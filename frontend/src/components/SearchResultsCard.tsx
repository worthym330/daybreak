import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { AiFillStar } from "react-icons/ai";
import Cookies from "js-cookie";
import Button from "./Button";
import { facilityIcons, FacilityKey, Tooltip } from "../pages/Detail";
import {
  initialModalState,
  initialResetModal,
  initialSignupModalState,
  RenderLoginModal,
  RenderSignUpModal,
  ResetPassRequest,
} from "./Header";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const [mainImage, setMainImage] = useState(hotel.imageUrls[0]);
  const auth_token = Cookies.get("authentication");
  const isLoggedIn = auth_token ? JSON.parse(auth_token) : null;
  const navigate = useNavigate();
  const [modal, setModal] = useState(initialModalState);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);

  const handleButtonClick = (id: string) => {
    if (isLoggedIn === null) {
      setModal((prev: any) => ({ ...prev, state: true }));
    } else {
      navigate(`/hotel-detail/${id}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row border-2 hover:border-[#00C0CB] rounded-md p-4 gap-4 lg:gap-8 mx-5 md:mx-0 justify-between">
      <RenderLoginModal
        modal={modal}
        setModal={setModal}
        setResetModal={setResetModal}
        setSignupModal={setSignupModal}
        isHeader={false}
        isBooking={false}
      />
      <RenderSignUpModal
        modal={signupModal}
        setModal={setSignupModal}
        initialModalState={initialSignupModalState}
        setLoginModal={setModal}
        isHeader={false}
      />
      <ResetPassRequest modal={resetModal} setModal={setResetModal} />
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
        <div className="flex flex-col gap-3 w-full">
          <div>
            {/* <div className="flex items-center gap-2"> */}
            {/* <span className="ml-1 text-sm">{hotel.hotelType}</span> */}
            {/* <span className="text-sm py-1 px-2 text-white bg-btnColor rounded-md">{hotel.starRating}</span> */}
            {/* </div> */}
            <div className="text-sm">
              {hotel.city}, {hotel.state}
            </div>
            <Link
              to={`/hotel-detail/${hotel._id}`}
              className="text-lg lg:text-xl font-bold cursor-pointer text-[#02596C]"
            >
              {hotel.name}
            </Link>
            <div className="flex items-center text-md mt-1 gap-5 w-full ">
              {hotel.hotelType.length > 0 && (
                <span className="border bg-[#02596C] px-3 py-2 rounded-lg text-white font-semibold text-xs">
                  {hotel.hotelType[0]}
                </span>
              )}
              <div className="flex items-center">
                {[...Array(hotel.star)].map((_, i) => (
                  <AiFillStar key={i} className="w-5 h-5 text-goldColor" />
                ))}
                {[...Array(5 - hotel.star)].map((_, i) => (
                  <AiFillStar key={i} className="w-5 h-5 text-gray-300" />
                ))}
                <span> | 100 reviews</span>
              </div>
            </div>
          </div>
          <div className="w-full font-medium">
            <div className="flex  gap-1 text-white items-center">
              {hotel.facilities.slice(0, 5).map((facility, index) => (
                <Tooltip key={index} text={facility}>
                  <div className="rounded-md p-2 flex items-center space-x-2 cursor-pointer text-goldColor text-xl">
                    {facilityIcons[facility as FacilityKey] && (
                      <span className="text-goldColor">
                        {facilityIcons[facility as FacilityKey]}
                      </span>
                    )}
                  </div>
                </Tooltip>
              ))}
              <span className="text-sm text-black text-nowrap">
                {hotel.facilities.length > 5 &&
                  `+${hotel.facilities.length - 5} more`}
              </span>
            </div>
          </div>

          <div>
            <div className="line-clamp-2 text-sm text-[#717171]">
              {hotel.description}
            </div>
          </div>

          {/* <div className="flex flex-col gap-1 text-white">
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
          </div> */}

          {/* Passes Price Details Start */}
          <div className="flex gap-2 mt-3">
            {hotel.productTitle.slice(0, 3).map((facility, index) => (
              <div
                className="flex flex-col border-r pr-5 items-center"
                key={index}
              >
                <span className="text-[#02596C] text-sm">{facility.title}</span>
                <span className="text-2xl text-goldColor font-semi-bold">
                  {facility.childPrice > facility.adultPrice
                    ? facility.childPrice
                    : facility.adultPrice}
                </span>
                {/* <span className="text-sm">Only 5 left</span> */}
              </div>
            ))}
            <div className="flex items-center">
              <span>+1 More</span>
            </div>
          </div>
          {/* Passes Price Details Start */}
        </div>
        {/* Content Section End */}
      </div>
      <div className="grid gap-2 content-end">
        {/* <span className="text-btnColor font-bold text-nowrap">
          <span className="text-gray-700 font-medium">Starting from</span> ₹{" "}
          {hotel?.productTitle[0]?.adultPrice}
        </span> */}
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
