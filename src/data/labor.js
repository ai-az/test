// ─────────────────────────────────────────────────────────────
// مُحَوِّل البيانات إلى شكل LABOR الذي تتوقّعه مكوّنات التصميم المرجعية،
// لكن بمحتوى مشروعنا الحقيقي (المواد المُدخَلة + بنية الأبواب المتحقَّقة).
// ─────────────────────────────────────────────────────────────
import { chapters as CHAPTERS, LAW_META } from "./chapters.js";
import { getEnteredArticles, getArticle } from "./articles.js";
import { articleIndex, chapterSlots } from "./articleIndex.js";
import { glossary as GLOSSARY } from "./glossary.js";
import { scenarios as SCENARIOS } from "./scenarios.js";
import { toArabicDigits } from "../lib/format.js";

export const toAr = (n) => toArabicDigits(n);

// أيقونة لكل موقف (تُطابق أسماء أيقونات ui المرجعية)
const SCENARIO_ICON = {
  fired: "gavel",
  resign: "exit",
  "salary-late": "wallet",
  overtime: "clock",
  leave: "sun",
  injury: "shield",
};

// ربط المادة بالحاسبة
const CALC_OF = {
  84: "end-of-service",
  85: "end-of-service",
  87: "end-of-service",
  107: "overtime",
  109: "annual-leave",
  110: "annual-leave",
};

const LATEST_YEAR = "١٤٤٦";

function chapterRange(n) {
  const slots = chapterSlots(n);
  if (!slots.length) return { from: 0, to: 0, count: 0 };
  const nums = slots.map((s) => s.n);
  return { from: Math.min(...nums), to: Math.max(...nums), count: slots.length };
}

const chaptersList = CHAPTERS.map((c) => {
  const r = chapterRange(c.number);
  return { n: c.number, title: c.title, en: c.titleEn, from: r.from, to: r.to, count: r.count };
});

// المواد المُدخَلة → شكل LABOR
const enteredList = getEnteredArticles().map((a) => ({
  articleNumber: a.mukarrar ? a.id : a.articleNumber,
  order: a.order,
  id: a.id,
  mukarrar: !!a.mukarrar,
  chapter: a.chapter,
  section: a.section || null,
  isAmended: a.isAmended,
  sample: false,
  officialText: a.officialText,
  originalText: a.originalText || "",
  amendmentInfo: a.amendmentInfo || "",
  amendedYear: a.isAmended ? toAr(a.lastUpdated) : undefined,
  simplifiedAr: a.simplifiedAr,
  example: a.example || null,
  keywords: a.keywords || [],
  relatedArticles: a.relatedArticles || [],
  calculator: CALC_OF[a.articleNumber] || null,
}));

// مواد قيد الإدخال (stubs) لكل خانة غير مُدخَلة
const enteredIdsSet = new Set(enteredList.map((a) => String(a.id)));
const pendingList = [];
for (const [chNum, slots] of Object.entries(articleIndex)) {
  const ch = CHAPTERS.find((c) => c.number === Number(chNum));
  for (const s of slots) {
    const id = s.mukarrar ? `${s.n}م` : String(s.n);
    if (enteredIdsSet.has(id)) continue;
    pendingList.push({
      articleNumber: s.mukarrar ? id : s.n,
      order: s.n + (s.mukarrar ? 0.5 : 0),
      id,
      chapter: { number: Number(chNum), title: ch ? ch.title : "" },
      status: "pending",
    });
  }
}

export const LABOR = {
  meta: {
    title: LAW_META.titleAr,
    titleEn: "Saudi Labor Law",
    decree: "المرسوم الملكي رقم م/٥١ وتاريخ ٢٣ / ٨ / ١٤٢٦هـ",
    decreeEn: "Royal Decree No. M/51, dated 23/8/1426 AH",
    chapters: 16,
    articles: 245,
    source: LAW_META.source,
    latestAmendmentYear: LATEST_YEAR,
  },
  chapters: chaptersList,
  articles: [...enteredList, ...pendingList],
  glossary: GLOSSARY.map((g) => ({ term: g.term, def: g.definition })),
  // ترتيب المواقف يطابق المرجع: أول ٤ أقراص في الغلاف = فصل/استقالة/راتب/إصابة
  scenarios: ["fired", "resign", "salary-late", "injury", "leave", "overtime"]
    .map((id) => SCENARIOS.find((s) => s.id === id))
    .filter(Boolean)
    .map((s) => ({
      id: s.id,
      icon: SCENARIO_ICON[s.id] || "doc",
      title: s.title,
      desc: s.lead,
      articles: s.articleIds.map((x) => (/^\d+$/.test(x) ? Number(x) : x)),
      calculator: s.calculator || null,
    })),
};

export const findArticle = (num) =>
  LABOR.articles.find((a) => String(a.articleNumber) === String(num)) || null;

export const isRecentlyAmended = (a) =>
  !!(a && a.isAmended && a.amendedYear && a.amendedYear === LABOR.meta.latestAmendmentYear);
