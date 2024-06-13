import { useQuery } from "react-query";
import * as apiClient from "../api-client";
// import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
// import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const search = useSearchContext();
  const { hotelId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()) ,
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  const { data: hotel } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (!hotel) {
    return <></>;
  }

  const handlePayment = () => {
    console.log("payment intent",paymentIntentData, currentUser);
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay Key ID
      amount: (paymentIntentData as any)?.amount, // Amount in paise
      currency: (paymentIntentData as any)?.currency,
      name: hotel.name,
      description: "Hotel Booking",
      order_id: (paymentIntentData as any)?.orderId,
      handler: async (response:any) => {
        // Handle payment success
        try {
          const result = await apiClient.verifyPayment({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
          // Proceed with booking logic
        } catch (error) {
          console.error("Payment verification failed", error);
        }
      },
      prefill: {
        name: (currentUser as any)?.name,
        email: (currentUser as any)?.email,
        contact: (currentUser as any)?.phone,
      },
      notes: {
        address: "Booking address",
      },
      theme: {
        color: "#F37254",
      },
    };

    // const rzp = new window.Razorpay(options);
    // rzp.open();
  };

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && paymentIntentData && (
        <div>
          <button onClick={handlePayment}>Pay with Razorpay</button>
        </div>
      )}
    </div>
  );
};

export default Booking;
