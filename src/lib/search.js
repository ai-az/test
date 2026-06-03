// البحث الفوري عبر Fuse.js مع تطبيع عربي (يعمل مع/بدون تشكيل، وبصيغ همزات متقاربة).
import Fuse from "fuse.js";
import { getEnteredArticles } from "../data/articles.js";
import { displayArticleNumber } from "./format.js";
import { normalizeAr } from "./arabic.js";

// مستندات البحث: نطبّع الحقول مسبقاً ليطابقها الاستعلام المطبَّع.
const docs = getEnteredArticles().map((a) => ({
  id: a.id,
  article: a,
  numberText: `${a.articleNumber} ${displayArticleNumber(a, "ar")} المادة`,
  official: normalizeAr(a.officialText),
  simplified: normalizeAr(a.simplifiedAr || ""),
  keywords: normalizeAr((a.keywords || []).join(" ")),
  chapter: normalizeAr(a.chapter.title),
}));

const fuse = new Fuse(docs, {
  includeScore: true,
  ignoreLocation: true,
  threshold: 0.34,
  minMatchCharLength: 2,
  keys: [
    { name: "numberText", weight: 0.9 },
    { name: "keywords", weight: 0.8 },
    { name: "official", weight: 0.6 },
    { name: "simplified", weight: 0.55 },
    { name: "chapter", weight: 0.3 },
  ],
});

export function searchArticles(query) {
  const q = normalizeAr(query);
  if (q.length < 2) return [];
  return fuse.search(q).map((r) => r.item.article);
}

// تظليل كلمات الاستعلام داخل مقتطف (تطابق مبسّط على النص الخام).
export function highlightParts(text = "", query = "") {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 2)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (terms.length === 0) return [{ text, hit: false }];
  const splitRe = new RegExp(`(${terms.join("|")})`, "gi");
  const hitRe = new RegExp(`^(?:${terms.join("|")})$`, "i");
  return text
    .split(splitRe)
    .filter((s) => s !== "")
    .map((s) => ({ text: s, hit: hitRe.test(s) }));
}
