import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { scenarios } from "../data/scenarios.js";

export default function Scenarios() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-10 border-b border-[var(--c-rule)] pb-8">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--fz-4xl)] font-black leading-none">
          {t("scenarios_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--fz-base)] text-[var(--c-ink-soft)]">
          {t("scenarios_lead")}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-rule)] sm:grid-cols-2">
        {scenarios.map((s) => (
          <li key={s.id}>
            <Link
              to={`/start/${s.id}`}
              className="group flex h-full flex-col gap-3 bg-[var(--c-paper)] p-6 transition-colors hover:bg-[var(--c-paper-2)]"
            >
              <span className="font-display grid size-11 place-items-center rounded-full bg-[var(--c-accent-soft)] text-[var(--fz-xl)] text-[var(--c-accent)]">
                {s.icon}
              </span>
              <h2 className="text-[var(--fz-lg)] leading-snug text-[var(--c-ink)] group-hover:text-[var(--c-accent)]">
                {s.title}
              </h2>
              <p className="text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-faint)]">
                {s.lead}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
