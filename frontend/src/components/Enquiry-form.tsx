import { memo } from "react";
import Modal from "./modal";
import * as Yup from "yup";
import { Formik } from "formik";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const MemoizedModal = memo(Modal);

export const EnquiryForm = ({ modal, setModal, hotelName }: any) => {
  const { state, data } = modal;

  // Validation schema with additional fields
  const enquiryFormSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Contact number is required"),
    bookingDate: Yup.date().required("Booking date is required").nullable(),
  });

  return (
    <Formik
      initialValues={{
        name: data?.name || "",
        phone: data?.phone || "",
        hotelName: data?.hotelName || hotelName,
        bookingDate: data?.bookingDate || null,
      }}
      validationSchema={enquiryFormSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          setSubmitting(true);
          values.hotelName = hotelName
          const response = await fetch(`${API_BASE_URL}/api/contact`, {
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
            toast.success("Thank you! You will be contacted soon.");
            resetForm();
          }
          setModal((prev: any) => ({ ...prev, state: false }));
        } catch (error) {
          console.error("Error during enquiry submission:", error);
        } finally {
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
        setFieldValue,
        resetForm,
      }) => (
        <MemoizedModal
          title="Enquiry Form"
          open={state}
          setOpen={() => {
            setModal((prev: any) => ({ ...prev, state: false }));
            resetForm();
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="text-left mb-2">
              <label className="text-gray-700 text-sm font-bold">Name</label>
              <input
                type="text"
                name="name"
                value={values.name}
                placeholder="Your Name"
                className="border rounded w-full px-2 py-3 font-normal mt-1"
                onChange={handleChange}
              />
              {touched.name && errors.name && (
                <span className="text-red-500 font-normal">
                  {errors.name as string}
                </span>
              )}
            </div>

            <div className="text-left mb-2">
              <label className="text-gray-700 text-sm font-bold">
                Contact Number
              </label>
              <input
                type="text"
                name="phone"
                value={values.phone}
                placeholder="Contact Number"
                className="border rounded w-full px-2 py-3 font-normal mt-1"
                onChange={handleChange}
              />
              {touched.phone && errors.phone && (
                <span className="text-red-500 font-normal">
                  {errors.phone as string}
                </span>
              )}
            </div>

            <div className="text-left mb-2">
              <label className="text-gray-700 text-sm font-bold">
                Booking Date
              </label>
              <DatePicker
                selected={values.bookingDate}
                onChange={(date) => setFieldValue("bookingDate", date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="Select booking date"
                className="border rounded w-full px-2 py-3 font-normal mt-1"
              />
              {touched.bookingDate && errors.bookingDate && (
                <span className="text-red-500 font-normal">
                  {errors.bookingDate as string}
                </span>
              )}
            </div>

            <div className="flex flex-col justify-center gap-5">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Submit
              </Button>
            </div>
          </form>
        </MemoizedModal>
      )}
    </Formik>
  );
};
