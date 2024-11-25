import React, { useState } from "react";
import Modal from "./modal";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FaStar } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const MemoizedModal = React.memo(Modal);

export const initialReviewState = {
  type: "add",
  state: false,
  index: null,
  loading: false,
  id: "",
  data: {
    userId: "",
    comment: "",
    rating: 0,
  },
};

// Custom StarRating Component
const StarRating = ({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (value: number) => void;
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex justify-center gap-1 my-2">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            size={28}
            className="cursor-pointer transition-transform transform hover:scale-110"
            color={starValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
          />
        );
      })}
    </div>
  );
};

export const RenderReviewModal = ({
  modal,
  setModal,
  hotelId,
  userId,
  callback,
}: any) => {
  const { state, data } = modal;
  const validationSchema = Yup.object().shape({
    comment: Yup.string()
      .required("Comment is required")
      .max(500, "Comment cannot exceed 500 characters"),
    rating: Yup.number()
      .required("Rating is required")
      .min(1, "Please select at least 1 star"),
  });

  return (
    <Formik
      initialValues={data}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm }) => {
        values.userId = userId;
        setModal((prev: any) => ({ ...prev, state: false, loading: true }));
        await fetch(`${API_BASE_URL}/api/reviews/${hotelId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
          .then(() => {
            resetForm();
            setModal(initialReviewState);
            callback();
          })
          .catch((error) => {
            setModal(initialReviewState);
            toast.error(error.message || "An unexpected error occurred");
          });
      }}
    >
      {({
        handleSubmit,
        values,
        setFieldValue,
        isSubmitting,
        errors,
        touched,
        handleChange,
        resetForm,
      }) => (
        <MemoizedModal
          title="Add Review"
          open={state}
          setOpen={() => {
            setModal(initialReviewState);
            resetForm();
          }}
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-6 bg-white p-6 rounded-lg"
          >
            {/* Rating */}
            <div className="flex justify-between items-center">
              <label
                htmlFor="rating"
                className="block text-lg font-medium text-gray-700 text-left"
              >
                Rating
              </label>
              <StarRating
                rating={values.rating}
                onChange={(value) => setFieldValue("rating", value)}
              />
              {errors.rating && touched.rating && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.rating as string}
                </div>
              )}
            </div>

            {/* Comment */}
            <div className="flex flex-col">
              <label
                htmlFor="comment"
                className="block text-lg font-medium text-gray-700  text-left"
              >
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                value={values.comment}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded-md shadow-sm ${
                  errors.comment && touched.comment
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
                rows={4}
                placeholder="Write your review..."
              />
              {errors.comment && touched.comment && (
                <div className="text-sm text-red-600 mt-1">
                  {errors.comment as string}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setModal(initialReviewState);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-lg text-white ${
                  isSubmitting
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </MemoizedModal>
      )}
    </Formik>
  );
};
