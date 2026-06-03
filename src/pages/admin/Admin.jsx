import { useState } from "react";
import { Link } from "react-router-dom";
import { useContentVersion } from "../../store/content.js";
import AdminOverview from "./AdminOverview.jsx";
import AdminArticles from "./AdminArticles.jsx";
import AdminPages from "./AdminPages.jsx";
import AdminData from "./AdminData.jsx";

const TABS = [
  { id: "overview", label: "نظرة عامة" },
  { id: "articles", label: "المواد" },
  { id: "pages", label: "الصفحات" },
  { id: "data", label: "البيانات" },
];

export default function Admin() {
  const [tab, setTab] = useState("overview");
  useContentVersion(); // إعادة التصيير عند تغيّر المحتوى

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="reveal mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">لوحة التحكم · محلية</p>
            <h1 className="font-display mt-1 text-[var(--fz-2xl)] font-black leading-none">
              إدارة المرجع
            </h1>
          </div>
          <Link
            to="/"
            className="rounded-full border border-[var(--c-rule)] px-4 py-2 text-[var(--fz-xs)] text-[var(--c-ink-soft)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]"
          >
            ← العودة للموقع
          </Link>
        </div>
        <p className="mt-3 rounded-[var(--rad-md)] border border-[var(--c-amend-soft)] bg-[var(--c-amend-soft)] px-4 py-3 text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-soft)]">
          <span className="font-display font-bold text-[var(--c-amend)]">ℹ تنبيه · </span>
          كل التعديلات تُحفظ في متصفّحك فقط (بلا خادم). لتثبيتها بشكل دائم على الموقع
          المنشور: افتح تبويب «البيانات» ← «تصدير»، وأرسل الملف ليُرفَع إلى المستودع.
        </p>
      </header>

      <nav className="mb-8 flex flex-wrap gap-2 border-b border-[var(--c-rule)] pb-3">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            type="button"
            onClick={() => setTab(tb.id)}
            className={`font-display rounded-full px-4 py-1.5 text-[var(--fz-sm)] transition-colors ${
              tab === tb.id
                ? "bg-[var(--c-ink)] text-[var(--c-paper)]"
                : "text-[var(--c-ink-soft)] hover:bg-[var(--c-paper-3)]"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && <AdminOverview />}
      {tab === "articles" && <AdminArticles />}
      {tab === "pages" && <AdminPages />}
      {tab === "data" && <AdminData />}
    </div>
  );
}
