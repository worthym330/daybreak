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
import loginImage from "../assets/images/pexels-gapeppy1-2373201.jpg";
import Button from "../components/Button";

interface login {
  email: string;
  password: string;
  loginThrough: string;
}

interface CustomJwtPayload extends JwtPayload {
  email?: string;
  name?: string;
}

interface signup {
  firstName: string;
  lastName: string;
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

const Login = ({ Login }: any) => {
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
        Cookies.set("authentication", JSON.stringify(body.user), {
          expires: 1,
        });
        navigate(-1)
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
        Cookies.set("authentication", JSON.stringify(body.user), {
          expires: 1,
        });
        navigate(-1)
      } else {
        showToast({ message: "Failed to register!", type: "ERROR" });
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

  return Login ? (
    <div className="flex min-h-screen flex-row">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 w-full md:w-1/2">
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
                  navigate(-1)
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
                  />
                  {touched.password && (
                    <span className="text-red-500 font-semibold">
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-5">
                  <span className="flex items-center justify-between">
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </span>
                  <span className="text-sm text-center flex justify-end gap-2">
                    <span>Don't have an account yet? </span>
                    <Link
                      className="underline font-bold text-goldColor "
                      to="/register"
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
      <div className="relative hidden flex-1 md:block md:w-1/2">
        <img
          className="absolute h-full w-full rounded-md object-cover object-center"
          src={loginImage}
          alt="Background"
        />
      </div>
    </div>
  ) : (
    <div className="flex min-h-screen flex-row-reverse">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 w-full md:w-1/2">
        <h2 className="text-3xl font-bold">Register</h2>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              confirmpassword: "",
              role: "customer",
            }}
            validationSchema={registerSchema}
            onSubmit={async (values: signup) => {
              try {
                const response = await fetch(
                  `${API_BASE_URL}/api/users/register`,
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                  }
                );
                const responseBody = await response.json();
                if (response.ok) {
                  Cookies.set(
                    "authentication",
                    JSON.stringify(responseBody.user),
                    {
                      expires: 1,
                    }
                  );
                  navigate(-1)
                  showToast({
                    message: "Registered Successful!",
                    type: "SUCCESS",
                  });
                  await queryClient.invalidateQueries("validateToken");
                } else {
                  showToast({
                    message: responseBody.message || "An error occurred",
                    type: "ERROR",
                  });
                }
              } catch (error: any) {
                console.log(error);
                showToast({
                  message: error.message || "An error occurred",
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
              handleChange,
            }) => (
              <form onSubmit={handleSubmit} noValidate>
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
                    <span className="text-red-500">
                      {errors.confirmpassword}
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-center gap-5 mt-5">
                  <span className="flex items-center justify-between">
                    <Button
                      type="submit"
                      className="bg-black mx-auto w-full text-white px-4 py-3 rounded-xl font-bold hover:bg-btnColor"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                  </span>
                  <span className="text-end text-gray-800">
                    Already have an account?
                    <Link
                      className="cursor-pointer underline text-goldColor"
                      to="/login"
                    >
                      {" "}
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
              </form>
            )}
          </Formik>
        </div>
      </div>
      <div className="relative hidden flex-1 md:block md:w-1/2">
        <img
          className="absolute h-full w-full rounded-md object-cover object-center"
          src={loginImage}
          alt="Background"
        />
      </div>
    </div>
  );
};

export default Login;
