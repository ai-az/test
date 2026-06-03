import { useState } from "react";
import {
  getArticle,
  builtinArticleIds,
} from "../../data/articles.js";
import { getSlot } from "../../data/articleIndex.js";
import { getChapter } from "../../data/chapters.js";
import {
  saveArticleOverride,
  deleteArticleOverride,
  overriddenArticleIds,
} from "../../store/content.js";
import { toArabicDigits } from "../../lib/format.js";

const blankForm = {
  n: "",
  mukarrar: false,
  chapterTitle: "",
  chapterNumber: "",
  sectionNumber: "",
  sectionTitle: "",
  isAmended: false,
  amendmentInfo: "",
  officialText: "",
  simplifiedAr: "",
  scenario: "",
  outcome: "",
  keywords: "",
  related: "",
  lastUpdated: "",
  status: "entered",
};

function articleToForm(a) {
  return {
    n: String(a.articleNumber),
    mukarrar: !!a.mukarrar,
    chapterNumber: String(a.chapter?.number ?? ""),
    chapterTitle: a.chapter?.title ?? "",
    sectionNumber: a.section ? String(a.section.number) : "",
    sectionTitle: a.section?.title ?? "",
    isAmended: !!a.isAmended,
    amendmentInfo: a.amendmentInfo ?? "",
    officialText: a.officialText ?? "",
    simplifiedAr: a.simplifiedAr ?? "",
    scenario: a.example?.scenario ?? "",
    outcome: a.example?.outcome ?? "",
    keywords: (a.keywords || []).join("، "),
    related: (a.relatedArticles || []).join("، "),
    lastUpdated: a.lastUpdated ?? "",
    status: a.status ?? "entered",
  };
}

function formToArticle(f) {
  const n = Number(f.n);
  const id = f.mukarrar ? `${n}م` : String(n);
  const splitList = (s) =>
    s.split(/[،,]/).map((x) => x.trim()).filter(Boolean);
  const ex =
    f.scenario.trim() || f.outcome.trim()
      ? { scenario: f.scenario.trim(), outcome: f.outcome.trim() }
      : null;
  return {
    id,
    order: n + (f.mukarrar ? 0.5 : 0),
    articleNumber: n,
    ...(f.mukarrar ? { mukarrar: true } : {}),
    chapter: { number: Number(f.chapterNumber) || 0, title: f.chapterTitle.trim() },
    section: f.sectionTitle.trim()
      ? { number: Number(f.sectionNumber) || 0, title: f.sectionTitle.trim() }
      : null,
    isAmended: f.isAmended,
    officialText: f.officialText.trim(),
    originalText: null,
    amendmentInfo: f.isAmended ? f.amendmentInfo.trim() || null : null,
    simplifiedAr: f.simplifiedAr.trim(),
    example: ex,
    keywords: splitList(f.keywords),
    relatedArticles: splitList(f.related),
    lastUpdated: f.lastUpdated.trim() || "1446",
    status: f.status,
  };
}

