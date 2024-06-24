import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { useState } from "react";
import { Formik } from "formik";
import HalfGeneralSlideover from "../components/slide-over";
import { hotelFacilities, hotelTypes } from "../config/hotel-options-config";
import { FaCircleXmark } from "react-icons/fa6";
import { MdPhotoLibrary } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Button from "../components/Button";

const initialModalState = {
  type: "",
  state: false,
  index: null,
  id: "",
  data: {
    name: "",
    city: "",
    country: "",
    description: "",
    type: "",
    adultCount: "",
    childCount: "",
    facilities: "",
    hotelType: "",
    pricePerNight: "",
    starRating: "",
    imageUrls: "",
  },
};

const MyHotels = () => {
  const [modal, setModal] = useState(initialModalState);
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {},
    }
  );

  const renderModal = () => {
    const { data, id, state } = modal;

    return (
      <Formik
        initialValues={data}
        validationSchema={null}
        onSubmit={async (values: any) => {
          console.log(values, id);
        }}
      >
        {({
          handleSubmit,
          values,
          isSubmitting,
          // errors,
          // touched,
          setValues,
          handleBlur,
          handleChange,
        }) => (
          <HalfGeneralSlideover
            title={id ? "Edit Hotel" : "Add Hotel"}
            open={state}
            setOpen={() => {
              setModal((prev) => ({ ...prev, state: false }));
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="mt-4 text-left grid md:grid-cols-2 grid-cols-1 gap-4 text-darkGold">
                <div className="text-left">
                  <label className="text-darkGold text-sm font-medium flex-1 ">
                    Hotel Name
                  </label>
                  <input
                    type="name"
                    name="name"
                    value={values.name}
                    placeholder="Enter hotel name"
                    className="border rounded-md w-full px-5 py-3 font-normal mt-2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {/* {touched.name && (
                    <span className="text-red-500 font-semibold">
                      {errors.name}
                    </span>
                  )} */}
                </div>

                <div className="text-left">
                  <label className="text-darkGold text-sm font-medium flex-1">
                    City
                  </label>
                  <input
                    type="city"
                    name="city"
                    value={values.city}
                    placeholder="Enter your city"
                    className="border rounded-md w-full px-5 py-3 font-normal mt-2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {/* {touched.city && (
                    <span className="text-red-500 font-semibold">
                      {errors.city}
                    </span>
                  )} */}
                </div>

                <div className="text-left col-span-1 md:col-span-2">
                  <label className="text-darkGold text-sm font-medium flex-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={values.description}
                    placeholder="Enter hotel description"
                    className="border rounded-md w-full px-5 py-3 font-normal mt-2 h-40 resize-none overflow-y-auto"
                    onChange={(e) => {
                      setValues({ ...values, description: e.target.value });
                    }}
                    onBlur={handleBlur}
                  />

                  {/* {touched.description" && (
                    <span className="text-red-500 font-semibold">
                      {errors.description"}
                    </span>
                  )} */}
                </div>

                <div className="text-left">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium leading-6 text-darkGold"
                  >
                    Price
                  </label>
                  <div className="relative rounded-md shadow-sm mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">₹</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      value={values.price}
                      className="border rounded-md w-full px-5 py-3 font-normal pl-7"
                      placeholder="0.00"
                      aria-describedby="price-currency"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span
                        className="text-darkGold sm:text-sm"
                        id="price-currency"
                      >
                        INR
                      </span>
                    </div>
                  </div>
                  {/* {touched.city && (
                    <span className="text-red-500 font-semibold">
                      {errors.city}
                    </span>
                  )} */}
                </div>
                <div className="text-left">
                  <label className="text-darkGold text-sm flex-1">Star</label>
                  <select
                    name="star"
                    value={values.star}
                    className="border rounded-md w-full px-5 py-3 font-normal mt-2 bg-white"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="" disabled>
                      Select star rating
                    </option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                  {/* {touched.star && (
                    <span className="text-red-500 font-semibold">
                      {errors.star}
                    </span>
                  )} */}
                </div>

                <div className="text-left col-span-1 md:col-span-2">
                  <label className="block font-medium text-sm mb-2">
                    Facilities
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {hotelFacilities.map((facility) => (
                      <label
                        key={facility}
                        className="inline-flex items-center gap-1 text-darkGold border border-goldColor rounded-md py-3 px-3"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox-round text-blue-600"
                          name="facilities"
                          value={facility}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.facilities.includes(facility)}
                        />
                        <span className="text-sm pl-1">{facility}</span>
                      </label>
                    ))}
                  </div>
                  {/* Optional: Display error message */}
                  {/* {touched.facilities && errors.facilities && (
    <span className="block text-sm text-red-500 mt-1">{errors.facilities}</span>
  )} */}
                </div>

                <div className="text-left col-span-1 md:col-span-2">
                  <label className="block font-medium text-sm mb-2">
                    Hotel Type
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {hotelTypes.map((hotel) => (
                      <label
                        key={hotel}
                        className="inline-flex items-center gap-1 text-darkGold border border-goldColor rounded-md py-3 px-3"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox-round text-blue-600"
                          name="hotelType"
                          value={hotel}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.hotelType.includes(hotel)}
                        />
                        {hotel}
                      </label>
                    ))}

                    {/* {touched.facilities && (
                      <span className="text-red-500 font-semibold">
                        {errors.facilities}
                      </span>
                    )} */}
                  </div>
                </div>

                <div className="text-left col-span-1 md:col-span-2">
                  <div className="w-full p-0 lg:p-6">
                    <h2 className="text-[0.9rem] md:text-[1.2rem] font-medium text-darkGold flex justify-center mt-2">
                      Upload your hotel images
                    </h2>
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e: any) => {
                        e.preventDefault();
                        const data = e.target.files;
                        const newData = Array.from(data);
                        const updatedFiles = [...newData];
                        setValues({
                          ...values,
                          imageUrls: updatedFiles,
                        });
                      }}
                      className="mt-8 flex justify-center rounded-lg border border-dashed border-goldColor px-6 py-10"
                    >
                      <div className="text-center">
                        <MdPhotoLibrary
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-primary">
                          <label
                            htmlFor="fileName"
                            className="relative flex cursor-pointer rounded-md bg-white font-semibold text-focus:ring-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-focus:ring-primary focus-within:ring-offset-2 hover:text-primary-300"
                          >
                            <span>Upload a file</span>
                            <input
                              id="fileName"
                              name="fileName"
                              type="file"
                              className="sr-only"
                              accept="application/pdf"
                              onChange={(e: any) => {
                                const data = e.target.files;
                                const newData = Array.from(data);
                                const updatedFiles = [...newData];
                                setValues({
                                  ...values,
                                  imageUrls: updatedFiles,
                                });
                              }}
                              multiple
                            />
                            <p className="pl-1">or drag and drop</p>
                          </label>
                        </div>
                        <p className="text-xs leading-5 flex w-full items-center justify-center gap-3 text-gray-600">
                          {values.imageUrls && values.imageUrls.length > 0 ? (
                            <p>
                              {values.imageUrls.map((s: any) => (
                                <span className="flex gap-2">
                                  {" "}
                                  <p>{s.name}</p>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setValues({
                                        ...values,
                                        imageUrls: values.files.filter(
                                          (e: any) => e !== s
                                        ),
                                      });
                                    }}
                                    className="cursor-pointer text-red-500 px-1 py-1 hover:bg-red-800 hover:rounded-md hover:text-white disabled:text-gray-700 disabled:hover:bg-gray-300 hover:border-slate-300 hover:border-solid"
                                  >
                                    <FaCircleXmark className="w-4" />
                                  </button>
                                </span>
                              ))}
                            </p>
                          ) : (
                            "Images"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-5 mt-4">
                <span className="flex items-center justify-between">
                  <Button
                    type="submit"
                    className="bg-black mx-auto w-full text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding in..." : "Add"}
                  </Button>
                </span>
              </div>
            </form>
          </HalfGeneralSlideover>
        )}
      </Formik>
    );
  };

  if (!hotelData) {
    return <span>No Hotels found</span>;
  }

  return (
    <div className="space-y-5 p-4 md:p-8">
      {renderModal()}
      <span className="flex justify-between items-center">
        <h1 className="text-2xl font-medium text-darkGold mb-4 md:mb-0">
          My Hotels
        </h1>
        <Button
          className="flex text-white text-xl p-2 bg-goldColor hover:bg-white hover:text-goldColor hover:border-2 hover:border-goldColor rounded-lg"
          onClick={() => setModal((prev) => ({ ...prev, state: true }))}
        >
          Add Hotel
        </Button>
      </span>
      <div className="grid grid-cols-1 gap-8 border border-goldColor rounded-lg p-4">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            data-testid="hotel-card"
            className="flex flex-col justify-between p-4 gap-5"
          >
            <h2 className="text-3xl font-bold text-goldColor font-LuzuryF1">
              {hotel.name}
            </h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 text-darkGold">
              <div className="border border-goldColor rounded-lg p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-goldColor rounded-lg p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-goldColor rounded-lg p-3 flex items-center">
                <BiMoney className="mr-1" />£{hotel.pricePerNight} per night
              </div>
              <div className="border border-goldColor rounded-lg p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-goldColor rounded-lg p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-end gap-3">
              <button className="flex items-center justify-center border-2 bg-black text-white px-5 py-2 rounded-lg text-lg hover:bg-white hover:text-black hover:border-2 hover:border-black">
                <FaEdit className="mr-1" />
                Edit
              </button>
              <button className="flex items-center justify-center border-2 bg-red-600 text-white px-5 py-2 rounded-lg text-lg hover:bg-white hover:text-red-600 hover:border-2 hover:border-red-600">
                <MdDelete className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
