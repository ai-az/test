import { createContext, useContext, useEffect, useState } from "react";

// واجهة ثنائية اللغة — العربية افتراضية (RTL)، الإنجليزية تتحوّل إلى LTR.
// ملاحظة: نصوص المواد القانونية تبقى بالعربية دائماً؛ الترجمة تخصّ واجهة الموقع.

const STRINGS = {
  ar: {
    dir: "rtl",
    siteName: "نظام العمل",
    siteTagline: "المرجع التفاعلي",
    nav_home: "الغلاف",
    nav_chapters: "الأبواب",
    nav_bookmarks: "المفضّلة",
    cover_kicker: "المملكة العربية السعودية · المرسوم الملكي م/٥١",
    cover_lead:
      "مرجعٌ تفاعلي يبسّط مواد نظام العمل عبر شرحٍ مختصر ومثالٍ عملي لكل مادة — لتفهمها دون تخصّص.",
    stat_chapters: "باباً",
    stat_articles: "مادة",
    cover_enter: "ابدأ التصفّح",
    chapters_title: "الأبواب",
    chapters_lead: "ستة عشر باباً تنتظم فيها مواد النظام. اختر باباً لتصفّح فصوله ومواده.",
    chapter_word: "الباب",
    section_word: "الفصل",
    article_word: "المادة",
    sections_label: "الفصول",
    no_sections: "بدون فصول فرعية",
    articles_entered: "مواد متاحة",
    article_pending_note:
      "نصوص مواد هذا الباب قيد الإدخال التدريجي من المصدر الرسمي.",
    official_text: "النص الرسمي",
    simply: "ببساطة",
    example: "مثال عملي",
    scenario: "الموقف",
    outcome: "النتيجة وفق المادة",
    related: "مواد ذات صلة",
    keywords: "كلمات مفتاحية",
    amended: "مُعدَّلة",
    show_original: "عرض النص الأصلي قبل التعديل",
    original_pending:
      "النص الأصلي قبل التعديل بانتظار التوثيق من المصدر الرسمي.",
    prev: "المادة السابقة",
    next: "المادة التالية",
    bookmark_add: "إضافة للمفضّلة",
    bookmark_remove: "إزالة من المفضّلة",
    copy: "نسخ المادة",
    copied: "تم النسخ",
    informal_badge: "شرح تبسيطي غير رسمي",
    disclaimer:
      "هذا الموقع لأغراض تعريفية فقط ولا يُعدّ استشارة قانونية. النص الرسمي الساري هو المعتمد، ويُرجى الرجوع للمصدر الرسمي.",
    source_label: "المصدر الرسمي",
    bookmarks_title: "المفضّلة",
    bookmarks_empty: "لم تُضِف أي مادة إلى المفضّلة بعد.",
    phase_note: "نسخة المرحلة الأولى — الأساس والتصميم. تُضاف بقية المواد تدريجياً.",
    toggle_theme: "تبديل الوضع الليلي",
    toggle_lang: "English",
    nav_search: "بحث",
    nav_index: "الفهرس",
    nav_glossary: "المسرد",
    menu: "القائمة",
    search_title: "بحث فوري",
    search_placeholder: "ابحث برقم المادة أو كلمة في نصّها أو شرحها…",
    search_hint: "اكتب حرفين على الأقل. يدعم البحث العربي مع/بدون تشكيل.",
    search_count: "نتيجة",
    search_no_results: "لا توجد نتائج مطابقة. جرّب كلمة أخرى أو رقم المادة.",
    glossary_title: "مسرد المصطلحات",
    glossary_lead: "تعريفات نظامية للمصطلحات الأساسية، مصدرها",
    glossary_filter: "تصفية المصطلحات…",
    index_title: "خريطة المواد",
    index_lead:
      "فهرس شامل للأبواب وموادّها المتاحة. صفِّ حسب الباب، والمواد المعدّلة موسومة بنقطة.",
    filter_all: "الكل",
    nav_start: "ابدأ بموقفك",
    nav_calculators: "الحاسبات",
    nav_timeline: "التعديلات",
    scenarios_title: "الدخول حسب الموقف",
    scenarios_lead:
      "ابدأ من حالتك، لا من رقم الباب — نوجّهك إلى المواد ذات الصلة والحاسبة المناسبة.",
    scenario_calc_cta: "افتح الحاسبة المرتبطة بهذا الموقف",
    scenario_articles: "المواد ذات الصلة",
    article_pending_label: "قيد الإدخال — قريباً",
    calculators_title: "الحاسبات التفاعلية",
    calculators_lead:
      "أدخل أرقامك لتقدير مستحقاتك مباشرة. كل حاسبة مرتبطة بمادتها المرجعية.",
    calc_disclaimer:
      "النتيجة تقديرية لأغراض تعريفية ولا تُعدّ التزاماً قانونياً؛ تعتمد على دقة المدخلات وقد تختلف مكوّنات الأجر. يُرجى الرجوع للمادة والمصدر الرسمي.",
    calc_result: "النتيجة التقديرية",
    calc_enter_values: "أدخل القيم لعرض النتيجة.",
    calc_sources: "المواد المرجعية",
    timeline_title: "خط التعديلات",
    timeline_lead:
      "تطوّر نظام العمل عبر مراسيمه المعدِّلة، من المرسوم الأصلي م/٥١ إلى أحدث التعديلات.",
    timeline_origin: "النص الأصلي",
    timeline_note:
      "ربط المراسيم بالمواد يعتمد على ما توفّر من الحواشي الرسمية؛ تُراجع التفاصيل من المصدر الرسمي.",
    share: "بطاقة مشاركة",
    tools: "أدوات",
    copy_link: "نسخ الرابط",
    copy_citation: "نسخ اقتباس نظامي",
    print_pdf: "طباعة / PDF",
    article_pending_full:
      "هذه المادة موجودة في بنية النظام، ونصّها الرسمي قيد الإدخال. تصفّح الباب أو راجع لوحة التغطية.",
    coverage_title: "لوحة التغطية",
    coverage_lead:
      "نسبة المواد المُدخَلة بنصّها الرسمي من إجمالي مواد النظام، موزّعة على الأبواب — لاكتشاف الناقص.",
    coverage_of: "من",
    coverage_pending: "مواد قيد الإدخال",
    nav_coverage: "التغطية",
    index_available: "متاحة",
    index_pending: "قيد الإدخال",
    char_btn: "ضبط الطابع",
    char_tune: "ضبط الطابع",
    char_sub: "اضبط شكل الموقع كما يناسبك",
    char_accent: "اللون المميّز",
    char_scale: "حجم الأرقام البطلة",
    char_kashida: "حدّة الكشيدة",
    char_quiet: "هادئة",
    char_medium: "متوسطة",
    char_dramatic: "مبالِغة",
    char_reset: "إعادة الضبط الافتراضي",
    close: "إغلاق",
  },
  en: {
    dir: "ltr",
    siteName: "Labor Law",
    siteTagline: "Interactive Reference",
    nav_home: "Cover",
    nav_chapters: "Chapters",
    nav_bookmarks: "Saved",
    cover_kicker: "Kingdom of Saudi Arabia · Royal Decree M/51",
    cover_lead:
      "An interactive reference that simplifies the Labor Law — a short explanation and a real example for every article.",
    stat_chapters: "chapters",
    stat_articles: "articles",
    cover_enter: "Start browsing",
    chapters_title: "Chapters",
    chapters_lead:
      "Sixteen chapters organize the law. Choose one to browse its sections and articles.",
    chapter_word: "Chapter",
    section_word: "Section",
    article_word: "Article",
    sections_label: "Sections",
    no_sections: "No sub-sections",
    articles_entered: "available articles",
    article_pending_note:
      "Article texts for this chapter are being added progressively from the official source.",
    official_text: "Official text",
    simply: "In short",
    example: "Practical example",
    scenario: "Scenario",
    outcome: "Outcome under the article",
    related: "Related articles",
    keywords: "Keywords",
    amended: "Amended",
    show_original: "Show pre-amendment text",
    original_pending:
      "The pre-amendment text is pending verification from the official source.",
    prev: "Previous article",
    next: "Next article",
    bookmark_add: "Save",
    bookmark_remove: "Remove",
    copy: "Copy article",
    copied: "Copied",
    informal_badge: "Informal explanation",
    disclaimer:
      "This site is for informational purposes only and is not legal advice. The official in-force text prevails — please consult the official source.",
    source_label: "Official source",
    bookmarks_title: "Saved articles",
    bookmarks_empty: "You haven't saved any article yet.",
    phase_note: "Phase 1 — foundation & design. Remaining articles added progressively.",
    toggle_theme: "Toggle dark mode",
    toggle_lang: "العربية",
    nav_search: "Search",
    nav_index: "Index",
    nav_glossary: "Glossary",
    menu: "Menu",
    search_title: "Instant search",
    search_placeholder: "Search by article number, or a word in its text or explanation…",
    search_hint:
      "Type at least two characters. Arabic search works with or without diacritics.",
    search_count: "results",
    search_no_results: "No matching results. Try another word or the article number.",
    glossary_title: "Glossary",
    glossary_lead: "Statutory definitions of key terms, sourced from",
    glossary_filter: "Filter terms…",
    index_title: "Article map",
    index_lead:
      "A full index of chapters and their available articles. Filter by chapter; amended articles are marked with a dot.",
    filter_all: "All",
    nav_start: "By situation",
    nav_calculators: "Calculators",
    nav_timeline: "Amendments",
    scenarios_title: "Start by situation",
    scenarios_lead:
      "Start from your case, not a chapter number — we guide you to the relevant articles and the right calculator.",
    scenario_calc_cta: "Open the calculator for this situation",
    scenario_articles: "Related articles",
    article_pending_label: "Being added — soon",
    calculators_title: "Interactive calculators",
    calculators_lead:
      "Enter your numbers for an instant estimate. Each calculator is linked to its source article.",
    calc_disclaimer:
      "The result is an informational estimate, not a legal obligation; it depends on input accuracy and wage components may vary. Please refer to the article and the official source.",
    calc_result: "Estimated result",
    calc_enter_values: "Enter values to see the result.",
    calc_sources: "Source articles",
    timeline_title: "Amendments timeline",
    timeline_lead:
      "The law's evolution through its amending decrees, from the original M/51 to the latest amendments.",
    timeline_origin: "Original text",
    timeline_note:
      "Linking decrees to articles relies on available official footnotes; full details should be checked against the official source.",
    share: "Share card",
    tools: "Tools",
    copy_link: "Copy link",
    copy_citation: "Copy citation",
    print_pdf: "Print / PDF",
    article_pending_full:
      "This article exists in the law's structure; its official text is being added. Browse the chapter or check the coverage panel.",
    coverage_title: "Coverage panel",
    coverage_lead:
      "Share of articles entered with official text out of the law's total, by chapter — to spot what's missing.",
    coverage_of: "of",
    coverage_pending: "articles pending",
    nav_coverage: "Coverage",
    index_available: "Available",
    index_pending: "Pending",
    char_btn: "Tune",
    char_tune: "Tune the character",
    char_sub: "Reshape the look to your taste",
    char_accent: "Accent color",
    char_scale: "Hero numeral scale",
    char_kashida: "Kashida intensity",
    char_quiet: "Quiet",
    char_medium: "Medium",
    char_dramatic: "Dramatic",
    char_reset: "Reset to default",
    close: "Close",
  },
};

