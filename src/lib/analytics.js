// ─────────────────────────────────────────────────────────────
// تحليلات محلية خاصّة بالخصوصية — بلا تتبّع خارجي ولا كوكيز.
// تُحفظ عدّادات الزيارات على جهاز الزائر فقط (localStorage)، وتُعرض في لوحة التحكم.
// ملاحظة: هذه إحصاءات «هذا الجهاز» فقط، وليست بيانات زوّار مجمّعة من الخادم.
// ─────────────────────────────────────────────────────────────

const KEY = "marja:analytics";
const MAX_VIEWS = 3000;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { views: [], byPath: {}, byDay: {}, sessions: 0, firstSeen: null };
    const a = JSON.parse(raw);
    return {
      views: a.views || [],
      byPath: a.byPath || {},
      byDay: a.byDay || {},
      sessions: a.sessions || 0,
      firstSeen: a.firstSeen || null,
    };
  } catch {
    return { views: [], byPath: {}, byDay: {}, sessions: 0, firstSeen: null };
  }
}

function save(a) {
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* تجاهُل */
  }
}

const dayKey = (d = new Date()) => d.toISOString().slice(0, 10);

export function recordView(path) {
  if (typeof localStorage === "undefined") return;
  const a = load();
  const now = Date.now();
  if (!a.firstSeen) a.firstSeen = new Date().toISOString();

  // جلسة جديدة لكل علامة تبويب (sessionStorage)
  try {
    if (!sessionStorage.getItem("marja:session")) {
      sessionStorage.setItem("marja:session", String(now));
      a.sessions += 1;
    }
  } catch {
    /* تجاهُل */
  }

  a.views.push({ p: path, t: now });
  if (a.views.length > MAX_VIEWS) a.views = a.views.slice(-MAX_VIEWS);
  a.byPath[path] = (a.byPath[path] || 0) + 1;
  const dk = dayKey();
  a.byDay[dk] = (a.byDay[dk] || 0) + 1;
  save(a);
}

export function getStats() {
  const a = load();
  const totalViews = a.views.length;
  const topPaths = Object.entries(a.byPath)
    .sort((x, y) => y[1] - x[1])
    .slice(0, 12)
    .map(([path, count]) => ({ path, count }));

  // آخر ١٤ يوماً
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    days.push({ day: k, count: a.byDay[k] || 0 });
  }
  const activeDays = Object.keys(a.byDay).length;
  const recent = a.views.slice(-15).reverse();
  return { totalViews, topPaths, days, activeDays, sessions: a.sessions, firstSeen: a.firstSeen, recent };
}

export function clearAnalytics() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* تجاهُل */
  }
}
