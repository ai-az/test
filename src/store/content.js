// ─────────────────────────────────────────────────────────────
// متجر المحتوى المحلي (لوحة التحكم) — بلا خادم.
// يحفظ التعديلات (المواد + الصفحات المخصّصة) في localStorage، ويدمجها حيّاً
// فوق البيانات المدمجة. «تصدير» يُنتج ملف JSON لرفعه إلى المستودع ليصبح دائماً.
// ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { setArticle, resetArticle, resetAllArticles } from "../data/articles.js";

const KEY = "marja:content";
const EVT = "marja:content-changed";

function emptyContent() {
  return { articles: {}, pages: [], updatedAt: null };
}

export function loadContent() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyContent();
    const c = JSON.parse(raw);
    return { articles: c.articles || {}, pages: c.pages || [], updatedAt: c.updatedAt || null };
  } catch {
    return emptyContent();
  }
}

function persist(content) {
  content.updatedAt = new Date().toISOString();
  localStorage.setItem(KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(EVT));
}

// ── المواد ──────────────────────────────────────────────
export function saveArticleOverride(id, data) {
  const c = loadContent();
  c.articles[id] = { ...data, id: String(id) };
  setArticle(id, c.articles[id]);
  persist(c);
}

export function deleteArticleOverride(id) {
  const c = loadContent();
  delete c.articles[id];
  resetArticle(id);
  persist(c);
}

export function overriddenArticleIds() {
  return new Set(Object.keys(loadContent().articles));
}

// ── الصفحات المخصّصة ────────────────────────────────────
export function listPages() {
  return loadContent().pages;
}
export function getPage(slug) {
  return loadContent().pages.find((p) => p.slug === slug) || null;
}
export function savePage(page) {
  const c = loadContent();
  const i = c.pages.findIndex((p) => p.slug === page.slug);
  const now = new Date().toISOString();
  if (i >= 0) c.pages[i] = { ...c.pages[i], ...page, updatedAt: now };
  else c.pages.push({ ...page, createdAt: now, updatedAt: now });
  persist(c);
}
export function deletePage(slug) {
  const c = loadContent();
  c.pages = c.pages.filter((p) => p.slug !== slug);
  persist(c);
}

// ── تصدير / استيراد ─────────────────────────────────────
export function exportContent() {
  return JSON.stringify(loadContent(), null, 2);
}

export function importContent(jsonOrObj) {
  const obj = typeof jsonOrObj === "string" ? JSON.parse(jsonOrObj) : jsonOrObj;
  const content = {
    articles: obj.articles || {},
    pages: obj.pages || [],
    updatedAt: new Date().toISOString(),
  };
  resetAllArticles();
  for (const [id, data] of Object.entries(content.articles)) setArticle(id, data);
  localStorage.setItem(KEY, JSON.stringify(content));
  window.dispatchEvent(new Event(EVT));
  return content;
}

export function clearAllOverrides() {
  resetAllArticles();
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

// ── خطّاف إعادة التصيير عند تغيّر المحتوى ────────────────
export function useContentVersion() {
  const [v, setV] = useState(0);
  useEffect(() => {
    const on = () => setV((x) => x + 1);
    window.addEventListener(EVT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVT, on);
      window.removeEventListener("storage", on);
    };
  }, []);
  return v;
}
