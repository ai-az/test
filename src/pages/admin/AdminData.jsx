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
      <div className="rounded-[var(--radius-md)] border border-[var(--color-rule)] p-5">
        <p className="eyebrow mb-1">الحالة المحلية</p>
        <p className="text-[var(--text-sm)] text-[var(--color-ink-soft)]">
          {counts.articles} مادة معدَّلة · {counts.pages} صفحة مخصّصة
          {content.updatedAt && ` · آخر تحديث ${new Date(content.updatedAt).toLocaleString("ar")}`}
        </p>
      </div>

      <section className="rounded-[var(--radius-md)] border border-[var(--color-rule)] p-5">
        <h2 className="font-display mb-1 text-[var(--text-base)] font-bold">تصدير</h2>
        <p className="mb-4 text-[var(--text-sm)] text-[var(--color-ink-soft)]">
          صدّر تعديلاتك كملف JSON. نزّله وأرسِله، أو انسخه والصقه لي هنا في المحادثة —
          وسأُثبّته في المستودع ليصبح دائماً على الموقع المنشور.
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={download} className="rounded-full bg-[var(--color-accent)] px-5 py-2 text-[var(--text-sm)] text-[var(--color-paper)]">
            تنزيل JSON
          </button>
          <button type="button" onClick={copy} className="rounded-full border border-[var(--color-rule)] px-5 py-2 text-[var(--text-sm)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]">
            نسخ JSON للمحادثة
          </button>
        </div>
      </section>

      <section className="rounded-[var(--radius-md)] border border-[var(--color-rule)] p-5">
        <h2 className="font-display mb-1 text-[var(--text-base)] font-bold">استيراد</h2>
        <p className="mb-4 text-[var(--text-sm)] text-[var(--color-ink-soft)]">
          استورد ملف JSON سبق تصديره (يستبدل التعديلات المحلية الحالية).
        </p>
        <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-[var(--color-rule)] px-5 py-2 text-[var(--text-sm)] text-[var(--color-ink-soft)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]">
          اختيار ملف
        </button>
      </section>

      <section className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-amend-soft)] p-5">
        <h2 className="font-display mb-1 text-[var(--text-base)] font-bold text-[var(--color-amend)]">منطقة الخطر</h2>
        <p className="mb-4 text-[var(--text-sm)] text-[var(--color-ink-soft)]">
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
          className="rounded-full border border-[var(--color-amend)] px-5 py-2 text-[var(--text-sm)] text-[var(--color-amend)]"
        >
          مسح التعديلات المحلية
        </button>
      </section>

      {msg && (
        <p className="rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] px-4 py-3 text-center text-[var(--text-sm)] text-[var(--color-accent)]">
          {msg}
        </p>
      )}
    </div>
  );
}
