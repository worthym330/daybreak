// import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaFacebook,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import Button from "../components/Button";
import { Formik } from "formik";
import Modal from "../components/modal";
import * as Yup from "yup";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const initialModalState = {
  type: "add",
  state: false,
  index: null,
  loading: false,
  id: "",
  data: {
    name: "",
    email: "",
    referralCode: "",
    city: "",
  },
};

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
  // const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [submited, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [number, setNumber] = useState(0);
  const [modal, setModal] = useState(initialModalState);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://www.DayBreakPasspass.com?uid=${code}`);
    // showToast({
    //   message: "Referral link copied to clipboard!",
    //   type: "SUCCESS",
    // });
    toast.success("Referral link copied to clipboard!")
  };

  const openSocialMedia = (platform: string) => {
    navigator.clipboard.writeText(`https://www.DayBreakPasspass.com?uid=${code}`);
    switch (platform) {
      case "instagram":
        window.open(`https://instagram.com`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://web.whatsapp.com`, "_blank");
        break;
      case "twitter":
        window.open(`https://x.com`, "_blank");
        break;
      case "linkedin":
        window.open(`https://linkedin.com`, "_blank");
        break;
      case "facebook":
        window.open(`https://facebook.com`, "_blank");
        break;
      default:
        break;
    }
  };

  const renderModal = () => {
    const { state, data } = modal;

    return (
      <Formik
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={async (
          values: WaitlistFormValues,
          { resetForm, setSubmitting }
        ) => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/waitlist`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(values),
            });
            const responseBody = await response.json();
            if (!response.ok) {
              // showToast({
              //   message: responseBody.error,
              //   type: "ERROR",
              // });
              toast.error(responseBody.error)
            } else {
              // showToast({
              //   message: "Form submitted successfully",
              //   type: "SUCCESS",
              // });
              toast.success("Form submitted successfully")
              console.log(responseBody)
              setModal(initialModalState);
              setNumber(responseBody.referredNumber);
              setCode(responseBody.referralCode);
            }
            resetForm();
            setSubmitted(true);
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
          isSubmitting,
          errors,
          touched,
          handleChange,
        }) => (
          <Modal
            title="Join WaitList"
            open={state}
            setOpen={() => {
              setModal(initialModalState);
            }}
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="text-left">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Name
                </label>
                <input
                  type="name"
                  name="name"
                  value={values.name}
                  placeholder="Name"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-3"
                  onChange={handleChange}
                />
                {touched.name && (
                  <span className="text-red-500">{errors.name}</span>
                )}
              </div>

              <div className="text-left">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="Email"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                  onChange={handleChange}
                />
                {touched.email && (
                  <span className="text-red-500 font-semibold">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="text-left">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Referral Code
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={values.referralCode}
                  placeholder="Referral Code"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                  onChange={handleChange}
                />
                {touched.referralCode && (
                  <span className="text-red-500">{errors.referralCode}</span>
                )}
              </div>

              <div className="text-left">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  city
                </label>
                <input
                  type="text"
                  name="city"
                  value={values.city}
                  placeholder="city"
                  className="border rounded w-full px-2 py-3 font-normal mb-3 mt-1"
                  onChange={handleChange}
                />
                {touched.city && (
                  <span className="text-red-500">{errors.city}</span>
                )}
              </div>

              <div className="flex flex-col justify-center gap-5 mt-5">
                <span className="flex items-center justify-between">
                  <Button
                    type="submit"
                    className="bg-black mx-auto w-full text-white px-4 py-3 rounded-xl font-bold hover:bg-btnColor"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </Button>
                </span>
              </div>
            </form>
          </Modal>
        )}
      </Formik>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      {renderModal()}
      <div className=" mx-8 py-8">
        <div className="flex justify-between">
          <span
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            DayBreakPass
          </span>
        </div>
        {submited ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4 mt-4">
            <h2 className="mt-4 text-4xl md:text-7xl duration-500 animate-fade-right animate-twice animate-duration-500 animate-ease-in font-bold font-HKFONT">
              Yay, you're on the waitlist!
            </h2>
            <p className="text-2xl mb-6">
              Want to cut the line and get early access?
            </p>
            <div className="flex items-center space-x-4 mb-4 w-full justify-center">
              <input
                type="text"
                value={`https://www.DayBreakPasspass.com?uid=${code}`}
                readOnly
                className="bg-white text-black rounded-lg p-2 w-80"
              />
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 p-2 rounded-lg"
              >
                <FaLink className="text-white" />
              </button>
            </div>
            <div className="flex space-x-4 mb-6">
              <FaInstagram
                className="text-2xl cursor-pointer"
                onClick={() => openSocialMedia("instagram")}
              />
              <FaWhatsapp
                className="text-2xl cursor-pointer"
                onClick={() => openSocialMedia("whatsapp")}
              />
              <FaFacebook
                className="text-2xl cursor-pointer"
                onClick={() => openSocialMedia("facebook")}
              />
              <AiOutlineClose
                className="text-2xl cursor-pointer"
                onClick={() => openSocialMedia("twitter")}
              />
              <FaLinkedin
                className="text-2xl cursor-pointer"
                onClick={() => openSocialMedia("linkedin")}
              />
            </div>
            <p className="text-lg">Your Place in Line:</p>
            <p className="text-4xl md:text-6xl duration-500 animate-fade-right animate-twice animate-duration-500 animate-ease-in">
              {531+number}
            </p>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center min-h-[80vh] gap-4 mt-4">
            <h2 className="mt-2 text-xl font-extrabold text-white text-xl md:text-3xl">Launching Soon</h2>
            <p className="mt-4 text-4xl lg:text-6xl duration-500 animate-fade-right animate-twice animate-duration-500 animate-ease-in font-bold font-HKFONT">
              Join the waitlist!
            </p>
            <p className="mt-4 text-2xl text-center">
              Let’s tick your bucketlist
              </p><p className="mt-2 text-lg text-center">Get access to luxury hotels, resorts and spa to have your
              daycation with dirty martini and pool parties etc. Stay tuned!
            </p>
            <div className="mt-8 space-y-4 w-full max-w-md flex justify-center items-center">
              <Button
                type="Button"
                className=""
                onClick={() => setModal((prev) => ({ ...prev, state: true }))}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitList;
