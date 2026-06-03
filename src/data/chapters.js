// ─────────────────────────────────────────────────────────────
// أبواب وفصول نظام العمل السعودي (م/51) — البنية الرسمية
// Verified against the official consolidated text (HRSD/HRDF PDF).
// 16 أبواب. عناوين الفصول مأخوذة من فهرس النظام الرسمي.
// النصوص الكاملة للمواد تُدخَل تدريجياً في data/articles.js.
// ─────────────────────────────────────────────────────────────

export const LAW_META = {
  titleAr: "نظام العمل",
  decree: "المرسوم الملكي رقم (م/51)",
  decreeDate: "23/8/1426هـ",
  chapterCount: 16,
  articleCount: 245,
  source:
    "https://laws.boe.gov.sa/boelaws/laws/lawdetails/08381293-6388-48e2-8ad2-a9a700f2aa94/1",
};

export const chapters = [
  {
    number: 1,
    title: "التعريفات والأحكام العامة",
    titleEn: "Definitions and General Provisions",
    sections: [
      { number: 1, title: "التعريفات" },
      { number: 2, title: "الأحكام العامة" },
    ],
  },
  {
    number: 2,
    title: "تنظيم عمليات التوظيف",
    titleEn: "Regulation of Recruitment",
    sections: [
      { number: 1, title: "وحدات التوظيف" },
      { number: 2, title: "توظيف المعوقين" },
      {
        number: 3,
        title: "المكاتب الأهلية لتوظيف المواطنين، ومكاتب الاستقدام",
      },
    ],
  },
  {
    number: 3,
    title: "توظيف غير السعوديين",
    titleEn: "Employment of Non-Saudis",
    sections: [],
  },
  {
    number: 4,
    title: "التدريب والتأهيل",
    titleEn: "Training and Qualification",
    sections: [
      { number: 1, title: "التدريب والتأهيل لدى صاحب العمل" },
      {
        number: 2,
        title: "عقد التأهيل والتدريب مع غير العاملين لدى صاحب العمل",
      },
    ],
  },
  {
    number: 5,
    title: "علاقات العمل",
    titleEn: "Work Relations",
    sections: [
      { number: 1, title: "عقد العمل" },
      { number: 2, title: "الواجبات وقواعد التأديب" },
      { number: 3, title: "انتهاء عقد العمل" },
      { number: 4, title: "مكافأة نهاية الخدمة" },
    ],
  },
  {
    number: 6,
    title: "شروط العمل وظروفه",
    titleEn: "Work Conditions and Environment",
    sections: [
      { number: 1, title: "الأجور" },
      { number: 2, title: "ساعات العمل" },
      { number: 3, title: "فترات الراحة والراحة الأسبوعية" },
      { number: 4, title: "الإجازات" },
    ],
  },
  {
    number: 7,
    title: "العمل لبعض الوقت",
    titleEn: "Part-Time Work",
    sections: [],
  },
  {
    number: 8,
    title:
      "الوقاية من مخاطر العمل والوقاية من الحوادث الصناعية الكبرى وإصابات العمل والخدمات الصحية والاجتماعية",
    titleEn:
      "Occupational Safety, Major Industrial Accidents, Work Injuries, and Health & Social Services",
    sections: [
      { number: 1, title: "الوقاية من مخاطر العمل" },
      { number: 2, title: "الوقاية من الحوادث الصناعية" },
      { number: 3, title: "إصابات العمل" },
      { number: 4, title: "الخدمات الصحية والاجتماعية" },
    ],
  },
  {
    number: 9,
    title: "تشغيل النساء",
    titleEn: "Employment of Women",
    sections: [],
  },
  {
    number: 10,
    title: "تشغيل الأحداث",
    titleEn: "Employment of Minors",
    sections: [],
  },
  {
    number: 11,
    title: "عقد العمل البحري",
    titleEn: "Maritime Work Contract",
    sections: [],
  },
  {
    number: 12,
    title: "العمل في المناجم والمحاجر",
    titleEn: "Work in Mines and Quarries",
    sections: [],
  },
  {
    number: 13,
    title: "تفتيش العمل",
    titleEn: "Labor Inspection",
    sections: [],
  },
  {
    number: 14,
    title: "هيئات تسوية الخلافات العمالية",
    titleEn: "Labor Dispute Settlement Commissions",
    sections: [],
  },
  {
    number: 15,
    title: "العقوبات",
    titleEn: "Penalties",
    sections: [],
  },
  {
    number: 16,
    title: "أحكام ختامية",
    titleEn: "Concluding Provisions",
    sections: [],
  },
];

export const getChapter = (n) =>
  chapters.find((c) => c.number === Number(n)) || null;
