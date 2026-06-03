import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { calculators } from "../data/calculators.js";

export default function Calculators() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-10 border-b border-[var(--color-rule)] pb-8">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--text-4xl)] font-black leading-none">
          {t("calculators_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--text-base)] text-[var(--color-ink-soft)]">
          {t("calculators_lead")}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
        {calculators.map((c) => (
          <li key={c.id}>
            <Link
              to={`/calculators/${c.id}`}
              className="group flex h-full flex-col gap-3 bg-[var(--color-paper)] p-6 transition-colors hover:bg-[var(--color-paper-2)]"
            >
              <span className="font-display grid size-11 place-items-center rounded-full bg-[var(--color-accent-soft)] text-[var(--text-lg)] font-black text-[var(--color-accent)]">
                ÷
              </span>
              <h2 className="text-[var(--text-lg)] leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                {c.title}
              </h2>
              <p className="text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-faint)]">
                {c.lead}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 rounded-[var(--radius-md)] border border-dashed border-[var(--color-rule)] bg-[var(--color-paper-2)] px-5 py-4 text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-soft)]">
        <span className="font-display font-bold text-[var(--color-accent)]">تنبيه · </span>
        {t("calc_disclaimer")}
      </p>
    </div>
  );
}
