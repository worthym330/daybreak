import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Button from "./Button";
import { Formik } from "formik";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { loginSuccess } from "../store/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { addFavorite, removeFavorite } from "../store/favSlice";
import { FavouriteList } from "./SearchResultsCard";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import React, { useState } from "react";
import * as Yup from "yup";
import Modal from "./modal";
import { useQueryClient } from "react-query";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";


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
  
  export const loginSchema =Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
    loginThrough: Yup.string().required('Login Through is required'),
  });
  
  const registerSchema =Yup.object().shape({
    firstName: Yup.string().required('First Name is required!'),
    lastName: Yup.string().required('Last Name is required!'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[\W_]/, 'Password must contain at least one special character'),
    confirmpassword: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    role: Yup.string(),
  });
  
  const MemoizedModal = React.memo(Modal);
  
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
          <MemoizedModal
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
          </MemoizedModal>
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
    isFavourite
  }: any) => {
    const { state, data } = modal;
    function handleSignInClick() {
      setModal((prev: any) => ({ ...prev, state: false }));
      setSignupModal((prev: any) => ({ ...prev, state: true }));
    }
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const hotel = useSelector((state: RootState) => state.fav.hotel)
    // console.log(hotel)
  
    const favorites = useSelector((state: RootState) => state.fav.favorites);
    const liked = favorites.some((fav: any) => fav._id === hotel._id);
    const responseLoginGoogle = async (response: any) => {
      const token = response.credential;
      const user = jwtDecode<CustomJwtPayload>(token);
      let payload = {
        email: user.email,
        // loginThrough: "google",
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
          if(isFavourite){
            const user: FavouriteList = {
              userId: body.user.id,
              firstName: body.user.name.split(" ")[0],
              lastName: body.user.name.split(" ").pop(),
              email: body.user.email,
            };
      
            try {
              const res = await fetch(
                `${API_BASE_URL}/api/hotels/${hotel._id}/favourite`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(user),
                }
              );
      
              if (res.ok) {
                if (liked) {
                  dispatch(removeFavorite(hotel._id));
                } else {
                  dispatch(addFavorite(hotel));
                }
                // toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
              } else {
                console.log("Failed to toggle favorite");
              }
            } catch (error) {
              console.error("An error occurred while toggling favorite");
            }
          }
          Cookies.set("authentication", JSON.stringify(body.user), {
            expires: 1,
          });
          const user = body.user;
          const token = body.user.token;
          dispatch(loginSuccess({ user, token }));
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
        onSubmit={async (values: login,{resetForm}) => {
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
              resetForm()
              if (isHeader) {
                setShowDropdown(false);
              }
              if (isBooking) {
                paymentIntent();
              }
              if(isFavourite){
                const user: FavouriteList = {
                  userId: body.user.id,
                  firstName: body.user.name.split(" ")[0],
                  lastName: body.user.name.split(" ").pop(),
                  email: body.user.email,
                };
          
                try {
                  const res = await fetch(
                    `${API_BASE_URL}/api/hotels/${hotel._id}/favourite`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(user),
                    }
                  );
          
                  if (res.ok) {
                    if (liked) {
                      dispatch(removeFavorite(hotel._id));
                    } else {
                      dispatch(addFavorite(hotel));
                    }
                    // toast.success(liked ? 'Removed from favorites' : 'Added to favorites');
                  } else {
                    console.log("Failed to toggle favorite");
                  }
                } catch (error) {
                  console.error("An error occurred while toggling favorite");
                }
              }
              Cookies.set("authentication", JSON.stringify(body.user), {
                expires: 1,
              });
              const user = body.user;
              const token = body.user.token;
              dispatch(loginSuccess({ user, token }));
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
          resetForm,
        }) => (
          <MemoizedModal
            title=""
            open={state}
            setOpen={() => {
              setModal((prev: any) => ({ ...prev, state: false }));
              resetForm()
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
                  <span className="text-red-500 font-normal">{errors.email as string}</span>
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
                  <span className="text-red-500">{errors.password as string}</span>
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
                <span
                  className="text-sm text-center"
                  onClick={() => {
                    setModal((prev: any) => ({ ...prev, state: false }));
                  }}
                >
                  Are you a hotel partner?{" "}
                  <a
                    className="underline text-goldColor"
                    href={import.meta.env.VITE_ADMIN_REDIRECT}
                    target="_blank"
                  >
                    Log in here
                  </a>
                </span>
              </div>
            </form>
          </MemoizedModal>
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
    const dispatch = useDispatch();
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
          const user = body.user;
          const token = body.user.token;
          dispatch(loginSuccess({ user, token }));
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
              const user = responseBody.user;
              const token = responseBody.user.token;
              dispatch(loginSuccess({ user, token }));
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
          <MemoizedModal
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
          </MemoizedModal>
        )}
      </Formik>
    );
  };
  