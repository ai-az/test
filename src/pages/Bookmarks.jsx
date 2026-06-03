import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useBookmarks } from "../lib/storage.js";
import { getArticle } from "../data/articles.js";
import { displayNumber, ordinalAr } from "../lib/format.js";

export default function Bookmarks() {
  const { t, lang } = useI18n();
  const { ids } = useBookmarks();
  const saved = ids.map(getArticle).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-8 border-b border-[var(--c-rule)] pb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-2 text-[var(--fz-4xl)] font-black leading-none">
          {t("bookmarks_title")}
        </h1>
      </header>

      {saved.length === 0 ? (
        <p className="rounded-[var(--rad-md)] border border-dashed border-[var(--c-rule)] bg-[var(--c-paper-2)] px-5 py-10 text-center text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
          {t("bookmarks_empty")}
        </p>
      ) : (
        <ul className="divide-y divide-[var(--c-rule)] overflow-hidden rounded-[var(--rad-md)] border border-[var(--c-rule)]">
          {saved.map((a) => (
            <li key={a.id}>
              <Link
                to={`/article/${a.id}`}
                className="group flex items-center gap-4 bg-[var(--c-paper)] px-5 py-4 transition-colors hover:bg-[var(--c-paper-2)]"
              >
                <span className="font-display min-w-9 text-[var(--fz-xl)] font-black text-[var(--c-ink-faint)] transition-colors group-hover:text-[var(--c-accent)]">
                  {displayNumber(a.articleNumber, lang)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block">
                    {t("chapter_word")} {ordinalAr(a.chapter.number)} · {a.chapter.title}
                  </span>
                  <span className="mt-0.5 line-clamp-1 block text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
                    {a.officialText}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
