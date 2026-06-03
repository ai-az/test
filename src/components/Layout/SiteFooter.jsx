import { Link } from "react-router-dom";
import { LAW_META } from "../../data/chapters.js";
import { useI18n } from "../../i18n/I18nContext.jsx";
import { listPages, useContentVersion } from "../../store/content.js";

const FOOTER_LINKS = [
  { to: "/start", key: "nav_start" },
  { to: "/calculators", key: "nav_calculators" },
  { to: "/index", key: "nav_index" },
  { to: "/glossary", key: "nav_glossary" },
  { to: "/timeline", key: "nav_timeline" },
  { to: "/coverage", key: "nav_coverage" },
];

export default function SiteFooter() {
  const { t } = useI18n();
  useContentVersion();
  const pages = listPages();
  return (
    <footer className="no-print mt-auto border-t border-[var(--color-rule)] bg-[var(--color-paper-2)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <nav className="mb-8 flex flex-wrap gap-x-5 gap-y-2 text-[var(--text-sm)] text-[var(--color-ink-soft)]">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="transition-colors hover:text-[var(--color-accent)]">
              {t(l.key)}
            </Link>
          ))}
          {pages.map((p) => (
            <Link key={p.slug} to={`/p/${p.slug}`} className="transition-colors hover:text-[var(--color-accent)]">
              {p.title}
            </Link>
          ))}
          <Link to="/admin" className="text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-accent)]">
            لوحة التحكم
          </Link>
        </nav>
        <p className="max-w-2xl text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-soft)]">
          <span className="font-display font-bold text-[var(--color-accent)]">
            تنويه ·{" "}
          </span>
          {t("disclaimer")}
        </p>
        <div className="mt-6 flex flex-col gap-2 border-t border-[var(--color-rule)] pt-6 text-[var(--text-xs)] text-[var(--color-ink-faint)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            {LAW_META.titleAr} — {LAW_META.decree} وتاريخ {LAW_META.decreeDate}
          </span>
          <a
            href={LAW_META.source}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[var(--color-rule)] underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
          >
            {t("source_label")} ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
