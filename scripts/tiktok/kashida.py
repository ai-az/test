#!/usr/bin/env python3
"""Kashida (tatweel) justification for Arabic lines rendered with a given font.

Inserts U+0640 (ـ) at typographically valid kashida positions — one elongated
connection per word, distributed evenly — so each line's shaped width grows
toward a target width. This is the classic Arabic "كشيدة" elongation, used here
to give the burned-in captions the calligraphic, stretched look of the source
podcast's typography.
"""
import uharfbuzz as hb

TATWEEL = 'ـ'

# Letters that do NOT join to the following letter (right-joining only): a
# tatweel must never be placed AFTER one of these.
NON_CONNECTING_PREV = set('اأإآدذرزوؤءةى')
# Never place a tatweel directly before an alef — it breaks the lam-alef
# ligature and reads poorly.
NO_TATWEEL_BEFORE = set('اأإآ')
DIACRITICS = set('ًٌٍَُِّْـٰ')


def _is_arabic_letter(ch):
    o = ord(ch)
    return (0x0621 <= o <= 0x064A) or (0x0671 <= o <= 0x06D3)


def kashida_positions(text):
    pos = []
    for i in range(1, len(text)):
        prev, nxt = text[i - 1], text[i]
        if prev in DIACRITICS or nxt in DIACRITICS:
            continue
        if not (_is_arabic_letter(prev) and _is_arabic_letter(nxt)):
            continue
        if prev in NON_CONNECTING_PREV:
            continue
        if nxt in NO_TATWEEL_BEFORE:
            continue
        pos.append(i)
    return pos


def _word_spans(text):
    spans, start = [], None
    for i, ch in enumerate(text):
        if ch == ' ':
            if start is not None:
                spans.append((start, i)); start = None
        elif start is None:
            start = i
    if start is not None:
        spans.append((start, len(text)))
    return spans


def one_per_word_positions(text):
    elig = set(kashida_positions(text))
    chosen = []
    for a, b in _word_spans(text):
        cands = [i for i in range(a + 1, b) if i in elig]
        if cands:
            chosen.append(cands[-1])
    return sorted(chosen)


class Shaper:
    def __init__(self, font_path):
        with open(font_path, 'rb') as f:
            self.face = hb.Face(f.read())
        self.font = hb.Font(self.face)
        self.upem = self.face.upem

    def width(self, text):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.font, buf, {"kern": True, "liga": True})
        return sum(p.x_advance for p in buf.glyph_positions) / self.upem


def _apply(text, counts):
    out = []
    for i, ch in enumerate(text):
        if i in counts and counts[i] > 0:
            out.append(TATWEEL * counts[i])
        out.append(ch)
    return ''.join(out)


def justify(text, shaper, target_em, max_per_gap=10):
    base = shaper.width(text)
    if base >= target_em:
        return text
    positions = one_per_word_positions(text)
    if not positions:
        return text
    counts = {p: 0 for p in positions}
    guard = 0
    while guard < 4000:
        guard += 1
        progressed = False
        for p in positions:
            if counts[p] >= max_per_gap:
                continue
            counts[p] += 1
            cand = _apply(text, counts)
            if shaper.width(cand) >= target_em:
                return cand
            progressed = True
        if not progressed:
            break
    return _apply(text, counts)


if __name__ == '__main__':
    s = Shaper('fonts/ThmanyahSans-Bold.ttf')
    for t in ["العقل قد يقودك إلى الهاوية", "لا تحزن إنَّ الله معنا"]:
        print(justify(t, s, s.width(t) * 1.3))
