import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useParams } from "react-router-dom";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import Cookies from "js-cookie";

const Booking = () => {
  const { hotelId } = useParams();
  const cart = Cookies.get("cart");
  const parsedCart = cart ? JSON.parse(cart) : [];
  const cartItems = parsedCart;

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

  // Function to handle Razorpay payment

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        cartItems={cartItems}
        hotel={hotel}
      />
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