export default function AdminArticles() {
  const [form, setForm] = useState(blankForm);
  const [loadedId, setLoadedId] = useState(null);
  const [saved, setSaved] = useState(false);
  const overridden = overriddenArticleIds();

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const load = (n, mukarrar) => {
    const id = mukarrar ? `${n}م` : String(n);
    const existing = getArticle(id);
    if (existing) {
      setForm(articleToForm(existing));
    } else {
      const slot = getSlot(id);
      const ch = slot ? getChapter(slot.chapter) : null;
      setForm({
        ...blankForm,
        n: String(n),
        mukarrar: !!mukarrar,
        chapterNumber: ch ? String(ch.number) : "",
        chapterTitle: ch ? ch.title : "",
      });
    }
    setLoadedId(id);
    setSaved(false);
  };

  const onSave = () => {
    if (!form.n || !form.officialText.trim()) return;
    const art = formToArticle(form);
    saveArticleOverride(art.id, art);
    setLoadedId(art.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onReset = () => {
    if (!loadedId) return;
    deleteArticleOverride(loadedId);
    if (builtinArticleIds.has(loadedId)) load(form.n, form.mukarrar);
    else {
      setForm(blankForm);
      setLoadedId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* المنتقي */}
      <div className="rounded-[var(--rad-md)] border border-[var(--c-rule)] p-4">
        <p className="eyebrow mb-2">تحميل / إضافة مادة</p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">رقم المادة</span>
            <input
              type="number"
              value={form.n}
              onChange={(e) => set("n", e.target.value)}
              className="w-28 rounded-[var(--rad-sm)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-3 py-2 text-[var(--fz-base)] outline-none focus:border-[var(--c-accent)]"
            />
          </label>
          <label className="flex items-center gap-2 pb-2 text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
            <input type="checkbox" checked={form.mukarrar} onChange={(e) => set("mukarrar", e.target.checked)} />
            مكرر
          </label>
          <button
            type="button"
            onClick={() => form.n && load(Number(form.n), form.mukarrar)}
            className="rounded-full bg-[var(--c-ink)] px-4 py-2 text-[var(--fz-sm)] text-[var(--c-paper)]"
          >
            تحميل
          </button>
        </div>
        {overridden.size > 0 && (
          <div className="mt-3">
            <p className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">معدَّلة محلياً:</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {[...overridden].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    const a = getArticle(id);
                    if (a) {
                      setForm(articleToForm(a));
                      setLoadedId(id);
                    }
                  }}
                  className="font-display rounded border border-[var(--c-accent)] bg-[var(--c-accent-soft)] px-2 py-0.5 text-[var(--fz-xs)] text-[var(--c-accent)]"
                >
                  {toArabicDigits(id.replace("م", " م"))}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loadedId !== null && (
        <div className="space-y-4 rounded-[var(--rad-md)] border border-[var(--c-rule)] p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[var(--fz-lg)] font-bold">
              المادة {toArabicDigits(form.n)} {form.mukarrar ? "مكرر" : ""}
            </h3>
            {overridden.has(loadedId) && (
              <span className="rounded-full bg-[var(--c-accent-soft)] px-2.5 py-0.5 text-[var(--fz-xs)] text-[var(--c-accent)]">
                معدَّلة محلياً
              </span>
            )}
          </div>

          <Row>
            <Field label="الباب (رقم)" value={form.chapterNumber} onChange={(v) => set("chapterNumber", v)} w="w-24" />
            <Field label="عنوان الباب" value={form.chapterTitle} onChange={(v) => set("chapterTitle", v)} />
          </Row>
          <Row>
            <Field label="الفصل (رقم)" value={form.sectionNumber} onChange={(v) => set("sectionNumber", v)} w="w-24" />
            <Field label="عنوان الفصل (اختياري)" value={form.sectionTitle} onChange={(v) => set("sectionTitle", v)} />
          </Row>

          <Area label="النص الرسمي *" value={form.officialText} onChange={(v) => set("officialText", v)} rows={4} />
          <Area label="ببساطة (شرح مبسّط)" value={form.simplifiedAr} onChange={(v) => set("simplifiedAr", v)} rows={3} />
          <Row>
            <Area label="مثال — الموقف" value={form.scenario} onChange={(v) => set("scenario", v)} rows={2} />
            <Area label="مثال — النتيجة" value={form.outcome} onChange={(v) => set("outcome", v)} rows={2} />
          </Row>
          <Field label="كلمات مفتاحية (مفصولة بفاصلة)" value={form.keywords} onChange={(v) => set("keywords", v)} />
          <Field label="مواد ذات صلة (أرقام مفصولة بفاصلة)" value={form.related} onChange={(v) => set("related", v)} />

          <Row>
            <label className="flex items-center gap-2 text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
              <input type="checkbox" checked={form.isAmended} onChange={(e) => set("isAmended", e.target.checked)} />
              مادة معدَّلة
            </label>
            <label className="flex items-center gap-2 text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
              <span>الحالة:</span>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="rounded-[var(--rad-sm)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-2 py-1"
              >
                <option value="entered">مُدخَلة (تظهر)</option>
                <option value="pending">قيد الإدخال</option>
              </select>
            </label>
          </Row>
          {form.isAmended && (
            <Area label="معلومة التعديل" value={form.amendmentInfo} onChange={(v) => set("amendmentInfo", v)} rows={2} />
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--c-rule)] pt-4">
            <button
              type="button"
              onClick={onSave}
              disabled={!form.officialText.trim()}
              className="rounded-full bg-[var(--c-accent)] px-5 py-2 text-[var(--fz-sm)] text-[var(--c-paper)] disabled:opacity-40"
            >
              {saved ? "تم الحفظ ✓" : "حفظ التعديل"}
            </button>
            {overridden.has(loadedId) && (
              <button
                type="button"
                onClick={onReset}
                className="rounded-full border border-[var(--c-rule)] px-5 py-2 text-[var(--fz-sm)] text-[var(--c-ink-soft)] hover:border-[var(--c-amend)] hover:text-[var(--c-amend)]"
              >
                استعادة الأصل
              </button>
            )}
            <span className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">
              يُحفظ محلياً — صدّر من تبويب «البيانات» لتثبيته.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ children }) {
  return <div className="flex flex-wrap gap-3">{children}</div>;
}
function Field({ label, value, onChange, w = "flex-1 min-w-[12rem]" }) {
  return (
    <label className={`flex flex-col gap-1 ${w}`}>
      <span className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[var(--rad-sm)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-3 py-2 text-[var(--fz-sm)] outline-none focus:border-[var(--c-accent)]"
      />
    </label>
  );
}
function Area({ label, value, onChange, rows = 3 }) {
  return (
    <label className="flex flex-1 flex-col gap-1">
      <span className="text-[var(--fz-xs)] text-[var(--c-ink-faint)]">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[var(--rad-sm)] border border-[var(--c-rule)] bg-[var(--c-paper-2)] px-3 py-2 text-[var(--fz-sm)] leading-relaxed outline-none focus:border-[var(--c-accent)]"
      />
    </label>
  );
}
