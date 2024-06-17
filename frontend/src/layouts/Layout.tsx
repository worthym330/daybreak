import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import Info from "../components/InfoSection";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}
const Layout = ({ children }: Props) => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {location?.pathname === "/" && (
        <div className="lg:container lg:mx-auto">
          <Hero />
          <SearchBar />
          <Info />
        </div>
      )}
      {location.pathname.includes("/detail/") ? (
        <div className="py-10 flex-1">{children}</div>
      ) : (
        <div className="lg:container lg:mx-auto py-10 flex-1">{children}</div>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
