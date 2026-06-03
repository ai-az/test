import { useState } from "react";
import { Link } from "react-router-dom";
import { listPages, savePage, deletePage } from "../../store/content.js";

const slugify = (s) =>
  s
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^ء-يa-z0-9-]/gi, "")
    .slice(0, 60) || `page-${Date.now()}`;

const blank = { title: "", slug: "", body: "" };

export default function AdminPages() {
  const pages = listPages();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const onSave = () => {
    if (!form.title.trim()) return;
    const slug = form.slug.trim() ? slugify(form.slug) : slugify(form.title);
    savePage({ title: form.title.trim(), slug, body: form.body });
    setForm(blank);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-md)] border border-[var(--color-rule)] p-4">
        <p className="eyebrow mb-3">{editing ? "تعديل صفحة" : "صفحة جديدة"}</p>
        <div className="space-y-3">
          <label className="flex flex-col gap-1">
            <span className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">العنوان *</span>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="rounded-[var(--radius-sm)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3 py-2 text-[var(--text-base)] outline-none focus:border-[var(--color-accent)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">
              المُعرّف (اختياري) — الرابط: /p/&lt;المعرّف&gt;
            </span>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="يُولَّد تلقائياً من العنوان"
              className="rounded-[var(--radius-sm)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3 py-2 text-[var(--text-sm)] outline-none placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">
              المحتوى — يدعم: # عنوان · ## عنوان فرعي · - عنصر قائمة · سطر فارغ = فقرة
            </span>
            <textarea
              rows={8}
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              className="rounded-[var(--radius-sm)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3 py-2 text-[var(--text-sm)] leading-relaxed outline-none focus:border-[var(--color-accent)]"
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={!form.title.trim()}
              className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-[var(--text-sm)] text-[var(--color-paper)] disabled:opacity-40"
            >
              حفظ الصفحة
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setForm(blank);
                  setEditing(false);
                }}
                className="rounded-full border border-[var(--color-rule)] px-5 py-2 text-[var(--text-sm)] text-[var(--color-ink-soft)]"
              >
                إلغاء
              </button>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-display mb-3 text-[var(--text-sm)] font-bold">الصفحات ({pages.length})</h2>
        {pages.length === 0 ? (
          <p className="text-[var(--text-sm)] text-[var(--color-ink-faint)]">لا توجد صفحات مخصّصة بعد.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-rule)]">
            {pages.map((p) => (
              <li key={p.slug} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <Link to={`/p/${p.slug}`} className="block truncate text-[var(--text-base)] text-[var(--color-ink)] hover:text-[var(--color-accent)]">
                    {p.title}
                  </Link>
                  <span className="text-[var(--text-xs)] text-[var(--color-ink-faint)]">/p/{p.slug}</span>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ title: p.title, slug: p.slug, body: p.body });
                      setEditing(true);
                      window.scrollTo(0, 0);
                    }}
                    className="rounded-full border border-[var(--color-rule)] px-3 py-1 text-[var(--text-xs)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)]"
                  >
                    تعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePage(p.slug)}
                    className="rounded-full border border-[var(--color-rule)] px-3 py-1 text-[var(--text-xs)] text-[var(--color-ink-soft)] hover:border-[var(--color-amend)] hover:text-[var(--color-amend)]"
                  >
                    حذف
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
