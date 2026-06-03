// توليد «بطاقة المادة» كصورة PNG ١٠٨٠×١٣٥٠ بهوية التصميم (داكنة + رقم أخضر عملاق) —
// مرسومة على canvas بلا مكتبات خارجية، بتشكيل عربي سليم. منقول من مرجع التصميم.
import { toArabicDigits } from "./format.js";

const SERIF = '"Thmanyah Serif"';
const SANS = '"Thmanyah Sans"';

function roundRect(x, rx, ry, w, h, r) {
  x.beginPath();
  x.moveTo(rx + r, ry);
  x.arcTo(rx + w, ry, rx + w, ry + h, r);
  x.arcTo(rx + w, ry + h, rx, ry + h, r);
  x.arcTo(rx, ry + h, rx, ry, r);
  x.arcTo(rx, ry, rx + w, ry, r);
  x.closePath();
}

function wrapRTL(x, text, maxW) {
  const words = String(text).split(" ");
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (x.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

async function renderCardBlob(article, numLabel, lang = "ar") {
  const S = 3; // 360×450 منطقي → 1080×1350 بكسل
  const W = 360 * S,
    H = 450 * S,
    P = 30 * S;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  try {
    await Promise.all([
      document.fonts.load(`800 100px ${SERIF}`),
      document.fonts.load(`700 30px ${SANS}`),
      document.fonts.load(`500 30px ${SANS}`),
    ]);
    await document.fonts.ready;
  } catch {
    /* خطوط احتياطية */
  }
  const num = numLabel ?? toArabicDigits(article.articleNumber);

  // الخلفية
  x.fillStyle = "#1c1b18";
  x.fillRect(0, 0, W, H);

  // رقم شبحي
  x.save();
  x.fillStyle = "rgba(255,255,255,0.045)";
  x.textAlign = "left";
  x.textBaseline = "top";
  x.font = `800 ${210 * S}px ${SERIF}`;
  x.fillText(num, -14 * S, -34 * S);
  x.restore();

  x.direction = "rtl";
  const right = W - P,
    left = P;

  // الصفّ العلوي
  x.textBaseline = "top";
  x.textAlign = "right";
  x.fillStyle = "#f7f4ec";
  x.font = `700 ${13 * S}px ${SANS}`;
  x.fillText(lang === "ar" ? "نظام العمل" : "Labor Law", right, P + 2 * S);
  if (article.isAmended) {
    const label = lang === "ar" ? "مُعدَّلة" : "Amended";
    x.font = `600 ${11 * S}px ${SANS}`;
    const tw = x.measureText(label).width,
      pad = 9 * S,
      bh = 22 * S;
    const bx = left,
      by = P - 2 * S;
    x.strokeStyle = "rgba(210,164,90,0.5)";
    x.lineWidth = 1 * S;
    roundRect(x, bx, by, tw + pad * 2, bh, 11 * S);
    x.stroke();
    x.fillStyle = "#d2a45a";
    x.textAlign = "left";
    x.textBaseline = "middle";
    x.fillText(label, bx + pad, by + bh / 2 + 1 * S);
    x.textAlign = "right";
    x.textBaseline = "top";
  }

  // تسمية «المادة»
  x.fillStyle = "rgba(247,244,236,0.6)";
  x.font = `600 ${12 * S}px ${SANS}`;
  x.fillText(lang === "ar" ? "المادة" : "ARTICLE", right, 148 * S);

  // الرقم الكبير
  x.fillStyle = "#5fb893";
  x.font = `800 ${140 * S}px ${SERIF}`;
  x.fillText(num, right, 154 * S);

  // الشرح المبسّط (ملفوف)
  const src = article.simplifiedAr || article.officialText || "";
  const text = src.length > 140 ? src.slice(0, 140) + "…" : src;
  x.fillStyle = "rgba(247,244,236,0.95)";
  x.font = `500 ${15 * S}px ${SANS}`;
  const lines = wrapRTL(x, text, W - P * 2);
  let ty = 292 * S;
  const lh = 24 * S;
  for (const ln of lines.slice(0, 4)) {
    x.fillText(ln, right, ty);
    ty += lh;
  }

  // التذييل
  x.strokeStyle = "rgba(255,255,255,0.15)";
  x.lineWidth = 1 * S;
  x.beginPath();
  x.moveTo(left, H - P - 22 * S);
  x.lineTo(right, H - P - 22 * S);
  x.stroke();
  x.fillStyle = "rgba(247,244,236,0.7)";
  x.font = `500 ${11 * S}px ${SANS}`;
  x.textAlign = "right";
  x.fillText(lang === "ar" ? "المرجع التفاعلي لنظام العمل" : "Interactive Labor Law Reference", right, H - P - 16 * S);
  x.textAlign = "left";
  x.fillText(lang === "ar" ? "شرح تبسيطي" : "simplified", left, H - P - 16 * S);

  return await new Promise((res) => c.toBlob(res, "image/png"));
}

export async function downloadArticleCard(article, numLabel, lang = "ar") {
  try {
    const blob = await renderCardBlob(article, numLabel, lang);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `نظام-العمل-المادة-${toArabicDigits(article.articleNumber)}${article.mukarrar ? "-مكرر" : ""}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch {
    /* ignore */
  }
}
