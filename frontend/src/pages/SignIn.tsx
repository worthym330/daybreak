import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface login {
  email: string;
  password: string;
  loginThrough: string;
}

export type SignInFormData ={
  email: string;
  password: string;
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

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();

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
        showToast({ message: "Sign in Successful!", type: "SUCCESS" });
        Cookies.set("authentication", JSON.stringify(body.user), { expires: 1 })
      } else {
        showToast({ message: "Failed to Login!", type: "ERROR" });
      }
    } catch (error) {
      console.error("Error authenticating with backend:", error);
    }
  };

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  return (
    <div className="flex min-h-screen flex-row">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Formik
            initialValues={{
              email: "",
              password: "",
              loginThrough: "password",
            }}
            validationSchema={loginSchema}
            onSubmit={(values: login, { setSubmitting }) => {
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
            {({
              isSubmitting,
              handleChange,
              handleBlur,
              touched,
              errors,
              values,
            }) => (
              <Form className="flex flex-col gap-5">
                <h2 className="text-3xl font-bold">Login</h2>
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
                  <span className="text-sm text-center flex justify-end gap-2">
                    <span>Don't have an account yet? </span>
                    <Link
                      className="underline text-sky-600"
                      to="/partner/register"
                    >
                      Register
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
                          onSuccess={responseLoginGoogle}
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

export default SignIn;
