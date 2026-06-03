import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { scenarios } from "../data/scenarios.js";

export default function Scenarios() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-10 border-b border-[var(--color-rule)] pb-8">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--text-4xl)] font-black leading-none">
          {t("scenarios_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--text-base)] text-[var(--color-ink-soft)]">
          {t("scenarios_lead")}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-rule)] sm:grid-cols-2">
        {scenarios.map((s) => (
          <li key={s.id}>
            <Link
              to={`/start/${s.id}`}
              className="group flex h-full flex-col gap-3 bg-[var(--color-paper)] p-6 transition-colors hover:bg-[var(--color-paper-2)]"
            >
              <span className="font-display grid size-11 place-items-center rounded-full bg-[var(--color-accent-soft)] text-[var(--text-xl)] text-[var(--color-accent)]">
                {s.icon}
              </span>
              <h2 className="text-[var(--text-lg)] leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                {s.title}
              </h2>
              <p className="text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-faint)]">
                {s.lead}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
