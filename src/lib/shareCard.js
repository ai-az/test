// توليد «بطاقة المادة» كصورة PNG بهوية Specimen — بلا مكتبات خارجية (canvas فقط).
import { toArabicDigits } from "./format.js";

const W = 1080;
const H = 1350;
const PAD = 96;

// ألوان ثابتة للبطاقة (تتبع هوية الموقع، مستقلة عن الوضع الليلي للتصدير).
const C = {
  paper: "#faf9f7",
  paper2: "#f0efe9",
  ink: "#23211d",
  inkSoft: "#5d5b54",
  inkFaint: "#8f8d85",
  green: "#126837",
  rule: "#d8d6cd",
};

function wrap(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function downloadArticleCard(article, numLabel) {
  try {
    await Promise.all([
      document.fonts.load('900 100px "Noto Kufi Arabic"'),
      document.fonts.load('700 100px "Noto Kufi Arabic"'),
      document.fonts.load('500 40px "IBM Plex Sans Arabic"'),
    ]);
  } catch {
    /* المتابعة بخطوط احتياطية */
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.direction = "rtl";
  ctx.textAlign = "right";
  const right = W - PAD;

  // الخلفية + إطار رفيع
  ctx.fillStyle = C.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = C.rule;
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  // شريط أخضر علوي
  ctx.fillStyle = C.green;
  ctx.fillRect(40, 40, W - 80, 12);

  // كيكر
  ctx.fillStyle = C.inkFaint;
  ctx.font = '500 30px "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText("نظام العمل · المرجع التفاعلي", right, 150);

  // «المادة»
  ctx.fillStyle = C.inkSoft;
  ctx.font = '700 56px "Noto Kufi Arabic", sans-serif';
  ctx.fillText("المادة", right, 250);

  // الرقم الضخم
  ctx.fillStyle = C.green;
  ctx.font = '900 360px "Noto Kufi Arabic", sans-serif';
  ctx.fillText(numLabel, right, 580);

  // خط فاصل
  ctx.strokeStyle = C.rule;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(PAD, 660);
  ctx.lineTo(right, 660);
  ctx.stroke();

  // «ببساطة»
  ctx.fillStyle = C.green;
  ctx.font = '700 40px "Noto Kufi Arabic", sans-serif';
  ctx.fillText("ببساطة", right, 740);

  // الشرح المبسّط (ملفوف)
  ctx.fillStyle = C.ink;
  ctx.font = '500 46px "IBM Plex Sans Arabic", sans-serif';
  const text = article.simplifiedAr || article.officialText || "";
  const lines = wrap(ctx, text, W - PAD * 2).slice(0, 9);
  let y = 810;
  for (const ln of lines) {
    ctx.fillText(ln, right, y);
    y += 70;
  }

  // تذييل
  ctx.fillStyle = C.inkFaint;
  ctx.font = '500 28px "IBM Plex Sans Arabic", sans-serif';
  ctx.fillText("شرح تبسيطي غير رسمي — ليس استشارة قانونية", right, H - 130);
  ctx.fillStyle = C.green;
  ctx.font = '700 34px "Noto Kufi Arabic", sans-serif';
  ctx.fillText("نظام العمل السعودي · م/٥١", right, H - 80);

  const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `المادة-${toArabicDigits(article.articleNumber)}${article.mukarrar ? "-مكرر" : ""}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
