import { useRef, useState } from "react";
import {
  exportContent,
  importContent,
  clearAllOverrides,
  loadContent,
} from "../../store/content.js";

export default function AdminData() {
  const fileRef = useRef(null);
  const [msg, setMsg] = useState("");
  const content = loadContent();
  const counts = {
    articles: Object.keys(content.articles).length,
    pages: content.pages.length,
  };

  const flash = (m) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2200);
  };

  const download = () => {
    const blob = new Blob([exportContent()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marja-content-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash("تم تنزيل الملف ✓");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportContent());
      flash("نُسخ إلى الحافظة ✓ — ألصقه لي هنا لأرفعه");
    } catch {
      flash("تعذّر النسخ");
    }
  };

  const onImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importContent(String(reader.result));
        flash("تم الاستيراد وتطبيقه ✓");
      } catch {
        flash("ملف غير صالح");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--rad-md)] border border-[var(--c-rule)] p-5">
        <p className="eyebrow mb-1">الحالة المحلية</p>
        <p className="text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
          {counts.articles} مادة معدَّلة · {counts.pages} صفحة مخصّصة
          {content.updatedAt && ` · آخر تحديث ${new Date(content.updatedAt).toLocaleString("ar")}`}
        </p>
      </div>

      <section className="rounded-[var(--rad-md)] border border-[var(--c-rule)] p-5">
        <h2 className="font-display mb-1 text-[var(--fz-base)] font-bold">تصدير</h2>
        <p className="mb-4 text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
          صدّر تعديلاتك كملف JSON. نزّله وأرسِله، أو انسخه والصقه لي هنا في المحادثة —
          وسأُثبّته في المستودع ليصبح دائماً على الموقع المنشور.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={download} className="rounded-full bg-[var(--c-accent)] px-5 py-2 text-[var(--fz-sm)] text-[var(--c-paper)]">
            تنزيل JSON
          </button>
          <button type="button" onClick={copy} className="rounded-full border border-[var(--c-rule)] px-5 py-2 text-[var(--fz-sm)] text-[var(--c-ink-soft)] hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]">
            نسخ JSON للمحادثة
          </button>
        </div>
      </section>

      <section className="rounded-[var(--rad-md)] border border-[var(--c-rule)] p-5">
        <h2 className="font-display mb-1 text-[var(--fz-base)] font-bold">استيراد</h2>
        <p className="mb-4 text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
          استورد ملف JSON سبق تصديره (يستبدل التعديلات المحلية الحالية).
        </p>
        <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-[var(--c-rule)] px-5 py-2 text-[var(--fz-sm)] text-[var(--c-ink-soft)] hover:border-[var(--c-accent)] hover:text-[var(--c-ink)]">
          اختيار ملف
        </button>
      </section>

      <section className="rounded-[var(--rad-md)] border border-dashed border-[var(--c-amend-soft)] p-5">
        <h2 className="font-display mb-1 text-[var(--fz-base)] font-bold text-[var(--c-amend)]">منطقة الخطر</h2>
        <p className="mb-4 text-[var(--fz-sm)] text-[var(--c-ink-soft)]">
          مسح كل التعديلات المحلية والعودة للبيانات المدمجة (لا يؤثّر على الموقع المنشور).
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm("مسح كل التعديلات المحلية؟")) {
              clearAllOverrides();
              flash("تم المسح ✓");
            }
          }}
          className="rounded-full border border-[var(--c-amend)] px-5 py-2 text-[var(--fz-sm)] text-[var(--c-amend)]"
        >
          مسح التعديلات المحلية
        </button>
      </section>

      {msg && (
        <p className="rounded-[var(--rad-md)] bg-[var(--c-accent-soft)] px-4 py-3 text-center text-[var(--fz-sm)] text-[var(--c-accent)]">
          {msg}
        </p>
      )}
    </div>
  );
}
