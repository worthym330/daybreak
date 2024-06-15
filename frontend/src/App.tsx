import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Layout from './layouts/Layout';
import Register from './pages/Register';
import SignIn from './pages/SignIn';
import AddHotel from './pages/AddHotel';
import MyHotels from './pages/MyHotels';
import EditHotel from './pages/EditHotel';
import Search from './pages/Search';
import Detail from './pages/Detail';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';
import Home from './pages/Home';
import { NotFound } from './pages/NotFound';

const AccessControl = ({ children, requiredRoles }:any) => {
  const auth_token = localStorage.getItem('auth_token');
  const user = auth_token !== null ? JSON.parse(auth_token) : null;
  if (user === null) {
    return false
  }

  if (requiredRoles && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};


const App = () => {
  return (
    <Router>
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
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          path="/detail/:hotelId"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/hotel/name/:name"
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
        <Route
          path="/partner/register"
          element={<Register />}
        />
        <Route
          path="/partner/sign-in"
          element={<SignIn />}
        />

        <Route
          path="/hotel/:hotelId/booking"
          element={
            <AccessControl requiredRoles={['customer', 'partner']}>
              <Layout>
                <Booking />
              </Layout>
            </AccessControl>
          }
        />

        <Route
          path="/add-hotel"
          element={
            <AccessControl requiredRoles={['partner']}>
              <Layout>
                <AddHotel />
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/edit-hotel/:hotelId"
          element={
            <AccessControl requiredRoles={['partner']}>
              <Layout>
                <EditHotel />
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/my-hotels"
          element={
            <AccessControl requiredRoles={['partner']}>
              <Layout>
                <MyHotels />
              </Layout>
            </AccessControl>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <AccessControl requiredRoles={['customer', 'partner']}>
              <Layout>
                <MyBookings />
              </Layout>
            </AccessControl>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
