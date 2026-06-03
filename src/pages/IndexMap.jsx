import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { chapters } from "../data/chapters.js";
import { articlesInChapter } from "../data/articles.js";
import { displayNumber, displayArticleNumber, ordinalAr } from "../lib/format.js";

export default function IndexMap() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState(0); // 0 = الكل
  const shown = filter ? chapters.filter((c) => c.number === filter) : chapters;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-6 border-b border-[var(--color-rule)] pb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-2 text-[var(--text-4xl)] font-black leading-none">
          {t("index_title")}
        </h1>
        <p className="mt-4 max-w-xl text-[var(--text-base)] text-[var(--color-ink-soft)]">
          {t("index_lead")}
        </p>
      </header>

      {/* مرشّح الأبواب */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Chip active={filter === 0} onClick={() => setFilter(0)}>
          {t("filter_all")}
        </Chip>
        {chapters.map((c) => (
          <Chip key={c.number} active={filter === c.number} onClick={() => setFilter(c.number)}>
            {displayNumber(c.number, lang)}
          </Chip>
        ))}
      </div>

      <div className="space-y-10">
        {shown.map((c) => {
          const arts = articlesInChapter(c.number);
          const sections = c.sections.length ? c.sections : [{ number: 0, title: null }];
          return (
            <section key={c.number}>
              <h2 className="flex items-baseline gap-3 border-b border-[var(--color-rule)] pb-2">
                <span className="font-display text-[var(--text-2xl)] font-black text-[var(--color-accent)]">
                  {displayNumber(c.number, lang)}
                </span>
                <span className="min-w-0">
                  <Link
                    to={`/chapter/${c.number}`}
                    className="text-[var(--text-lg)] text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                  >
                    {c.title}
                  </Link>
                </span>
              </h2>

              {arts.length === 0 ? (
                <p className="mt-3 text-[var(--text-sm)] text-[var(--color-ink-faint)]">
                  {t("article_pending_note")}
                </p>
              ) : (
                sections.map((s) => {
                  const inSec = arts.filter(
                    (a) => s.number === 0 || a.section?.number === s.number
                  );
                  if (inSec.length === 0) return null;
                  return (
                    <div key={s.number} className="mt-4">
                      {s.title && (
                        <p className="eyebrow mb-2">
                          {t("section_word")} {ordinalAr(s.number)} · {s.title}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {inSec.map((a) => (
                          <Link
                            key={a.id}
                            to={`/article/${a.id}`}
                            className={`font-display inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border px-3 py-1.5 text-[var(--text-sm)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] ${
                              a.isAmended
                                ? "border-[var(--color-amend-soft)] text-[var(--color-ink-soft)]"
                                : "border-[var(--color-rule)] text-[var(--color-ink-soft)]"
                            }`}
                            title={a.officialText.slice(0, 80)}
                          >
                            {displayArticleNumber(a, lang)}
                            {a.isAmended && (
                              <span className="size-1.5 rounded-full bg-[var(--color-amend)]" />
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`font-display rounded-full border px-3.5 py-1.5 text-[var(--text-sm)] transition-colors ${
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
          : "border-[var(--color-rule)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
      }`}
    >
      {children}
    </button>
  );
}
