# TikTok video redesign — @A9ZL

إعادة تصميم مقطع (فضيلة الشيخ عبدالله بن صالح القصير عن الدعاء) بنفس الصوت الأصلي.

- `A9ZL_final.mp4` — الفيديو النهائي (1080×1920، 30fps، الصوت الأصلي منسوخ كما هو).
- `page.html` — مشهد التصميم (خلفية ليلية متحركة: قمر، نجوم، شهب، صورة ظلية لمسجد؛ أنيميشن كلمة-بكلمة مع تمييز الكلمة المنطوقة؛ مؤشر صوتي من بيانات الصوت الفعلية؛ حقوق @A9ZL مع شعار تيك توك).
- `phrases.json` — النص المصحح يدوياً مع توقيت كل كلمة (استُخرج بـ whisper ثم صُحح بمطابقة ترجمة الفيديو الأصلي).
- `transcribe.py` — استخراج الكلمات وتوقيتاتها من الصوت (faster-whisper large-v3-turbo).
- `render.py` — تصوير المشهد إطاراً-بإطار عبر Chromium (Playwright) ودمجه مع الصوت عبر ffmpeg.

## الخط
خط «ثمانية» (Thmanyah Sans / Serif Display). ملفات woff2 غير مضمّنة في المستودع (رخصة الخط لا تسمح بإعادة الاستضافة) — نزّلها إلى `fonts/` قبل التشغيل:

```sh
mkdir -p fonts && cd fonts
for w in Regular Medium Bold Black; do
  curl -sLO "https://cdn.jsdelivr.net/gh/engdawood/thmanyah-font-web@4266a9d/fonts/thmanyah-sans/woff2/thmanyah-sans-$w.woff2"
done
for w in Bold Black; do
  curl -sLO "https://cdn.jsdelivr.net/gh/engdawood/thmanyah-font-web@4266a9d/fonts/thmanyah-serif-display/woff2/thmanyah-serif-display-$w.woff2"
done
```

## إعادة الإخراج
```sh
pip install playwright faster-whisper imageio-ffmpeg
python render.py   # يتوقع audio.m4a وamps.json وphrases.json بجانب page.html
```
