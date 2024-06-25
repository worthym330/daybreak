import { BsBuilding, BsMap } from "react-icons/bs";
import { BiStar } from "react-icons/bi";
import { useEffect, useState } from "react";
import { Formik } from "formik";
import HalfGeneralSlideover from "../components/slide-over";
import * as Yup from "yup";
import {
  hotelFacilities,
  hotelProducts,
  hotelTypes,
} from "../config/hotel-options-config";
import { FaCircleXmark } from "react-icons/fa6";
import { MdPhotoLibrary } from "react-icons/md";
import Button from "../components/Button";
import Switch from "react-switch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppContext } from "../contexts/AppContext";
// import { HotelType } from "../../../backend/src/shared/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

interface HotelType {
  _id?: string;
  name: string;
  city: string;
  state: string;
  description: string;
  cancellationPolicy: string;
  facilities: string[];
  hotelType: string[];
  star: string;
  imageUrls: string[];
  productTitle: string[];
  mapurl: string;
  pincode: string;
}

interface ModalState {
  type: string;
  state: boolean;
  index: null | number;
  id: string;
  data: HotelType;
}

const initialModalState: ModalState = {
  type: "",
  state: false,
  index: null,
  id: "",
  data: {
    name: "",
    city: "",
    state: "",
    description: "",
    cancellationPolicy: "",
    facilities: [],
    hotelType: [],
    star: "",
    imageUrls: [],
    productTitle: [],
    pincode: "",
    mapurl: "",
  },
};

interface FormTouched {
  productTitle?: {
    title?: boolean;
    description?: boolean;
    adultPrice?: boolean;
    childPrice?: boolean;
    otherpoints?: boolean;
    notes?: boolean;
    selectedDates?: string;
    slotTime?: boolean;
    startTime?: boolean;
    endTime?: boolean;
    maxPeople?: boolean;
    maxGuestsperDay?: boolean;
  }[];
}

const productSchema = Yup.object().shape({
  title: Yup.string().required("Product title is required"),
  description: Yup.string().required("Product description is required"),
  adultPrice: Yup.number()
    .typeError("Price for Adult must be a number")
    .required("Price for Adult is required")
    .positive("Price for Adult must be a positive number"),
  childPrice: Yup.number()
    .typeError("Price for Child must be a number")
    // .required("Price for Child is required")
    .positive("Price for Child must be a positive number")
    .nullable(),
  otherpoints: Yup.string().required("Product points are required"),
  notes: Yup.string().required("Notes are required"),
  selectedDates: Yup.array().required("Please select at least one date."),
  slotTime: Yup.string().required("Time Slot are required"),
  startTime: Yup.string()
    .required("Start Time is required")
    .matches(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid time format (HH:mm)"
    ),
  endTime: Yup.string()
    .required("End Time is required")
    .matches(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      "Invalid time format (HH:mm)"
    )
    .test(
      "is-greater",
      "End Time must be greater than Start Time",
      function (value) {
        const { startTime } = this.parent;
        if (!startTime || !value) return true; // Skip if either is empty
        return startTime < value;
      }
    ),
  maxPeople: Yup.string().when("title", (title: any, schema: any) => {
    return title === "Luxury Tents"
      ? schema.required("Max People is required for Luxury Tents")
      : schema.notRequired();
  }),
  maxGuestsperDay: Yup.number()
    .typeError("Max People must be a number")
    .required("Max People is required")
    .positive("Max People must be a positive number"),
});

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  city: Yup.string().required("City is required"),
  description: Yup.string().required("Description is required"),
  cancellationPolicy: Yup.string().required("Cancellation Policy is required"),
  state: Yup.string().required("State is required"),
  star: Yup.number()
    .required("Star rating is required")
    .oneOf([1, 2, 3, 4, 5], "Invalid star rating"),
  facilities: Yup.array()
    .of(Yup.string().required("Facility is required"))
    .min(1, "At least one facility is required"),
  hotelType: Yup.array()
    .of(Yup.string().required("Hotel type is required"))
    .min(1, "At least one hotel type is required"),
  imageUrls: Yup.array().of(Yup.mixed()).required("Images are required"),
  productTitle: Yup.array()
    .of(productSchema)
    .required("Product title is required")
    .min(1, "At least one product is required"),
  mapurl: Yup.string().required("Google Map URL is required"),
  pincode: Yup.string()
    .matches(/^[0-9]+$/, "Pin Code must be a numeric string")
    .required("Pin Code is required")
    .matches(/^[0-9]{6}$/, "Pin Code must be exactly 6 digits"),
});

