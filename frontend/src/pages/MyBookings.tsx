import { useState } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const MyBookings = () => {
  const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <main className="space-y-5">
      {/* User Header */}
      <div className="bg-white border-b py-4 px-10 d:py-7">
        <div className="mx-auto max-w-6xl w-full">
          <div className="text-goldColor font-medium text-3xl leading-30px tracking-extraTight d:text-35 d:leading-10 mb-2">
            Ranjit G
          </div>
          <div className="leading-relaxed d:text-17 d:leading-8">
            $0 credits available
          </div>
        </div>
      </div>
      {/* User Header Ends */}

      <div className="mx-auto max-w-6xl w-full d:flex d:flex-row d:items-start d:pt-5 pt-5">
        <h1 className="text-2xl text-center lg:text-left font-medium mb-5">My Bookings</h1>
        {/* Tabs */}
        <div className="d:w-9/12">
          <section className="py-4">
            <ul className="overflow-x-auto flex flex-row px-5 gap-3">
              <li className="">
                <button
                  className={`border capitalize px-4 py-3 rounded-lg ${activeTab === "bookings" ? "bg-[#fff6ea] text-darkGold border border-goldColor" : ""}`}
                  onClick={() => setActiveTab("bookings")}
                >
                  Bookings
                </button>
              </li>
              <li>
                <button
                  className={`border capitalize px-4 py-3 rounded-lg ${activeTab === "favourites" ? "bg-[#fff6ea] text-darkGold border border-goldColor" : ""}`}
                  onClick={() => setActiveTab("favourites")}
                >
                  Favourites
                </button>
              </li>
              <li>
                <button
                  className={`border capitalize px-4 py-3 rounded-lg ${activeTab === "waitlist" ? "bg-[#fff6ea] text-darkGold border border-goldColor" : ""}`}
                  onClick={() => setActiveTab("waitlist")}
                >
                  Waitlist
                </button>
              </li>
            </ul>
            {/* Content Shown when clicked on Bookings*/}
            {activeTab === "bookings" && (
              <div className="mx-5 my-4 pt-5 rounded-xl shadow-lg border">
                <h3 className="border-b capitalize text-xl leading-[30px] font-medium pb-4 px-4 d:border-b-0 d:px-5 text-goldColor">
                  My Bookings
                </h3>
                <div className="">
                  {hotels && hotels.length > 0 ? (
                    hotels.map((hotel) => (
                      <div
                        key={hotel._id}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5"
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
                              {hotel.city}, {hotel.country}
                            </div>
                          </div>
                          {hotel.bookings.map((booking) => (
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
                                  {booking.adultCount} adults, {booking.childCount} children
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
              <div className="mx-5 my-4 pt-5 rounded-xl shadow-lg border">
                <h3 className="border-b capitalize text-xl leading-[30px] font-medium pb-4 px-4 d:border-b-0 d:px-5 text-goldColor">
                  My Favourites
                </h3>
                <div className="">
                  <div className="capitalize font-regular px-4 py-[22px] text-sm">
                    You have no favourites to show on this list.
                  </div>
                </div>
              </div>
            )}
            {/* Content Shown when clicked on Favourites End*/}

            {/* Content Shown when clicked on Waitlist*/}
            {activeTab === "waitlist" && (
              <div className="mx-5 my-4 pt-5 rounded-xl shadow-lg border">
                <h3 className="border-b capitalize text-xl leading-[30px] font-medium pb-4 px-4 d:border-b-0 d:px-5 text-goldColor">
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
