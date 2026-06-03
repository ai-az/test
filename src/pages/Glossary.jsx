import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { glossary, GLOSSARY_ARTICLE } from "../data/glossary.js";
import { normalizeAr } from "../lib/arabic.js";

export default function Glossary() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const n = normalizeAr(q);
    if (!n) return glossary;
    return glossary.filter(
      (g) => normalizeAr(g.term).includes(n) || normalizeAr(g.definition).includes(n)
    );
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-8 border-b border-[var(--c-rule)] pb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-2 text-[var(--fz-4xl)] font-black leading-none">
          {t("glossary_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--fz-base)] text-[var(--c-ink-soft)]">
          {t("glossary_lead")}{" "}
          <Link
            to={`/article/${GLOSSARY_ARTICLE}`}
            className="text-[var(--c-accent)] underline underline-offset-4"
          >
            {t("article_word")} ٢
          </Link>
          .
        </p>
      </header>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("glossary_filter")}
        aria-label={t("glossary_filter")}
        className="mb-6 w-full rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-4 py-3 text-[var(--fz-base)] text-[var(--c-ink)] outline-none transition-colors placeholder:text-[var(--c-ink-faint)] focus:border-[var(--c-accent)]"
      />

      <dl className="divide-y divide-[var(--c-rule)] overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)]">
        {filtered.map((g) => (
          <div key={g.term} className="bg-[var(--c-paper)] p-5">
            <dt className="font-display text-[var(--fz-lg)] font-bold text-[var(--c-ink)]">
              {g.term}
            </dt>
            <dd className="mt-1 text-[var(--fz-base)] leading-relaxed text-[var(--c-ink-soft)]">
              {g.definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
