#!/usr/bin/env python3
"""Compose the final vertical TikTok clips.

For each clip: blurred 9:16 pillar background + sharpened foreground + the
Pillow-rendered Thmanyah caption/title layer (with kashida), in one ffmpeg pass.

Input : raw/<name>.mp4 (pre-cut to the clip window) + video.ar.srt + fonts/
Output: clips/<name>.mp4  (1080x1920, H.264 + AAC)
"""
import os
import subprocess
from render_layer import parse_srt, make_frames

RAW_DIR = "raw"
OUT_DIR = "clips"
WORK = "work"

# name, window_start_abs, window_end_abs, title
CLIPS = [
    ("clip1_alrazi",  1318, 1483, "العقل قد يقودك إلى الهاوية\nقصة الإمام الرازي"),
    ("clip2_taslim",  1528, 1605, "قمة الرضا تسليمُ أمرك لله\nقصة الخسروشاهي"),
    ("clip3_abubakr", 1987, 2131, "أُصدّقه في خبر السماء\nموقف أبي بكر من الإسراء"),
    ("clip4_alghar",  2381, 2483, "لا تحزن إنَّ الله معنا\nقصة الغار"),
    ("clip5_musa",    2488, 2666, "كلَّا إنَّ معي ربي سيهدين\nموسى والبحر"),
]


def compose(name, concat, out):
    src = os.path.join(RAW_DIR, f"{name}.mp4")
    vf = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,"
        "crop=1080:1920,gblur=sigma=32,eq=brightness=-0.16:saturation=1.06[bg];"
        "[0:v]scale=1080:-2,unsharp=5:5:0.5:5:5:0.0[fg];"
        "[bg][fg]overlay=(W-w)/2:600[base];"
        "[1:v]format=rgba[ov];"
        "[base][ov]overlay=0:0:format=auto[v]"
    )
    cmd = [
        "ffmpeg", "-y", "-v", "error",
        "-i", src,
        "-f", "concat", "-safe", "0", "-i", concat,
        "-filter_complex", vf, "-map", "[v]", "-map", "0:a?",
        "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
        "-shortest", out,
    ]
    subprocess.run(cmd, check=True)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(WORK, exist_ok=True)
    cues = parse_srt("video.ar.srt")
    for name, ws, we, title in CLIPS:
        src = os.path.join(RAW_DIR, f"{name}.mp4")
        if not os.path.exists(src):
            print("SKIP (missing raw):", name)
            continue
        concat, n = make_frames(name, cues, ws, we, title, WORK)
        out = os.path.join(OUT_DIR, f"{name}.mp4")
        compose(name, concat, out)
        print(f"{name}: {n} captions -> {out} ({os.path.getsize(out)/1e6:.1f} MB)")


if __name__ == "__main__":
    main()
