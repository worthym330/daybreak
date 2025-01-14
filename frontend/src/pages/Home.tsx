import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
// import hotelImg1 from "../assets/taj.jpg";
import LatestDestinationCard from "../components/LatestDestinationCard";
import TopDestinationCard from "../components/TopDestinationCard";
import Button from "../components/Button";
import InfoSection from "../components/InfoSection";
import image from "../assets/images/image.png";
import { FaLocationDot } from "react-icons/fa6";
import { useSearchContext } from "../contexts/SearchContext";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { FaCalendar, FaSearch } from "react-icons/fa";
import { initialModalState, ListmyHotelRender } from "./ListmyHotel";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../store/authSlice";

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  const latestDestHotels = hotels || [];
  // const bottomRowHotels = hotels?.slice(2) || [];
  const navigate = useNavigate();

  const topDestinations = [
    {
      _id: 1,
      imageUrls: [
        "https://images.unsplash.com/photo-1598932982787-f54572e6cde4?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      city: "Mumbai",
    },
    {
      _id: 2,
      imageUrls: [
        "https://images.unsplash.com/photo-1598977054780-2dc700fdc9d3?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      city: "Delhi",
    },
    {
      _id: 3,
      imageUrls: [
        "https://images.unsplash.com/photo-1667300376656-e5d2cc288918?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      ],
      city: "Jaipur",
    },
    {
      _id: 4,
      imageUrls: [
        "https://images.unsplash.com/photo-1603689200436-b212c976c011?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8S29sa2F0YSUyMGJlYXV0aWZ1bCUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
      ],
      city: "Kolkata",
    },
  ];

  const search = useSearchContext();
  const [modal, setModal] = useState(initialModalState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const dispatch = useDispatch();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(destination, checkIn);
    navigate(`/listings?city=${destination}`);
  };

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const videoSrc = videoElement.getAttribute("data-src");
          if (videoSrc) {
            videoElement.setAttribute("src", videoSrc);
            videoElement.load();
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(videoElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const auth_token = Cookies.get("authentication");
    const user = auth_token ? JSON.parse(auth_token) : null;
    if (user === null) {
      dispatch(logout());
    } else {
      const token = user.token;
      dispatch(loginSuccess({ user, token }));
    }
  }, []);

  return (
    <div className="space-y-10">
      {modal.state && <ListmyHotelRender modal={modal} setModal={setModal} />}
      <section className="relative w-full h-screen overflow-hidden -mt-10">
        {!isLoaded && (
          <img
            src={"/3.jpg"}
            alt="Welcome"
            className={`absolute inset-0 w-full h-[95%] object-cover ${
              isLoaded ? "hidden" : "block"
            } `}
          />
        )}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          loop
          muted
          preload="none"
          data-src="/Daybreakpassslideslowerversion.mp4"
          className={`absolute inset-0 w-full h-[95%] object-cover ${
            isLoaded ? "block" : "hidden"
          }`}
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src="/Daybreakpassslideslowerversion.mp4" type="video/mp4" />
        </video>

        <div className="absolute bottom-0 w-full flex flex-col justify-center items-center bg-transparent text-center p-4">
          <div className="max-w-screen-lg mb-8">
            <h1 className="text-2xl md:text-6xl text-white font-normal font-LuzuryF2 tracking-wider mb-6 leading-10">
              FIND YOUR NEXT DAYCATION
            </h1>
            <p className="text-base md:text-2xl text-white mb-4 font-poppins">
              Discover luxury by the day: Book Day Passes, Daybeds, Cabanas &
              Experiences at premier hotels in your city.
            </p>
          </div>

          <div className="w-full md:w-2/3 lg:w-1/2">
            <form
              className="flex items-center p-2 bg-white rounded-full shadow-md w-full"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-row w-5/6 gap-2">
                <div className="flex items-center flex-1 px-2">
                  <div className="flex items-center md:space-x-2">
                    <span className="text-xs md:text-xl">
                      <FaLocationDot className="w-6 h-6 text-[#02596c]" />
                    </span>
                    <input
                      type="text"
                      placeholder="Location"
                      className="outline-none bg-transparent placeholder-[#02596c] text-[#02596c] p-1 md:p-2 w-full"
                      value={destination}
                      onChange={(event) => setDestination(event.target.value)}
                    />
                  </div>
                </div>
                <div className="h-8 border border-gray-300 hidden md:block"></div>
                <div className="flex items-center flex-1 px-2">
                  <div className="flex items-center md:space-x-2">
                    <span className="text-xl text-[#02596c]">
                      <FaCalendar className="w-6 h-6" />
                    </span>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date as Date)}
                      selectsStart
                      startDate={checkIn}
                      minDate={minDate}
                      // isClearable={true}
                      maxDate={maxDate}
                      placeholderText="Check-In Date"
                      className="outline-none bg-transparent placeholder-[#02596c] text-[#02596c] p-1 md:p-2 w-full"
                    />
                  </div>
                </div>
              </div>
              <button
                className="flex items-center justify-center px-6 py-2 ml-2 text-white bg-orange-500 rounded-full w-1/6"
                type="submit"
              >
                <span className="text-lg">
                  <FaSearch className="text-white w-6 h-6" />
                </span>
                <span className="ml-1 text-lg hidden md:block">Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="container mx-auto md:pt-10">
        <InfoSection />
      </section>

      {/* Latest Destinations */}
      <section className="lg:container lg:mx-auto md:pt-10">
        <h2 className="text-center text-goldColor text-2xl md:text-3xl mb-3 font-LuzuryF2 uppercase">
          <span className="font-bold">Popular</span> <span>Destinations</span>
        </h2>
        <p className="text-center mb-5 text-base md:text-lg text-fontSecondaryColor">
          Most recent destinations added by our hosts
        </p>
        <div className="grid gap-4 lg:gap-2 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 px-4 lg:px-0 pt-10">
          {latestDestHotels.slice(0, 6).map((hotel: any, idx:any) => (
            // <Link to={`/hotel-detail/${hotel._id}`}>
            <LatestDestinationCard key={idx} hotel={hotel} />
            // </Link>
          ))}
        </div>
      </section>

      {/* Latest Destinations End */}

      <div className="relative md:py-6 rounded-lg md:my-8 md:pt-10">
        <div className="flex flex-col md:flex-row items-center bg-gradient-to-r from-[#018292] to-[#00bdc8]">
          <div className="lg:w-1/3 w-full">
            <img
              src={image}
              alt="Beach scene"
              className="shadow-md h-full w-full"
            />
          </div>
          <div className="w-full lg:w-2/3 lg:pl-20 text-white py-4 px-2 lg:px-0">
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              Weekday specials: enjoy unbeatable rates!
            </h2>
            <p className="mb-6 text-sm md:text-base">
              Enjoy a mid-week escape and rediscover your summer.
            </p>
            <button
              className="bg-orange-500 hover:bg-white text-white hover:text-orange-500 hover:border hover:border-orange-500 font-bold py-2 px-4 rounded-lg"
              onClick={() => navigate("/listings")}
            >
              Search Now
            </button>
          </div>
        </div>
      </div>
      {/* Top Destinations */}
      <section className="container mx-auto md:pt-10">
        <div className="flex flex-col">
          <h2 className="text-center text-goldColor text-2xl md:text-3xl mb-3 font-LuzuryF2 uppercase">
            <span className="font-bold">Explore</span> <span>Destinations</span>
          </h2>
          {/* <p className="text-center mb-10">
          Most recent desinations added by our hosts
        </p> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-4 md:mt-10">
            {topDestinations.map((hotel: any, idx: any) => {
              return <TopDestinationCard hotel={hotel} key={idx} />;
            })}
          </div>
        </div>
      </section>
      {/* Top Destinations End */}
      <section className="container mx-auto">
        <div className="md:py-14 px-4 md:mt-10">
          <h2 className="text-2xl font-bold text-left text-goldColor mb-10">
            HOW IT WORKS
          </h2>
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-4">
            <div className="flex flex-col lg:w-1/3 gap-2">
              <div className="bg-[#00c0cb] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-xl text-goldColor">Explore</h3>
              <p className="leading-5 text-sm text-gray-700 mb-4">
                Explore nearby hotels and resorts. New properties added
                regularly.
              </p>
              <div className="bg-[#00c0cb] text-white py-2 px-4 rounded-md w-full flex flex-col justify-center items-center">
                <span className="font-bold text-xl">Delighted </span>
                <span>Daycationers</span>
              </div>
            </div>

            <div className="flex flex-col lg:w-1/3 gap-2">
              <div className="bg-[#00c0cb] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-xl text-goldColor">
                Pick & Book
              </h3>
              <p className="leading-5 text-sm text-gray-700 mb-4">
                Choose a hotel or resort, pick a date, and book your Daycation.
              </p>
              <div className="bg-[#00c0cb] text-white py-2 px-4 rounded-md w-full flex flex-col justify-center items-center">
                <span className="font-bold text-xl">Risk Free </span>
                <span>Cancellation anytime</span>
              </div>
            </div>

            <div className="flex flex-col lg:w-1/3 gap-2">
              <div className="bg-[#00c0cb] text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-xl text-goldColor">Enjoy</h3>
              <p className="leading-5 text-sm text-gray-700 mb-4">
                Check in, relax, swim, eat, drink, and enjoy the good life!
              </p>
              <div className="bg-[#00c0cb] text-white py-2 px-4 rounded-md w-full flex flex-col justify-center items-center">
                <span className="font-bold text-xl">Flexible</span>
                <span>Reservation dates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become Hotelier Section */}
      <div className="bg-[#fff6da]">
        <section className="container mx-auto">
          <div className="flex flex-col p-4 md:p-16 mx-8 md:mx-0 rounded-3xl gap-4">
            <div className="flex flex-col">
              <span className="flex text-2xl md:text-4xl mb-4 text-goldColor font-bold font-LuzuryF1 uppercase text-center justify-center">
                Are You A Hotelier?
              </span>
              <span className="text-center max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-2xl">
                Join the world's top hotel brands using Daycation to increase
                their bottom line revenue.
              </span>
            </div>
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
          <div className="relative col-span-1 p-2">
            <img
              className="rounded-md transition duration-300 ease-in-out filter grayscale hover:filter-none"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Taj_Hotels_logo.svg/2286px-Taj_Hotels_logo.svg.png"
              alt="Taj Hotel"
            />
          </div>
        </div> */}
            <div className="flex justify-center md:mt-8">
              <Button
                className="font-inter w-80 py-4 rounded-xl font-xl"
                type="button"
                onClick={() => {
                  setModal((prev: any) => ({ ...prev, state: true }));
                }}
              >
                Become a Hotel Partner
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Become Hotelier Section End*/}
    </div>
  );
};

export default React.memo(Home);
