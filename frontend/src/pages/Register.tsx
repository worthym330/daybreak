import { Formik, Form    } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

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
    firstName: Yup.string().required('This field is required'),
    lastName: Yup.string().required('This field is required'),
    email: Yup.string().email('Invalid email address').required('This field is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('This field is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Your passwords do not match')
      .required('This field is required'),
  });

  return (
    <div className="flex min-h-screen flex-row-reverse">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Formik
            initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
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
            {({ isSubmitting,handleChange,handleBlur,touched, errors }) => (
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
                      <p className="text-red-700 error_msg">
                        {errors.email}
                      </p>
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
                      <p className="text-red-700 error_msg">
                        {errors.password}
                      </p>
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
                <span>
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-5 font-semibold hover:bg-gray-700 text-xl rounded-md"
                    disabled={isSubmitting}
                  >
                    Create Account
                  </button>
                </span>
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
