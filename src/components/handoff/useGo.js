import { useNavigate } from "react-router-dom";

// مُحوِّل go({name,...}) المرجعي إلى تنقّل react-router — يُبقي JSX المرجعي كما هو.
export function useGo() {
  const navigate = useNavigate();
  return (r) => {
    switch (r.name) {
      case "home": return navigate("/");
      case "browse": return navigate("/chapters");
      case "chapter": return navigate(`/chapter/${r.n}`);
      case "article": return navigate(`/article/${r.num}`);
      case "index": return navigate("/index");
      case "scenarios": return navigate("/start");
      case "scenario": return navigate(`/start/${r.id}`);
      case "calc": return navigate(r.tool ? `/calculators/${r.tool}` : "/calculators");
      case "glossary": return navigate("/glossary");
      case "timeline": return navigate("/timeline");
      case "saved": return navigate("/bookmarks");
      case "card": return navigate(`/card/${r.num}`);
      case "search": return navigate(r.q ? `/search?q=${encodeURIComponent(r.q)}` : "/search");
      default: return navigate("/");
    }
  };
}
