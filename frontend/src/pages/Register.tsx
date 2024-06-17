import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { Link } from "react-router-dom";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import { jwtDecode, JwtPayload } from "jwt-decode";
// import Cookies from "js-cookie";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import HotelPartnerRegistration from '../assets/images/HotelPartnerRegistration.png'

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

// interface CustomJwtPayload extends JwtPayload {
//   email?: string;
//   name?: string;
// }

const Register = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required!"),
    hotelName: Yup.string().required("Hotel Name is required!"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Work Email is required!"),
    designation: Yup.string().required("Designation is required!"),
    contactNo:Yup.string().required("Contact Number is required!")
  });

  // const responseSignUpGoogle = async (response: any) => {
  //   const token = response.credential;
  //   const user = jwtDecode<CustomJwtPayload>(token);
  //   let payload = {
  //     email: user.email,
  //     firstName: user.name?.split(" ")[0],
  //     lastName: user.name?.split(" ")[user.name?.split(" ").length - 1],
  //     loginThrough: "google",
  //     googleToken: token,
  //     role: "partner",
  //   };
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/users/register`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });
  //     const body = await response.json();
  //     if (response.ok) {
  //       showToast({ message: "Registered Successful!", type: "SUCCESS" });
  //       Cookies.set("authentication", JSON.stringify(body.user), { expires: 1 })
  //     } else {
  //       showToast({ message: "Failed to register!", type: "ERROR" });
  //     }
  //   } catch (error) {
  //     console.error("Error authenticating with backend:", error);
  //   }
  // };

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 md:flex-none md:px-20 xl:px-24 w-full md:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Formik
            initialValues={{
              fullName: "",
              hotelName: "",
              email: "",
              role: "partner",
              designation:"",
              contactNo:""
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSubmitting(false);
                
                const response = await fetch(`${API_BASE_URL}/api/users/partner/register`, {
                  method: "POST",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                });
                
                const responseBody = await response.json();
                console.log("response data", responseBody);
            
                if (!response.ok) {
                  showToast({
                    message: "Failed to create account!",
                    type: "ERROR",
                  });
                } else {
                  showToast({ message: "Our Team will contact you in 3 working days!", type: "SUCCESS" });
                  await queryClient.invalidateQueries("validateToken");
                }
              } catch (error) {
                console.error("Error creating account:", error);
                showToast({
                  message: "An error occurred while creating the account!",
                  type: "ERROR",
                });
              } finally {
                setSubmitting(false);
              }
            }}
            
          >
            {({ isSubmitting, handleChange, handleBlur, touched, errors }) => (
              <Form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold">
                    Bring Daycation to your hotel
                  </h2>
                </div>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Full Name
                  <input
                    className="border rounded w-full px-2 py-3 mt-3 font-normal"
                    name="fullName"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                  />
                  {touched.fullName && (
                    <p className="text-red-700 error_msg">{errors.fullName}</p>
                  )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Work Email
                  <input
                    className="border rounded w-full px-2 py-3 mt-2 font-normal"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your work email"
                  />
                  {touched.email && (
                    <p className="text-red-700 error_msg">{errors.email}</p>
                  )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Contact Number
                  <input
                    className="border rounded w-full px-2 py-3 mt-2 font-normal"
                    name="contactNo"
                    type="contactNo"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your Contact Number"
                  />
                  {touched.contactNo && (
                    <p className="text-red-700 error_msg">{errors.contactNo}</p>
                  )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Hotel Name
                  <div>
                    <input
                      className="border rounded w-full px-2 py-3 mt-2 font-normal"
                      name="hotelName"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your Hotel Name"
                    />
                  </div>
                  {touched.hotelName && (
                    <p className="text-red-700 error_msg">{errors.hotelName}</p>
                  )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Role
                  <input
                    className="border rounded w-full px-2 py-3 mt-2 font-normal"
                    name="designation"
                    type="designation"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your role"
                  />
                  {touched.designation && (
                    <p className="text-red-700 error_msg">{errors.designation}</p>
                  )}
                </label>
                <div className="flex flex-col justify-center gap-5">
                  <span className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="bg-goldColor mx-auto w-full text-white px-4 py-3 rounded-xl font-bold hover:bg-white hover:text-goldColor border hover:border-goldColor "
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
                          <span>Registering in...</span>
                        </>
                      ) : (
                        "Sign up for Hotel Partner"
                      )}
                    </button>
                  </span>
                  <span className="flex gap-2 text-sm text-center justify-end">
                    <span>Your hotel is already using DayBreak? </span>
                    <Link
                      className="font-bold text-goldColor underline"
                      to="/partner/sign-in"
                    >
                      Login
                    </Link>
                  </span>
                  {/* <div className="flex w-full my-1 justify-center items-center">
                    <hr className="border-gray-300 flex-grow" />
                    <span className="text-gray-400 mx-2">OR</span>
                    <hr className="border-gray-300 flex-grow" />
                  </div> */}

                  {/* <GoogleOAuthProvider
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
                  </GoogleOAuthProvider> */}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 md:block md:w-1/2">
        <img
          className="absolute h-full w-full rounded-md object-fit object-center"
          src={HotelPartnerRegistration}
          alt="Background"
        />
      </div>
    </div>
  );
};

export default Register;
