import { useParams, Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { getChapter } from "../data/chapters.js";
import { articlesInChapter } from "../data/articles.js";
import { displayNumber, ordinalAr } from "../lib/format.js";
import NotFound from "./NotFound.jsx";

export default function ChapterDetail() {
  const { num } = useParams();
  const { t, lang } = useI18n();
  const chapter = getChapter(num);
  if (!chapter) return <NotFound />;

  const entered = articlesInChapter(chapter.number);
  const bySection = (sectionNumber) =>
    entered.filter((a) => a.section?.number === sectionNumber);
  const noSection = entered.filter(
    (a) => !chapter.sections.some((s) => s.number === a.section?.number)
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <Breadcrumb
        items={[
          { label: t("nav_chapters"), to: "/chapters" },
          { label: `${t("chapter_word")} ${ordinalAr(chapter.number) || chapter.number}` },
        ]}
      />

      <header className="reveal mt-6 flex items-start gap-5 border-b border-[var(--color-rule)] pb-8">
        <span className="specimen-numeral text-[var(--text-4xl)] text-[var(--color-accent)]">
          {displayNumber(chapter.number, lang)}
        </span>
        <div className="min-w-0 pt-1">
          <p className="eyebrow">
            {t("chapter_word")} {ordinalAr(chapter.number) || chapter.number}
          </p>
          <h1 className="font-display mt-1 text-[var(--text-2xl)] font-bold leading-tight">
            {chapter.title}
          </h1>
        </div>
      </header>

      {entered.length === 0 && (
        <p className="mt-8 rounded-[var(--radius-md)] border border-dashed border-[var(--color-rule)] bg-[var(--color-paper-2)] px-5 py-6 text-[var(--text-sm)] text-[var(--color-ink-soft)]">
          {t("article_pending_note")}
        </p>
      )}

      {chapter.sections.map((s) => {
        const arts = bySection(s.number);
        return (
          <section key={s.number} className="mt-10">
            <h2 className="flex items-baseline gap-2 text-[var(--text-base)] text-[var(--color-ink-soft)]">
              <span className="eyebrow">
                {t("section_word")} {ordinalAr(s.number) || s.number}
              </span>
              <span className="text-[var(--color-ink)]">{s.title}</span>
            </h2>
            {arts.length > 0 ? (
              <ArticleList articles={arts} />
            ) : (
              <p className="mt-3 text-[var(--text-sm)] text-[var(--color-ink-faint)]">
                {t("article_pending_note")}
              </p>
            )}
          </section>
        );
      })}

      {noSection.length > 0 && <ArticleList articles={noSection} className="mt-10" />}
    </div>
  );
}

function ArticleList({ articles, className = "" }) {
  const { t, lang } = useI18n();
  return (
    <ul
      className={`mt-4 divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)] ${className}`}
    >
      {articles.map((a) => (
        <li key={a.articleNumber}>
          <Link
            to={`/article/${a.articleNumber}`}
            className="group flex items-center gap-4 bg-[var(--color-paper)] px-5 py-4 transition-colors duration-150 hover:bg-[var(--color-paper-2)]"
          >
            <span className="font-display min-w-9 text-[var(--text-xl)] font-black text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-accent)]">
              {displayNumber(a.articleNumber, lang)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="eyebrow block">
                {t("article_word")} {displayNumber(a.articleNumber, lang)}
              </span>
              <span className="mt-0.5 line-clamp-2 block text-[var(--text-sm)] leading-relaxed text-[var(--color-ink-soft)]">
                {a.officialText}
              </span>
            </span>
            {a.isAmended && <AmendedTag />}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function AmendedTag() {
  const { t } = useI18n();
  return (
    <span className="shrink-0 rounded-full bg-[var(--color-amend-soft)] px-2.5 py-1 text-[var(--text-xs)] text-[var(--color-amend)]">
      {t("amended")}
    </span>
  );
}

function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-[var(--text-xs)] text-[var(--color-ink-faint)]">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.to ? (
            <Link to={it.to} className="transition-colors hover:text-[var(--color-accent)]">
              {it.label}
            </Link>
          ) : (
            <span className="text-[var(--color-ink-soft)]">{it.label}</span>
          )}
          {i < items.length - 1 && <span aria-hidden="true">/</span>}
        </span>
      ))}
    </nav>
  );
}
