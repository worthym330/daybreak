import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { facilityIcons, FacilityKey, Tooltip } from "./Detail";
import { FaHeart } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const MyBookings = () => {
  // const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);
  const [activeTab, setActiveTab] = useState("bookings");
  const personalInfo = JSON.parse(Cookies.get("authentication") || "[]");
  const [bookingData, setBookingData] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (activeTab === "bookings") {
      getMyBookings();
    } else if (activeTab === "favourites") {
      getFavourites();
    } else {
    }
  }, [activeTab]);

  async function getMyBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
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

  const toggleFavourite = async (hotelId: any) => {
    if (personalInfo !== null) {
      const user: any = {
        userId: personalInfo.id,
        firstName: personalInfo.name.split(" ")[0],
        lastName: personalInfo.name.split(" ").pop(),
        email: personalInfo.email,
      };

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/hotels/${hotelId}/favourite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );
        if (res.ok) {
          // Handle success if necessary
        }
      } catch (error) {
        // Handle error if necessary
      }
    } else {
      // showToast({ message: "Please log in to save", type: "ERROR" });
      toast.error("Please log in to save");
    }
  };

  return (
    <main className="space-y-5">
      {/* User Header */}
      <div className="py-4 px-10">
        <div className="mx-auto max-w-6xl w-full">
          {/* <div className="text-goldColor font-medium text-3xl leading-30px tracking-extraTight mb-2">
            {personalInfo.name}
          </div> */}
          {/* <div className="leading-relaxed">
            $0 credits available
          </div> */}
        </div>
      </div>
      {/* User Header Ends */}

      <div className="mx-auto max-w-6xl w-full pt-5">
        <h1 className="text-2xl text-center lg:text-left font-medium mb-5 pl-0 lg:pl-5">
          My Account
        </h1>
        {/* Tabs */}
        <div className="">
          <section className="py-4">
            <ul className="overflow-x-auto flex flex-row px-5 gap-3">
              <li className="">
                <button
                  className={`border capitalize px-4 py-3 rounded-lg ${
                    activeTab === "bookings"
                      ? "bg-[#fff6ea] text-darkGold border border-goldColor"
                      : ""
                  }`}
                  onClick={() => setActiveTab("bookings")}
                >
                  Bookings
                </button>
              </li>
              <li>
                <button
                  className={`border capitalize px-4 py-3 rounded-lg ${
                    activeTab === "favourites"
                      ? "bg-[#fff6ea] text-darkGold border border-goldColor"
                      : ""
                  }`}
                  onClick={() => setActiveTab("favourites")}
                >
                  Favourites
                </button>
              </li>
              {/* <li>
                <button
                  className={`border capitalize px-4 py-3 rounded-lg ${activeTab === "waitlist" ? "bg-[#fff6ea] text-darkGold border border-goldColor" : ""}`}
                  onClick={() => setActiveTab("waitlist")}
                >
                  Cancelled
                </button>
              </li> */}
            </ul>
            {/* Content Shown when clicked on Bookings*/}
            {activeTab === "bookings" && (
              <div className="mx-5 my-4 pt-5">
                <h3 className="border-b border-goldColor capitalize text-xl leading-[30px] font-medium pb-4 px-4 text-goldColor">
                  My Bookings
                </h3>
                <div className="space-y-5 rounded-xl shadow-lg">
                  {bookingData && bookingData.length > 0 ? (
                    bookingData.map((hotel: any) => (
                      <div
                        key={hotel._id}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-goldColor rounded-lg p-8 gap-5"
                      >
                        <div className="lg:w-full lg:h-[250px]">
                          <img
                            src={hotel.imageUrls[0]}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                          <div className="text-2xl font-bold">
                            {hotel.name}
                            <div className="text-xs font-normal">
                              {hotel.city}, {hotel.state}, India
                            </div>
                          </div>
                          {hotel.bookings.map((booking: any) => (
                            <div key={booking._id}>
                              <div>
                                <span className="font-bold mr-2">Dates: </span>
                                <span>
                                  {/* {new Date(booking.checkIn).toDateString()} -{" "}
                                  {new Date(booking.checkOut).toDateString()} */}
                                </span>
                              </div>
                              <div>
                                <span className="font-bold mr-2">Guests:</span>
                                <span>
                                  {booking.adultCount} adults,{" "}
                                  {booking.childCount} children
                                </span>
                              </div>
                            </div>
                          ))}
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
            {activeTab === "favourites" && (
              <div className="mx-5 my-4 pt-5">
                <h3 className="border-b capitalize text-xl leading-[30px] font-medium pb-4 px-4 text-goldColor">
                  My Favourites
                </h3>
                <div className="space-y-5 rounded-xl shadow-lg">
                  {favourites && favourites.length > 0 ? (
                    favourites.map((hotel: any) => (
                      <Link
                        to={`/hotel-detail/${hotel._id}`}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-goldColor rounded-lg p-8 gap-5"
                      >
                        <div className="lg:w-full lg:h-[250px]">
                          <img
                            src={hotel.imageUrls[0]}
                            className="w-full h-full object-cover object-center rounded-md"
                          />
                        </div>
                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                          <div className="flex justify-between">
                            <div className="text-2xl font-bold">
                              {hotel.name}
                              <div className="text-xs font-normal">
                                {hotel.city}, {hotel.state}
                              </div>
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  toggleFavourite(hotel._id);
                                }}
                              >
                                {hotel._id ? (
                                  <span className="flex gap-2">
                                    <FaHeart className="w-6 h-6 text-red-500 fill-current" />
                                    <span>Saved</span>
                                  </span>
                                ) : (
                                  <span className="flex gap-2">
                                    <FaHeart className="w-6 h-6 text-gray-300 fill-current" />
                                    <span>Save</span>
                                  </span>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {hotel.facilities.map(
                              (facility: any, index: number) => (
                                <Tooltip key={index} text={facility}>
                                  <div className="border border-goldColor rounded-md p-2 flex items-center space-x-2 cursor-pointer text-goldColor text-xl">
                                    {facilityIcons[facility as FacilityKey] && (
                                      <span>
                                        {facilityIcons[facility as FacilityKey]}
                                      </span>
                                    )}
                                  </div>
                                </Tooltip>
                              )
                            )}
                          </div>
                        </div>
                      </Link>
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

            {/* Content Shown when clicked on Waitlist*/}
            {activeTab === "waitlist" && (
              <div className="mx-5 my-4 pt-5 rounded-xl shadow-lg border">
                <h3 className="border-b capitalize text-xl leading-[30px] font-medium pb-4 px-4 text-goldColor">
                  My Waitlist
                </h3>
                <div className="">
                  <div className="capitalize font-regular px-4 py-[22px] text-sm">
                    No Bookings Found
                  </div>
                </div>
              </div>
            )}
            {/* Content Shown when clicked on Waitlist End*/}
          </section>
        </div>
        {/* Tabs Ends */}
      </div>
    </main>
  );
};

export default MyBookings;
