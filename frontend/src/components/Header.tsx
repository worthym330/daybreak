import React, {  useEffect,  useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {  FaUserCircle } from "react-icons/fa";
import { BsSuitcase } from "react-icons/bs";
import {  logout } from "../store/authSlice";
import { initialModalState, initialResetModal, initialSignupModalState, RenderLoginModal, RenderSignUpModal, ResetPassRequest } from "./Auth";

const Header:React.FC = () => {
  // const { showToast } = useAppContext();
  const [modal, setModal] = useState(initialModalState);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const cart = useSelector((state: RootState) => state.cart.items);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();

  const headerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const cart = localStorage.getItem("cart");
    const parsedCart = cart ? JSON.parse(cart) : [];
    setCartItems(parsedCart);
  }, [cart]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      headerRef.current &&
      !headerRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      Cookies.remove("authentication");
      // showToast({ message: "Signed Out!", type: "SUCCESS" });
      dispatch(logout());
      toast.success("Successfully logout");
      navigate("/");
    },
    onError: (error: Error) => {
      // showToast({ message: error.message, type: "ERROR" });
      toast.error("Failed to logout");
      console.log(error.message);
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="">
      <RenderLoginModal
        modal={modal}
        setModal={setModal}
        setShowDropdown={setIsDropdownOpen}
        setResetModal={setResetModal}
        setSignupModal={setSignupModal}
        isHeader={true}
        isBooking={false}
      />
      <RenderSignUpModal
        modal={signupModal}
        setModal={setSignupModal}
        setShowDropdown={setIsDropdownOpen}
        initialModalState={initialSignupModalState}
        setLoginModal={setModal}
        isHeader={true}
      />
      <ResetPassRequest modal={resetModal} setModal={setResetModal} />
      <div
        className={`w-full ${
          location.pathname === "/"
            ? "bg-transparent text-white absolute z-10 top-0"
            : "bg-white text-black border-gray-200 border shadow-lg"
        }`}
        ref={headerRef}
      >
        <div className="flex flex-wrap items-center justify-between mx-auto py-2 relative px-2 md:px-5 ">
          <Link
            className={`hidden md:flex items-center px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-goldColor hover:text-white `}
            to="/list-my-hotel"
          >
            List My Hotel
          </Link>
          <span className="text-xl md:text-3xl font-bold tracking-tight flex gap-2">
            <Link to="/">
            {/* <img src={location.pathname === "/" ?"/whitelogo.png":"/logo.png"} alt="Logo" className="h-16 -py-2" /> */}
            <img src={"/daybreaklogo.png"} alt="Logo" className="h-16 -py-2" />

            </Link>
          </span>
          <span className="flex space-x-4">
            <Link
              className="flex bg-transparent items-center px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-goldColor hover:text-white relative"
              to="/checkout"
            >
              <BsSuitcase className="text-2xl" />
              <span className="absolute right-1 top-0 block px-2 py-1 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-goldColor text-white ring-2 ring-white tems-center justify-center ">
                {cartItems.length}{" "}
              </span>
            </Link>
            {auth.isAuthenticated ? (
              <>
                <button
                  type="button"
                  className="flex text-sm md:me-0 items-center gap-4"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <FaUserCircle className="w-10 h-10 rounded-full text-[#00C0CB]" /> 
                  <span className="hidden md:block text-sm">
                    Hii, {auth?.user?.name}
                  </span>
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute max-w-screen-xl mx-auto top-16 mt-2 w-48 bg-white divide-y divide-gray-100 right-0 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 z-50"
                    id="user-dropdown"
                  >
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      {/* <li onClick={toggleDropdown}>
                        <Link
                          to="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Profile
                        </Link>
                      </li> */}
                      <li onClick={toggleDropdown}>
                        <Link
                          to="/my-bookings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Bookings
                        </Link>
                      </li>
                      {/* <li onClick={toggleDropdown}>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Giftcard
                        </a>
                      </li> */}
                      <li onClick={toggleDropdown}>
                        <Link
                          to="/my-favourites"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Favourites
                        </Link>
                      </li>
                      <li onClick={toggleDropdown}>
                        <span
                          className="block px-4 py-2 text-sm text-white bg-goldColor cursor-pointer"
                          onClick={() => {
                            handleClick();
                          }}
                        >
                          Logout
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full md:me-0"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  {/* <span className="sr-only">Open user menu</span> */}
                  <FaUserCircle className="w-10 h-10 rounded-full" />
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute max-w-screen-xl mx-auto top-16 mt-2 w-48 bg-white divide-y divide-gray-100 right-0 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 z-50"
                    id="user-dropdown"
                  >
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li onClick={toggleDropdown}>
                        <span
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                          onClick={() => {
                            setModal((prev: any) => ({ ...prev, state: true }));
                          }}
                        >
                          Login
                        </span>
                      </li>
                      <li onClick={toggleDropdown}>
                        <span
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                          onClick={() => {
                            setSignupModal((prev: any) => ({
                              ...prev,
                              state: true,
                            }));
                          }}
                        >
                          Register
                        </span>
                      </li>
                      <li onClick={() => toggleDropdown()}>
                        <a
                          href={import.meta.env.VITE_ADMIN_REDIRECT}
                          target="_blank"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                        >
                          Hotel Login
                        </a>
                      </li>
                      <li onClick={toggleDropdown}>
                        <span
                          className="block md:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                          onClick={() => navigate("/list-my-hotel")}
                        >
                          List My Hotel
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Header);