const I18nContext = createContext(null);

// ── «ضبط الطابع» presets ──────────────────────────────────
export const ACCENTS = {
  olive: { name: "زيتي", nameEn: "Olive", swatch: "#1a5c43", light: ["#1a5c43", "#124231"], dark: ["#5fb893", "#8fd3b3"] },
  brick: { name: "طوبي", nameEn: "Brick", swatch: "#9a3b2e", light: ["#9a3b2e", "#6f2820"], dark: ["#e08a78", "#f0a695"] },
  navy: { name: "كحلي", nameEn: "Navy", swatch: "#1f3a5f", light: ["#1f3a5f", "#142a47"], dark: ["#6f9bd1", "#9bbce0"] },
  gold: { name: "ذهبي", nameEn: "Gold", swatch: "#9a7b1e", light: ["#9a7b1e", "#6f5712"], dark: ["#d2a45a", "#e2bd80"] },
};
const KASHIDA = {
  هادئة: { body: '"dlig" 1, "calt" 1, "liga" 1', display: '"dlig" 1, "calt" 1, "rlig" 1', kashida: '"dlig" 1, "calt" 1, "rlig" 1' },
  متوسطة: { body: '"swsh" 1, "dlig" 1, "calt" 1, "rlig" 1, "liga" 1', display: '"swsh" 1, "dlig" 1, "calt" 1, "rlig" 1', kashida: '"swsh" 1, "dlig" 1, "calt" 1, "rlig" 1' },
  مبالِغة: { body: '"swsh" 1, "ss05" 1, "dlig" 1, "calt" 1, "rlig" 1, "liga" 1', display: '"swsh" 1, "ss05" 1, "dlig" 1, "calt" 1, "rlig" 1', kashida: '"swsh" 1, "ss05" 1, "dlig" 1, "calt" 1, "rlig" 1' },
};
const CHARACTER_DEFAULT = { accent: "olive", numScale: 1, kashida: "متوسطة" };

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("marja:lang") || "ar");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("marja:theme") || "light"
  );
  const [character, setCharacter] = useState(() => {
    try {
      return { ...CHARACTER_DEFAULT, ...JSON.parse(localStorage.getItem("marja:character") || "{}") };
    } catch {
      return CHARACTER_DEFAULT;
    }
  });

  useEffect(() => {
    const dir = STRINGS[lang].dir;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("marja:lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("marja:theme", theme);
  }, [theme]);

  // تطبيق «ضبط الطابع» كمتغيّرات CSS على <html> (يعتمد على الثيم لاختيار درجة اللون)
  useEffect(() => {
    const root = document.documentElement.style;
    const pal = ACCENTS[character.accent] || ACCENTS.olive;
    const [acc, deep] = theme === "dark" ? pal.dark : pal.light;
    root.setProperty("--accent", acc);
    root.setProperty("--accent-deep", deep);
    root.setProperty("--accent-tint", `color-mix(in srgb, ${acc} 8%, transparent)`);
    root.setProperty("--accent-tint-2", `color-mix(in srgb, ${acc} 14%, transparent)`);
    root.setProperty("--num-scale", String(character.numScale));
    const k = KASHIDA[character.kashida] || KASHIDA["متوسطة"];
    root.setProperty("--feat-body", k.body);
    root.setProperty("--feat-display", k.display);
    root.setProperty("--feat-kashida", k.kashida);
    localStorage.setItem("marja:character", JSON.stringify(character));
  }, [character, theme]);

  const t = (key) => STRINGS[lang][key] ?? key;

  const value = {
    lang,
    dir: STRINGS[lang].dir,
    theme,
    t,
    toggleLang: () => setLang((l) => (l === "ar" ? "en" : "ar")),
    toggleTheme: () => setTheme((th) => (th === "light" ? "dark" : "light")),
    character,
    setTweak: (k, v) => setCharacter((c) => ({ ...c, [k]: v })),
    resetCharacter: () => setCharacter(CHARACTER_DEFAULT),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
