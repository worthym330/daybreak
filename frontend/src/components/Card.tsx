import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Card = ({ hotel }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (event: any) => {
    event.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? hotel.imageUrls.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (event: any) => {
    event.stopPropagation();
    const isLastSlide = currentIndex === hotel.imageUrls.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  function shareInfo(hotel: any) {
    console.log("Share info",hotel)
  }

  return (
    <div className="w-full cursor-pointer overflow-hidden rounded-md max-w-sm shadow-lg block">
      <div className="relative">
        <Link to={`/detail/${hotel._id}`}>
          <img
            className="w-full"
            src={hotel.imageUrls[currentIndex]}
            alt={hotel.name}
          />
        </Link>
        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent w-full p-4 text-white">
          <h2 className="text-lg font-semibold">{hotel.location}</h2>
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
      <div className="px-6 py-4 flex gap-2 justify-between">
        <Link to={`/detail/${hotel._id}`}>
          <div className="font-bold text-xl mb-2">{hotel.name}</div>
          <p className="text-gray-700 text-base">Starting at ${hotel.price}</p>
          <p className="text-blue-500">{hotel.description}</p>
        </Link>
        <div className="flex items-center">
          <button className="text-gray-500 hover:text-gray-900" onClick={()=>shareInfo(hotel)}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
