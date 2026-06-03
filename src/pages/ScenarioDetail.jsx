import { useParams, Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { getScenario } from "../data/scenarios.js";
import { getArticle } from "../data/articles.js";
import { getCalculator } from "../data/calculators.js";
import { displayArticleNumber } from "../lib/format.js";
import NotFound from "./NotFound.jsx";

export default function ScenarioDetail() {
  const { id } = useParams();
  const { t, lang } = useI18n();
  const scenario = getScenario(id);
  if (!scenario) return <NotFound />;

  const calc = scenario.calculator ? getCalculator(scenario.calculator) : null;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <nav className="flex items-center gap-2 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
        <Link to="/start" className="hover:text-[var(--c-accent)]">
          {t("scenarios_title")}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--c-ink-soft)]">{scenario.title}</span>
      </nav>

      <header className="reveal mt-6 flex items-start gap-4 border-b border-[var(--c-rule)] pb-8">
        <span className="font-display grid size-12 shrink-0 place-items-center rounded-full bg-[var(--c-accent-soft)] text-[var(--fz-2xl)] text-[var(--c-accent)]">
          {scenario.icon}
        </span>
        <div className="min-w-0 pt-1">
          <h1 className="font-display text-[var(--fz-2xl)] font-bold leading-tight">
            {scenario.title}
          </h1>
          <p className="mt-2 text-[var(--fz-base)] text-[var(--c-ink-soft)]">
            {scenario.lead}
          </p>
        </div>
      </header>

      {calc && (
        <Link
          to={`/calculators/${calc.id}`}
          className="mt-8 flex items-center justify-between gap-4 rounded-[var(--rad-md)] border border-[var(--c-accent)] bg-[var(--c-accent-soft)] p-5 transition-transform hover:-translate-y-0.5"
        >
          <span>
            <span className="font-display block text-[var(--fz-lg)] font-bold text-[var(--c-accent)]">
              {calc.title}
            </span>
            <span className="text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
              {t("scenario_calc_cta")}
            </span>
          </span>
          <span className="text-[var(--fz-xl)] text-[var(--c-accent)] rtl:rotate-180">→</span>
        </Link>
      )}

      <h2 className="font-display mt-10 mb-3 flex items-center gap-2 text-[var(--fz-sm)] font-bold text-[var(--c-ink)]">
        <span className="h-3 w-1 rounded-full bg-[var(--c-ink-faint)]" />
        {t("scenario_articles")}
      </h2>
      <ul className="divide-y divide-[var(--c-rule)] overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)]">
        {scenario.articleIds.map((aid) => {
          const a = getArticle(aid);
          if (!a) {
            return (
              <li
                key={aid}
                className="flex items-center gap-4 bg-[var(--c-paper)] px-5 py-4 text-[var(--c-ink-faint)]"
              >
                <span className="font-display min-w-9 text-[var(--fz-xl)] font-black">
                  {aid}
                </span>
                <span className="text-[var(--fz-sm)]">{t("article_pending_label")}</span>
              </li>
            );
          }
          return (
            <li key={aid}>
              <Link
                to={`/article/${a.id}`}
                className="group flex items-center gap-4 bg-[var(--c-paper)] px-5 py-4 transition-colors hover:bg-[var(--c-paper-2)]"
              >
                <span className="font-display min-w-9 text-[var(--fz-xl)] font-black text-[var(--c-ink-faint)] group-hover:text-[var(--c-accent)]">
                  {displayArticleNumber(a, lang)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block">
                    {t("article_word")} {displayArticleNumber(a, lang)}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-soft)]">
                    {a.simplifiedAr || a.officialText}
                  </span>
                </span>
                {a.isAmended && (
                  <span className="shrink-0 rounded-full bg-[var(--c-amend-soft)] px-2.5 py-1 text-[var(--fz-xs)] text-[var(--c-amend)]">
                    {t("amended")}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-[var(--fz-xs)] leading-relaxed text-[var(--c-ink-faint)]">
        {t("disclaimer")}
      </p>
    </div>
  );
}
