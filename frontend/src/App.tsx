import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Layout from "./layouts/Layout";
// import SignIn from "./pages/SignIn";
import Cookies from "js-cookie";
import { lazy, Suspense, useEffect } from "react";
// import Login from "./pages/LoginandSignup";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { NotFound } from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const AccessControl = ({ children, requiredRoles }: any) => {
  const auth_token = Cookies.get("authentication") || "null";
  const user = JSON.parse(auth_token);
  const navigate = useNavigate();
  // const [unauthenticated, setUnauthenticated] = useState(false);
  useEffect(() => {
    if (user === null) {
      navigate(-1);
    } else if (requiredRoles && !requiredRoles.includes(user.role)) {
      navigate("/");
    }
  }, [user, requiredRoles, navigate]);

  return <>{children}</>;
};

// const AuthRedirect = ({ children }: any) => {
//   const auth_token = Cookies.get("authentication");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (auth_token) {
//       navigate("/"); // Redirect to home or any other page
//     }
//   }, [auth_token]);

//   return auth_token ? null : children;
// };

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

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
// const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        transition={Bounce}
      />
      <Suspense fallback={<SplashScreen />}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/listings"
            element={
              <Layout>
                <Search />
              </Layout>
            }
          />
          <Route
            path="/hotel-detail/:hotelId"
            element={
              <Layout>
                <Detail />
              </Layout>
            }
          />
          <Route
            path="/hotel-detail/name/:name"
            element={
              <Layout>
                <Detail />
              </Layout>
            }
          />
          <Route
            path="/terms-and-condition"
            element={
              <Layout>
                <TermsAndConditions />
              </Layout>
            }
          />
          <Route
            path="/privacy-and-policy"
            element={
              <Layout>
                <PrivacyPolicy />
              </Layout>
            }
          />
          <Route
            path="/support"
            element={
              <Layout>
                <Support />
              </Layout>
            }
          />
          <Route
            path="/cookie-policy"
            element={
              <Layout>
                <CookiePolicy />
              </Layout>
            }
          />
          <Route
            path="/cancellation-policy"
            element={
              <Layout>
                <CancellationPolicy />
              </Layout>
            }
          />
          <Route
            path="/list-my-hotel"
            element={
              // <Layout>
              <ListMyPage />
              // </Layout>
            }
          />
          <Route path="/about-us" element={<AboutUs />} />
          <Route
            path="/contact-us"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route path="/waitlist" element={<WaitList />} />
          <Route
            path="/checkout"
            element={
              // <AccessControl requiredRoles={["customer"]}>
              <Layout>
                <Booking />
              </Layout>
              // </AccessControl>
            }
          />
          <Route
            path="/my-hotels"
            element={
              <AccessControl requiredRoles={["partner"]}>
                <Layout>
                  <MyHotels />
                </Layout>
              </AccessControl>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <AccessControl requiredRoles={["customer"]}>
                <Layout>
                  <MyBookings tab="bookings" />
                </Layout>
              </AccessControl>
            }
          />
          <Route
            path="/my-favourites"
            element={
              <AccessControl requiredRoles={["customer"]}>
                <Layout>
                  <MyBookings tab="favourites" />
                </Layout>
              </AccessControl>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/reset-password/:token"
            element={
              <Layout>
                <ResetPass />
              </Layout>
            }
          />
          <Route
            path="/review/:hotelId"
            element={
              <Layout>
                <ResetPass />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
