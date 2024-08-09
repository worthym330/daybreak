import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import {
  initialModalState,
  initialResetModal,
  initialSignupModalState,
  RenderLoginModal,
  RenderSignUpModal,
  ResetPassRequest,
} from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import ConfirmationModal from "../components/AlertModal";
import {
  removeCoupon,
  removeDiscount,
  removeFromCart,
} from "../store/cartSlice";
import { FaXmark } from "react-icons/fa6";
import moment from "moment";
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
  const [modal, setModal] = useState(initialModalState);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);
  const discount = useSelector((state: RootState) => state.cart.discount);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [carts, setCarts] = useState(cartItems);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const handleClear = (e: any) => {
    setTitle(e);
    setConfirmationDialog(true);
  };

  const removeCart = () => {
    let cart: any[] = [];
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart) as any[];
      cart = cart.filter((item) => item.product.title !== title);
      if (cart.length === 0) {
        dispatch(removeCoupon());
        dispatch(removeDiscount());
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    dispatch(removeFromCart(title));
    setCarts(cart);
  };

  const fetchPaymentIntentData = async () => {
    if (!!hotelId && cartItems.length > 0) {
      try {
        const data = await apiClient.createPaymentIntent(
          hotelId,
          cartItems,
          discount ?? 0
        );
        setPaymentIntentData(data);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    }
  };

  useEffect(() => {
    fetchPaymentIntentData();
  }, [discount]);

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

  return (
    <div className="font-poppins">
      <RenderLoginModal
        modal={modal}
        setModal={setModal}
        setResetModal={setResetModal}
        setSignupModal={setSignupModal}
        isHeader={false}
        isBooking={true}
        paymentIntent={fetchPaymentIntentData}
      />
      <RenderSignUpModal
        modal={signupModal}
        setModal={setSignupModal}
        initialModalState={initialSignupModalState}
        setLoginModal={setModal}
        isHeader={false}
      />
      <ConfirmationModal
        setOpen={setConfirmationDialog}
        open={confirmationDialog}
        onDelete={removeCart}
      />
      <ResetPassRequest modal={resetModal} setModal={setResetModal} />
      {cartItems.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <div className="p-4 space-y-4 w-full rounded-xl shadow-md border border-gray-400">
              <h2 className="text-xl font-bold px-4">Your Booking Details</h2>
              <div className="space-y-4 p-4">
                {carts.slice(0, 1).map((item: any, index: any) => (
                  <div className="flex items-center space-x-4" key={index}>
                    <img
                      src={item.hotel.imageUrls[0]}
                      alt={item.hotel.name}
                      className="w-20 h-20 rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-[#02596C]">
                        {item.hotel.name}
                      </h3>
                      <p className="text-gray-500">
                        {moment(item.date).format("Do MMMM YYYY")}{" "}
                      </p>
                    </div>
                  </div>
                ))}
                {carts.map((item: any, index: any) => (
                  <div
                    className="flex justify-between items-center mt-4 gap-4 font-semibold"
                    key={index}
                  >
                    <div className="flex items-center space-x-2">
                      {/* <div className="bg-teal-500 p-2 rounded-full">
                      </div> */}
                      <span>
                        {item.product.title} - ₹{item.product.adultPrice} x{" "}
                        {item.adultCount} Adult{" "}
                        {item.childCount > 0 && (
                          <>
                            + ₹{item.product.childPrice} x {item.childCount}{" "}
                            Child
                          </>
                        )}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="">
                        ₹
                        {item.adultCount > 0 && item.childCount > 0
                          ? item.product.adultPrice * item.adultCount +
                            item.product.childPrice * item.childCount
                          : item.adultCount > 0
                          ? item.product.adultPrice * item.adultCount
                          : item.product.childPrice * item.childCount}
                      </span>
                      <FaXmark
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => {
                          handleClear(item.product.title);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {userLogined ? (
            currentUser &&
            paymentIntentData && (
              <div className="w-full md:w-2/3">
                {/* Display booking summary */}
                <BookingForm
                  currentUser={currentUser}
                  paymentIntent={paymentIntentData}
                  cartItems={cartItems}
                />
                {/* Button to initiate Razorpay payment */}
              </div>
            )
          ) : (
            <main className="grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
              <div className="text-center">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                  Please log in
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                  You need to be logged in to view your booking summary and
                  proceed with payment.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button
                    onClick={() =>
                      setModal((prev: any) => ({ ...prev, state: true }))
                    }
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            </main>
          )}
        </div>
      ) : (
        <main className="grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Your cart is empty
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
              It looks like you haven't added anything to your cart yet.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button onClick={() => navigate("/listings")}>
                Go to Hotels
              </Button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Booking;
