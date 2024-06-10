import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
// import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import { useState, useEffect } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import {
  FaDumbbell,
  FaParking,
  FaShuttleVan,
  FaSpa,
  FaSwimmingPool,
  FaWifi,
} from "react-icons/fa";
import { MdFamilyRestroom, MdSmokeFree } from "react-icons/md";

type FacilityKey =
  | "Free WiFi"
  | "Parking"
  | "Airport Shuttle"
  | "Family Rooms"
  | "Non-Smoking Rooms"
  | "Outdoor Pool"
  | "Spa"
  | "Fitness Center";

const facilityIcons = {
  "Free WiFi": <FaWifi />,
  Parking: <FaParking />,
  "Airport Shuttle": <FaShuttleVan />,
  "Family Rooms": <MdFamilyRestroom />,
  "Non-Smoking Rooms": <MdSmokeFree />,
  "Outdoor Pool": <FaSwimmingPool />,
  Spa: <FaSpa />,
  "Fitness Center": <FaDumbbell />,
};

const Tooltip = ({ children, text }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-white text-nowrap text-sm rounded-md shadow-full">
          {text}
        </div>
      )}
      {children}
    </div>
  );
};

const Detail = () => {
  const { hotelId, name } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hotelQuery = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const hotelByNameQuery = useQuery(
    ["fetchHotelByName", name],
    () => apiClient.fetchHotelByName(name || ""),
    {
      enabled: !hotelId && !!name,
    }
  );

  const hotel = hotelQuery.data || hotelByNameQuery.data;

  const handleNext = () => {
    if (!hotel?.imageUrls) return;
    const isLastSlide = currentIndex === hotel.imageUrls.length - slidesToShow;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => {
    if (!hotel?.imageUrls) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? hotel.imageUrls.length - slidesToShow
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const getDisplayedImages = () => {
    if (!hotel?.imageUrls || hotel.imageUrls.length === 0) {
      return [];
    }

    const images = hotel.imageUrls;
    const totalImages = images.length;
    const displayedImages = [];

    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % totalImages;
      displayedImages.push(images[index]);
    }

    return displayedImages;
  };

  if (!hotel) {
    return <></>;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden px-2">
          {getDisplayedImages().map((image, index) => (
            <div key={index} className="h-[300px]">
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center border"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-md"
        >
          <BiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-md"
        >
          <BiChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="w-full lg:container px-8 lg:mx-auto space-y-2">
        <div className="flex md:flex-row flex-col-reverse gap-4 space-y-2 justify-between">
          <div className="flex flex-col gap-2 w-full lg:w-2/3">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-bold">{hotel.name}</span>
                <span>3 star</span>
              </div>
              <div className="flex gap-2">
                <span className="flex">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <AiFillStar key={i} className="fill-yellow-400" />
                  ))}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {hotel.facilities.map((facility, index) => (
                <Tooltip key={index} text={facility}>
                  <div className="border border-slate-300 rounded-sm p-3 flex items-center space-x-2 cursor-pointer">
                    {facilityIcons[facility as FacilityKey] && (
                      <span>{facilityIcons[facility as FacilityKey]}</span>
                    )}
                  </div>
                </Tooltip>
              ))}
            </div>
            <div className="whitespace-pre-line">{hotel.description}</div>
          </div>

          <div className="w-full lg:w-1/3 hidden lg:block">
            <div className="h-fit">
              {/* <GuestInfoForm
                pricePerNight={hotel.pricePerNight}
                hotelId={hotel._id}
              /> */}
              <div className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Your Cart</h2>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={hotel.imageUrls[0]}
                      alt={hotel.name}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div>
                      <h3 className="text-md font-semibold">{hotel.name}</h3>
                      <p className="text-sm text-gray-500">
                        Please select a product to continue
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal:</span>
                      <span>$0 USD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
