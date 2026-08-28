#!/usr/bin/env python3
"""Render the caption/title overlay for one clip as a transparent alpha video.

libass mis-shapes the Thmanyah font, so instead of burning subtitles we render
every caption with Pillow + raqm (HarfBuzz shaping — correct Arabic joining and
kashida), lay the cues out on a timeline, and emit a single ProRes 4444 overlay
with alpha that ffmpeg composites over the video in one pass.
"""
import os
import re
import subprocess
from PIL import Image, ImageDraw, ImageFont
from kashida import Shaper, justify

W, H = 1080, 1920
FONTS_DIR = "fonts"

# Layout
TITLE_Y = 150
BRAND_Y = 300
CAP_CENTER_Y = 1580          # vertical centre of the caption block
CAP_MAX_W = 940              # wrap width for captions (px)
TITLE_MAX_W = 960

WHITE = (255, 255, 255, 255)
CYAN = (43, 231, 255, 255)
GREY = (208, 208, 208, 255)
SHADOW = (0, 0, 0, 210)
OUTLINE = (12, 14, 18, 255)

BRAND = "بودكاست معالم — الطريق إلى الله"


class Renderer:
    def __init__(self):
        self.black = ImageFont.truetype(f"{FONTS_DIR}/ThmanyahSans-Black.ttf", 60)
        self.bold = ImageFont.truetype(f"{FONTS_DIR}/ThmanyahSans-Bold.ttf", 58)
        self.med = ImageFont.truetype(f"{FONTS_DIR}/ThmanyahSans-Medium.ttf", 34)
        self.shaper = Shaper(f"{FONTS_DIR}/ThmanyahSans-Bold.ttf")

    def _wrap(self, text, font, max_w, draw):
        words = text.split()
        lines, cur = [], ""
        for w in words:
            trial = (cur + " " + w).strip()
            bbox = draw.textbbox((0, 0), trial, font=font, direction="rtl", language="ar")
            if bbox[2] - bbox[0] > max_w and cur:
                lines.append(cur)
                cur = w
            else:
                cur = trial
        if cur:
            lines.append(cur)
        return lines

    def _draw_line(self, draw, x, y, text, font, fill, anchor="ma"):
        # shadow + outline for readability over video
        for dx, dy in ((0, 3), (2, 2), (-2, 2)):
            draw.text((x + dx, y + dy), text, font=font, fill=SHADOW,
                      anchor=anchor, direction="rtl", language="ar")
        draw.text((x, y), text, font=font, fill=fill, anchor=anchor,
                  direction="rtl", language="ar", stroke_width=2, stroke_fill=OUTLINE)

    def title_layer(self, title_lines):
        """Static layer: title + brand, returns an RGBA image."""
        img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(img)
        y = TITLE_Y
        for ln in title_lines:
            jl = justify(ln, self.shaper, self.shaper.width(ln) * 1.24)
            self._draw_line(d, W // 2, y, jl, self.black, CYAN)
            y += 84
        self._draw_line(d, W // 2, BRAND_Y + (len(title_lines) - 1) * 84,
                        BRAND, self.med, GREY)
        return img

    def caption_image(self, base, text):
        """Base title layer + one caption, full frame RGBA."""
        img = base.copy()
        d = ImageDraw.Draw(img)
        lines = self._wrap(text, self.bold, CAP_MAX_W, d)
        # light kashida per wrapped line
        rendered = []
        for ln in lines:
            base_w = self.shaper.width(ln)
            rendered.append(justify(ln, self.shaper, base_w * 1.06))
        n = len(rendered)
        total_h = n * 78
        y = CAP_CENTER_Y - total_h // 2
        for ln in rendered:
            self._draw_line(d, W // 2, y, ln, self.bold, WHITE)
            y += 78
        return img


def parse_srt(path):
    text = open(path, encoding="utf-8").read()
    cues = []
    for b in re.split(r"\n\n+", text.strip()):
        lines = b.strip().split("\n")
        if len(lines) < 3:
            continue
        m = re.match(r"(\d+):(\d+):(\d+)[,.](\d+) --> (\d+):(\d+):(\d+)[,.](\d+)", lines[1])
        if not m:
            continue
        s = int(m[1]) * 3600 + int(m[2]) * 60 + int(m[3]) + int(m[4]) / 1000
        e = int(m[5]) * 3600 + int(m[6]) * 60 + int(m[7]) + int(m[8]) / 1000
        cues.append([s, e, " ".join(lines[2:]).strip()])
    return cues


def clean(t):
    t = t.replace(">>", " ")
    t = re.sub(r"\[[^\]]*\]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def timeline(cues, w_start, w_end):
    sel, prev = [], ""
    for s, e, t in cues:
        if t == prev or not t:
            continue
        prev = t
        if s < w_start - 0.3 or s > w_end - 0.4:
            continue
        sel.append([s - w_start, clean(t)])
    out = []
    for i, (s, t) in enumerate(sel):
        end = sel[i + 1][0] if i + 1 < len(sel) else (w_end - w_start)
        end = min(end, w_end - w_start)
        if end - s < 0.2 or not t:
            continue
        out.append((s, end, t))
    return out


def make_frames(name, cues, w_start, w_end, title, work_dir):
    """Render the title/caption frames and a concat-demuxer file describing their
    timing. Returns (concat_path, n_captions). The concat file is fed straight to
    ffmpeg as the overlay input — no heavy intermediate video."""
    r = Renderer()
    dur = w_end - w_start
    base = r.title_layer(title.split("\n"))
    tl = timeline(cues, w_start, w_end)

    frame_dir = os.path.join(work_dir, f"{name}_frames")
    os.makedirs(frame_dir, exist_ok=True)
    concat = os.path.join(work_dir, f"{name}.concat")
    lines = []

    def emit(idx, img, d):
        p = os.path.join(frame_dir, f"f{idx:04d}.png")
        img.save(p)
        lines.append(f"file '{os.path.abspath(p)}'")
        lines.append(f"duration {d:.3f}")

    idx, t = 0, 0.0
    if not tl or tl[0][0] > 0.05:
        gap_end = tl[0][0] if tl else dur
        emit(idx, base, max(gap_end, 0.05)); idx += 1
        t = gap_end
    for (s, e, txt) in tl:
        if s > t + 0.03:
            emit(idx, base, s - t); idx += 1
            t = s
        emit(idx, r.caption_image(base, txt), max(e - s, 0.1)); idx += 1
        t = e
    if t < dur - 0.03:
        emit(idx, base, dur - t); idx += 1
    if len(lines) >= 2:
        lines.append(lines[-2])  # concat demuxer repeats the last file
    open(concat, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    return concat, len(tl)
