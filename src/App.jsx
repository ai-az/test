import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Chapters from "./pages/Chapters.jsx";
import ChapterDetail from "./pages/ChapterDetail.jsx";
import ArticleView from "./pages/ArticleView.jsx";
import CardView from "./pages/CardView.jsx";
import Search from "./pages/Search.jsx";
import Glossary from "./pages/Glossary.jsx";
import IndexMap from "./pages/IndexMap.jsx";
import Scenarios from "./pages/Scenarios.jsx";
import ScenarioDetail from "./pages/ScenarioDetail.jsx";
import Calculators from "./pages/Calculators.jsx";
import Timeline from "./pages/Timeline.jsx";
import Coverage from "./pages/Coverage.jsx";
import Bookmarks from "./pages/Bookmarks.jsx";
import CustomPage from "./pages/CustomPage.jsx";
import Admin from "./pages/admin/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";
import { recordView } from "./lib/analytics.js";

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    recordView(pathname);
  }, [pathname]);

  return (
    <Layout>
      {/* الصفحات العامّة تعكس التعديلات عند التنقّل؛ اللوحة والتذييل يتحدّثان محلياً */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chapters" element={<Chapters />} />
        <Route path="/chapter/:num" element={<ChapterDetail />} />
        <Route path="/article/:num" element={<ArticleView />} />
        <Route path="/card/:num" element={<CardView />} />
        <Route path="/search" element={<Search />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/index" element={<IndexMap />} />
        <Route path="/start" element={<Scenarios />} />
        <Route path="/start/:id" element={<ScenarioDetail />} />
        <Route path="/calculators" element={<Calculators />} />
        <Route path="/calculators/:id" element={<Calculators />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/coverage" element={<Coverage />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/p/:slug" element={<CustomPage />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
