import Header from "../components/Header";
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
      {location.pathname.includes("/hotel-detail/") ? (
        <div className="py-10 flex-1">{children}</div>
      ) : location?.pathname === "/" ?(
        <div className="py-10 flex-1">{children}</div>
      ):(
        <div className="container mx-auto py-10 flex-1">{children}</div>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
