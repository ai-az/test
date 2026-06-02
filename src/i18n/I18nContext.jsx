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
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("marja:lang") || "ar");
  const [theme, setTheme] = useState(
    () => localStorage.getItem("marja:theme") || "light"
  );

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

  const t = (key) => STRINGS[lang][key] ?? key;

  const value = {
    lang,
    dir: STRINGS[lang].dir,
    theme,
    t,
    toggleLang: () => setLang((l) => (l === "ar" ? "en" : "ar")),
    toggleTheme: () => setTheme((th) => (th === "light" ? "dark" : "light")),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
