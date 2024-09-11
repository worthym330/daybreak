import { useForm } from "react-hook-form";
import { PaymentIntentResponse } from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import Cookies from "js-cookie";
import Button from "../../components/Button";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCoupon,
  setAppliedCoupon,
  setDiscountValue,
  removeDiscount,
} from "../../store/cartSlice";
import { RootState } from "../../store/store";
import { FaXmark } from "react-icons/fa6";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginSuccess } from "../../store/authSlice";

type Props = {
  // currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
  cartItems: any;
  setModal: any;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount?: number;
  phone: string;
  childCount?: number;
  checkIn?: string;
  hotelId?: string;
  paymentIntentId?: string;
  totalCost?: number;
  orderId?: string;
};

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile Number must be 10 digits")
    .required("Mobile Number is required"),
  adultCount: yup
    .number()
    .positive("Must be a positive number")
    .integer("Must be an integer")
    .optional(),
  childCount: yup
    .number()
    .positive("Must be a positive number")
    .integer("Must be an integer")
    .optional(),
  checkIn: yup.string().optional(),
  hotelId: yup.string().optional(),
  paymentIntentId: yup.string().optional(),
  totalCost: yup.number().positive("Must be a positive number").optional(),
  orderId: yup.string().optional(),
});

const BookingForm = ({
  // currentUser,
  paymentIntent,
  cartItems,
}: // setModal,
Props) => {
  const search = useSearchContext();
  const { razorpayOptions } = useAppContext();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const dispatch = useDispatch();
  const appliedCoupon = useSelector(
    (state: RootState) => state.cart.appliedCoupon
  );
  const discountValue = useSelector((state: RootState) => state.cart.discount);
  const cart = localStorage.getItem("cart");
  const parsedCart = cart ? JSON.parse(cart) : [];
  const hotelId = parsedCart[0]?.hotel?._id;
  const auth = useSelector((state: RootState) => state.auth);
  const { data: currentUser } = useQuery("fetchCurrentUser", () =>
    apiClient.fetchCurrentUser()
  );
  const { mutate: bookRoom, isLoading } = useMutation<
  void,
  Error,
  BookingFormData
>(
  async (formData) => {
    const data = await apiClient.createRoomBooking(formData, parsedCart);
    return data;  // Return the data here
  },
  {
    onSuccess: (data:any) => {
      toast.success("Successfully booked!");
      localStorage.removeItem("cart");
      Cookies.remove("date");
      navigate("/my-bookings");
      const userData = data.data
      if(!auth.isAuthenticated){
        Cookies.set("authentication", JSON.stringify(userData), {
          expires: 1,
        });
        const user = userData;
        const token = userData.token;
        dispatch(loginSuccess({ user, token }));
      }
    },
    onError: () => {
      toast.error("Failed to mark your payment");
    },
  }
);


  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: yupResolver(validationSchema),
  });

  // Set default form values dynamically after currentUser data is loaded
  useEffect(() => {
    if (currentUser && search.checkIn) {
      reset({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        checkIn: search.checkIn.toISOString(),
        hotelId: hotelId,
        totalCost: paymentIntent.totalCost,
        paymentIntentId: paymentIntent.paymentIntentId,
        orderId: paymentIntent.orderId,
      });
    }
  }, [currentUser, search.checkIn, hotelId, paymentIntent, reset]);

  const onSubmit = async (formData: BookingFormData) => {
    formData.checkIn = search.checkIn.toISOString();
    formData.hotelId = hotelId;
    formData.paymentIntentId = paymentIntent.paymentIntentId;
    formData.totalCost = paymentIntent.totalCost;
    formData.orderId = paymentIntent.orderId;
    try {
      const options = {
        key: razorpayOptions.key_id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        name:
          currentUser?.firstName !== undefined
            ? `${currentUser?.firstName} ${currentUser?.lastName}`
            : `${formData.firstName} ${formData.lastName}`,
        description: "Booking payment",
        order_id: paymentIntent.orderId,
        status: "captured",
        handler: async function (response: any) {
          try {
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
            }
          } catch (error) {
            console.error("Error booking room:", error);
          }
        },
        prefill: {
          name:
            currentUser?.firstName !== undefined
              ? `${currentUser?.firstName} ${currentUser?.lastName}`
              : `${formData.firstName} ${formData.lastName}`,
          email:
            currentUser?.email !== undefined
              ? currentUser?.email
              : formData.email,
          contact:
            currentUser?.phone !== undefined
              ? currentUser?.phone
              : formData.phone,
        },
        notes: {
          address: "Booking Address",
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

  useEffect(() => {
    const calculateSubtotal = (items: any) => {
      return items.reduce((total: number, item: any) => {
        const adultTotal =
          item.adultCount > 0 ? item.adultCount * item.product.adultPrice : 0;
        const childTotal =
          item.childCount > 0 ? item.childCount * item.product.childPrice : 0;
        return total + adultTotal + childTotal;
      }, 0);
    };

    const calculatedSubtotal = calculateSubtotal(cartItems);
    const calculatedGst = calculatedSubtotal * 0.18;
    const calculatedTotal =
      calculatedSubtotal - (discountValue ?? 0) + calculatedGst;

    setSubtotal(calculatedSubtotal);
    setGst(calculatedGst);
    setTotal(calculatedTotal);
  }, [cartItems]);

  const handleCouponApply = () => {
    if (couponCode !== "") {
      const discount = total * 0.1;
      dispatch(setDiscountValue(discount));
      setTotal(total - discount);
      dispatch(setAppliedCoupon(couponCode));
      setCouponCode("");
    }
  };

  const handleCouponRemove = () => {
    setTotal(total + (discountValue ?? 0));
    dispatch(removeDiscount());
    dispatch(removeCoupon());
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-gray-400 p-5 font-poppins"
    >
      <span className="text-3xl font-bold text-[#02596C]">
        Confirm Your Details
      </span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-base flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </label>
        <label className="text-gray-700 text-base flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </label>
        <label className="text-gray-700 text-base flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </label>
        <label className="text-gray-700 text-base flex-1">
          Mobile Number
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </label>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-[#02596C]">
          Your Price Summary
        </h3>
        {cartItems.map((item: any, index: any) => (
          <div
            className="flex justify-between items-center gap-4 py-2"
            key={index}
          >
            <span>
              {item.product.title} - ₹{item.product.adultPrice} x{" "}
              {item.adultCount} Adult{" "}
              {item.childCount > 0 && (
                <>
                  + ₹{item.product.childPrice} x {item.childCount} Child
                </>
              )}
            </span>
            <span className="">
              ₹{" "}
              {(item.adultCount > 0 && item.childCount > 0
                ? item.product.adultPrice * item.adultCount +
                  item.product.childPrice * item.childCount
                : item.adultCount > 0
                ? item.product.adultPrice * item.adultCount
                : item.product.childPrice * item.childCount
              ).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between py-2">
          <span>Subtotal:</span>
          <span>₹ {subtotal.toFixed(2)}</span>
        </div>
        {(discountValue ?? 0) > 0 && (
          <div className="flex justify-between py-2">
            <span>Discount:</span>
            <span>₹ {(discountValue ?? 0).toFixed(2)}</span>
          </div>
        )}
        {(discountValue ?? 0) > 0 && (
          <div className="flex justify-between py-2">
            <span>Coupon Code:</span>
            <span className="flex justify-between gap-2 items-center">
              <span>{appliedCoupon}</span>
              <FaXmark
                className="w-4 h-4 text-red-500"
                onClick={handleCouponRemove} // You don't need an anonymous function here
              />
            </span>
          </div>
        )}
        <div className="flex justify-between py-2">
          <span>GST:</span>
          <span>₹ {gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 font-semibold">
          <span>Total:</span>
          <span>₹ {total.toFixed(2)}</span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Coupon Code</label>
        <div className="flex">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
            }}
          />
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-teal-600 text-white rounded-md"
            onClick={() => handleCouponApply()}
          >
            Apply
          </button>
        </div>
      </div>
      <Button disabled={isLoading} type="submit">
        {isLoading ? "Saving..." : "Confirm Booking"}
      </Button>
    </form>
  );
};

export default BookingForm;
