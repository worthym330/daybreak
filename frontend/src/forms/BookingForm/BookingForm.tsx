import { useForm } from "react-hook-form";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import Cookies from "js-cookie";
import Button from "../../components/Button";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
  orderId?: string;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const search = useSearchContext();
  const { hotelId } = useParams();

  const { showToast, razorpayOptions } = useAppContext();

  const cart = Cookies.get("cart");
  const parsedCart = cart ? JSON.parse(cart) : [];

  const { mutate: bookRoom, isLoading } = useMutation<
    void,
    Error,
    BookingFormData
  >(
    "createBooking", // Mutation key
    async (formData) => {
      await apiClient.createRoomBooking(formData, parsedCart);
    },
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      checkIn: search.checkIn.toISOString(),
      hotelId: hotelId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
      orderId: paymentIntent.orderId,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    try {
      const options = {
        key: razorpayOptions.key_id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        description: "Booking payment",
        order_id: paymentIntent.orderId,
        status: "captured",
        handler: async function (response: any) {
          try {
            console.log("Razorpay response:", response);
            if (response.razorpay_payment_id) {
              // Call backend to complete booking
              await bookRoom({
                ...formData,
                paymentIntentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
            } else {
              console.error(
                "Razorpay payment_id missing in response:",
                response
              );
              alert("Payment failed. Please try again.");
            }
          } catch (error) {
            console.error("Error booking room:", error);
            alert("Failed to complete booking. Please try again.");
          }
        },
        prefill: {
          name: `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
          contact: currentUser.email, // Replace with user's contact number if available
        },
        notes: {
          address: "Booking Address", // Optionally add any notes
        },
        theme: {
          color: "#F37254",
        },
        payment_method: {
          // Enable UPI payments
          method: "upi",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: ₹{(paymentIntent.amount / 100).toFixed(2)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
