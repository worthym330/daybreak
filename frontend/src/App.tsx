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
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <Home />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/listings"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <Search />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/hotel-detail/:hotelId"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <Detail />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/hotel-detail/name/:name"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <Detail />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/terms-and-condition"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <TermsAndConditions />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/privacy-and-policy"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <PrivacyPolicy />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/support"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <Support />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/cookie-policy"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <CookiePolicy />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/cancellation-policy"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <CancellationPolicy />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/list-my-hotel"
          element={
            <Suspense fallback={<SplashScreen />}>
              <ListMyPage />
            </Suspense>
          }
        />
        <Route
          path="/about-us"
          element={
            <Suspense fallback={<SplashScreen />}>
              <AboutUs />
            </Suspense>
          }
        />
        <Route
          path="/contact-us"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <Contact />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/waitlist"
          element={
            <Suspense fallback={<SplashScreen />}>
              <WaitList />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <Booking />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/my-hotels"
          element={
            <AccessControl requiredRoles={["partner"]}>
              <Layout>
                <Suspense fallback={<SplashScreen />}>
                  <MyHotels />
                </Suspense>
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <AccessControl requiredRoles={["customer"]}>
              <Layout>
                <Suspense fallback={<SplashScreen />}>
                  <MyBookings tab="bookings" />
                </Suspense>
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/my-favourites"
          element={
            <AccessControl requiredRoles={["customer"]}>
              <Layout>
                <Suspense fallback={<SplashScreen />}>
                  <MyBookings tab="favourites" />
                </Suspense>
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<SplashScreen />}>
              <NotFound />
            </Suspense>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <ResetPass />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/review/:hotelId"
          element={
            <Layout>
              <Suspense fallback={<SplashScreen />}>
                <ResetPass />
              </Suspense>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
