import { useAppContext } from "../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRegCopy,
  FaWhatsapp,
} from "react-icons/fa";
import { Formik } from "formik";
import * as Yup from "yup";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "";
import backgroundImage from "../assets/images/comingsoon.png";

interface WaitlistFormValues {
  name: string;
  email: string;
  referralCode?: string;
  city: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  city: Yup.string().required("City is required"),
});

const WaitList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query1 = queryParams.get("uid");
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [submited, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [number, setNumber] = useState(0);
  const [referralCode] = useState(query1);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${FRONTEND_URL}/waitlist?uid=${code}`);
    showToast({
      message: "Referral link copied to clipboard!",
      type: "SUCCESS",
    });
  };

  const openSocialMedia = (platform: string) => {
    navigator.clipboard.writeText(`Check out this link: ${FRONTEND_URL}/waitlist?uid=${code}`);
    let baseUrl = `Check out this link: ${FRONTEND_URL}/waitlist?uid=${code}`;
  
    switch (platform) {
      case "instagram":
        window.open(`https://www.instagram.com`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://www.api.whatsapp.com/send?text=${encodeURIComponent(baseUrl)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://www.x.com/`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/`, "_blank");
        break;
      default:
        break;
    }
  };

  return (
    <div className="text-center">
      {submited ? (
        <div
          className="flex flex-col items-center justify-center min-h-screen gap-4 text-white px-4 md:px-8 py-4 md:py-8"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: 1,
          }}
        >
          <h2 className="mt-2 font-extrabold text-white text-2xl md:text-3xl">
            DayBreakPass
          </h2>
          <h2 className="mt-4 text-4xl md:text-6xl duration-500 animate-fade-right animate-twice animate-duration-500 animate-ease-in font-bold font-HKFONT">
            Yay, you're on the waitlist!
          </h2>
          <p className="text-xl md:text-2xl mb-6">
            Want to cut the line and get early access?
          </p>
          <div className="flex items-center space-x-2 md:space-x-4 mb-4 w-full md:justify-center">
            <input
              type="text"
              value={`${FRONTEND_URL}/waitlist?uid=${code}`}
              readOnly
              className="border-2 rounded-full bg-goldColor text-white text-lg w-full md:w-96 px-4 py-3 font-bold"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-lg"
            >
              <FaRegCopy className="text-white w-6 h-6" />
            </button>
          </div>
          <div className="flex space-x-2 md:space-x-4 mb-6">
            <FaInstagram
              className="text-xl md:text-2xl cursor-pointer w-6 h-6"
              onClick={() => openSocialMedia("instagram")}
            />
            <FaWhatsapp
              className="text-xl md:text-2xl cursor-pointer w-6 h-6"
              onClick={() => openSocialMedia("whatsapp")}
            />
            <FaFacebook
              className="text-xl md:text-2xl cursor-pointer w-6 h-6"
              onClick={() => openSocialMedia("facebook")}
            />
            <AiOutlineClose
              className="text-xl md:text-2xl cursor-pointer w-6 h-6"
              onClick={() => openSocialMedia("twitter")}
            />
            <FaLinkedin
              className="text-xl md:text-2xl cursor-pointer w-6 h-6"
              onClick={() => openSocialMedia("linkedin")}
            />
          </div>
          <p className="text-base md:text-lg">Your Place in Line:</p>
          <p className="text-4xl md:text-6xl duration-500 animate-fade-right animate-twice animate-duration-500 animate-ease-in">
            {1038 + number}
          </p>
        </div>
      ) : (
        <div
          className="min-h-screen text-white font-sans "
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            // opacity: 0.5,
            filter: "brightness(1.5)",
          }}
        >
          <div className="px-8 py-4 md:py-8 ">
            <div className="flex justify-center md:justify-between">
              <span
                className="text-2xl font-bold cursor-pointer text-center md:text-left"
                onClick={() => navigate("/")}
              >
                DayBreakPass
              </span>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 mt-4 min-h-[85vh]">
              <h2 className="mt-2 font-extrabold text-white text-xl md:text-3xl">
                Launching Soon
              </h2>
              <p
                className="mt-4 text-4xl md:text-6xl lg:text-8xl uppercase duration-500 animate-fade-right animate-twice animate-duration-500 animate-ease-in font-bold font-HKFONT text-3d text-nowrap"
                data-text="Join the waitlist!"
              >
                Join the waitlist!
              </p>
              <p className="mt-4 text-2xl text-center">
                Let’s tick your bucketlist
              </p>
              <p className="mt-2 text-lg text-center">
                Get access to luxury hotels, resorts and spa to have your
                daycation with dirty martini and pool parties etc. Stay tuned!
              </p>
              <div className="mt-8 w-full flex justify-center items-center px-4">
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    referralCode: "",
                    city: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (
                    values: WaitlistFormValues,
                    { resetForm, setSubmitting }
                  ) => {
                    try {
                      values.referralCode = referralCode || "";
                      const response = await fetch(
                        `${API_BASE_URL}/api/waitlist`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(values),
                        }
                      );
                      const responseBody = await response.json();
                      if (!response.ok) {
                        showToast({
                          message: responseBody.error,
                          type: "ERROR",
                        });
                      } else {
                        showToast({
                          message: "Form submitted successfully",
                          type: "SUCCESS",
                        });
                        console.log(responseBody);
                        setNumber(responseBody.referredNumber);
                        setCode(responseBody.referralCode);
                        setSubmitted(true);
                      }
                      resetForm();
                    } catch (error: any) {
                      console.error(
                        "Error submitting form:",
                        error.response?.data || error.message
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                    handleBlur,
                    handleChange,
                  }) => (
                    <form
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-4"
                    >
                      <div className="text-left">
                        <input
                          type="text"
                          name="name"
                          value={values.name}
                          placeholder={
                            errors.name && touched.name
                              ? "Please Enter Your Name"
                              : "Your Name"
                          }
                          className={`border-2 rounded-full text-goldColor text-lg w-full md:w-96 px-4 py-3 font-bold ${
                            errors.name && touched.name
                              ? "border-red-500 placeholder:text-red-500"
                              : "border-goldColor placeholder:text-goldColor"
                          }`}
                          onChange={handleChange}
                          autoComplete="off"
                          onBlur={handleBlur}
                        />
                      </div>

                      <div className="text-left">
                        <input
                          type="email"
                          name="email"
                          value={values.email}
                          placeholder={
                            errors.email && touched.email
                              ? "Please Enter Your Email"
                              : "Your Email"
                          }
                          className={`border-2 rounded-full text-goldColor text-lg w-full md:w-96 px-4 py-3 font-bold ${
                            errors.email && touched.email
                              ? "border-red-500 placeholder:text-red-500"
                              : "border-goldColor placeholder:text-goldColor"
                          }`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                      </div>

                      {/* <div className="text-left">
                        <input
                          type="text"
                          name="referralCode"
                          value={referralCode || ""}
                          placeholder="Enter Referral Code"
                          className={`border-2 rounded-full text-goldColor text-lg w-full md:w-96 px-4 py-3 font-bold border-goldColor placeholder:text-goldColor`}
                          onChange={(e) => {
                            setRefferalCode(e.target.value);
                          }}
                          onBlur={handleBlur}
                        />
                      </div> */}

                      <div className="text-left">
                        <input
                          type="text"
                          name="city"
                          value={values.city}
                          placeholder={
                            errors.city && touched.city
                              ? "Please enter Your City"
                              : "Your City"
                          }
                          className={`border-2 rounded-full text-goldColor text-lg w-full md:w-96 px-4 py-3 font-bold ${
                            errors.city && touched.city
                              ? "border-red-500 placeholder:text-red-500"
                              : "border-goldColor placeholder:text-goldColor"
                          }`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                        />
                      </div>

                      <div className="flex flex-col justify-center gap-5 mt-5">
                        <span className="flex items-center justify-between">
                          <button
                            type="submit"
                            className="border-2 text-white bg-goldColor rounded-full py-2 px-4 ease-in-out duration-300 hover:border-goldColor hover:bg-white hover:text-goldColor"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Joining..." : "Submit"}
                          </button>
                        </span>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaitList;
