import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import { Formik } from "formik";
import Modal from "./modal";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import * as Yup from "yup";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useMutation, useQueryClient } from "react-query";
import { GiHamburgerMenu } from "react-icons/gi";
import * as apiClient from "../api-client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Button from "./Button";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import { BsSuitcase } from "react-icons/bs";

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
  const [modal, setModal] = useState(initialModalState);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);

  const auth_token = Cookies.get("authentication");
  const userLogined = auth_token ? JSON.parse(auth_token) : null;
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const cart = useSelector((state: RootState) => state.cart.items);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      toast.success("Successfully logout")
      navigate("/");
    },
    onError: (error: Error) => {
      // showToast({ message: error.message, type: "ERROR" });
      toast.error("Failed to logout")
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
        className={`w-full 
        top-2 ${
             location.pathname === "/"
               ? "bg-transparent text-white absolute z-10"
               : "bg-white text-black border-gray-200 border shadow-lg py-4"
           }`}
        ref={headerRef}
      >
        <div className="flex flex-wrap items-center justify-between mx-auto py-2 relative px-2 md:px-5 ">
          <Link
            className={`hidden md:flex items-center px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 `}
            to="/list-my-hotel"
          >
            List My Hotel
          </Link>
          <span className="text-xl md:text-3xl font-bold tracking-tight flex gap-2">
            <Link to="/">DayBreakPass</Link>
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
            {userLogined !== null ? (
              <>
                <button
                  type="button"
                  className="flex text-sm md:me-0 items-center gap-4"
                  id="user-menu-button"
                  aria-expanded={isDropdownOpen}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-10 h-10 rounded-full border-2"
                    src="/profile.jpg"
                    alt="user photo"
                  />
                  <span className="block text-sm">Hii, {userLogined.name}</span>
                </button>
                {isDropdownOpen && (
                  <div
                    className="absolute max-w-screen-xl mx-auto top-16 mt-2 w-48 bg-white divide-y divide-gray-100 right-0 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 z-50"
                    id="user-dropdown"
                  >
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          My Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          My Trips
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Giftcard
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          My Favourite
                        </a>
                      </li>
                      <li>
                        <span className="block px-4 py-2 text-sm text-white bg-goldColor cursor-pointer" onClick={()=>{handleClick()}}>
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
                      <li>
                        <span
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                          onClick={() => {
                            setModal((prev: any) => ({ ...prev, state: true }));
                          }}
                        >
                          Login
                        </span>
                      </li>
                      <li>
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
                      <li>
                        <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer">
                          Hotel Login
                        </span>
                      </li>
                      <li>
                        <span className="block md:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
                        onClick={()=>navigate("/list-my-hotel")}>
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

export default Header;
