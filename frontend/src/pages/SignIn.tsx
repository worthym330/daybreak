import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const responseGoogle = async (response:any) => {
    console.log(response);
    const token = response.credential;

    try {
      // Send the token to your backend
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: token })
      });

      // Handle response from the backend
      console.log('Backend response:', res);
      // You can store the user information, JWT token, etc. as needed
    } catch (error) {
      console.error('Error authenticating with backend:', error);
    }
    // Handle the response and send it to your backend for authentication
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

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="flex flex-col gap-5 bg-gray-100 rounded-xl p-10 shadow-lg"
        onSubmit={onSubmit}
      >
        <h1 className="text-center text-3xl font-light text-gray-800">
          Welcome to <span className="text-gray-800 font-bold">DayBreak</span>
        </h1>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-5">
          Sign In
        </h2>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="email"
            placeholder="Enter your email address"
            className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
            {...register("email", { required: "*This field is required" })}
          ></input>
          {errors.email && (
            <span className="text-red-500 font-semibold">
              {errors.email.message}
            </span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Password
          <input
            type="password"
            placeholder="Enter your password"
            className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
            {...register("password", {
              required: "*This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          ></input>
          {errors.password && (
            <span className="text-red-500 font-semibold">
              {errors.password.message}
            </span>
          )}
        </label>
        <div className="flex flex-col justify-center gap-5">
          <span className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-black mx-auto text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800"
            >
              Login
            </button>
          </span>
          <span className="text-sm text-center">
            Not Registered?{" "}
            <Link className="underline text-sky-600" to="/register">
              Create an account here
            </Link>
          </span>
        </div>

        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={()=>{console.log("Google",errors)}}
      />
    </GoogleOAuthProvider>
      </form>
    </div>
  );
};

export default SignIn;
