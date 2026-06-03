import { useParams } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext.jsx";
import { getPage } from "../store/content.js";
import NotFound from "./NotFound.jsx";

// عارض بسيط للنصّ: عناوين (# / ##)، قوائم (-)، وفقرات.
function renderBody(body = "") {
  const blocks = body.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const lines = block.split("\n");
    if (lines.every((l) => l.trim().startsWith("- "))) {
      return (
        <ul key={i} className="my-4 list-disc space-y-1 pe-6">
          {lines.map((l, j) => (
            <li key={j} className="text-[var(--color-ink-soft)]">
              {l.replace(/^-\s+/, "")}
            </li>
          ))}
        </ul>
      );
    }
    const t = block.trim();
    if (t.startsWith("## "))
      return (
        <h3 key={i} className="font-display mt-8 mb-2 text-[var(--text-xl)] font-bold">
          {t.slice(3)}
        </h3>
      );
    if (t.startsWith("# "))
      return (
        <h2 key={i} className="font-display mt-8 mb-2 text-[var(--text-2xl)] font-bold">
          {t.slice(2)}
        </h2>
      );
    return (
      <p key={i} className="my-3 leading-[var(--leading-prose)] text-[var(--color-ink-soft)]">
        {block.split("\n").map((l, j) => (
          <span key={j}>
            {l}
            {j < block.split("\n").length - 1 && <br />}
          </span>
        ))}
      </p>
    );
  });
}

export default function CustomPage() {
  const { slug } = useParams();
  const { t } = useI18n();
  const page = getPage(slug);
  if (!page) return <NotFound />;

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
      <header className="reveal mb-8 border-b border-[var(--color-rule)] pb-6">
        <p className="eyebrow">{t("siteName")}</p>
        <h1 className="font-display mt-3 text-[var(--text-4xl)] font-black leading-tight">
          {page.title}
        </h1>
      </header>
      <div className="text-[var(--text-base)]">{renderBody(page.body)}</div>
    </article>
  );
}
