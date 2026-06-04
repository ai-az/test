import { useLocation } from "react-router-dom";
import TopBar from "../handoff/TopBar.jsx";
import Footer from "../handoff/Footer.jsx";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  return (
    <div>
      <TopBar />
      <main key={pathname} className="reveal" style={{ minHeight: "70vh" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
