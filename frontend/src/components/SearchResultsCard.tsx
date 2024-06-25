import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { AiFillStar } from "react-icons/ai";
import Cookies from "js-cookie";
import Button from "./Button";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const [mainImage, setMainImage] = useState(hotel.imageUrls[0]);
  const auth_token = Cookies.get("authentication");
  const isLoggedIn = auth_token ? JSON.parse(auth_token) : null;
  const navigate = useNavigate();

  const handleButtonClick = (id: string) => {
    if (isLoggedIn === null) {
      navigate("/login");
    } else {
      navigate(`/detail/${id}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row border border-slate-300 rounded-md p-4 gap-4 lg:gap-8 mx-5 md:mx-0 justify-between">
      <div className="flex flex-col md:flex-row gap-7">
        {/* Images Section */}
        <div className="w-full mb-[5px] md:w-[239px]">
          <div className="mb-2">
            <img
              src={mainImage}
              className="w-full md:w-[243px] h-[152px] object-cover object-center rounded-lg"
            />
          </div>
          <div className="grid gap-1.5 grid-cols-4 w-full md:w-[239px] cursor-pointer">
            {hotel.imageUrls.slice(0, 4).map((image, index) => (
              <span
                key={index}
                className="relative"
                onMouseEnter={() => setMainImage(image)}
              >
                <img
                  src={image}
                  alt=""
                  className="rounded-md h-[50px] hover:opacity-75 transition-opacity duration-200"
                />
                <span className="absolute inset-0 rounded-md bg-white opacity-0 hover:opacity-30 transition-opacity duration-200"></span>
              </span>
            ))}
          </div>
        </div>
        {/* Images Section Ends */}

        {/* Content Section */}
        <div className="flex flex-col gap-3 md:max-w-[460px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="ml-1 text-sm">{hotel.hotelType}</span>
              {/* <span className="text-sm py-1 px-2 text-white bg-btnColor rounded-md">{hotel.starRating}</span> */}
              <span className="flex">
                {Array.from({ length: hotel.star }).map((_, index) => (
                  <AiFillStar key={index} className="fill-yellow-400" />
                ))}
              </span>
            </div>
            <Link
              to={`/detail/${hotel._id}`}
              className="text-lg lg:text-xl font-bold cursor-pointer"
            >
              {hotel.name}
            </Link>
          </div>

          <div>
            <div className="line-clamp-4 text-sm">{hotel.description}</div>
          </div>

          <div className="grid grid-cols-2 items-start font-medium">
            <div className="flex flex-wrap gap-1 text-white">
              {hotel.facilities.slice(0, 3).map((facility, index) => (
                <span
                  key={index}
                  className="bg-goldColor p-2 rounded-md text-xs"
                >
                  {facility}
                </span>
              ))}
              <span className="text-sm text-black">
                {hotel.facilities.length > 3 &&
                  `+${hotel.facilities.length - 3} more`}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-white">
            <span className="text-sm text-black font-bold">Products </span>
            <span className="flex flex-wrap">
              {hotel.productTitle.slice(0, 3).map((facility, index) => (
                <span
                  key={index}
                  className="bg-goldColor p-2 rounded-md text-xs"
                >
                  {facility.title}
                </span>
              ))}
            </span>
            <span className="text-sm text-black">
              {hotel.productTitle.length > 3 &&
                `+${hotel.productTitle.length - 3} more`}
            </span>
          </div>
        </div>
        {/* Content Section End */}
      </div>
      <div className="grid gap-2 content-around ">
        <span className="text-btnColor font-bold text-nowrap">
          <span className="text-gray-700 font-medium">Starting from</span> ₹{" "}
          {hotel?.productTitle[0]?.adultPrice}
        </span>
        <Button
          className="text-sm "
          onClick={() => handleButtonClick(hotel._id)}
        >
          {isLoggedIn === null ? "Login to book now!" : "Book Now"}
        </Button>
      </div>
    </div>
  );
};

export default SearchResultsCard;
