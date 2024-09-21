import { useEffect, useState } from "react";
import Cookies from "js-cookie";
// import { Link } from "react-router-dom";
// import { facilityIcons, FacilityKey, Tooltip } from "./Detail";
import { FaFileDownload } from "react-icons/fa";
// import { toast } from "react-toastify";
import { titleIcons, TitleKey } from "../components/ProductCard";
import { MdCancel } from "react-icons/md";
import LatestDestinationCard from "../components/LatestDestinationCard";
import ConfirmationModal from "../components/AlertModal";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const MyBookings = ({ tab }: any) => {
  // const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);
  const personalInfo = JSON.parse(Cookies.get("authentication") || "[]");
  const [bookingData, setBookingData] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [id, setId] = useState();

  useEffect(() => {
    if (tab === "bookings") {
      getMyBookings();
    } else {
      getFavourites();
    }
  }, [tab]);

  async function getMyBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/invoice`, {
        credentials: "include",
      });
      const resbody = await response.json();

      if (response.ok) {
        setBookingData(resbody);
      } else {
        console.log("theow errior");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getFavourites() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/hotels/get/favourites/${personalInfo.id}`,
        {
          credentials: "include",
        }
      );
      const resbody = await response.json();

      if (response.ok) {
        setFavourites(resbody);
      } else {
        console.log("theow errior");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const toggleFavourite = async (hotelId: any) => {
  //   if (personalInfo !== null) {
  //     const user: any = {
  //       userId: personalInfo.id,
  //       firstName: personalInfo.name.split(" ")[0],
  //       lastName: personalInfo.name.split(" ").pop(),
  //       email: personalInfo.email,
  //     };

  //     try {
  //       const res = await fetch(
  //         `${API_BASE_URL}/api/hotels/${hotelId}/favourite`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(user),
  //         }
  //       );
  //       if (res.ok) {
  //         // Handle success if necessary
  //       }
  //     } catch (error) {
  //       // Handle error if necessary
  //     }
  //   } else {
  //     // showToast({ message: "Please log in to save", type: "ERROR" });
  //     toast.error("Please log in to save");
  //   }
  // };

  const cancelBooking = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/invoice/${id}/cancellation`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include orderId in the request body
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleCancellation = (hotel: any) => {
    setId(hotel);
    // setBookingId(bookingid);
    setConfirmationDialog(true);
  };

  const handleInvoice = async (id: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/invoice/${id}/invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include orderId in the request body
        }
      );
      const responseData = await response.json();
      console.log(response, responseData);
      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }
      // Convert the response to a blob (binary data)
      const a = document.createElement("a");
      a.href = responseData.pdfUrl; // Directly use the URL string
      a.download = `invoice_${id}.pdf`;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="">
      {/* User Header */}
      <ConfirmationModal
        setOpen={setConfirmationDialog}
        open={confirmationDialog}
        onDelete={cancelBooking}
        confirmationButtonText="Mark as Cancel"
      />
      <div className="">
        <div className="max-w-6xl w-full">
          {/* <div className="text-goldColor font-medium text-3xl leading-30px tracking-extraTight mb-2">
            {personalInfo.name}
          </div> */}
          {/* <div className="leading-relaxed">
            $0 credits available
          </div> */}
        </div>
      </div>
      {/* User Header Ends */}

      <div className="w-full">
        <h1 className="text-2xl text-center text-black font-medium my-5 pl-0 lg:pl-5">
          MY {tab.toUpperCase()}
        </h1>
        {/* Tabs */}
        <div className="">
          <section className="py-3">
            {/* Content Shown when clicked on Bookings*/}
            {tab === "bookings" && (
              <div className="mx-20 my-4">
                <div className="space-y-10">
                  {bookingData && bookingData.length > 0 ? (
                    bookingData.map((booking: any) => (
                      <div key={booking._id} className="space-y-5">
                        <div className="flex flex-col md:flex-row bg-[#edfdff] rounded-lg overflow-hidden">
                          {/* Left Section (Image) */}
                          <div className="w-full md:w-1/3 relative">
                            <img
                              src={booking.hotelId.imageUrls[0]}
                              alt={booking.hotelId.name}
                              className={`object-cover w-full h-full ${
                                booking.paymentStatus === "refunded"
                                  ? "grayscale"
                                  : "grayscale-0"
                              }`}
                            />
                            <p
                              className={`flex items-center text-sm font-semibold mb-2 absolute right-0 top-0 ${
                                booking.paymentStatus === "refunded"
                                  ? "text-red-500 opacity-95"
                                  : "text-white"
                              }`}
                            >
                              {booking.paymentStatus === "refunded"
                                ? "Cancelled"
                                : "Booked"}
                            </p>
                          </div>

                          {/* Right Section (Details) */}
                          <div className="w-full md:w-2/3 p-6 flex flex-col border-black border-r-2 border-y-2 border-dashed justify-between">
                            <div>
                              <h3 className="text-2xl font-bold text-[#02596c]">
                                {booking.hotelId.name}
                              </h3>
                              <p className="">
                                {booking.hotelId.city}, {booking.hotelId.state}
                              </p>
                            </div>

                            <div className="mt-5 flex flex-col gap-2">
                              <p className="flex gap-2">
                                <span className="text-[#02596c] font-semibold">
                                  Dates:
                                </span>
                                <span className="font-medium text-base flex justify-between gap-4">
                                  <span>{new Date(booking.date).toDateString()}</span><span>{booking.slot}</span>
                                  
                                </span>
                              </p>
                              {/* Modify the guests section according to the data structure */}
                              <p className="flex gap-2">
                                <span className="text-[#02596c] font-semibold">
                                  Guests:
                                </span>{" "}
                                <span className="font-medium text-base">
                                  {
                                    booking.hotelId.bookings[0].cart[0]
                                      .adultCount
                                  }{" "}
                                  adults,{" "}
                                  {
                                    booking.hotelId.bookings[0].cart[0]
                                      .childCount
                                  }{" "}
                                  children
                                </span>
                              </p>
                            </div>

                            <div className="mt-2">
                              {booking.servicesUsed
                                .slice(0, 3)
                                .map((service: string) => (
                                  <button
                                    key={service}
                                    className="bg-orange-500 text-white py-2 px-4 rounded-md shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 flex gap-2 items-center"
                                  >
                                    <span>
                                      {
                                        titleIcons[
                                          service.toUpperCase() as TitleKey
                                        ]
                                      }{" "}
                                      {/* Replace this with your icon logic if any */}
                                    </span>
                                    <span>{service}</span>
                                  </button>
                                ))}
                            </div>

                            <div className="mt-2 flex gap-4 justify-end">
                              <button
                                onClick={() => {
                                  handleInvoice(booking._id);
                                }}
                                className="bg-transparent border border-[#02596c] text-[#02596c] py-2 px-4 rounded-md hover:bg-[#02596c] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#02596c] focus:ring-opacity-50 flex gap-2 items-center"
                              >
                                <span>
                                  <FaFileDownload className="w-6 h-6" />
                                </span>
                                <span>Invoice</span>
                              </button>
                              {booking.paymentStatus !== "refunded" && (
                                <button
                                  className="bg-transparent border border-red-500 text-red-500 hover:text-white py-2 px-4 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex gap-2 items-center disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:text-red-500"
                                  disabled={
                                    booking.paymentStatus === "refunded"
                                  }
                                  onClick={() => {
                                    HandleCancellation(booking._id);
                                  }}
                                >
                                  <span>
                                    <MdCancel className="w-6 h-6" />
                                  </span>
                                  <span>Cancel</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="capitalize font-regular px-4 py-[22px] text-sm">
                      No Bookings Found
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Content Shown when clicked on Bookings End*/}

            {/* Content Shown when clicked on Favourites*/}
            {tab === "favourites" && (
              <div className="mx-20 my-4">
                <div className="grid gap-4 lg:gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 px-4 lg:px-0">
                  {favourites && favourites.length > 0 ? (
                    favourites.map((hotel: any) => (
                      <LatestDestinationCard key={hotel.id} hotel={hotel} />
                    ))
                  ) : (
                    <div className="capitalize font-regular px-4 py-[22px] text-sm">
                      You have no favourites to show on this list.
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Content Shown when clicked on Favourites End*/}
          </section>
        </div>
        {/* Tabs Ends */}
      </div>
    </main>
  );
};

export default MyBookings;
