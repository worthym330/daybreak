import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useNavigate } from "react-router-dom";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Button from "../components/Button";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Booking = () => {
  const cart = localStorage.getItem("cart");
  const parsedCart = cart ? JSON.parse(cart) : [];
  const cartItems = parsedCart;
  const auth_token = Cookies.get("authentication") || "null";
  const userLogined = JSON.parse(auth_token);
  const navigate = useNavigate();
  const [paymentIntentData, setPaymentIntentData] = useState(null);
  const hotelId = cartItems[0]?.hotel?._id;
  const [hotel, setHotel] = useState();

  useEffect(() => {
    const fetchPaymentIntentData = async () => {
      if (!!hotelId && cartItems.length > 0) {
        try {
          const data = await apiClient.createPaymentIntent(hotelId, cartItems);
          setPaymentIntentData(data);
        } catch (error) {
          console.error("Error creating payment intent:", error);
        }
      }
    };

    fetchPaymentIntentData();
  }, []);

  // const { data: hotel } = useQuery("fetchHotelByID", () =>
  //   apiClient.fetchHotelById(hotelId as string)
  // );

  useEffect(() => {
    fetchHotelData();
  }, []);

  const fetchHotelData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        setHotel(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { data: currentUser } = useQuery("fetchCurrentUser", () =>
    apiClient.fetchCurrentUser()
  );

  if (!hotel) {
    return (
      <main className="grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Your cart is empty
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            It looks like you haven't added anything to your cart yet.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button onClick={() => navigate("/search")}>Go to Shop</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr] space-x-2">
      <BookingDetailsSummary cartItems={cartItems} hotel={hotel} />
      {userLogined ? (
        currentUser &&
        paymentIntentData && (
          <div>
            {/* Display booking summary */}
            <BookingForm
              currentUser={currentUser}
              paymentIntent={paymentIntentData}
            />
            {/* Button to initiate Razorpay payment */}
          </div>
        )
      ) : (
        <main className="grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Join the Waitlist
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
              You need to join the waitlist to view your booking summary and
              proceed with payment.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button onClick={() => navigate("/waitlist")}>
                Join Waitlist
              </Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Booking;
