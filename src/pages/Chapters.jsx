import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { chapters } from "../data/chapters.js";
import { articlesInChapter } from "../data/articles.js";
import { displayNumber, ordinalAr } from "../lib/format.js";

export default function Chapters() {
  const { t, lang } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-10 border-b border-[var(--c-rule)] pb-8">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--fz-4xl)] font-black leading-none">
          {t("chapters_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--fz-base)] text-[var(--c-ink-soft)]">
          {t("chapters_lead")}
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)] bg-[var(--c-rule)] md:grid-cols-2">
        {chapters.map((c) => {
          const count = articlesInChapter(c.number).length;
          return (
            <li key={c.number}>
              <Link
                to={`/chapter/${c.number}`}
                className="group flex h-full flex-col gap-3 bg-[var(--c-paper)] p-6 transition-colors duration-150 hover:bg-[var(--c-paper-2)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-[var(--fz-4xl)] font-black leading-none text-[var(--c-ink-faint)] transition-colors group-hover:text-[var(--c-accent)]">
                    {displayNumber(c.number, lang)}
                  </span>
                  {count > 0 && (
                    <span className="shrink-0 rounded-full bg-[var(--c-accent-soft)] px-2.5 py-1 text-[var(--fz-xs)] text-[var(--c-accent)]">
                      {displayNumber(count, lang)} {t("articles_entered")}
                    </span>
                  )}
                </div>
                <div>
                  <span className="eyebrow block">
                    {t("chapter_word")} {ordinalAr(c.number) || c.number}
                  </span>
                  <h2 className="mt-1 text-[var(--fz-lg)] leading-snug text-[var(--c-ink)]">
                    {c.title}
                  </h2>
                </div>
                {c.sections.length > 0 && (
                  <p className="text-[var(--fz-sm)] leading-relaxed text-[var(--c-ink-faint)]">
                    {c.sections.map((s) => s.title).join(" · ")}
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
