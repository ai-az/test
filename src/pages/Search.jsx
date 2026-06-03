import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { searchArticles, highlightParts } from "../lib/search.js";
import { displayArticleNumber, displayNumber, ordinalAr } from "../lib/format.js";

export default function Search() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchArticles(query), [query]);
  const active = query.trim().length >= 2;

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-2 text-[var(--fz-4xl)] font-black leading-none">
          {t("search_title")}
        </h1>
      </header>

      <div className="relative">
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_placeholder")}
          aria-label={t("search_title")}
          className="w-full rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-5 py-4 text-[var(--fz-lg)] text-[var(--c-ink)] outline-none transition-colors placeholder:text-[var(--c-ink-faint)] focus:border-[var(--c-accent)]"
        />
      </div>

      {!active && (
        <p className="mt-6 text-[var(--fz-sm)] text-[var(--c-ink-faint)]">
          {t("search_hint")}
        </p>
      )}

      {active && (
        <p className="mt-6 text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
          {displayNumber(results.length, lang)} {t("search_count")}
        </p>
      )}

      <ul className="mt-3 space-y-3">
        {active && results.length === 0 && (
          <li className="rounded-[var(--rad-md)] border border-dashed border-[var(--c-rule)] bg-[var(--c-paper-2)] px-5 py-8 text-center text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
            {t("search_no_results")}
          </li>
        )}
        {results.map((a) => (
          <li key={a.id}>
            <Link
              to={`/article/${a.id}`}
              className="group block rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-paper)] p-5 transition-colors hover:border-[var(--c-accent)] hover:bg-[var(--c-paper-2)]"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-[var(--fz-lg)] font-bold text-[var(--c-ink)] group-hover:text-[var(--c-accent)]">
                  {t("article_word")} {displayArticleNumber(a, lang)}
                </span>
                <span className="eyebrow shrink-0">
                  {t("chapter_word")} {ordinalAr(a.chapter.number)} · {a.chapter.title}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-soft)]">
                {highlightParts(a.officialText, query).map((p, i) =>
                  p.hit ? (
                    <mark
                      key={i}
                      className="rounded bg-[var(--c-accent-soft)] px-0.5 text-[var(--c-accent)]"
                    >
                      {p.text}
                    </mark>
                  ) : (
                    <span key={i}>{p.text}</span>
                  )
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
