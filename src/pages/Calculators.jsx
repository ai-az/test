import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { calculators } from "../data/calculators.js";

export default function Calculators() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-10 border-b border-[var(--c-rule)] pb-8">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--fz-4xl)] font-black leading-none">
          {t("calculators_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--fz-base)] text-[var(--c-ink-soft)]">
          {t("calculators_lead")}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-rule)] sm:grid-cols-2">
        {calculators.map((c) => (
          <li key={c.id}>
            <Link
              to={`/calculators/${c.id}`}
              className="group flex h-full flex-col gap-3 bg-[var(--c-paper)] p-6 transition-colors hover:bg-[var(--c-paper-2)]"
            >
              <span className="font-display grid size-11 place-items-center rounded-full bg-[var(--c-accent-soft)] text-[var(--fz-lg)] font-black text-[var(--c-accent)]">
                ÷
              </span>
              <h2 className="text-[var(--fz-lg)] leading-snug text-[var(--c-ink)] group-hover:text-[var(--c-accent)]">
                {c.title}
              </h2>
              <p className="text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-faint)]">
                {c.lead}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-8 rounded-[var(--rad-md)] border border-dashed border-[var(--c-rule)] bg-[var(--c-paper-2)] px-5 py-4 text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-soft)]">
        <span className="font-display font-bold text-[var(--c-accent)]">تنبيه · </span>
        {t("calc_disclaimer")}
      </p>
    </div>
  );
}
