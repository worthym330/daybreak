import { FaFacebook, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { initialModalState, ListmyHotelRender } from "../pages/ListmyHotel";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Footer = () => {
  const [HotelRegisterModal, setHotelRegisterModal] =
    useState(initialModalState);

  const location = useLocation();
  const [isDetail, setIsDetail] = useState(false);
  const cart = useSelector((state: RootState) => state.cart.items);
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    const parsedCart = cart ? JSON.parse(cart) : [];
    setCartItems(parsedCart);
  }, [cart]);

  useEffect(() => {
    const loc = location.pathname.startsWith("/hotel-detail/");
    setIsDetail(loc);
  }, [location]);

  return (
    <div
      className={`bg-[#02596c] mt-8 font-poppins ${
        isDetail && cartItems.length > 0 ? "mb-20 md:mb-0" : ""
      }`}
    >
      <ListmyHotelRender
        modal={HotelRegisterModal}
        setModal={setHotelRegisterModal}
      />
      <div className="container mx-auto px-4 pt-10 flex flex-col items-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-6 w-full">
          <div className="flex flex-col items-center md:w-1/2 text-center">
            <span className="text-3xl text-[#e1cf79] font-bold tracking-tight mb-4">
              DayBreakPass
            </span>
            <div className="flex flex-col items-center">
              <span className="text-gray-400 mb-2">Recognized by</span>
              <div className="flex gap-4">
                <img
                  src={"/DPIIT-logo-trans.png"}
                  alt="DPIIT-logo"
                  className="w-12 h-12 bg-white rounded-md"
                />
                <img
                  src={"/razorpayrize.png"}
                  alt="Raazorpay rize logo"
                  className="w-12 h-12 bg-white rounded-md"
                />
                <img
                  src={"/startupindia.png"}
                  alt="Startup India-logo"
                  className="w-12 h-12 bg-white rounded-md"
                />
              </div>
              <span className="text-gray-400 my-2">Connect with us</span>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61561046045525"
                  target="_blank"
                >
                  <FaFacebook className="w-8 h-8" fill="white" />
                </a>
                <a
                  href="https://www.instagram.com/daybreakpass/"
                  target="_blank"
                >
                  <FaInstagram className="w-8 h-8" fill="white" />
                </a>
                <a
                  href="https://www.linkedin.com/company/daybreakpass/"
                  target="_blank"
                >
                  <FaLinkedinIn className="w-8 h-8" fill="white" />
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between w-full md:w-1/2 gap-6 text-center md:text-left">
            <div className="flex flex-col w-full md:w-1/2">
              <span className="text-[#e1cf79] font-bold text-lg mb-2">
                COMPANY
              </span>
              <span className="text-white font-medium mb-1">
                <Link to="/about-us">About Us</Link>
              </span>
              <span className="text-white font-medium mb-1">
                <Link to="/support">Support</Link>
              </span>
              <span className="text-white font-medium mb-1">
                <Link to="/privacy-and-policy">Privacy & Policy</Link>
              </span>
              <span className="text-white font-medium mb-1">
                <Link to="/terms-and-condition">Terms & Conditions</Link>
              </span>
              <span className="text-white font-medium mb-1">
                <Link to="/cookie-policy">Cookie Policy</Link>
              </span>
              <span className="text-white font-medium mb-1">
                <Link to="/contact-us">Contact Us</Link>
              </span>
            </div>
            <div className="flex flex-col w-full md:w-1/2">
              <span className="text-[#e1cf79] font-bold text-lg mb-2">
                HOTELS
              </span>
              <span
                className="text-white font-medium mb-1 cursor-pointer"
                onClick={() =>
                  setHotelRegisterModal((prev: any) => ({
                    ...prev,
                    state: true,
                  }))
                }
              >
                Become Hotel Partner
              </span>
              <span className="text-white font-medium mb-1">
                <Link to="/support">Support</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-500 my-3 w-full" />
      <div className="flex justify-center items-center pb-3">
        <span className="text-white">2024 © DayBreakPass</span>
      </div>
    </div>
  );
};

export default React.memo(Footer);
