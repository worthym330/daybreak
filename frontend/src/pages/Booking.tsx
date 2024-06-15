import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useNavigate, useParams } from "react-router-dom";
import BookingDetailsSummary from "../components/BookingDetailsSummary";

const Booking = () => {
  const { hotelId } = useParams();
  const cart = localStorage.getItem("cart");
  const parsedCart = cart ? JSON.parse(cart) : [];
  const cartItems = parsedCart;
  const auth_token = localStorage.getItem("auth_token");
  const userLogined = auth_token ? JSON.parse(auth_token) : null;
  const navigate = useNavigate();

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        hotelId as string,
        cartItems // Pass cartItems to API call
      ),
    {
      enabled: !!hotelId && cartItems.length > 0,
    }
  );

  const { data: hotel } = useQuery("fetchHotelByID", () =>
    apiClient.fetchHotelById(hotelId as string)
  );

  const { data: currentUser } = useQuery("fetchCurrentUser", () =>
    apiClient.fetchCurrentUser()
  );

  if (!hotel) {
    return <></>;
  }

  if (userLogined === null) {
    navigate(-1);
    return null;
  }

  // Function to handle Razorpay payment

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary cartItems={cartItems} hotel={hotel} />
      {currentUser && paymentIntentData && (
        <div>
          {/* Display booking summary */}
          <BookingForm
            currentUser={currentUser}
            paymentIntent={paymentIntentData}
          />
          {/* Button to initiate Razorpay payment */}
        </div>
      )}
    </div>
  );
};

export default Booking;
