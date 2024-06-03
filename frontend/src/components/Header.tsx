import React, { useState } from "react";
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
import { jwtDecode } from "jwt-decode";
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
  },
};

const initialSignupModalState = {
  type: "add",
  state: false,
  index: null,
  id: "",
  data: {
    email: "",
    password: "",
    confirmpassword: "",
    role: "customer",
  },
};

interface login {
  email: string;
  password: string;
}

interface signup {
  email: string;
  password: string;
  confirmpassword: string;
  role: string;
}

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
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

  const responseGoogle = async (response: any) => {
    const token = response.credential;
    console.log(jwtDecode(token));
    const user = jwtDecode(token);
    try {
      // Send the token to your backend
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: user }),
      });
      console.log("Backend response:", res);
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
                <span className="w-full">
                  <GoogleOAuthProvider
                    clientId={
                      "445301932465-dpr3akkbni8aj6b8jm87tpnutiamhull.apps.googleusercontent.com"
                    }
                  >
                    <div className="w-full flex justify-center">
                      <div className="w-full">
                        <GoogleLogin
                          onSuccess={responseGoogle}
                          onFailure={responseGoogle}
                          cookiePolicy={"single_host_origin"}
                          prompt="consent"
                          // useOneTap
                        />
                      </div>
                    </div>
                  </GoogleOAuthProvider>
                </span>
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
          showToast({ message: "Registered Successful!", type: "SUCCESS" });
          await queryClient.invalidateQueries("validateToken");
          setSignupModal(initialSignupModalState);
          if (!response.ok) {
            // throw new Error(responseBody.message);
            showToast({
              message: "Failed to create account!",
              type: "SUCCESS",
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

              <div className="flex flex-col justify-center gap-5">
                <span className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-black mx-auto w-full text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </span>
                {/* <GoogleOAuthProvider clientId={import.meta.env.CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={(response:any) => {
                      console.log(response);
                    }}
                    onFailure={(error:any) => {
                      console.log(error);
                    }}
                  />
                </GoogleOAuthProvider> */}
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
        <div className="relative">
          <video
            src={videoBg}
            playsInline
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          ></video>

          {/* ---------- NavBar Starts ---------- */}
          <div className="w-screen absolute top-8 flex items-center justify-between z-10 px-[10rem] bg-transparent">
            <span className="text-3xl text-white font-bold tracking-tight">
              <Link to="/">DayBreak</Link>
            </span>
            <span className="flex space-x-2">
              {userLogined !== null ? (
                <>
                  {userLogined?.role === "customer" ? (
                    <Link
                      className="flex bg-transparent items-center text-white px-5 py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
                      to="/my-bookings"
                    >
                      My Bookings
                    </Link>
                  ) : (
                    <Link
                      className="flex bg-transparent items-center text-white px-5 py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
                      to="/my-hotels"
                    >
                      My Hotels
                    </Link>
                  )}
                  <SignOutButton classNames="text-white" />
                </>
              ) : (
                <button
                  className="flex bg-transparent items-center text-white px-5 py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
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
                  className="flex bg-transparent items-center text-white px-5 py-2 rounded-full font-bold border-2 hover:bg-gray-100 hover:text-black"
                  to="/"
                >
                  <IoCartOutline className="text-2xl" />
                </Link>
              )}
            </span>

            {/* Dropdown for Login button */}
            {showDropdown && (
              <div className="absolute bg-white text-rp-primary-black right-16 top-20 -mt-1 rounded-xl w-72 z-300 flex flex-col items-start shadow-login-card d:right-28 d:top-24">
                <button
                  type="button"
                  className="pl-5 pb-4 pt-4 cursor-pointer z-10 w-full text-left align-middle rounded-t-xl hover:bg-rp-light-gray-4"
                  onClick={() => setModal((prev) => ({ ...prev, state: true }))}
                >
                  Login
                </button>

                <button
                  type="button"
                  className="pl-5 pb-3 cursor-pointer z-10 w-full text-left align-middle pt-2 border-b border-rp-gray-divider hover:bg-rp-light-gray-4"
                  onClick={() =>
                    setSignupModal((prev) => ({ ...prev, state: true }))
                  }
                >
                  Sign Up
                </button>

                <button
                  type="button"
                  className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                  onClick={() => navigate("/partner/sign-in")}
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
        <div className="top-4 flex items-center justify-between px-2 py-4 shadow-md ">
          <span className="text-3xl text-black font-bold tracking-tight">
            <Link to="/">DayBreak</Link>
          </span>
          <span className="flex space-x-2">
            {userLogined !== null ? (
              <>
                {userLogined?.role === "customer" ? (
                  <Link
                    className="flex bg-transparent items-center text-black px-5 py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
                    to="/my-bookings"
                  >
                    My Bookings
                  </Link>
                ) : (
                  <Link
                    className="flex bg-transparent items-center text-black px-5 py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
                    to="/my-hotels"
                  >
                    My Hotels
                  </Link>
                )}
                <SignOutButton classNames="text-black border-black" />
              </>
            ) : (
              <button
                className="flex bg-transparent items-center text-black px-5 py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
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
                className="flex bg-transparent items-center text-black px-5 py-2 rounded-full font-bold border-2 border-black hover:bg-gray-100 hover:text-black"
                to="/"
              >
                <IoCartOutline className="text-2xl" />
              </Link>
            )}
          </span>

          {/* Dropdown for Login button */}
          {showDropdown && (
            <div className="absolute bg-gray-100 text-rp-primary-black right-16 top-20 -mt-1 rounded-xl w-72 z-300 flex flex-col items-start shadow-login-card md:right-4 md:top-20 shadow-md">
              <button
                type="button"
                className="pl-5 pb-4 pt-4 cursor-pointer z-10 w-full text-left align-middle rounded-t-xl hover:bg-rp-light-gray-4"
                onClick={() => setModal((prev) => ({ ...prev, state: true }))}
              >
                Login
              </button>

              <button
                type="button"
                className="pl-5 pb-3 cursor-pointer z-10 w-full text-left align-middle pt-2 border-b border-rp-gray-divider hover:bg-rp-light-gray-4"
                onClick={() =>
                  setSignupModal((prev) => ({ ...prev, state: true }))
                }
              >
                Sign Up
              </button>

              <button
                type="button"
                className="pl-5 pb-4 cursor-pointer z-10 w-full text-left align-middle pt-3 hover:bg-rp-light-gray-4"
                onClick={() => navigate("/partner/sign-in")}
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
