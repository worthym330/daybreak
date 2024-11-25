import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import Cookies from "js-cookie";
import { lazy, Suspense, useEffect } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { NotFound } from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const AccessControl = ({ children, requiredRoles }: any) => {
  const auth_token = Cookies.get("authentication") || "null";
  const user = JSON.parse(auth_token);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate(-1);
    } else if (requiredRoles && !requiredRoles.includes(user.role)) {
      navigate("/");
    }
  }, [user, requiredRoles, navigate]);

  return <>{children}</>;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const MyHotels = lazy(() => import("./pages/MyHotels"));
const Search = lazy(() => import("./pages/Search"));
const Detail = lazy(() => import("./pages/Detail"));
const Booking = lazy(() => import("./pages/Booking"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const WaitList = lazy(() => import("./pages/WaitList"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const TermsAndConditions = lazy(() => import("./pages/TermAndCondition"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyandPolicy"));
const Support = lazy(() => import("./pages/Support"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ListMyPage = lazy(() => import("./pages/ListmyHotel"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPolicy"));
const ResetPass = lazy(() => import("./pages/ResetPassword"));
const Contact = lazy(() => import("./pages/ContactUs"));

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        transition={Bounce}
      />
      <Layout>
        <Suspense fallback={<SplashScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Search />} />
            <Route path="/hotel-detail/:hotelId" element={<Detail />} />
            <Route path="/hotel-detail/name/:name" element={<Detail />} />
            <Route
              path="/terms-and-condition"
              element={<TermsAndConditions />}
            />
            <Route path="/privacy-and-policy" element={<PrivacyPolicy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route
              path="/cancellation-policy"
              element={<CancellationPolicy />}
            />
            <Route path="/list-my-hotel" element={<ListMyPage />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/waitlist" element={<WaitList />} />
            <Route path="/checkout" element={<Booking />} />
            <Route
              path="/my-hotels"
              element={
                <AccessControl requiredRoles={["partner"]}>
                  <MyHotels />
                </AccessControl>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <AccessControl requiredRoles={["customer"]}>
                  <MyBookings tab="bookings" />
                </AccessControl>
              }
            />
            <Route
              path="/my-favourites"
              element={
                <AccessControl requiredRoles={["customer"]}>
                  <MyBookings tab="favourites" />
                </AccessControl>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/reset-password/:token" element={<ResetPass />} />
            <Route path="/review/:hotelId" element={<ResetPass />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
