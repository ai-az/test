import { Link } from "react-router-dom";
import { getStats, clearAnalytics } from "../../lib/analytics.js";
import { getEnteredCount, getArticle } from "../../data/articles.js";
import { TOTAL_ARTICLE_SLOTS } from "../../data/articleIndex.js";
import { listPages, getPage } from "../../store/content.js";
import { useBookmarks } from "../../lib/storage.js";
import { displayArticleNumber, toArabicDigits } from "../../lib/format.js";
import { useState } from "react";

const ROUTE_LABELS = {
  "/": "الغلاف",
  "/chapters": "الأبواب",
  "/index": "خريطة المواد",
  "/glossary": "المسرد",
  "/search": "بحث",
  "/start": "حسب الموقف",
  "/calculators": "الحاسبات",
  "/timeline": "التعديلات",
  "/coverage": "التغطية",
  "/bookmarks": "المفضّلة",
  "/admin": "لوحة التحكم",
};

function labelFor(path) {
  if (ROUTE_LABELS[path]) return ROUTE_LABELS[path];
  const parts = path.split("/");
  if (path.startsWith("/article/")) {
    const id = decodeURIComponent(parts[2] || "");
    const a = getArticle(id);
    return a ? `المادة ${displayArticleNumber(a, "ar")}` : `المادة ${id}`;
  }
  if (path.startsWith("/p/")) {
    const slug = decodeURIComponent(parts[2] || "");
    const p = getPage(slug);
    return p ? p.title : `صفحة: ${slug}`;
  }
  if (path.startsWith("/chapter/")) return `الباب ${toArabicDigits(parts[2])}`;
  if (path.startsWith("/calculators/")) return `حاسبة: ${parts[2]}`;
  if (path.startsWith("/start/")) return `موقف: ${parts[2]}`;
  return path;
}

export default function AdminOverview() {
  const stats = getStats();
  const { ids } = useBookmarks();
  const [cleared, setCleared] = useState(false);
  const maxDay = Math.max(1, ...stats.days.map((d) => d.count));

  const cards = [
    { label: "إجمالي المشاهدات", value: stats.totalViews },
    { label: "الجلسات", value: stats.sessions },
    { label: "الأيام النشطة", value: stats.activeDays },
    { label: "مواد مُدخَلة", value: `${getEnteredCount()} / ${TOTAL_ARTICLE_SLOTS}` },
    { label: "صفحات مخصّصة", value: listPages().length },
    { label: "مواد مُفضّلة", value: ids.length },
  ];

  return (
    <div className="space-y-8">
      <p className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">
        إحصاءات هذا الجهاز فقط (خصوصية تامّة، بلا تتبّع خارجي). للزوّار المجمّعين بعد
        النشر، استخدم لوحة Vercel Web Analytics.
      </p>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-[var(--color-paper)] px-5 py-4">
            <div className="font-display text-[var(--text-2xl)] font-black text-[var(--color-accent)]">
              {typeof c.value === "number" ? toArabicDigits(c.value) : toArabicDigits(c.value)}
            </div>
            <div className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">{c.label}</div>
          </div>
        ))}
      </div>

      {/* مخطّط آخر ١٤ يوماً */}
      <section>
        <h2 className="font-display mb-3 text-[var(--text-sm)] font-bold">المشاهدات · آخر ١٤ يوماً</h2>
        <div className="flex h-28 items-end gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-rule)] p-3">
          {stats.days.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day}: ${d.count}`}>
              <div
                className="w-full rounded-t bg-[var(--color-accent)]"
                style={{ height: `${(d.count / maxDay) * 100}%`, minHeight: d.count ? "3px" : "0" }}
              />
              <span className="text-[8px] text-[var(--color-ink-faint)]">{toArabicDigits(d.day.slice(8))}</span>
            </div>
          ))}
        </div>
      </section>

      {/* الأكثر مشاهدة */}
      <section>
        <h2 className="font-display mb-3 text-[var(--text-sm)] font-bold">الأكثر مشاهدة</h2>
        {stats.topPaths.length === 0 ? (
          <p className="text-[var(--text-sm)] text-[var(--color-ink-faint)]">لا توجد بيانات بعد.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)]">
            {stats.topPaths.map((p) => (
              <li key={p.path} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <Link to={p.path} className="text-[var(--text-sm)] text-[var(--color-ink)] hover:text-[var(--color-accent)]">
                  {labelFor(p.path)}
                </Link>
                <span className="font-display text-[var(--text-sm)] font-bold text-[var(--color-ink-soft)]">
                  {toArabicDigits(p.count)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        type="button"
        onClick={() => {
          clearAnalytics();
          setCleared(true);
          setTimeout(() => setCleared(false), 1500);
        }}
        className="text-[var(--text-xs)] text-[var(--color-ink-faint)] underline decoration-dashed underline-offset-4 hover:text-[var(--color-amend)]"
      >
        {cleared ? "تم المسح ✓" : "مسح إحصاءات هذا الجهاز"}
      </button>
    </div>
  );
}
