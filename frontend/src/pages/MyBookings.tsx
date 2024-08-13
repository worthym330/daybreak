import { useEffect, useState } from "react";
import Cookies from "js-cookie";
// import { Link } from "react-router-dom";
// import { facilityIcons, FacilityKey, Tooltip } from "./Detail";
import { FaFileDownload } from "react-icons/fa";
// import { toast } from "react-toastify";
import { titleIcons, TitleKey } from "../components/ProductCard";
import { MdCancel } from "react-icons/md";
import LatestDestinationCard from "../components/LatestDestinationCard";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const MyBookings = ({ tab }: any) => {
  // const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);
  const personalInfo = JSON.parse(Cookies.get("authentication") || "[]");
  const [bookingData, setBookingData] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (tab === "bookings") {
      getMyBookings();
    } else {
      getFavourites();
    }
  }, [tab]);

  async function getMyBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
        credentials: "include",
      });
      const resbody = await response.json();

      if (response.ok) {
        setBookingData(resbody);
        console.log(resbody);
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

  return (
    <main className="">
      {/* User Header */}
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
        <h1 className="text-2xl text-center text-[#00c0cb] font-medium mb-5 pl-0 lg:pl-5">
          MY {tab.toUpperCase()}
        </h1>
        {/* Tabs */}
        <div className="">
          <section className="py-4">
            {/* Content Shown when clicked on Bookings*/}
            {tab === "bookings" && (
              <div className="mx-5 my-4 pt-5">
                <div className="space-y-5">
                  {bookingData && bookingData.length > 0 ? (
                    bookingData.map((hotel: any) => (
                      <div key={hotel._id} className="space-y-5">
                        {hotel.bookings.map((booking: any) => (
                          <div key={booking._id} className="">
                            <div className="flex flex-col md:flex-row bg-[#B2F6FF] rounded-lg shadow-lg overflow-hidden">
                              {/* Left Section (Image) */}
                              <div className="w-full md:w-1/3">
                                <img
                                  src={hotel.imageUrls[0]}
                                  alt={hotel.name}
                                  className="object-cover w-full h-full"
                                />
                              </div>

                              {/* Right Section (Details) */}
                              <div className="w-full md:w-2/3 p-6 flex flex-col border-black border-r-2 border-y-2 border-dashed justify-between ">
                                <div>
                                  <h3 className="text-2xl font-bold text-[#02596c]">
                                    {hotel.name}
                                  </h3>
                                  <p className="">
                                    {hotel.city}, {hotel.state}
                                  </p>
                                </div>

                                <div className="mt-2 flex gap-2 justify-between">
                                  <p className="flex gap-2">
                                    <strong className="text-[#02596c]">
                                      Dates:
                                    </strong>{" "}
                                    <span className="font-medium text-base">
                                      {new Date(booking.checkIn).toDateString()}
                                    </span>
                                  </p>
                                  <p className="flex gap-2">
                                    <strong className="text-[#02596c]">
                                      Guests:
                                    </strong>{" "}
                                    <span className="font-medium text-base">
                                      {booking.cart[0].adultCount} adults,{" "}
                                      {booking.cart[0].childCount} children
                                    </span>
                                  </p>
                                </div>

                                <div className="mt-2">
                                  {booking.cart.slice(0,4).map((e: any) => (
                                    <button
                                      key={e.product.title}
                                      className="bg-orange-500 text-white py-2 px-4 rounded-md shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 flex gap-2 items-center"
                                    >
                                      <span>
                                        {
                                          titleIcons[
                                            e.product.title.toUpperCase() as TitleKey
                                          ]
                                        }
                                      </span>
                                      <span>{e.product.title}</span>
                                    </button>
                                  ))}
                                </div>
                                <div className="mt-2 flex justify-between">
                                  <button className="bg-[#02596c] text-white py-2 px-4 rounded-md shadow hover:bg-[#02596c] focus:outline-none focus:ring-2 focus:ring-[#02596c] focus:ring-opacity-50 flex gap-2 items-center flex gap-2 items-center"><span><FaFileDownload  className="w-6 h-6"/></span><span>Invoice</span></button>
                                  <button className="bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex gap-2 items-center flex gap-2 items-center"><span><MdCancel  className="w-6 h-6"/></span><span>Cancel</span></button>

                                  {/* <button>Cancel</button> */}
                                 </div>
                              </div>
                            </div>
                          </div>
                        ))}
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
              <div className="mx-5 my-4">
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
