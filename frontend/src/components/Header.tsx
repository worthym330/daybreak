import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import videoBg from "../assets/videobg.mp4";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { Formik } from "formik";
import Modal from "./modal";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import * as Yup from "yup";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useMutation, useQueryClient } from "react-query";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiXMark } from "react-icons/hi2";
import * as apiClient from "../api-client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Button from "./Button";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { MdCalendarMonth } from "react-icons/md";
import { FaEye, FaEyeSlash, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaLocationDot } from "react-icons/fa6";
import { useSearchContext } from "../contexts/SearchContext";

export const initialModalState = {
  type: "add",
  state: false,
  index: null,
  loading: false,
  id: "",
  data: {
    email: "",
    password: "",
    loginThrough: "password",
    userType: "customer",
  },
};

export const initialSignupModalState = {
  type: "add",
  state: false,
  index: null,
  id: "",
  data: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "customer",
  },
};

export const initialResetModal = {
  type: "add",
  state: false,
  index: null,
  id: "",
  data: {
    email: "",
  },
};

export interface login {
  email: string;
  password: string;
  loginThrough: string;
}

interface signup {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmpassword: string;
  role: string;
}

export interface CustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
}

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  loginThrough: Yup.string().required("Login Through is required"),
});

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required!"),
  lastName: Yup.string().required("Last Name is required!"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[\W_]/, "Password must contain at least one special character"),
  confirmpassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  role: Yup.string(),
});

const tabs = [
  { name: "Guests", href: "#", current: false },
  { name: "Hotel", href: "#", current: false },
];

function classNames(...classes: any[]): string {
  return classes.filter(Boolean).join(" ");
}

