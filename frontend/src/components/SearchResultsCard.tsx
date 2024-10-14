import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { AiFillStar } from "react-icons/ai";
import Button from "./Button";
import { AmenitiesIcons, FacilityKey, Tooltip } from "../pages/Detail";
import {
  initialModalState,
  initialResetModal,
  initialSignupModalState,
  RenderLoginModal,
  RenderSignUpModal,
  ResetPassRequest,
} from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FaHeart } from "react-icons/fa";
import { addFavorite, addHotel, removeFavorite } from "../store/favSlice";
import ConfirmationModal from "./AlertModal";
// import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type Props = {
  hotel: HotelType;
};

export type FavouriteList = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const [mainImage, setMainImage] = useState(hotel.imageUrls[0]);
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modal, setModal] = useState(initialModalState);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const favorites = useSelector((state: RootState) => state.fav.favorites);
  const isFavourite = favorites.some((fav: any) => fav._id === hotel._id);

  const handleButtonClick = (id: string) => {
    navigate(`/hotel-detail/${id}`);
  };

  const handleToggleFavourite = async () => {
    if (auth.user) {
      const user: FavouriteList = {
        userId: auth.user.id,
        firstName: auth.user.name.split(" ")[0],
        lastName: auth.user.name.split(" ").pop(),
        email: auth.user.email,
      };

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/hotels/${hotel._id}/favourite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (res.ok) {
          if (isFavourite) {
            dispatch(removeFavorite(hotel._id));
          } else {
            dispatch(addFavorite(hotel));
          }
          setConfirmationDialog(true);
          // toast.success(isFavourite ? 'Removed from favorites' : 'Added to favorites');
        } else {
          console.log("Failed to toggle favorite");
        }
      } catch (error) {
        console.error("An error occurred while toggling favorite");
      }
    } else {
      dispatch(addHotel(hotel));
      setModal((prev: any) => ({ ...prev, state: true, hotel }));
    }
  };

  return (
    <div className="border-2 hover:border-[#00C0CB] shadow-md rounded-md p-4 lg:mx-0 justify-between bg-[#ECFDFF]">
      <RenderLoginModal
        modal={modal}
        setModal={setModal}
        setResetModal={setResetModal}
        setSignupModal={setSignupModal}
        isHeader={false}
        isBooking={false}
        isFavourite={true}
      />
      <RenderSignUpModal
        modal={signupModal}
        setModal={setSignupModal}
        initialModalState={initialSignupModalState}
        setLoginModal={setModal}
        isHeader={false}
      />
      <ResetPassRequest modal={resetModal} setModal={setResetModal} />
      <ConfirmationModal
        setOpen={setConfirmationDialog}
        open={confirmationDialog}
        onDelete={() => navigate("/my-favourites")}
        title={isFavourite ? "Added to favorites" : "Removed from favorites"}
        confirmationButtonText="View Favourites"
        description={
          isFavourite
            ? "This hotel has been successfully added to your favorites list. You can view it anytime in your favorites."
            : "This hotel has been removed from your favorites list. You can view your updated favorites anytime."
        }
      />
      <div className="flex flex-col md:flex-row gap-7">
        {/* Images Section */}
        <div className="w-full mb-[5px] md:w-[239px]">
          <div className="mb-2">
            <img
              src={mainImage}
              className="w-full md:w-[243px] h-[200px] object-cover object-center rounded-lg"
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
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div className="text-sm">
                  {hotel.city}, {hotel.state}
                </div>
                <Link
                  to={`/hotel-detail/${hotel._id}`}
                  className="text-sm md:text-lg lg:text-xl font-bold cursor-pointer text-[#02596C]"
                >
                  {hotel.name}
                </Link>
              </div>
              <div>
                <button onClick={handleToggleFavourite}>
                  {isFavourite ? (
                    <FaHeart className="w-6 h-6 text-red-500 fill-current" />
                  ) : (
                    <FaHeart className="w-6 h-6 text-gray-300 fill-current" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center text-md mt-1 gap-1 md:gap-5 w-full ">
              {hotel.hotelType.length > 0 && (
                <span className="border bg-[#02596C] px-3 py-2 rounded-lg text-white font-semibold text-xs">
                  {hotel.hotelType[0]}
                </span>
              )}
              <div className="flex flex-wrap items-center">
                <div className="flex items-center">
                  {[...Array(hotel.star)].map((_, i) => (
                    <AiFillStar key={i} className="w-5 h-5 text-goldColor" />
                  ))}
                  {[...Array(5 - hotel.star)].map((_, i) => (
                    <AiFillStar key={i} className="w-5 h-5 text-gray-300" />
                  ))}
                </div>
                <span className="ml-2 text-nowrap">
                  {" "}
                  <span className="text-goldColor">
                    {hotel.star.toFixed(1)}
                  </span>{" "}
                  | <span className="text-goldColor">100 reviews</span>
                </span>
              </div>
            </div>
          </div>
          <div className="w-full font-medium">
            <div className="flex flex-wrap gap-1 text-white items-center">
              {hotel.facilities.slice(0, 6).map((facility, index) => (
                <Tooltip key={index} text={facility}>
                  <div className="rounded-md p-2 flex items-center space-x-2 text-goldColor text-xl">
                    {AmenitiesIcons[facility as FacilityKey] && (
                      <span className="text-goldColor">
                        {AmenitiesIcons[facility as FacilityKey]}
                      </span>
                    )}
                  </div>
                </Tooltip>
              ))}
              <span className="text-sm text-black text-nowrap">
                {hotel.facilities.length > 6 &&
                  `+${hotel.facilities.length - 6} more`}
              </span>
            </div>
          </div>

          <div>
            <div className="line-clamp-2 text-sm text-black font-inter">
              {hotel.description}
            </div>
          </div>

          {/* Passes Price Details Start */}
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-2 mt-3">
              {hotel.productTitle.slice(0, 3).map((facility, index) => (
                <div
                  className="flex flex-col border-r pr-5 items-center border-black"
                  key={index}
                >
                  <span className="text-black font-sans font-bold text-sm">
                    {facility.title}
                  </span>
                  <span className="text-lg text-goldColor font-semi-bold">
                    ₹{" "}
                    {facility.childPrice > facility.adultPrice
                      ? facility.childPrice
                      : facility.adultPrice}
                  </span>
                  {/* <span className="text-sm">Only 5 left</span> */}
                </div>
              ))}
              <div className="flex items-center">
                <span className="text-sm text-black">
                  {hotel.productTitle.length > 3 &&
                    `+${hotel.productTitle.length - 3} more`}
                </span>
              </div>
            </div>
            <div className="mt-3 lg:mt-0">
              <Button
                className="text-sm text-nowrap"
                onClick={() => handleButtonClick(hotel._id)}
              >
                Book Now
              </Button>
            </div>
          </div>
          {/* Passes Price Details Start */}
        </div>
        {/* Content Section End */}
      </div>
    </div>
  );
};

export default SearchResultsCard;
