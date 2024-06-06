import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface CustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
}

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ message: "Registration Success!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("This field is required"),
    lastName: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("This field is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("This field is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Your passwords do not match")
      .required("This field is required"),
  });

  const responseSignUpGoogle = async (response: any) => {
    const token = response.credential;
    const user = jwtDecode<CustomJwtPayload>(token);
    let payload = {
      email: user.email,
      firstName: user.name?.split(" ")[0],
      lastName: user.name?.split(" ")[user.name?.split(" ").length - 1],
      loginThrough: "google",
      googleToken: token,
      role: "partner",
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
        showToast({ message: "Registered Successful!", type: "SUCCESS" });
        localStorage.setItem("auth_token", JSON.stringify(body.user));
      } else {
        showToast({ message: "Failed to register!", type: "ERROR" });
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              mutation.mutate(values, {
                onSuccess: () => {
                  setSubmitting(false);
                },
                onError: () => {
                  setSubmitting(false);
                },
              });
            }}
          >
            {({ isSubmitting, handleChange, handleBlur, touched, errors }) => (
              <Form className="flex flex-col gap-5">
                <h2 className="text-3xl font-bold">Create an Account</h2>
                <div className="flex flex-col gap-5">
                  <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input
                      className="border rounded w-full px-2 py-3 mt-3 font-normal"
                      name="firstName"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {touched.firstName && (
                      <p className="text-red-700 error_msg">
                        {errors.firstName}
                      </p>
                    )}
                  </label>
                  <label className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <div>
                      <input
                        className="border rounded w-full px-2 py-3 mt-2 font-normal"
                        name="lastName"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    {touched.lastName && (
                      <p className="text-red-700 error_msg">
                        {errors.lastName}
                      </p>
                    )}
                  </label>
                </div>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Email
                  <input
                    className="border rounded w-full px-2 py-3 mt-2 font-normal"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.email && (
                    <p className="text-red-700 error_msg">{errors.email}</p>
                  )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Password
                  <input
                    className="border rounded w-full px-2 py-3 mt-2 font-normal"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.password && (
                    <p className="text-red-700 error_msg">{errors.password}</p>
                  )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Confirm Password
                  <input
                    className="border rounded w-full px-2 py-3 mt-2 font-normal"
                    name="confirmPassword"
                    type="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.confirmPassword && (
                    <p className="text-red-700 error_msg">
                      {errors.confirmPassword}
                    </p>
                  )}
                </label>
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
                  <span className="text-sm text-center flex justify-end gap-2">
                    <span>Already have an account? </span>
                    <Link
                      className="underline text-sky-600"
                      to="/partner/sign-in"
                    >
                      Login
                    </Link>
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
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block lg:w-1/2">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          alt="Background"
        />
      </div>
    </div>
  );
};

export default Register;
