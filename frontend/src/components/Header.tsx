import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
import videoBg from "../assets/VideoBg.mp4";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import { Formik } from "formik";
import Modal from "./modal";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import * as Yup from "yup";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useQueryClient } from "react-query";

const initialModalState = {
  type: "add",
  state: false,
  index: null,
  loading: false,
  id: "",
  data: {
    email: "",
    password: "",
    loginThrough: "password",
  },
};

const initialSignupModalState = {
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

interface login {
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

interface CustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  loginThrough: Yup.string().required("Login Through is required"),
});

const registerSchema = Yup.object().shape({
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

const Header = () => {
  const { showToast } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [arrowDirection, setArrowDirection] = useState("down");
  const [modal, setModal] = useState(initialModalState);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);

  const auth_token = localStorage.getItem("auth_token");
  const userLogined = auth_token ? JSON.parse(auth_token) : null;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const handleLoginClick = () => {
    setShowDropdown(!showDropdown);
    setArrowDirection(showDropdown ? "down" : "up");
  };

  const responseLoginGoogle = async (response: any) => {
    const token = response.credential;
    const user = jwtDecode<CustomJwtPayload>(token);
    let payload = {
      email: user.email,
      loginThrough: "google",
      googleToken: token,
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
        setModal((prev) => ({ ...prev, state: false, loading: false }));
        showToast({ message: "Sign in Successful!", type: "SUCCESS" });
        setShowDropdown(false);
        localStorage.setItem("auth_token", JSON.stringify(body.user));
      } else {
        showToast({ message: "Failed to Login!", type: "ERROR" });
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
    }
  };

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
        setSignupModal(initialSignupModalState);
        showToast({ message: "Registered Successful!", type: "SUCCESS" });
        setShowDropdown(false);
        localStorage.setItem("auth_token", JSON.stringify(body.user));
      } else {
        showToast({ message: "Failed to register!", type: "ERROR" });
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
    }
  };

  function handleSignInClick() {
    setModal((prev) => ({ ...prev, state: false }));
    setSignupModal((prev) => ({ ...prev, state: true }));
  }

  function handleLoginSpanClick() {
    setSignupModal((prev) => ({ ...prev, state: false }));
    setModal((prev) => ({ ...prev, state: true }));
  }

  const renderLoginModal = () => {
    const { state, data } = modal;
    return (
      <Formik
        initialValues={data}
        validationSchema={loginSchema}
        onSubmit={async (values: login) => {
          setModal((prev) => ({ ...prev, state: false, loading: true }));
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
          const body = await response.json();
          setModal((prev) => ({ ...prev, state: false, loading: false }));
          showToast({ message: "Sign in Successful!", type: "SUCCESS" });
          setShowDropdown(false);
          localStorage.setItem("auth_token", JSON.stringify(body.user));
          if (!response.ok) {
            throw new Error(body.message);
          }
        }}
      >
        {({
          handleSubmit,
          values,
          isSubmitting,
          errors,
          touched,
          handleBlur,
          handleChange,
        }) => (
          <Modal
            title=""
            open={state}
            setOpen={() => {
              setModal((prev) => ({ ...prev, state: false }));
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <h1 className="text-center text-3xl font-light text-gray-800">
                Welcome to{" "}
                <span className="text-gray-800 font-bold">DayBreak</span>
              </h1>
              <span className="text-center text-gray-800 mb-5">
                Don't have an account yet?{" "}
                <span
                  className="cursor-pointer underline text-sky-600"
                  onClick={() => handleSignInClick()}
                >
                  {" "}
                  Sign Up
                </span>
              </span>

              <div className="text-left">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="Enter your email address"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && (
                  <span className="text-red-500 font-semibold">
                    {errors.email}
                  </span>
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
                  placeholder="Enter your password"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.password && (
                  <span className="text-red-500 font-semibold">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-center gap-5">
                <span className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-black mx-auto w-full text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800"
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
                  </button>
                </span>
                <div className="flex w-full my-1 justify-center items-center">
                  <hr className="border-gray-300 flex-grow" />
                  <span className="text-gray-400 mx-2">OR</span>
                  <hr className="border-gray-300 flex-grow" />
                </div>

                <GoogleOAuthProvider
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                >
                  <div className="w-full flex justify-center">
                    <div className="w-full">
                      <GoogleLogin
                        onSuccess={responseLoginGoogle}
                        onError={() => console.log("failed to login")}
                      />
                    </div>
                  </div>
                </GoogleOAuthProvider>
                <span className="text-sm text-center">
                  Are you a hotel partner?{" "}
                  <Link
                    className="underline text-sky-600"
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

  const renderSignUpModal = () => {
    const { state, data } = signupModal;

    return (
      <Formik
        initialValues={data}
        validationSchema={registerSchema}
        onSubmit={async (values: signup) => {
          const response = await fetch(`${API_BASE_URL}/api/users/register`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
          const responseBody = await response.json();
          localStorage.setItem("auth_token", JSON.stringify(responseBody.user));
          showToast({ message: "Registered Successful!", type: "SUCCESS" });
          await queryClient.invalidateQueries("validateToken");
          setSignupModal(initialSignupModalState);
          if (!response.ok) {
            // throw new Error(responseBody.message);
            showToast({
              message: "Failed to create account!",
              type: "ERROR",
            });
          }
        }}
      >
        {({
          handleSubmit,
          values,
          isSubmitting,
          errors,
          touched,
          handleBlur,
          handleChange,
        }) => (
          <Modal
            title=""
            open={state}
            setOpen={() => {
              setSignupModal(initialSignupModalState);
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <h1 className="text-center text-3xl font-light text-gray-800">
                Create DayBreak Account
              </h1>
              <span className="text-center text-gray-800 mb-5">
                Already have an account?
                <span
                  className="cursor-pointer underline text-sky-600"
                  onClick={() => handleLoginSpanClick()}
                >
                  {" "}
                  Login
                </span>
              </span>

              <div className="text-left">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  First Name
                </label>
                <input
                  type="firstName"
                  name="firstName"
                  value={values.firstName}
                  placeholder="Enter First Name"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.firstName && (
                  <span className="text-red-500 font-semibold">
                    {errors.firstName}
                  </span>
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
                  placeholder="Enter your Last Name"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
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
                  placeholder="Enter your email address"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && (
                  <span className="text-red-500 font-semibold">
                    {errors.email}
                  </span>
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
                  placeholder="Enter your password"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.password && (
                  <span className="text-red-500 font-semibold">
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="text-left">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Confirm Password
                </label>
                <input
                  type="confirmpassword"
                  name="confirmpassword"
                  value={values.confirmpassword}
                  placeholder="Enter your password"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.confirmpassword && (
                  <span className="text-red-500 font-semibold">
                    {errors.confirmpassword}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-center gap-5 mt-4">
                <span className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-black mx-auto w-full text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </span>
                <div className="flex w-full my-1 justify-center items-center">
                  <hr className="border-gray-300 flex-grow" />
                  <span className="text-gray-400 mx-2">OR</span>
                  <hr className="border-gray-300 flex-grow" />
                </div>
                <GoogleOAuthProvider
                  clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                >
                  <div className="w-full flex justify-center">
                    <div className="w-full">
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

  return (
    <div className="">
      {renderLoginModal()}
      {renderSignUpModal()}
      {location.pathname === "/" ? (
        <div className="relative w-full h-screen">
          <video
            src={videoBg}
            playsInline
            autoPlay
            loop
            muted
            className="absolute inset-0 w-full h-full object-cover"
          ></video>

          {/* ---------- NavBar Starts ---------- */}
          <div className="w-full absolute top-8 flex items-center justify-between z-10 px-4 md:px-[10rem] bg-transparent">
            <span className="text-2xl md:text-3xl text-white font-bold tracking-tight">
              <Link to="/">DayBreak</Link>
            </span>
            <span className="flex space-x-2">
              {userLogined !== null ? (
                <>
                  {userLogined?.role === "customer" ? (
                    <Link
                      className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
                      to="/my-bookings"
                    >
                      My Bookings
                    </Link>
                  ) : (
                    <Link
                      className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
                      to="/my-hotels"
                    >
                      My Hotels
                    </Link>
                  )}
                  <SignOutButton classNames="text-white" />
                </>
              ) : (
                <button
                  className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
                  onClick={handleLoginClick}
                >
                  Login{" "}
                  {arrowDirection === "down" ? (
                    <IoIosArrowDown className="ml-3 text-xl" />
                  ) : (
                    <IoIosArrowUp className="ml-3 text-xl" />
                  )}
                </button>
              )}
              {userLogined?.role === "customer" && (
                <Link
                  className="flex bg-transparent items-center text-white px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
                  to="/"
                >
                  <IoCartOutline className="text-2xl" />
                </Link>
              )}
            </span>

            {/* Dropdown for Login button */}
            {showDropdown && (
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

                <button
                  type="button"
                  className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/partner/sign-in");
                  }}
                >
                  Hotel Login
                </button>

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
          {/* ---------- NavBar Ends ---------- */}
        </div>
      ) : (
        <div className="top-8 flex items-center justify-between px-2 w-full md:px-10 py-4 shadow-md">
          <span className="text-2xl md:text-3xl text-black font-bold tracking-tight">
            <Link to="/">DayBreak</Link>
          </span>
          <span className="flex space-x-2">
            {userLogined !== null ? (
              <>
                {userLogined?.role === "customer" ? (
                  <Link
                    className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
                    to="/my-bookings"
                  >
                    My Bookings
                  </Link>
                ) : (
                  <Link
                    className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
                    to="/my-hotels"
                  >
                    My Hotels
                  </Link>
                )}
                <SignOutButton classNames="text-black border-black px-3 py-1 md:px-5 md:py-2" />
              </>
            ) : (
              <button
                className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
                onClick={handleLoginClick}
              >
                Login{" "}
                {arrowDirection === "down" ? (
                  <IoIosArrowDown className="ml-3 text-xl" />
                ) : (
                  <IoIosArrowUp className="ml-3 text-xl" />
                )}
              </button>
            )}
            {userLogined?.role === "customer" && (
              <Link
                className="flex bg-transparent items-center text-black px-3 py-1 md:px-5 md:py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
                to="/"
              >
                <IoCartOutline className="text-2xl" />
              </Link>
            )}
          </span>

          {/* Dropdown for Login button */}
          {showDropdown && (
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

              <button
                type="button"
                className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                onClick={() => {
                  setShowDropdown(false);
                  navigate("/partner/sign-in");
                }}
              >
                Hotel Login
              </button>

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
      )}
    </div>
  );
};

export default Header;
