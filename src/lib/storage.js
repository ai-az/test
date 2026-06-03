// المفضّلة — تخزين محلي في المتصفّح فقط (لا حسابات، لا خادم)
import { useCallback, useEffect, useState } from "react";

const KEY = "marja:bookmarks";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* تجاهُل أخطاء التخزين (وضع التصفّح الخاص مثلاً) */
  }
  window.dispatchEvent(new Event("marja:bookmarks-changed"));
}

export function useBookmarks() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener("marja:bookmarks-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("marja:bookmarks-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((articleNumber) => {
    const list = read();
    const next = list.includes(articleNumber)
      ? list.filter((n) => n !== articleNumber)
      : [...list, articleNumber];
    write(next);
  }, []);

  const has = useCallback((n) => ids.includes(n), [ids]);

  return { ids, toggle, has };
}
