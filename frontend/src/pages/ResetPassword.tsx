import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
import Button from "../components/Button";
import { toast } from "react-toastify";

interface resetPass {
  password: string;
  confirmPassword: string;
}

const resetPassValidation = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Required"),
});

const ResetPass = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  return (
    <div className="flex justify-center items-center h-screen">
      <Formik
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={resetPassValidation}
        onSubmit={async (values: resetPass, { setSubmitting, resetForm }) => {
          try {
            setSubmitting(true);
            const response = await fetch(
              `${API_BASE_URL}/api/auth/reset/${token}`,
              {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
              }
            );

            const body = await response.json();
            if (response.ok) {
              toast.success(body.message);
              setSubmitting(false);
              resetForm();
              navigate("/");
            } else {
              toast.error(body.message);
            }
          } catch (error: any) {
            console.error("Error during sign in:", error);
          }
        }}
      >
        {({
          isSubmitting,
          handleChange,
          touched,
          errors,
          values,
          handleSubmit,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-8 rounded shadow-md"
          >
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                onChange={handleChange}
                value={values.password}
                className={`w-full px-3 py-2 border ${
                  touched.password && errors.password
                    ? "border-red-500"
                    : "border-goldColor"
                } rounded focus:outline-none focus:ring focus:border-blue-300`}
              />
              {touched.password && errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 font-bold mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                onChange={handleChange}
                value={values.confirmPassword}
                className={`w-full px-3 py-2 border ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-red-500"
                    : "border-goldColor"
                } rounded focus:outline-none focus:ring focus:border-blue-300`}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Button type="submit" disable={isSubmitting}>
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPass;
