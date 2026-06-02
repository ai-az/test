import { LAW_META } from "../../data/chapters.js";
import { useI18n } from "../../i18n/I18nContext.jsx";

export default function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-[var(--color-rule)] bg-[var(--color-paper-2)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
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
