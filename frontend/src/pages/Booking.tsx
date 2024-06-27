import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useNavigate } from "react-router-dom";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Booking = () => {
  const cart = localStorage.getItem("cart");
  const parsedCart = cart ? JSON.parse(cart) : [];
  const cartItems = parsedCart;
  const auth_token = Cookies.get("authentication") || "null";
  const userLogined = JSON.parse(auth_token);
  const navigate = useNavigate();
  const [paymentIntentData, setPaymentIntentData] = useState(null);
  const hotelId = cartItems[0].hotel._id

  useEffect(() => {
    const fetchPaymentIntentData = async () => {
      if (!!hotelId && cartItems.length > 0) {
        try {
          const data = await apiClient.createPaymentIntent(hotelId, cartItems);
          setPaymentIntentData(data);
        } catch (error) {
          console.error('Error creating payment intent:', error);
        }
      }
    };

    fetchPaymentIntentData();
  }, []);

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

  return (
    <div className="grid md:grid-cols-[1fr_2fr] space-x-2">
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
