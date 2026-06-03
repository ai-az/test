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
      <header className="reveal mb-8 border-b border-[var(--color-rule)] pb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-2 text-[var(--text-4xl)] font-black leading-none">
          {t("glossary_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--text-base)] text-[var(--color-ink-soft)]">
          {t("glossary_lead")}{" "}
          <Link
            to={`/article/${GLOSSARY_ARTICLE}`}
            className="text-[var(--color-accent)] underline underline-offset-4"
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
        className="mb-6 w-full rounded-[var(--radius-md)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3 text-[var(--text-base)] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)]"
      />

      <dl className="divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)]">
        {filtered.map((g) => (
          <div key={g.term} className="bg-[var(--color-paper)] p-5">
            <dt className="font-display text-[var(--text-lg)] font-bold text-[var(--color-ink)]">
              {g.term}
            </dt>
            <dd className="mt-1 text-[var(--text-base)] leading-relaxed text-[var(--color-ink-soft)]">
              {g.definition}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
