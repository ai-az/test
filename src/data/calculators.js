// ─────────────────────────────────────────────────────────────
// الحاسبات التفاعلية — كل حاسبة تُرمّز معادلة من مادة محقَّقة، وتُعرض نتيجتها
// مع تنبيه «حساب تقديري غير ملزم» ورابط المادة المرجعية.
// المعادلات مستندة إلى نصوص رسمية مُتحقَّق منها (84، 85، 87، 107، 109).
// لا تُعتمد معادلة دون مصدر؛ وأي معادلة غير مؤكدة تبقى status: "pending".
// ─────────────────────────────────────────────────────────────

export const calculators = [
  {
    id: "end-of-service",
    title: "حاسبة مكافأة نهاية الخدمة",
    lead: "تقدير مكافأة نهاية الخدمة بناءً على الأجر الأخير ومدة الخدمة وسبب انتهاء العلاقة.",
    articleIds: ["84", "85", "87"],
    status: "active",
    inputs: [
      { name: "wage", label: "الأجر الأخير (شهرياً، بالريال)", type: "number", min: 0, step: 100 },
      { name: "years", label: "مدة الخدمة (بالسنوات)", type: "number", min: 0, step: 0.5 },
      {
        name: "reason",
        label: "سبب انتهاء العلاقة",
        type: "select",
        options: [
          { value: "employer", label: "إنهاء من صاحب العمل أو انتهاء المدة" },
          { value: "resign", label: "استقالة العامل" },
          { value: "special", label: "حالة المادة ٨٧ (قوة قاهرة / زواج أو وضع العاملة)" },
        ],
      },
    ],
    compute({ wage, years, reason }) {
      const w = Number(wage) || 0;
      const y = Number(years) || 0;
      if (w <= 0 || y <= 0) return null;
      const firstYears = Math.min(y, 5);
      const laterYears = Math.max(0, y - 5);
      const baseMonths = firstYears * 0.5 + laterYears * 1; // م84
      const base = baseMonths * w;

      let factor = 1;
      let factorLabel = "كامل المكافأة";
      if (reason === "resign") {
        if (y < 2) {
          factor = 0;
          factorLabel = "أقل من سنتين — لا تُستحق مكافأة (م٨٥)";
        } else if (y <= 5) {
          factor = 1 / 3;
          factorLabel = "ثلث المكافأة (٢ إلى ٥ سنوات — م٨٥)";
        } else if (y < 10) {
          factor = 2 / 3;
          factorLabel = "ثلثا المكافأة (أكثر من ٥ ولم تبلغ ١٠ — م٨٥)";
        } else {
          factor = 1;
          factorLabel = "كامل المكافأة (١٠ سنوات فأكثر — م٨٥)";
        }
      } else if (reason === "special") {
        factor = 1;
        factorLabel = "كامل المكافأة (استثناء م٨٧)";
      }

      const amount = base * factor;
      return {
        amount,
        unit: "ريال",
        breakdown: [
          { label: "أساس المكافأة (م٨٤)", value: `${fmt(baseMonths)} شهر × ${fmt(w)} = ${fmt(base)} ريال` },
          { label: "نسبة الاستحقاق", value: factorLabel },
          { label: "المبلغ التقديري", value: `${fmt(amount)} ريال` },
        ],
      };
    },
  },

  {
    id: "overtime",
    title: "حاسبة الأجر الإضافي",
    lead: "تقدير أجر ساعات العمل الإضافية وفق المادة ١٠٧ (أجر الساعة + ٥٠٪ من الأجر الأساسي).",
    articleIds: ["107", "98"],
    status: "active",
    inputs: [
      { name: "hourly", label: "أجر الساعة الأساسي (بالريال)", type: "number", min: 0, step: 1 },
      { name: "hours", label: "عدد ساعات العمل الإضافية", type: "number", min: 0, step: 1 },
    ],
    compute({ hourly, hours }) {
      const h = Number(hourly) || 0;
      const n = Number(hours) || 0;
      if (h <= 0 || n <= 0) return null;
      const rate = h * 1.5; // م107: أجر الساعة + 50%
      const amount = rate * n;
      return {
        amount,
        unit: "ريال",
        breakdown: [
          { label: "أجر الساعة الإضافية", value: `${fmt(h)} + ٥٠٪ = ${fmt(rate)} ريال` },
          { label: "عدد الساعات", value: fmt(n) },
          { label: "المبلغ التقديري", value: `${fmt(amount)} ريال` },
        ],
      };
    },
  },

  {
    id: "annual-leave",
    title: "حاسبة رصيد الإجازة السنوية",
    lead: "تقدير رصيد الإجازة السنوية (٢١ أو ٣٠ يوماً) بحسب مدة الخدمة، مع احتساب المدة الجزئية.",
    articleIds: ["109", "110"],
    status: "active",
    inputs: [
      { name: "years", label: "مدة الخدمة المتصلة (بالسنوات)", type: "number", min: 0, step: 0.5 },
      { name: "months", label: "أشهر العمل في سنة الاستحقاق (١–١٢)", type: "number", min: 0, max: 12, step: 1 },
    ],
    compute({ years, months }) {
      const y = Number(years) || 0;
      const m = Math.min(12, Math.max(0, Number(months) || 0));
      if (m <= 0) return null;
      const perYear = y >= 5 ? 30 : 21; // م109
      const accrued = (perYear * m) / 12;
      return {
        amount: accrued,
        unit: "يوم",
        breakdown: [
          { label: "الاستحقاق السنوي", value: `${fmt(perYear)} يوماً ${y >= 5 ? "(٥ سنوات فأكثر)" : "(أقل من ٥ سنوات)"}` },
          { label: "نسبة المدة", value: `${fmt(m)} / ١٢ شهراً` },
          { label: "الرصيد التقديري", value: `${fmt(accrued)} يوم` },
        ],
      };
    },
  },
];

export const getCalculator = (id) => calculators.find((c) => c.id === id) || null;

// تنسيق رقمي بأرقام عربية-هندية مع فواصل، وتقريب لخانتين عند الحاجة.
function fmt(n) {
  const rounded = Math.round((Number(n) + Number.EPSILON) * 100) / 100;
  const s = rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return s.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}
