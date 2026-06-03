import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Chapters from "./pages/Chapters.jsx";
import ChapterDetail from "./pages/ChapterDetail.jsx";
import ArticleView from "./pages/ArticleView.jsx";
import Search from "./pages/Search.jsx";
import Glossary from "./pages/Glossary.jsx";
import IndexMap from "./pages/IndexMap.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/chapter/:num" element={<ChapterDetail />} />
        <Route path="/article/:num" element={<ArticleView />} />
        <Route path="/search" element={<Search />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/index" element={<IndexMap />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
