# -*- coding: utf-8 -*-
import base64, pathlib
from scenes import SCENES

ROOT = pathlib.Path(__file__).resolve().parent.parent  # project root
def b64(p, mime):
    return f"data:{mime};base64," + base64.b64encode(pathlib.Path(p).read_bytes()).decode()

zain_b   = b64(ROOT/'fonts/zain-b.ttf', 'font/ttf')
zain_r   = b64(ROOT/'fonts/zain-r.ttf', 'font/ttf')
plex_r   = b64(ROOT/'fonts/plex-r.ttf', 'font/ttf')
plex_b   = b64(ROOT/'fonts/plex-b.ttf', 'font/ttf')
logo_d   = b64(ROOT/'assets/logo_dark.png',  'image/png')
logo_l   = b64(ROOT/'assets/logo_light.png', 'image/png')
kit      = b64(ROOT/'assets/kit.png',        'image/png')

body = "\n".join(SCENES)
body = body.replace('__LOGO_DARK__', logo_d).replace('__LOGO_LIGHT__', logo_l).replace('__KIT__', kit)

css = pathlib.Path('style.css').read_text(encoding='utf-8')
js  = pathlib.Path('engine.js').read_text(encoding='utf-8')

faces = f"""
@font-face{{font-family:'ZainAr';font-weight:700 900;src:url({zain_b}) format('truetype');font-display:block}}
@font-face{{font-family:'ZainAr';font-weight:100 600;src:url({zain_r}) format('truetype');font-display:block}}
@font-face{{font-family:'PlexAr';font-weight:600 900;src:url({plex_b}) format('truetype');font-display:block}}
@font-face{{font-family:'PlexAr';font-weight:100 500;src:url({plex_r}) format('truetype');font-display:block}}
"""

html = f"""<!doctype html>
<html dir="rtl" lang="ar"><head><meta charset="utf-8">
<title>الإسعافات الأولية في مكان العمل — البسامي القابضة</title>
<style>{faces}
{css}</style></head>
<body><div id="stage">
{body}
<div id="curtain"></div><div id="flash"></div>
</div>
<script>{js}</script>
</body></html>"""

out = pathlib.Path('video.html')
out.write_text(html, encoding='utf-8')
print('video.html', round(out.stat().st_size/1024/1024,2), 'MB')
