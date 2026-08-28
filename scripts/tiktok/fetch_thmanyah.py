#!/usr/bin/env python3
"""Fetch the Thmanyah Sans font (خط ثمانية الرقمي) for LOCAL rendering only.

The font is downloaded transiently at build time and converted to TTF so libass
can burn it into the video. The font files are NEVER committed to the repository
or redistributed — the Thmanyah licence forbids self-hosting/redistribution, but
using the font to render text is fine. Source: https://font.thmanyah.com
"""
import os
import urllib.request
from fontTools.ttLib import TTFont

ASSETS = "https://framerusercontent.com/assets"
# Thmanyah Sans weights (asset hashes discovered from font.thmanyah.com).
VARIANTS = {
    "ThmanyahSans-Regular": "x6EBzvXf1Fi35XhsRoHxePDVo",
    "ThmanyahSans-Medium":  "oE98mOPE28KTzUeptOLRIaqW1I",
    "ThmanyahSans-Bold":    "LZvgFRUsP7pGWYj3tKxMUrKuhSY",
    "ThmanyahSans-Black":   "ulQLGTktcl2Qq4AmD6RuVgELZKg",
}


def main(out_dir="fonts"):
    os.makedirs(out_dir, exist_ok=True)
    for name, h in VARIANTS.items():
        woff2 = os.path.join(out_dir, name + ".woff2")
        ttf = os.path.join(out_dir, name + ".ttf")
        urllib.request.urlretrieve(f"{ASSETS}/{h}.woff2", woff2)
        f = TTFont(woff2)
        f.flavor = None
        f.save(ttf)
        os.remove(woff2)
        print(name, "->", ttf, os.path.getsize(ttf), "bytes")


if __name__ == "__main__":
    main()
