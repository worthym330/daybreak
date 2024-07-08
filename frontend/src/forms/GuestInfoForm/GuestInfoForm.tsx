import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
// import { useAppContext } from "../../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Formik } from "formik";
import Modal from "../../components/modal";
import { useState } from "react";
import { CustomJwtPayload, login, loginSchema } from "../../components/Header";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Button from "../../components/Button";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

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

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
  const search = useSearchContext();
  const navigate = useNavigate();
  // const location = useLocation();
  // const { showToast } = useAppContext();

  const auth_token = Cookies.get("authentication");
  const isLoggedIn = auth_token ? JSON.parse(auth_token) : null;
  const [modal, setModal] = useState(initialModalState);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      // adultCount: search.adultCount,
      // childCount: search.childCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // const onSignInClick = (data: GuestInfoFormData) => {
  //   search.saveSearchValues(
  //     "",
  //     data.checkIn,
  //     data.checkOut,
  //     // data.adultCount,
  //     // data.childCount
  //   );
  //   navigate("/sign-in", { state: { from: location } });
  // };

  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut
      // data.adultCount,
      // data.childCount
    );
    navigate(`/hotel/${hotelId}/booking`);
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
        // showToast({ message: "Sign in Successful!", type: "SUCCESS" });
        toast.success("Sign in Successful!")
        Cookies.set("authentication", JSON.stringify(body.user), { expires: 1 });
      } else {
        // showToast({ message: "Failed to Login!", type: "ERROR" });
        toast.error("Failed to Login!")
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
    }
  };

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
          if (!response.ok) {
            // throw new Error(body.message);
            toast.error(body.message)
          }else{
            // showToast({ message: "Sign in Successful!", type: "SUCCESS" });
            toast.success("Sign in Successful!")
            Cookies.set("authentication", JSON.stringify(body.user), { expires: 1 });
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
                <span className="text-gray-800 font-bold">DayBreakPass</span>
              </h1>
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

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      {renderLoginModal()}
      <h3 className="text-md font-bold">£{pricePerNight}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              // endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Adults:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label className="items-center flex">
              Children:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <Button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl" >
              Book Now
            </Button>
          ) : (
            <Button
              className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl"
              type="button"
              onClick={() => setModal((prev) => ({ ...prev, state: true }))}
            >
              Login
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
