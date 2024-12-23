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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCoupon,
  setAppliedCoupon,
  setDiscountValue,
  removeDiscount,
  setSubtotalAmount,
  setTotalAmount,
} from "../../store/cartSlice";
import { RootState } from "../../store/store";
import { FaXmark } from "react-icons/fa6";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginSuccess } from "../../store/authSlice";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type Props = {
  paymentIntent: PaymentIntentResponse;
  cartItems: any;
  setModal: any;
};

interface Coupon {
  code: string;
  percentage: number;
  expiration_date: string;
}

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

const BookingForm = ({ paymentIntent, cartItems }: Props) => {
  const search = useSearchContext();
  const { razorpayOptions } = useAppContext();
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const dispatch = useDispatch();
  const appliedCoupon = useSelector(
    (state: RootState) => state.cart.appliedCoupon
  );
  const discountValue = useSelector((state: RootState) => state.cart.discount);
  const totalValue = useSelector((state: RootState) => state.cart.total);
  const subTotalValue = useSelector((state: RootState) => state.cart.subtotal);
  const cart = localStorage.getItem("cart");
  const parsedCart = cart ? JSON.parse(cart) : [];
  const hotelId = parsedCart[0]?.hotel?._id;
  const auth = useSelector((state: RootState) => state.auth);
  const [couponCodes, setCouponCodes] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState("");
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
      return data;
    },
    {
      onSuccess: (data: any) => {
        toast.success("Successfully booked!");
        localStorage.removeItem("cart");
        Cookies.remove("date");
        navigate("/my-bookings");
        const userData = data.data;
        if (!auth.isAuthenticated) {
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
      reset((formValues) => ({
        ...formValues,
        firstName: formValues.firstName || currentUser.firstName || "",
        lastName: formValues.lastName || currentUser.lastName || "",
        email: formValues.email || currentUser.email || "",
        phone: formValues.phone || currentUser.phone || "",
        checkIn: formValues.checkIn || search.checkIn.toISOString(),
        hotelId: formValues.hotelId || hotelId,
        totalCost: formValues.totalCost || paymentIntent.totalCost,
        paymentIntentId:
          formValues.paymentIntentId || paymentIntent.paymentIntentId,
        orderId: formValues.orderId || paymentIntent.orderId,
      }));
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
        name: currentUser?.firstName
          ? `${currentUser?.firstName} ${currentUser?.lastName}`
          : `${formData.firstName} ${formData.lastName}`,
        description: "Booking payment",
        order_id: paymentIntent.orderId,
        status: "captured",
        handler: async function (response: any) {
          if (response.razorpay_payment_id) {
            await bookRoom({
              ...formData,
              paymentIntentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            });
          } else {
            console.error("Razorpay payment_id missing in response:", response);
          }
        },
        prefill: {
          name: currentUser?.firstName
            ? `${currentUser?.firstName} ${currentUser?.lastName}`
            : `${formData.firstName} ${formData.lastName}`,
          email: currentUser?.email || formData.email,
          contact: currentUser?.phone || formData.phone,
        },
        notes: { address: "Booking Address" },
        theme: { color: "#F37254" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  useEffect(() => {
    console.log("called", subtotal);
    if (cartItems) {
      const calculateSubtotal = (items: any) => {
        return items.reduce((total: number, item: any) => {
          const adultTotal =
            item.adultCount > 0 ? item.adultCount * item.product.adultPrice : 0;
          const childTotal =
            item.childCount > 0 ? item.childCount * item.product.childPrice : 0;

          // Calculate total for selected add-ons
          const addOnTotal = item.selectedAddOns
            ? item.selectedAddOns.reduce(
                (addOnTotal: number, addOn: any) =>
                  addOnTotal + addOn.price * addOn.quantity,
                0
              )
            : 0;

          return total + adultTotal + childTotal + addOnTotal; // Include add-on total
        }, 0);
      };

      const calculatedSubtotal = calculateSubtotal(cartItems);

      setSubtotal(calculatedSubtotal);
      dispatch(setSubtotalAmount(calculatedSubtotal));
    }
  }, []);

  useEffect(() => {
    console.log(subtotal);
    const calculatedGst = subtotal * 0.18;
    const calculatedTotal = subtotal + calculatedGst;
    setGst(calculatedGst);
    dispatch(setTotalAmount(calculatedTotal));
  }, [subtotal]);

  const getCoupons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/discount`, {
        method: "GET",
      });
      const data = await response.json();
      setCouponCodes(data);
    } catch (error) {
      console.error("Error expanding URL:", error);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const handleCouponApply = () => {
    let coupon: any = couponCodes.find(
      (e: any) => e.code.toUpperCase() === couponCode.toUpperCase()
    );
    if (coupon) {
      const discount = subtotal * (coupon?.percentage / 100);
      if (discount >= coupon.amount) {
        dispatch(setDiscountValue(coupon.amount));
        setSubtotal(subtotal - coupon.amount);
        dispatch(setSubtotalAmount(subtotal - coupon.amount));
        dispatch(setAppliedCoupon(couponCode));
        setCouponCode("");
      } else {
        dispatch(setDiscountValue(discount));
        setSubtotal(subtotal - discount);
        dispatch(setSubtotalAmount(subtotal - discount));
        dispatch(setAppliedCoupon(couponCode));
        setCouponCode("");
      }
    } else {
      toast.error("Invalid Coupon");
    }
  };

  useEffect(() => {
    dispatch(removeDiscount());
    dispatch(removeCoupon());
  }, []);

  // const couponOptions = couponCodes.map((coupon: any) => ({
  //   // label: `${coupon.code} - ${coupon.percentage}% off (Expires: ${new Date(coupon.expirationDate).toLocaleDateString()})`,
  //   label: `${coupon.code} - ${coupon.percentage}%`,
  //   value: coupon.code,
  //   code: coupon.code,
  //   percentage: coupon.percentage,
  //   amount: coupon.amount,
  //   expirationDate: coupon.expirationDate,
  // }));

  const handleCouponRemove = () => {
    dispatch(removeDiscount());
    dispatch(removeCoupon());
    setSubtotal(subtotal + (discountValue ?? 0));
    dispatch(setSubtotalAmount(subtotal + (discountValue ?? 0)));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-gray-400 p-5 font-poppins"
    >
      <span className="text-xl md:text-3xl font-bold text-[#02596C]">
        Confirm Your Details
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 text-sm md:text-base">
        <div className="flex gap-2 md:hidden">
          <label className="text-gray-700 flex-1">
            First Name
            <input
              className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
              type="text"
              {...register("firstName")}
              placeholder="Enter First Name"
            />
            {errors.firstName && (
              <p className="text-red-500">{errors.firstName.message}</p>
            )}
          </label>
          <label className="text-gray-700 flex-1">
            Last Name
            <input
              className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
              type="text"
              {...register("lastName")}
              placeholder="Enter Last Name"
            />
            {errors.lastName && (
              <p className="text-red-500">{errors.lastName.message}</p>
            )}
          </label>
        </div>
        <label className="text-gray-700 flex-1 hidden md:block">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            {...register("firstName")}
            placeholder="Enter First Name"
          />
          {errors.firstName && (
            <p className="text-red-500">{errors.firstName.message}</p>
          )}
        </label>
        <label className="text-gray-700 flex-1 hidden md:block">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            {...register("lastName")}
            placeholder="Enter Last Name"
          />
          {errors.lastName && (
            <p className="text-red-500">{errors.lastName.message}</p>
          )}
        </label>
        <label className="text-gray-700 flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            placeholder="Enter Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </label>
        <label className="text-gray-700 flex-1">
          Mobile Number
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 font-normal"
            type="text"
            {...register("phone")}
            placeholder="Enter Mobile Number"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </label>
      </div>

      <div className="mb-2 md:mb-4 text-sm md:text-base">
        <h3 className="text-base md:text-lg font-medium text-[#02596C]">
          Your Price Summary
        </h3>
        {cartItems.map((item: any, index: any) => {
          // Calculate totals for adults, children, and add-ons
          const adultTotal = item.product.adultPrice * item.adultCount;
          const childTotal = item.product.childPrice * item.childCount;
          const itemTotal = adultTotal + childTotal;

          return (
            <div
              className="flex justify-between items-center gap-4 py-2 "
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
              <span className="">₹ {itemTotal.toFixed(2)}</span>
            </div>
          );
        })}
        {cartItems.map((item: any, index: any) => {
          const addOnTotal = item.selectedAddOns
            ? item.selectedAddOns.reduce(
                (total: number, addOn: any) =>
                  total + addOn.price * addOn.quantity,
                0
              )
            : 0;

          return (
            <React.Fragment key={index}>
              {" "}
              {/* Use React.Fragment and pass key here */}
              {addOnTotal > 0 &&
                item.selectedAddOns &&
                item.selectedAddOns.length > 0 && ( // Check if addOnTotal > 0
                  <div className="flex justify-between items-center gap-4 py-2 text-xs text-gray-600">
                    <div>
                      <h4 className="font-semibold">Add-Ons:</h4>
                      {item.selectedAddOns.map(
                        (addOn: any, addOnIndex: number) => (
                          <div
                            key={addOnIndex}
                            className="flex justify-between"
                          >
                            <span>
                              {addOn.name} ({addOn.quantity})
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <span>₹ {addOnTotal.toFixed(2)}</span>
                  </div>
                )}
            </React.Fragment>
          );
        })}

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
        {(discountValue ?? 0) > 0 && (
          <div className="flex justify-between py-2">
            <span>Discount:</span>
            <span>₹ {(discountValue ?? 0).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between py-2">
          <span>Subtotal:</span>
          <span>₹ {subTotalValue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span>Taxes:</span>
          <span>₹ {gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 font-semibold">
          <span>Total:</span>
          <span>₹ {totalValue.toFixed(2)}</span>
        </div>
      </div>
      {appliedCoupon === "" && (
        <div className="mb-2 md:mb-4">
          <label className="block text-gray-700">Coupon Code</label>
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-md"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value);
              }}
            />
            <button
              type="button"
              className="px-4 py-2 bg-teal-600 text-white rounded-md"
              onClick={() => handleCouponApply()}
            >
              Apply
            </button>
          </div>
        </div>
      )}
      <Button disabled={isLoading} type="submit">
        {isLoading ? "Saving..." : "Confirm Booking"}
      </Button>
    </form>
  );
};

export default BookingForm;
