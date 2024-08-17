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
import backgroundImage from "../assets/images/sunglasses-1850648_1280 1.png";

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
    navigator.clipboard.writeText(
      `Check out this link: ${FRONTEND_URL}/waitlist?uid=${code}`
    );
    let baseUrl = `Check out this link: ${FRONTEND_URL}/waitlist?uid=${code}`;

    switch (platform) {
      case "instagram":
        window.open(`https://www.instagram.com`, "_blank");
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(baseUrl)}`,
          "_blank"
        );
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
    <div
      className="text-center min-h-screen text-white font-sans"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 bg-black py-4 px-8">
        <span
          className="text-2xl font-bold cursor-pointer text-center md:text-left font-poppins"
          onClick={() => navigate("/")}
        >
          DayBreakPass
        </span>
        <span className="font-bold text-xl font-montserrat">
          Get Early access. Get <span className="text-goldColor">50% off</span>{" "}
          on your first booking.
        </span>
        <span></span>
        {/* <span>Limited to 100 users only.</span> */}
      </div>
      <div className="text-white font-sans ">
        <div className="md:px-8 py-8 px-4">
          <div className="gap-4 mt-4 min-h-[85vh] flex flex-col justify-center items-center">
            <p
              className="mt-4 text-4xl uppercase duration-500 font-bold text-nowrap"
              data-text={
                submited ? "Yay, you're on the waitlist!" : "Join the waitlist!"
              }
            >
              {submited ? "Yay, you're on the waitlist!" : "Join the waitlist!"}
            </p>
            <div className="w-full lg:w-[85%] flex flex-col lg:flex-row justify-center items-center bg-gray-300 rounded-lg gap-2 md:gap-0">
              <div className="w-full h-full lg:w-3/5 p-4 rounded-lg bg-black">
                {submited ? (
                  <div className="flex flex-col items-center justify-center gap-4 text-white px-4 md:px-8 py-4 md:py-8 space-y-8">
                    <p className="text-xl md:text-2xl mb-6">
                      Want to cut the line and get early access?
                    </p>
                    <div className="flex items-center space-x-2 md:space-x-4 mb-4 w-full md:justify-center">
                      <input
                        type="text"
                        value={`${FRONTEND_URL}/waitlist?uid=${code}`}
                        readOnly
                        className="border-2 rounded-md bg-white text-black text-lg w-full md:w-96 px-4 py-3 font-bold"
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
                      {57 + number}
                    </p>
                  </div>
                ) : (
                  <div className="md:px-8 py-4 md:py-8">
                    <p className="mt-4 text-3xl text-center">
                      Limited to{" "}
                      <span className="text-goldColor font-bold">
                        100 users
                      </span>{" "}
                      only
                    </p>
                    <p className="mt-4 text-2xl text-center">
                      Let’s tick your bucketlist
                    </p>
                    <p className="mt-2 text-lg text-center">
                      Get access to luxury hotels, resorts and spa to have your
                      daycation with dirty martini and pool parties etc. Stay
                      tuned!
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
                          handleChange,
                        }) => (
                          <form
                            onSubmit={handleSubmit}
                            noValidate
                            className="space-y-8"
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
                                className={`border-2 rounded-md text-black text-lg w-full md:w-96 px-4 py-3 font-bold ${
                                  errors.name && touched.name
                                    ? "border-red-500 placeholder:text-red-500"
                                    : "border-white placeholder:text-gray-400"
                                }`}
                                onChange={handleChange}
                                autoComplete="off"
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
                                className={`border-2 rounded-md text-black text-lg w-full md:w-96 px-4 py-3 font-bold ${
                                  errors.email && touched.email
                                    ? "border-red-500 placeholder:text-red-500"
                                    : "border-white placeholder:text-gray-400"
                                }`}
                                onChange={handleChange}
                                autoComplete="off"
                              />
                            </div>

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
                                className={`border-2 rounded-md text-black text-lg w-full md:w-96 px-4 py-3 font-bold ${
                                  errors.city && touched.city
                                    ? "border-red-500 placeholder:text-red-500"
                                    : "border-white placeholder:text-gray-400"
                                }`}
                                onChange={handleChange}
                                autoComplete="off"
                              />
                            </div>

                            <div className="flex justify-center gap-5 mt-5">
                              <span className="flex items-center">
                                <button
                                  type="submit"
                                  className="border-2 text-white bg-goldColor rounded-lg py-2 px-4 ease-in-out duration-300 hover:border-goldColor hover:bg-white hover:text-goldColor"
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
                )}
              </div>
              <div className="w-full lg:w-2/5 rounded-lg ">
                <video
                  src={"/Daybreakpassslideslowerversion.mp4"}
                  playsInline
                  autoPlay
                  loop
                  muted
                  className="w-full object-cover h-[600px] rounded-md"
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitList;