export const ResetPassRequest = ({ modal, setModal }: any) => {
  const { state, data } = modal;
  const resetPassRequestSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  return (
    <Formik
      initialValues={data}
      validationSchema={resetPassRequestSchema}
      onSubmit={async (values: login, { setSubmitting, resetForm }) => {
        try {
          setSubmitting(true);
          const response = await fetch(`${API_BASE_URL}/api/auth/forgot`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          const body = await response.json();

          if (!response.ok) {
            toast.error(body.message);
          } else {
            toast.success(body.message);
            setSubmitting(false);
            resetForm();
          }
          setModal((prev: any) => ({ ...prev, state: false }));
        } catch (error: any) {
          console.error("Error during sign in:", error);
          setSubmitting(false);
        }
      }}
    >
      {({
        handleSubmit,
        values,
        isSubmitting,
        errors,
        touched,
        handleChange,
        resetForm,
      }) => (
        <Modal
          title="Forgot Password Request"
          open={state}
          setOpen={() => {
            setModal((prev: any) => ({ ...prev, state: false }));
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="text-left">
              <label className="text-gray-700 text-sm font-bold flex-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                placeholder="Email address"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                onChange={handleChange}
              />
              {touched.email && (
                <span className="text-red-500 font-normal">
                  {errors.email as string}
                </span>
              )}
            </div>

            <div className="flex flex-col justify-center gap-5">
              <span className="flex items-center justify-between">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Request
                </Button>
              </span>
            </div>
          </form>
        </Modal>
      )}
    </Formik>
  );
};

export const RenderLoginModal = ({
  modal,
  setModal,
  setShowDropdown,
  setResetModal,
  setSignupModal,
  isHeader,
  isBooking,
  paymentIntent,
}: any) => {
  const { state, data } = modal;
  function handleSignInClick() {
    setModal((prev: any) => ({ ...prev, state: false }));
    setSignupModal((prev: any) => ({ ...prev, state: true }));
  }
  const [showPassword, setShowPassword] = useState(false);
  const responseLoginGoogle = async (response: any) => {
    const token = response.credential;
    const user = jwtDecode<CustomJwtPayload>(token);
    let payload = {
      email: user.email,
      loginThrough: "google",
      googleToken: token,
      userType: "customer",
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (response.ok) {
        setModal((prev: any) => ({ ...prev, state: false, loading: false }));
        // showToast({ message: "Sign in Successful!", type: "SUCCESS" });
        toast.success("Sign in Successful!");
        if (isHeader) {
          setShowDropdown(false);
        }
        if (isBooking) {
          paymentIntent();
        }
        Cookies.set("authentication", JSON.stringify(body.user), {
          expires: 1,
        });
      } else {
        // showToast({ message: "Failed to Login!", type: "ERROR" });
        toast.error("Failed to Login!");
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
    }
  };
  return (
    <Formik
      initialValues={data}
      validationSchema={loginSchema}
      onSubmit={async (values: login) => {
        setModal((prev: any) => ({ ...prev, state: false, loading: true }));
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });

          const body = await response.json();
          setModal(initialModalState);

          if (!response.ok) {
            // showToast({ message: body.message, type: "ERROR" });
            toast.error(body.message);
          } else {
            toast.success("Logined Successfully!");
            if (isHeader) {
              setShowDropdown(false);
            }
            if (isBooking) {
              paymentIntent();
            }
            Cookies.set("authentication", JSON.stringify(body.user), {
              expires: 1,
            });
          }
        } catch (error: any) {
          console.error("Error during sign in:", error);
          setModal(initialModalState);
          // showToast({
          //   message: error.message || "An error occurred during sign in",
          //   type: "ERROR",
          // });
          toast.error(error.message);
        }
      }}
    >
      {({
        handleSubmit,
        values,
        isSubmitting,
        errors,
        touched,
        handleChange,
      }) => (
        <Modal
          title=""
          open={state}
          setOpen={() => {
            setModal((prev: any) => ({ ...prev, state: false }));
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="text-center text-2xl font-light text-gray-800 mb-5">
              Welcome to{" "}
              <span className="text-goldColor font-bold">DayBreakPass</span>
            </h1>

            <div className="text-left">
              <label className="text-gray-700 text-sm font-bold flex-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                placeholder="Email address"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                onChange={handleChange}
              />
              {touched.email && (
                <span className="text-red-500 font-normal">{errors.email}</span>
              )}
            </div>

            <div className="text-left relative">
              <label className="text-gray-700 text-sm font-bold flex-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                placeholder="Password"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                onChange={handleChange}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 pt-4 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-600 w-5 h-5" />
                ) : (
                  <FaEye className="text-gray-600 w-5 h-5" />
                )}
              </div>
              {touched.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
            </div>
            <div className="flex flex-col justify-center gap-5">
              <span
                className="cursor-pointer underline text-goldColor flex justify-end hover:text-blue-700"
                onClick={() => {
                  setModal((prev: any) => ({ ...prev, state: false }));
                  setResetModal((prev: any) => ({ ...prev, state: true }));
                }}
              >
                Forgot Password?
              </span>
              <span className="flex items-center justify-between">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l2.12-2.122A5 5 0 016 12H2c0 1.795.703 3.432 1.757 4.686L6 17.291z"
                        ></path>
                      </svg>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </span>
              <span className="text-center text-gray-800">
                Don't have an account yet?{" "}
                <span
                  className="cursor-pointer underline text-goldColor"
                  onClick={() => handleSignInClick()}
                >
                  {" "}
                  Sign Up
                </span>
              </span>
              <div className="flex w-full my-1 justify-center items-center">
                <hr className="border-gray-300 flex-grow" />
                <span className="text-gray-400 mx-2">OR</span>
                <hr className="border-gray-300 flex-grow" />
              </div>

              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <div className="w-full flex justify-center mb-3">
                  <div className="">
                    <GoogleLogin
                      onSuccess={responseLoginGoogle}
                      onError={() => console.log("failed to login")}
                    />
                  </div>
                </div>
              </GoogleOAuthProvider>
              <hr className="border-gray-300 flex-grow" />
              <span className="text-sm text-center">
                Are you a hotel partner?{" "}
                <Link
                  className="underline text-goldColor"
                  to="/partner/sign-in"
                >
                  Log in here
                </Link>
              </span>
            </div>
          </form>
        </Modal>
      )}
    </Formik>
  );
};

export const RenderSignUpModal = ({
  modal,
  setModal,
  setShowDropdown,
  setLoginModal,
  initialModalState,
  isHeader,
}: any) => {
  const { state, data } = modal;
  const queryClient = useQueryClient();
  function handleLoginSpanClick() {
    setModal((prev: any) => ({ ...prev, state: false }));
    setLoginModal((prev: any) => ({ ...prev, state: true }));
  }

  const responseSignUpGoogle = async (response: any) => {
    const token = response.credential;
    const user = jwtDecode<CustomJwtPayload>(token);
    let payload = {
      email: user.email,
      firstName: user.name?.split(" ")[0],
      lastName: user.name?.split(" ")[user.name?.split(" ").length - 1],
      loginThrough: "google",
      googleToken: token,
      role: "customer",
    };
    console.log(payload, user.name);

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (response.ok) {
        setModal(initialModalState);
        toast.success("Registered Successful!");
        if (isHeader) {
          setShowDropdown(false);
        }
        Cookies.set("authentication", JSON.stringify(body.user), {
          expires: 1,
        });
      } else {
        toast.error("Failed to register!");
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
    }
  };

  return (
    <Formik
      initialValues={data}
      validationSchema={registerSchema}
      onSubmit={async (values: signup) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
          const responseBody = await response.json();
          if (response.ok) {
            Cookies.set("authentication", JSON.stringify(responseBody.user), {
              expires: 1,
            });
            toast.success("Registered Successful!");
            await queryClient.invalidateQueries("validateToken");
            if (isHeader) {
              setShowDropdown(false);
            }
            setModal(initialModalState);
          } else {
            toast.error(responseBody.message);
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      }}
    >
      {({
        handleSubmit,
        values,
        isSubmitting,
        errors,
        touched,
        handleChange,
      }) => (
        <Modal
          title=""
          open={state}
          setOpen={() => {
            setModal(initialModalState);
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="text-center text-2xl font-light text-gray-800 mb-3">
              Create{" "}
              <span className="text-goldColor font-bold">DayBreakPass</span>{" "}
              Account
            </h1>

            <div className="text-left">
              <label className="text-gray-700 text-sm font-bold flex-1">
                First Name
              </label>
              <input
                type="firstName"
                name="firstName"
                value={values.firstName}
                placeholder="First Name"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                onChange={handleChange}
              />
              {touched.firstName && (
                <span className="text-red-500">{errors.firstName}</span>
              )}
            </div>

            <div className="text-left">
              <label className="text-gray-700 text-sm font-bold flex-1">
                Last Name
              </label>
              <input
                type="lastName"
                name="lastName"
                value={values.lastName}
                placeholder="Last Name"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                onChange={handleChange}
              />
              {touched.lastName && (
                <span className="text-red-500 font-semibold">
                  {errors.lastName}
                </span>
              )}
            </div>

            <div className="text-left">
              <label className="text-gray-700 text-sm font-bold flex-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                placeholder="Email address"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                onChange={handleChange}
              />
              {touched.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
            </div>

            <div className="text-left">
              <label className="text-gray-700 text-sm font-bold flex-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={values.password}
                placeholder="Password"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                onChange={handleChange}
              />
              {touched.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
            </div>

            <div className="text-left">
              <label className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmpassword"
                value={values.confirmpassword}
                placeholder="Confirm Password"
                className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                onChange={handleChange}
              />
              {touched.confirmpassword && (
                <span className="text-red-500">{errors.confirmpassword}</span>
              )}
            </div>

            <div className="flex flex-col justify-center gap-5 mt-5">
              <span className="flex items-center justify-between">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </span>
              <span className="text-center text-gray-800">
                Already have an account?
                <span
                  className="cursor-pointer underline text-goldColor"
                  onClick={() => handleLoginSpanClick()}
                >
                  {" "}
                  Login
                </span>
              </span>
              <div className="flex w-full my-1 justify-center items-center">
                <hr className="border-gray-300 flex-grow" />
                <span className="text-gray-400 mx-2">OR</span>
                <hr className="border-gray-300 flex-grow" />
              </div>
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <div className="w-full flex justify-center mb-3">
                  <div className="">
                    <GoogleLogin
                      onSuccess={responseSignUpGoogle}
                      onError={() => console.log("failed to login")}
                    />
                  </div>
                </div>
              </GoogleOAuthProvider>
            </div>
          </form>
        </Modal>
      )}
    </Formik>
  );
};

const Header = () => {
  // const { showToast } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [arrowDirection, setArrowDirection] = useState("down");
  const [modal, setModal] = useState(initialModalState);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);

  const auth_token = Cookies.get("authentication");
  const userLogined = auth_token ? JSON.parse(auth_token) : null;
  const navigate = useNavigate();
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);
  const [tab, setTab] = useState("Guests");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const cart = useSelector((state: RootState) => state.cart.items);

  const headerRef = useRef<HTMLDivElement>(null);
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(destination, checkIn);
    navigate(`/listings?city=${destination}`);
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
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
      setShowDropdown(false);
      setShowNav(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    setShowDropdown(!showDropdown);
    setArrowDirection(showDropdown ? "down" : "up");
  };

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      Cookies.remove("authentication");
      // showToast({ message: "Signed Out!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      // showToast({ message: error.message, type: "ERROR" });
      console.log(error.message);
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };

  return (
    <div className="">
      {/* {renderLoginModal()} */}
      {/* {renderSignUpModal()} */}
      <RenderLoginModal
        modal={modal}
        setModal={setModal}
        setShowDropdown={setShowDropdown}
        setResetModal={setResetModal}
        setSignupModal={setSignupModal}
        isHeader={true}
        isBooking={false}
      />
      <RenderSignUpModal
        modal={signupModal}
        setModal={setSignupModal}
        setShowDropdown={setShowDropdown}
        initialModalState={initialSignupModalState}
        setLoginModal={setModal}
        isHeader={true}
      />
      <ResetPassRequest modal={resetModal} setModal={setResetModal} />
      {location.pathname === "/" ? (
        <div
          className="relative w-full h-screen overflow-hidden"
          ref={headerRef}
        >
          <video
            src={
              "https://ixnyqungcmjgqzmlzyka.supabase.co/storage/v1/object/public/daybreakpass/bgimage.mp4?t=2024-07-15T12%3A51%3A18.983Z"
            }
            playsInline
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-[94%] object-cover"
          ></video>

          {/* Hero Section */}
          <div className="absolute bottom-0 w-full flex flex-col justify-center items-center bg-transparent text-center p-4">
            <div className="max-w-screen-lg mb-16">
              <h1 className="text-4xl md:text-6xl text-white font-normal font-LuzuryF2 tracking-wider mb-6 leading-10">
                FIND YOUR NEXT DAYCATION
              </h1>
              <p className="text-lg md:text-2xl text-white mb-4 font-poppins">
                Discover luxury by the day: Book Day Passes, Daybeds, Cabanas &
                Experiences at premier hotels in your city.
              </p>
            </div>

            <div className="w-full md:w-2/3 lg:w-1/2">
              <form
                onSubmit={handleSubmit}
                className="px-8 py-8 bg-white rounded-full shadow-lg h-14 flex items-center justify-between"
              >
                <div className="w-2/5 md:w-1/3 flex items-center h-full relative border-r-2 border-gray-800">
                  <FaLocationDot className="text-xl mr-2 text-[#02596c]" />
                  <input
                    placeholder="Where are you going?"
                    className="text-sm md:text-lg w-full focus:outline-none text-[#02596c] placeholder:text-[#02596c]"
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                  />
                </div>
                <div className="w-3/5 md:w-2/3 flex-1 flex items-center h-full pl-2 text-[#02596c] border-l-2 border-gray-800">
                  <MdCalendarMonth className="text-xl mr-2" />
                  <div className="w-full">
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date as Date)}
                      selectsStart
                      startDate={checkIn}
                      minDate={minDate}
                      maxDate={maxDate}
                      placeholderText="Check-in Date"
                      className="w-full bg-white focus:outline-none placeholder:text-[#02596c]"
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
                <button
                  className="h-10 w-10 md:w-24 text-white text-sm font-medium rounded-full bg-orange-500 flex items-center justify-center"
                  type="submit"
                >
                  <FaSearch className="sm:mr-2" />
                  <span className="hidden md:inline-block">Search</span>
                </button>
              </form>
            </div>
          </div>
          {/* Hero Section */}

          {/* ---------- NavBar Starts ---------- */}
          {showNav ? (
            <div className="absolute w-full top-0 bg-white z-10">
              <div className="hidden md:block md:px-[10rem]">
                <div className="w-full pt-4 flex items-center justify-between py-2">
                  <span className="text-2xl md:text-3xl font-bold tracking-tight flex gap-2">
                    <span className="flex items-center text-center cursor-pointer">
                      <HiXMark
                        className="w-8 h-8"
                        onClick={() => setShowNav(!showNav)}
                      />
                    </span>
                    <Link to="/">DayBreakPass</Link>
                  </span>
                  <span className="flex space-x-2">
                    {/* {userLogined !== null ? (
                      <>
                        {userLogined?.role === "customer" ? (
                          <Link
                            className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-goldColor hover:text-white"
                            to="/my-bookings"
                          >
                            My Bookings
                          </Link>
                        ) : (
                          <Link
                            className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-goldColor hover:text-white"
                            to="/my-hotels"
                          >
                            My Hotels
                          </Link>
                        )}
                        <SignOutButton classNames="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-goldColor hover:text-white" />
                      </>
                    ) : ( */}
                    <button
                      className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-goldColor  hover:border-black hover:bg-btnColor hover:text-white"
                      onClick={() => navigate("/partner/sign-in")}
                    >
                      Hotel Login{" "}
                      {/* {arrowDirection === "down" ? (
                          <IoIosArrowDown className="ml-3 text-xl" />
                        ) : (
                          <IoIosArrowUp className="ml-3 text-xl" />
                        )} */}
                    </button>
                    {/* )} */}
                    <button
                      className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-goldColor hover:border-black hover:bg-btnColor hover:text-white"
                      onClick={() => navigate("/waitlist")}
                    >
                      Join WaitList{" "}
                    </button>

                    <Link
                      className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-goldColor hover:text-white relative "
                      to="/checkout"
                    >
                      <IoCartOutline className="text-2xl" />
                      <span className="absolute right-1 top-0 block px-2 py-1 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-goldColor text-white ring-2 ring-white items-center justify-center ">
                        {cartItems.length}{" "}
                      </span>
                    </Link>
                  </span>

                  {/* Dropdown for Login button */}
                  {/* {showDropdown && (
                    <div className="absolute bg-gray-100 text-rp-primary-black right-4 top-20 -mt-1 rounded-xl w-56 md:w-72 z-300 flex flex-col items-start shadow-login-card md:top-20 shadow-md">
                      <button
                        type="button"
                        className="pl-5 pb-4 pt-4 cursor-pointer z-10 w-full text-left align-middle rounded-t-xl hover:bg-rp-light-gray-4"
                        onClick={() => {
                          setShowDropdown(false);
                          setModal((prev) => ({ ...prev, state: true }));
                        }}
                      >
                        Login
                      </button>

                      <button
                        type="button"
                        className="pl-5 pb-3 cursor-pointer z-10 w-full text-left align-middle pt-2 border-b border-rp-gray-divider hover:bg-rp-light-gray-4"
                        onClick={() => {
                          setShowDropdown(false);
                          setSignupModal((prev) => ({ ...prev, state: true }));
                        }}
                      >
                        Sign Up
                      </button>

                      <a
                        // type="button"
                        className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                        href={import.meta.env.VITE_ADMIN_REDIRECT}
                        onClick={() => {
                          setShowDropdown(false);
                          // window.location.href = ""
                        }}
                      >
                        Hotel Login
                      </a>

                      <button
                        type="button"
                        className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-2 rounded-b-xl hover:bg-rp-light-gray-4"
                      >
                        List My Hotel
                      </button>
                    </div>
                  )}
                  {/* Dropdown End */}
                </div>

                {/*Home Page Hamburger */}
                <div className="w-full flex px-16 py-4">
                  <div className="flex flex-col md:w-1/2 py-3 mr-20">
                    <span className="pb-3 text-fontPrimaryColor tracking-wider text-4xl font-LuzuryF1">
                      Unforgettable resorts and memories await
                    </span>
                    <Link
                      className="py-3 text-fontSecondaryColor"
                      to="/about-us"
                    >
                      About DayBreakPass
                    </Link>
                  </div>
                  <div className="flex gap-20 md:w-1/2 justify-center">
                    <div className="text-nowrap flex flex-col gap-2">
                      <span className="text-nowrap font-bold text-fontPrimaryColor">
                        Guests
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor">
                        My Favourite
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor">
                        Browse Hotels
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor">
                        Help
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor"></span>
                      <span className="text-nowrap text-fontSecondaryColor"></span>
                    </div>
                    <div className="text-nowrap flex flex-col gap-2">
                      <span className="text-nowrap font-bold text-fontPrimaryColor">
                        Hotels
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor">
                        List My Hotels
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor">
                        Marketplace
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor">
                        Help
                      </span>
                      <span className="text-nowrap text-fontSecondaryColor"></span>
                      <span className="text-nowrap text-fontSecondaryColor"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:hidden flex flex-col gap-2 border-b-2 border-black">
                <div className="bg-white text-black w-full h-screen p-6 flex flex-col">
                  <span className="flex items-center text-center cursor-pointer">
                    <HiXMark
                      className="w-8 h-8"
                      onClick={() => setShowNav(!showNav)}
                    />
                  </span>
                  <div className="flex flex-col justify-between h-screen">
                    <div>
                      <div className="flex items-center mb-6 w-full mt-10">
                        <div className="ml-4 w-full flex gap-5">
                          {tabs.map((e: any) => (
                            <button
                              className={classNames(
                                e.name === tab
                                  ? "bg-goldColor text-white  border-darkGold"
                                  : "text-black hover:bg-white border-darkGold",
                                "rounded-md px-3 py-2 text-sm font-medium w-1/2 border"
                              )}
                              onClick={() => setTab(e.name)}
                            >
                              {e.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="my-6 ml-8">
                        {tab === "Guests" ? (
                          <ul className="space-y-6 text-goldColor">
                            <li>My Favorites</li>
                            <li>Browse Hotels</li>
                            <li>Help</li>
                          </ul>
                        ) : (
                          <ul className="space-y-6 text-goldColor">
                            <li>List My Hotels</li>
                            <li>Marketplace</li>
                            <li>Help</li>
                          </ul>
                        )}
                      </div>
                    </div>

                    <div>
                      {/* {userLogined !== null ? (
                        <button
                          className="bg-red-500 text-white px-3 py-2 mb-4 w-full rounded-md"
                          onClick={handleClick}
                        >
                          Log out
                        </button>
                      ) : (
                        <> */}
                      <button
                        className="bg-white text-black px-3 py-2 mb-4 w-full rounded-md border-2 border-black hover:bg-btnColor hover:text-white"
                        onClick={() => {
                          // setSignupModal((prev) => ({
                          //   ...prev,
                          //   state: true,
                          // }));
                          navigate("/waitlist");
                        }}
                      >
                        Join Waitlist
                      </button>
                      <button
                        className="bg-black text-white px-3 py-2 mb-4 w-full rounded-md border-2 border-black hover:bg-btnColor hover:text-white"
                        onClick={() => {
                          // setModal((prev) => ({ ...prev, state: true }));
                          navigate("/partner/sign-in");
                        }}
                      >
                        Hotel Login
                      </button>
                      {/* </>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Home page NavBar
            <div className="w-full absolute top-4 flex items-center justify-between z-10 px-4 md:px-[10rem] bg-transparent">
              <span className="text-2xl md:text-3xl text-white font-bold tracking-tight flex gap-2">
                <span className="flex items-center text-center cursor-pointer">
                  <GiHamburgerMenu
                    className="w-8 h-8"
                    onClick={() => setShowNav(!showNav)}
                  />
                </span>
                <Link to="/">DayBreakPass</Link>
              </span>
              <span className="hidden md:flex space-x-2">
                {/* {userLogined !== null ? (
                  <>
                    {userLogined?.role === "customer" ? (
                      <Link
                        className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-goldColor hover:text-white"
                        to="/my-bookings"
                      >
                        My Bookings
                      </Link>
                    ) : (
                      <Link
                        className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-goldColor hover:text-white"
                        to="/my-hotels"
                      >
                        My Hotels
                      </Link>
                    )}
                    <SignOutButton classNames="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-goldColor hover:text-white" />
                  </>
                ) : ( */}
                <button
                  className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-goldColor hover:border-white hover:bg-btnColor hover:text-white"
                  onClick={() => navigate("/partner/sign-in")}
                >
                  Hotel Login{" "}
                  {/* {arrowDirection === "down" ? (
                      <IoIosArrowDown className="ml-3 text-xl" />
                    ) : (
                      <IoIosArrowUp className="ml-3 text-xl" />
                    )} */}
                </button>

                <button
                  className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-goldColor hover:border-white hover:bg-btnColor hover:text-white"
                  onClick={() => navigate("/waitlist")}
                >
                  Join Waitlist
                </button>
                {/* )} */}

                <Link
                  className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-goldColor hover:text-white relative"
                  to="/checkout"
                >
                  <IoCartOutline className="text-2xl" />
                  <span className="absolute right-1 top-0 block px-2 py-1 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-goldColor text-white ring-2 ring-white tems-center justify-center ">
                    {cartItems.length}{" "}
                  </span>
                </Link>
              </span>

              {/* Dropdown for Login button */}
              {/* {showDropdown && (
                <div className="absolute bg-white text-rp-primary-black right-4 md:right-16 top-20 -mt-1 rounded-xl w-56 md:w-72 z-300 flex flex-col items-start shadow-login-card md:top-24">
                  <button
                    type="button"
                    className="pl-5 pb-4 pt-4 cursor-pointer z-10 w-full text-left align-middle rounded-t-xl hover:bg-rp-light-gray-4"
                    onClick={() => {
                      setShowDropdown(false);
                      setModal((prev) => ({ ...prev, state: true }));
                    }}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="pl-5 pb-3 cursor-pointer z-10 w-full text-left align-middle pt-2 border-b border-rp-gray-divider hover:bg-rp-light-gray-4"
                    onClick={() => {
                      setShowDropdown(false);
                      setSignupModal((prev) => ({ ...prev, state: true }));
                    }}
                  >
                    Sign Up
                  </button>

                  <a
                    // type="button"
                    className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                    href={import.meta.env.VITE_ADMIN_REDIRECT}
                    onClick={() => {
                      setShowDropdown(false);
                      // window.location.href = ""
                    }}
                  >
                    Hotel Login
                  </a>

                  <button
                    type="button"
                    className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-2 rounded-b-xl hover:bg-rp-light-gray-4"
                  >
                    List My Hotel
                  </button>
                </div>
              )} */}
              {/* Dropdown End */}
            </div>
          )}
          {/* ---------- NavBar Ends ---------- */}
        </div>
      ) : // Search Result Page hamburger dropdown Navbar
      showNav ? (
        <div
          className="absolute w-full top-0 bg-white text-black z-20 border-b-2 border-black"
          ref={headerRef}
        >
          <div className="hidden md:block md:px-10">
            <div className="w-full pt-4 flex items-center justify-between py-2">
              <span className="text-2xl md:text-3xl font-bold tracking-tight flex gap-2">
                <span className="flex items-center text-center cursor-pointer">
                  <HiXMark
                    className="w-8 h-8"
                    onClick={() => setShowNav(!showNav)}
                  />
                </span>
                <Link to="/">DayBreakPass</Link>
              </span>
              <span className="flex space-x-2">
                {/* {userLogined !== null ? (
                  <>
                    {userLogined?.role === "customer" ? (
                      <Link
                        className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-darkGold hover:bg-goldColor hover:text-white hover:border-black"
                        to="/my-bookings"
                      >
                        My Bookings
                      </Link>
                    ) : (
                      <Link
                        className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-darkGold hover:bg-goldColor hover:text-white hover:border-black"
                        to="/my-hotels"
                      >
                        My Hotels
                      </Link>
                    )}
                    <SignOutButton classNames="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-darkGold hover:bg-goldColor hover:text-white hover:border-black" />
                  </>
                ) : ( */}
                <button
                  className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:border-btnColor hover:bg-btnColor hover:text-white"
                  onClick={() => navigate("/partner/sign-in")}
                >
                  Hotel Login{" "}
                  {/* {arrowDirection === "down" ? (
                      <IoIosArrowDown className="ml-3 text-xl" />
                    ) : (
                      <IoIosArrowUp className="ml-3 text-xl" />
                    )}*/}
                </button>
                {/* )} */}

                <button
                  className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:border-btnColor hover:bg-btnColor hover:text-white"
                  onClick={() => navigate("/waitlist")}
                >
                  Join Waitlist{" "}
                  {/* {arrowDirection === "down" ? (
                      <IoIosArrowDown className="ml-3 text-xl" />
                    ) : (
                      <IoIosArrowUp className="ml-3 text-xl" />
                    )}*/}
                </button>

                <Link
                  className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-darkGold hover:bg-goldColor hover:text-white relative"
                  to="/checkout"
                >
                  <IoCartOutline className="text-2xl" />
                  <span className="absolute right-1 top-0 block px-2 py-1 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-goldColor text-white ring-2 ring-white items-center justify-center ">
                    {cartItems.length}{" "}
                  </span>
                </Link>
              </span>

              {/* Dropdown for Login button */}
              {/* {showDropdown && (
                <div className="absolute bg-gray-100 text-rp-primary-black right-4 top-20 -mt-1 rounded-xl w-56 md:w-72 z-300 flex flex-col items-start shadow-login-card md:top-20 shadow-md">
                  <button
                    type="button"
                    className="pl-5 pb-4 pt-4 cursor-pointer text-black z-10 w-full text-left align-middle rounded-t-xl hover:bg-rp-light-gray-4"
                    onClick={() => {
                      setShowDropdown(false);
                      setModal((prev) => ({ ...prev, state: true }));
                    }}
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    className="pl-5 pb-3 cursor-pointer text-black z-10 w-full text-left align-middle pt-2 border-b border-rp-gray-divider hover:bg-rp-light-gray-4"
                    onClick={() => {
                      setShowDropdown(false);
                      setSignupModal((prev) => ({ ...prev, state: true }));
                    }}
                  >
                    Sign Up
                  </button>

                  <a
                    // type="button"
                    className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                    href={import.meta.env.VITE_ADMIN_REDIRECT}
                    onClick={() => {
                      setShowDropdown(false);
                      // window.location.href = ""
                    }}
                  >
                    Hotel Login
                  </a>

                  <button
                    type="button"
                    className="pl-5 pb-4 cursor-pointer text-black z-10 w-full text-left align-middle pt-2 rounded-b-xl hover:bg-rp-light-gray-4"
                  >
                    List My Hotel
                  </button>
                </div>
              )} */}
              {/* Dropdown End */}
            </div>

            {/* Hamburger when clciked */}
            <div className="w-full flex px-16 py-4">
              <div className="flex flex-col md:w-1/2 py-3 mr-20">
                <span className="pb-3 text-fontPrimaryColor tracking-wider text-4xl font-LuzuryF1">
                  Unforgettable resorts and memories await
                </span>
                <Link className="py-3 text-fontSecondaryColor" to="/about-us">
                  <span onClick={() => setShowNav(!showNav)}>
                    About DayBreakPass
                  </span>
                </Link>
              </div>
              <div className="flex gap-20 md:w-1/2 justify-center">
                <div className="text-nowrap flex flex-col gap-2">
                  <span className="text-nowrap font-bold text-fontPrimaryColor">
                    Guests
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor">
                    My Favourite
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor">
                    Browse Hotels
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor">
                    Help
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor"></span>
                  <span className="text-nowrap text-fontSecondaryColor"></span>
                </div>
                <div className="text-nowrap flex flex-col gap-2">
                  <span className="text-nowrap font-bold text-fontPrimaryColor">
                    Hotels
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor">
                    List My Hotels
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor">
                    Marketplace
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor">
                    Help
                  </span>
                  <span className="text-nowrap text-fontSecondaryColor"></span>
                  <span className="text-nowrap text-fontSecondaryColor"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden flex flex-col gap-2 border-b-2 border-black">
            <div className="bg-white text-black w-full h-screen p-6 flex flex-col">
              <span className="flex items-center text-center cursor-pointer">
                <HiXMark
                  className="w-8 h-8"
                  onClick={() => setShowNav(!showNav)}
                />
              </span>
              <div className="flex flex-col h-screen">
                <div>
                  <div className="flex items-center mb-6 w-full mt-10">
                    <div className="ml-4 w-full flex gap-5">
                      {tabs.map((e: any) => (
                        <button
                          className={classNames(
                            e.name === tab
                              ? "bg-goldColor text-white  border-darkGold"
                              : "text-black hover:bg-white border-darkGold",
                            "rounded-md px-3 py-2 text-sm font-medium w-1/2 border"
                          )}
                          onClick={() => setTab(e.name)}
                        >
                          {e.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="my-6 ml-8">
                    {tab === "Guests" ? (
                      <ul className="space-y-6 text-goldColor">
                        <li>My Favorites</li>
                        <li>Browse Hotels</li>
                        <li>Help</li>
                      </ul>
                    ) : (
                      <ul className="space-y-6 text-goldColor">
                        <li>List My Hotels</li>
                        <li>Marketplace</li>
                        <li>Help</li>
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-end h-full">
                  {/* {userLogined !== null ? (
                    <button
                      className="bg-red-500 text-white px-3 py-2 mb-4 w-full rounded-md"
                      onClick={handleClick}
                    >
                      Log out
                    </button>
                  ) : (
                    <> */}
                  <button
                    className="bg-white text-black px-3 py-2 mb-4 w-full rounded-md border-2 border-black hover:bg-btnColor hover:text-white"
                    onClick={() => {
                      // setSignupModal((prev) => ({
                      //   ...prev,
                      //   state: true,
                      // }));
                      navigate("/waitlist");
                    }}
                  >
                    Join Waitlist
                  </button>
                  <button
                    className="bg-black text-white px-3 py-2 mb-4 w-full rounded-md border-2 border-black hover:bg-btnColor hover:text-white"
                    onClick={() => {
                      // setModal((prev) => ({ ...prev, state: true }));
                      navigate("/partner/sign-in");
                    }}
                  >
                    Hotel Login
                  </button>
                  {/* </>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Search Result NavBar Page
        <div className="top-4 flex items-center justify-between px-2 w-full md:px-10 py-4 shadow-md">
          <span className="text-2xl md:text-3xl text-black font-bold tracking-tight flex gap-2">
            <span className="flex items-center text-center cursor-pointer">
              <GiHamburgerMenu
                className="w-8 h-8"
                onClick={() => setShowNav(!showNav)}
              />
            </span>
            <Link to="/" className="">
              DayBreakPass
            </Link>
          </span>
          <span className="space-x-2 hidden md:flex">
            {/* {userLogined !== null ? (
              <>
                {userLogined?.role === "customer" ? (
                  <Link
                    className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-darkGold hover:bg-goldColor hover:text-white"
                    to="/my-bookings"
                  >
                    My Bookings
                  </Link>
                ) : (
                  <Link
                    className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-darkGold hover:bg-goldColor hover:text-white"
                    to="/my-hotels"
                  >
                    My Hotels
                  </Link>
                )}
                <SignOutButton classNames="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-darkGold hover:bg-goldColor hover:text-white" />
              </>
            ) : ( */}
            <button
              className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-goldColor hover:border-black hover:bg-btnColor hover:text-white"
              onClick={() => navigate("/partner/sign-in")}
            >
              Hotel Login{" "}
              {/* {arrowDirection === "down" ? (
                  <IoIosArrowDown className="ml-3 text-xl" />
                ) : (
                  <IoIosArrowUp className="ml-3 text-xl" />
                )} */}
            </button>
            {/* )} */}
            <button
              className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-goldColor hover:border-black hover:bg-btnColor hover:text-white"
              onClick={() => navigate("/waitlist")}
            >
              Join Waitlist{" "}
            </button>

            <Link
              className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-goldColor hover:text-white relative"
              to="/checkout"
            >
              <IoCartOutline className="text-2xl" />
              <span className="absolute right-1 top-0 block px-2 py-1 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-goldColor text-white ring-2 ring-white items-center justify-center ">
                {cartItems.length}{" "}
              </span>
            </Link>
          </span>

          {/* Dropdown for Login button */}
          {/* {showDropdown && (
            <div className="absolute bg-gray-100 text-rp-primary-black right-4 top-20 -mt-1 rounded-xl w-56 md:w-72 z-50 flex flex-col items-start shadow-login-card md:top-20 shadow-md">
              <button
                type="button"
                className="pl-5 pb-4 pt-4 cursor-pointer z-10 w-full text-left align-middle rounded-t-xl hover:bg-rp-light-gray-4"
                onClick={() => {
                  setShowDropdown(false);
                  setModal((prev) => ({ ...prev, state: true }));
                }}
              >
                Login
              </button>

              <button
                type="button"
                className="pl-5 pb-3 cursor-pointer z-10 w-full text-left align-middle pt-2 border-b border-rp-gray-divider hover:bg-rp-light-gray-4"
                onClick={() => {
                  setShowDropdown(false);
                  setSignupModal((prev) => ({ ...prev, state: true }));
                }}
              >
                Sign Up
              </button>

              <a
                // type="button"
                className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                href={import.meta.env.VITE_ADMIN_REDIRECT}
                onClick={() => {
                  setShowDropdown(false);
                  // window.location.href = ""
                }}
              >
                Hotel Login
              </a>

              <button
                type="button"
                className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-2 rounded-b-xl hover:bg-rp-light-gray-4"
              >
                List My Hotel
              </button>
            </div>
          )} */}
          {/* Dropdown End */}
        </div>
      )}
    </div>
  );
};

export default Header;
