import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoShareSocial } from "react-icons/io5";
import { AiFillStar } from "react-icons/ai";

const LatestDestinationCard = ({ hotel }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (event: any) => {
    event.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? hotel.imageUrls.length - 1
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (event: any) => {
    event.stopPropagation();
    const isLastSlide = currentIndex === hotel.imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  function shareInfo(hotel: any) {
    console.log("Share info", hotel);
  }

  return (
    <div className="w-full cursor-pointer overflow-hidden rounded-md max-w-sm shadow-lg block">
      <div className="relative h-[300px]">
        <Link to={`/detail/${hotel._id}`}>
          <img
            className="rounded-md w-full h-full object-cover object-center"
            src={hotel.imageUrls[currentIndex]}
            alt={hotel.name}
          />
        </Link>
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent w-full p-4 text-white">
          <h2 className="text-sm font-semibold">{hotel.city}, {' '} {hotel.country}</h2>
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 left-0 hover:bg-opacity-70">
          <button
            onClick={prevSlide}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            <FaChevronLeft />
          </button>
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-0 hover:bg-opacity-70">
          <button
            onClick={nextSlide}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {hotel.imageUrls.map((_: any, index: any) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
        </div>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2 justify-between bg-[#00b1cc] text-white">
        <Link to={`/detail/${hotel._id}`}>
          <div className="font-bold text-xl mb-2">{hotel.name}</div>
          <p className="text-base">
            Starting at{" "}
            <span className="font-bold">${hotel.price}</span>
          </p>
          <p className="">{hotel.description}</p>
        </Link>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <span> {hotel?.starRating && <div className="flex flex-row items-center">
              <AiFillStar className="w-6 h-6 "/>
              <span>{hotel.starRating}</span>

            </div> }</span>
          </div>
          <button
            className="flex items-center text-gray-300"
            onClick={() => shareInfo(hotel)}
          >
            <IoShareSocial className="mr-1" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestDestinationCard;