const MyHotels = () => {
  const [modal, setModal] = useState<ModalState>(initialModalState);
  const [hotelData, setHotelData] = useState([]);
  const { showToast } = useAppContext();

  const getData = async () => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error fetching hotels");
    }
    setHotelData(await response.json());
    // return response.json();
  };

  useEffect(() => {
    getData();
  }, []);

  const renderModal = () => {
    const { data, id, state } = modal;
    return (
      <Formik
        enableReinitialize
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={async (values: any, { setSubmitting, resetForm }) => {
          // setSubmitting(true);
          console.log(values);
          delete values.bookings;
          delete values.favourites;
          const { ...otherValues } = values;
          const formData = new FormData();
          for (const key in otherValues) {
            if (otherValues.hasOwnProperty(key)) {
              // console.log(key,otherValues)
              if (key === "imageUrls") {
                console.log(key === "imageUrls");
                Array.from(otherValues[key]).forEach((file: any) => {
                  console.log(key, file);
                  formData.append(`imageFiles`, file);
                });
              } else if (key === "productTitle") {
                formData.append(key, JSON.stringify(otherValues[key]));
              } else {
                formData.append(key, otherValues[key]);
              }
            }
          }
          if (id) {
            try {
              console.log("called");
              const response = await fetch(
                `${API_BASE_URL}/api/my-hotels/${id}`,
                {
                  method: "PUT",
                  credentials: "include",
                  body: formData,
                }
              );

              if (response.ok) {
                showToast({ message: "Successfully updated", type: "SUCCESS" });
                setModal(initialModalState);
                setSubmitting(false);
                resetForm();
                getData();
              } else {
                showToast({
                  message: "Failed to update Hotel!",
                  type: "ERROR",
                });
                setSubmitting(false);
              }
              // return response.json();
            } catch (error) {
              console.log(error);
            }
          } else {
            try {
              const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
                method: "POST",
                credentials: "include",
                body: formData,
              });

              if (response.ok) {
                showToast({ message: "Successfully Added", type: "SUCCESS" });
                setModal(initialModalState);
                setSubmitting(false);
                resetForm();
                getData();
              } else {
                showToast({ message: "Failed to Add Hotel!", type: "ERROR" });
                setSubmitting(false);
              }
              // return response.json();
            } catch (error) {
              console.log(error);
            }
          }
        }}
      >
        {({
          handleSubmit,
          values,
          isSubmitting,
          errors,
          touched,
          setValues,
          handleBlur,
          handleChange,
          resetForm,
        }) => (
          <HalfGeneralSlideover
            title={id ? "Edit Hotel" : "Add Hotel"}
            open={state}
            setOpen={() => {
              setModal(initialModalState);
              resetForm();
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="mt-4 text-left grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4 ">
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">Name</label>
                  <input
                    type="name"
                    name="name"
                    value={values.name}
                    disabled={id ? true : false}
                    placeholder="Enter Hotel Name"
                    className="border rounded-md w-full px-2 py-3 font-normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.name && typeof errors?.name === "string" && (
                    <span className="text-red-500 text-sm">{errors.name}</span>
                  )}
                </div>
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">City</label>
                  <input
                    type="city"
                    name="city"
                    value={values.city}
                    disabled={id ? true : false}
                    placeholder="Enter your City"
                    className="border rounded-md w-full px-2 py-3 font-normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.city && typeof errors?.city === "string" && (
                    <span className="text-red-500 text-sm">{errors.city}</span>
                  )}
                </div>
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">
                    Pin Code
                  </label>
                  <input
                    type="pincode"
                    name="pincode"
                    value={values.pincode}
                    disabled={id ? true : false}
                    placeholder="Enter your Pin Code"
                    className="border rounded-md w-full px-2 py-3 font-normal"
                    onChange={handleChange}
                    // onBlur={handleBlur}
                  />
                  {touched.pincode && typeof errors?.pincode === "string" && (
                    <span className="text-red-500 text-sm">
                      {errors.pincode as String}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">State</label>
                  <input
                    type="state"
                    name="state"
                    value={values.state}
                    disabled={id ? true : false}
                    placeholder="Enter your State"
                    className="border rounded-md w-full px-2 py-3 font-normal"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.state && typeof errors?.state === "string" && (
                    <span className="text-red-500 text-sm">{errors.state}</span>
                  )}
                </div>
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">
                    Google Map URL
                  </label>
                  <input
                    type="mapurl"
                    name="mapurl"
                    value={values.mapurl}
                    disabled={id ? true : false}
                    placeholder="Enter your Google Map URL"
                    className="border rounded-md w-full px-2 py-3 font-normal"
                    onChange={handleChange}
                    // onBlur={handleBlur}
                  />
                  {touched.mapurl && (
                    <span className="text-red-500 text-sm">
                      {errors.mapurl as String}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">Star</label>
                  <select
                    name="star"
                    value={values.star}
                    className="border rounded-md w-full px-2 py-3 font-normal"
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
                  {touched.star && typeof errors?.star === "string" && (
                    <span className="text-red-500 text-sm">{errors.star}</span>
                  )}
                </div>
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={values.description}
                    placeholder="Enter your description"
                    className="border rounded-md w-full px-2 py-3 font-normal"
                    onChange={(e) => {
                      setValues({ ...values, description: e.target.value });
                    }}
                    onBlur={handleBlur}
                  />
                  {touched.description &&
                    typeof errors?.description === "string" && (
                      <span className="text-red-500 text-sm">
                        {errors.description}
                      </span>
                    )}
                </div>
                <div className="text-left">
                  <label className="text-gray-700 text-sm flex-1">
                    Cancellation Policy
                  </label>
                  <textarea
                    name="cancellationPolicy"
                    value={values.cancellationPolicy}
                    placeholder="Enter your Cancellation Policy  "
                    className="border rounded-md w-full px-2 py-3 font-normal"
                    onChange={(e) => {
                      setValues({
                        ...values,
                        cancellationPolicy: e.target.value,
                      });
                    }}
                    onBlur={handleBlur}
                  />
                  {touched.cancellationPolicy &&
                    typeof errors?.cancellationPolicy === "string" && (
                      <span className="text-red-500 text-sm">
                        {errors.cancellationPolicy}
                      </span>
                    )}
                </div>
                <div className="text-left col-span-1 sm:col-span-2 md:col-span-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-700 font-bold text-sm flex-1">
                        Facilities
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {hotelFacilities.map((facility) => (
                          <label
                            key={facility}
                            className="text-sm flex gap-1 text-gray-700"
                          >
                            <input
                              type="checkbox"
                              name="facilities"
                              value={facility}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values.facilities.includes(facility)}
                            />
                            {facility}
                          </label>
                        ))}
                      </div>
                      {touched.facilities &&
                        typeof errors.facilities === "string" && (
                          <span className="text-red-500 text-sm">
                            {errors.facilities}
                          </span>
                        )}
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="text-gray-700 font-bold text-sm flex-1">
                        Hotel Type
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {hotelTypes.map((hotel) => (
                          <label
                            key={hotel}
                            className="text-sm flex gap-1 text-gray-700"
                          >
                            <input
                              type="checkbox"
                              name="hotelType"
                              value={hotel}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values.hotelType.includes(hotel)}
                            />
                            {hotel}
                          </label>
                        ))}
                      </div>
                      {touched.hotelType &&
                        typeof errors.hotelType === "string" && (
                          <span className="text-red-500 text-sm">
                            {errors.hotelType}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="text-left col-span-1 sm:col-span-2 md:col-span-3">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-1/2">
                      <div className="w-full bg-gray-50 p-6 rounded-sm shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 flex justify-center mt-2">
                          Uploads
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
                          className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
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
                              {values.imageUrls &&
                              values.imageUrls.length > 0 ? (
                                <p>
                                  {values.imageUrls.map((s: any) => {
                                    let name;
                                    if (!s.name) {
                                      name = s.split("/").pop();
                                    }
                                    return (
                                      <span className="flex gap-2">
                                        {" "}
                                        {s.name ? (
                                          <p>{s.name}</p>
                                        ) : (
                                          <p>{name}</p>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setValues({
                                              ...values,
                                              imageUrls:
                                                values.imageUrls.filter(
                                                  (e: any) => e !== s
                                                ),
                                            });
                                          }}
                                          className="cursor-pointer text-red-500 px-1 py-1 hover:bg-red-800 hover:rounded-md hover:text-white disabled:text-gray-700 disabled:hover:bg-gray-300 hover:border-slate-300 hover:border-solid"
                                        >
                                          <FaCircleXmark className="w-4" />
                                        </button>
                                      </span>
                                    );
                                  })}
                                </p>
                              ) : (
                                "Images"
                              )}
                            </p>
                          </div>
                        </div>
                        {touched.imageUrls &&
                          typeof errors.imageUrls === "string" && (
                            <span className="text-red-500 text-sm">
                              {errors.imageUrls}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="w-full md:w-1/2">
                      <label className="text-gray-700 font-bold text-sm flex-1">
                        Add Your Products
                      </label>
                      <div className="flex flex-wrap gap-4">
                        {hotelProducts.map((hotel) => {
                          const isChecked = values?.productTitle?.some(
                            (product: any) => product.title === hotel
                          );
                          return (
                            <label
                              key={hotel}
                              className="text-sm flex gap-1 text-gray-700"
                            >
                              <input
                                type="checkbox"
                                name="productTitle"
                                value={hotel}
                                onChange={(e) => {
                                  const { checked, value } = e.target;
                                  if (checked) {
                                    setValues({
                                      ...values,
                                      productTitle: [
                                        ...values.productTitle,
                                        {
                                          title: value,
                                          description: "",
                                          adultPrice: "",
                                          childPrice: "",
                                          otherpoints: "",
                                          notes: "",
                                        },
                                      ],
                                    });
                                  } else {
                                    setValues({
                                      ...values,
                                      productTitle: values.productTitle.filter(
                                        (product: any) =>
                                          product.title !== value
                                      ),
                                    });
                                  }
                                }}
                                onBlur={handleBlur}
                                checked={isChecked}
                              />
                              {hotel}
                            </label>
                          );
                        })}
                      </div>
                      {touched.productTitle &&
                        typeof errors.productTitle === "string" && (
                          <span className="text-red-500 text-sm">
                            {errors.productTitle}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="text-left col-span-1 sm:col-span-2 md:col-span-3">
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4">
                    {Array.isArray(values.productTitle) &&
                      values.productTitle.map((product: any, index: number) => (
                        <div
                          key={index}
                          className="border border-goldColor shadow-md rounded-md mt-2 p-4 space-y-4"
                        >
                          {product.title === "Other" ? (
                            <div className="text-left">
                              <label className="text-gray-700 text-sm flex-1">
                                Product Title
                              </label>
                              <input
                                type="text"
                                name={`productTitle.${index}.title`}
                                value={product.title}
                                placeholder="Enter Product Title"
                                className="border rounded-md w-full px-2 py-3 font-normal"
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {(
                                touched.productTitle as FormTouched["productTitle"]
                              )?.[index]?.title &&
                                (
                                  errors.productTitle as FormTouched["productTitle"]
                                )?.[index]?.title && (
                                  <div className="text-red-500 text-sm">
                                    {
                                      (
                                        errors.productTitle as FormTouched["productTitle"]
                                      )?.[index].title
                                    }
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="text-left col-span-1 md:col-span-3">
                              <label className="text-gray-700 font-bold text-lg flex-1">
                                {product.title}
                              </label>
                            </div>
                          )}

                          <div className="text-left col-span-1 md:col-span-3">
                            <label className="text-gray-700 text-sm flex-1">
                              Product Description
                            </label>
                            <textarea
                              name={`productTitle.${index}.description`}
                              value={product.description}
                              placeholder="Enter your description"
                              className="border rounded-md w-full px-2 py-3 font-normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {(
                              touched.productTitle as FormTouched["productTitle"]
                            )?.[index]?.description &&
                              (
                                errors.productTitle as FormTouched["productTitle"]
                              )?.[index]?.description && (
                                <div className="text-red-500 text-sm">
                                  {
                                    (
                                      errors.productTitle as FormTouched["productTitle"]
                                    )?.[index].description
                                  }
                                </div>
                              )}
                          </div>

                          <div className="text-left col-span-1 md:col-span-3">
                            <label className="text-gray-700 text-sm flex-1">
                              All the points that need to be mentioned in the
                              product
                            </label>
                            <textarea
                              name={`productTitle.${index}.otherpoints`}
                              value={product.otherpoints}
                              placeholder="Enter Here"
                              className="border rounded-md w-full px-2 py-3 font-normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {(
                              touched.productTitle as FormTouched["productTitle"]
                            )?.[index]?.otherpoints &&
                              (
                                errors.productTitle as FormTouched["productTitle"]
                              )?.[index]?.otherpoints && (
                                <div className="text-red-500 text-sm">
                                  {
                                    (
                                      errors.productTitle as FormTouched["productTitle"]
                                    )?.[index].otherpoints
                                  }
                                </div>
                              )}
                          </div>

                          <div className="text-left col-span-1 md:col-span-3">
                            <label className="text-gray-700 text-sm flex-1">
                              Notes
                            </label>
                            <textarea
                              name={`productTitle.${index}.notes`}
                              value={product.notes}
                              placeholder="Enter the Notes"
                              className="border rounded-md w-full px-2 py-3 font-normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {(
                              touched.productTitle as FormTouched["productTitle"]
                            )?.[index]?.notes &&
                              (
                                errors.productTitle as FormTouched["productTitle"]
                              )?.[index]?.notes && (
                                <div className="text-red-500 text-sm">
                                  {
                                    (
                                      errors.productTitle as FormTouched["productTitle"]
                                    )?.[index].notes
                                  }
                                </div>
                              )}
                          </div>

                          <div className="text-left col-span-1 md:col-span-3">
                            <label className="text-gray-700 text-sm flex-1">
                              Maximum Guests allowed per day
                            </label>
                            <input
                              type="number"
                              name={`productTitle.${index}.maxGuestsperDay`}
                              value={product.maxGuestsperDay}
                              placeholder="Enter the Time Slot for each booking"
                              className="border rounded-md w-full px-2 py-3 font-normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              min={1}
                            />
                            {(
                              touched.productTitle as FormTouched["productTitle"]
                            )?.[index]?.maxGuestsperDay &&
                              (
                                errors.productTitle as FormTouched["productTitle"]
                              )?.[index]?.maxGuestsperDay && (
                                <div className="text-red-500 text-sm">
                                  {
                                    (
                                      errors.productTitle as FormTouched["productTitle"]
                                    )?.[index].maxGuestsperDay
                                  }
                                </div>
                              )}
                          </div>
                          <div className="text-left flex flex-col gap-2">
                            <label className="text-gray-700 text-sm flex-1">
                              Select Dates
                            </label>
                            <div className="customDatePickerWidth">
                              <DatePicker
                                name={`productTitle.${index}.selectedDates`}
                                className="border rounded-md w-full px-2 py-3 font-normal"
                                selected={null}
                                onChange={(date: any) => {
                                  const currentDates = product.selectedDates
                                    ? [...product.selectedDates]
                                    : [];
                                  const dateIndex = currentDates.findIndex(
                                    (d) => d.getTime() === date.getTime()
                                  );

                                  if (dateIndex === -1) {
                                    currentDates.push(date);
                                  } else {
                                    currentDates.splice(dateIndex, 1);
                                  }

                                  handleChange({
                                    target: {
                                      name: `productTitle.${index}.selectedDates`,
                                      value: currentDates,
                                    },
                                  });
                                }}
                                highlightDates={product.selectedDates || []}
                                inline
                                isClearable={true}
                              />
                            </div>
                            {(
                              touched.productTitle as FormTouched["productTitle"]
                            )?.[index]?.selectedDates &&
                              (
                                errors.productTitle as FormTouched["productTitle"]
                              )?.[index]?.selectedDates && (
                                <div className="text-red-500 text-sm">
                                  {
                                    (
                                      errors.productTitle as FormTouched["productTitle"]
                                    )?.[index].selectedDates
                                  }
                                </div>
                              )}
                          </div>

                          <div className="text-left col-span-1 md:col-span-3">
                            <label className="text-gray-700 text-sm flex-1">
                              Time Slot
                            </label>
                            <input
                              name={`productTitle.${index}.slotTime`}
                              value={product.slotTime}
                              placeholder="Enter the Time Slot for each booking"
                              className="border rounded-md w-full px-2 py-3 font-normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {(
                              touched.productTitle as FormTouched["productTitle"]
                            )?.[index]?.slotTime &&
                              (
                                errors.productTitle as FormTouched["productTitle"]
                              )?.[index]?.slotTime && (
                                <div className="text-red-500 text-sm">
                                  {
                                    (
                                      errors.productTitle as FormTouched["productTitle"]
                                    )?.[index].slotTime
                                  }
                                </div>
                              )}
                          </div>

                          <div className="text-left">
                            <div className="flex  gap-2 ">
                              <div className="w-1/2">
                                <label className="text-gray-700 text-sm flex-1">
                                  Start Time3
                                </label>

                                <input
                                  type="time"
                                  name={`productTitle.${index}.startTime`}
                                  value={product.startTime}
                                  placeholder="Enter the Start Time"
                                  className="border rounded-md w-full px-2 py-3 font-normal"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />

                                {(
                                  touched.productTitle as FormTouched["productTitle"]
                                )?.[index]?.startTime &&
                                  (
                                    errors.productTitle as FormTouched["productTitle"]
                                  )?.[index]?.startTime && (
                                    <div className="text-red-500 text-sm">
                                      {
                                        (
                                          errors.productTitle as FormTouched["productTitle"]
                                        )?.[index].startTime
                                      }
                                    </div>
                                  )}
                              </div>
                              <div className="w-1/2">
                                <label className="text-gray-700 text-sm flex-1">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  name={`productTitle.${index}.endTime`}
                                  value={product.endTime}
                                  placeholder="Enter the End Time"
                                  className="border rounded-md w-full px-2 py-3 font-normal"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                {(
                                  touched.productTitle as FormTouched["productTitle"]
                                )?.[index]?.endTime &&
                                  (
                                    errors.productTitle as FormTouched["productTitle"]
                                  )?.[index]?.endTime && (
                                    <div className="text-red-500 text-sm">
                                      {
                                        (
                                          errors.productTitle as FormTouched["productTitle"]
                                        )?.[index].endTime
                                      }
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>

                          {product.title === "Luxury Tents" && (
                            <div className="text-left col-span-1 md:col-span-3">
                              <label className="text-gray-700 text-sm flex-1">
                                Occupancy for tents max people
                              </label>
                              <input
                                name={`productTitle.${index}.maxPeople`}
                                value={product.maxPeople}
                                placeholder="Enter the Time Slot for each booking"
                                className="border rounded-md w-full px-2 py-3 font-normal"
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {(
                                touched.productTitle as FormTouched["productTitle"]
                              )?.[index]?.maxPeople &&
                                (
                                  errors.productTitle as FormTouched["productTitle"]
                                )?.[index]?.maxPeople && (
                                  <div className="text-red-500 text-sm">
                                    {
                                      (
                                        errors.productTitle as FormTouched["productTitle"]
                                      )?.[index].maxPeople
                                    }
                                  </div>
                                )}
                            </div>
                          )}

                          <div className="text-left">
                            <label className="text-gray-700 text-sm flex-1">
                              Price for Adult
                            </label>
                            <input
                              type="number"
                              name={`productTitle.${index}.adultPrice`}
                              value={product.adultPrice}
                              placeholder="Enter your Price for Adult"
                              className="border rounded-md w-full px-2 py-3 font-normal"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              min={0}
                            />
                            {(
                              touched.productTitle as FormTouched["productTitle"]
                            )?.[index]?.adultPrice &&
                              (
                                errors.productTitle as FormTouched["productTitle"]
                              )?.[index]?.adultPrice && (
                                <div className="text-red-500 text-sm">
                                  {
                                    (
                                      errors.productTitle as FormTouched["productTitle"]
                                    )?.[index].adultPrice
                                  }
                                </div>
                              )}
                          </div>

                          <div className="text-left flex justify-center items-center w-1/2 mt-4">
                            <label className="text-gray-700 text-sm flex-1">
                              Include Price for Child
                            </label>
                            <Switch
                              onChange={(checked) => {
                                handleChange({
                                  target: {
                                    name: `productTitle.${index}.isChildPrice`,
                                    value: checked,
                                  },
                                });
                              }}
                              checked={product.isChildPrice}
                              className="react-switch ml-2"
                            />
                          </div>
                          {product.isChildPrice && (
                            <div className="text-left">
                              <label className="text-gray-700 text-sm flex-1">
                                Price for Child
                              </label>
                              <input
                                type="number"
                                name={`productTitle.${index}.childPrice`}
                                value={product.childPrice}
                                placeholder="Enter your Price for Child"
                                className="border rounded-md w-full px-2 py-3 font-normal"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min={0}
                              />
                              {(
                                touched.productTitle as FormTouched["productTitle"]
                              )?.[index]?.childPrice &&
                                (
                                  errors.productTitle as FormTouched["productTitle"]
                                )?.[index]?.childPrice && (
                                  <div className="text-red-500 text-sm">
                                    {
                                      (
                                        errors.productTitle as FormTouched["productTitle"]
                                      )?.[index].childPrice
                                    }
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="my-4 flex justify-end">
                <Button type="submit" className="w-64" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting in..." : "Submit"}
                </Button>
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
    <div className="space-y-5">
      {renderModal()}
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Button onClick={() => setModal((prev) => ({ ...prev, state: true }))}>
          Add Hotel
        </Button>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel: HotelType) => (
          <div
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold break-words truncate">
              {hotel.name}
            </h2>
            <div className="whitespace-pre-line break-words truncate">
              {hotel.description}
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.state}, India
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.hotelType}
              </div>

              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.star} Star Rating
              </div>
            </div>
            <span className="flex justify-end">
              <Button
                onClick={() => {
                  setModal((prev) => ({
                    ...prev,
                    id: hotel._id || "",
                    state: true,
                    data: hotel,
                  }));
                }}
              >
                View Details
              </Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;