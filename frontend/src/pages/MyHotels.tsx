import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { useState } from "react";
import { Formik } from "formik";
import HalfGeneralSlideover from "../components/slide-over";

const initialModalState={
  type: "",
  state: false,
  index: null,
  id: "",
  data: {
    firstName:"",
    lastName:"",
    email: "",
    password: "",
    confirmpassword: "",
    role: "customer",
  },
}
const MyHotels = () => {
  const [modal, setModal]= useState(initialModalState)
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    }
  );

  const renderModal = () => {
    const { data, id, state } = modal

    return(
      <Formik
        initialValues={data}
        validationSchema={null}
        onSubmit={async (values: any) => {
          console.log(values,id)
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
          <HalfGeneralSlideover
            title={id?'Edit Hotel':'Add Hotel'}
            open={state}
            setOpen={() => {
              setModal((prev) => ({ ...prev, state: false }));
            }}
          >
            <form onSubmit={handleSubmit} noValidate>

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
                {/* {touched.email && (
                  <span className="text-red-500 font-semibold">
                    {errors.email}
                  </span>
                )} */}
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
                {/* {touched.password && (
                  <span className="text-red-500 font-semibold">
                    {errors.password}
                  </span>
                )} */}
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
              </div>
            </form>
          </HalfGeneralSlideover>
        )}
      </Formik>
    )
  }


  if (!hotelData) {
    return <span>No Hotels found</span>;
  }

  return (
    <div className="space-y-5">
      {renderModal()}
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Hotel
        </Link>
        <div
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
          onClick={() => setModal((prev) => ({ ...prev, state: true }))}
        >
          Add Hotel
        </div>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />£{hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;