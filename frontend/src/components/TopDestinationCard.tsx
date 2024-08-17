// import { Link } from "react-router-dom";
import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { useSearchContext } from "../contexts/SearchContext";

type Props = {
  hotel: HotelType;
};

const TopDestinationCard = ({ hotel }: Props) => {
  const search = useSearchContext();
  return (
    <div
      className="flex flex-wrap justify-center lg:justify-start mt-3 px-2 lg:px-0"
      onClick={() => {
        search.saveSearchValues(hotel.city, search.checkIn);
      }}
    >
      <Link
        to={`/listings?city=${hotel.city}`}
        className="flex-1 lg:w-1/4 px-2 mb-4 lg:mb-0"
      >
        <div className="relative group overflow-hidden ">
          <img
            src={hotel.imageUrls[0]}
            className="w-full h-96 object-cover rounded-lg"
            alt={hotel.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#303131] to-transparent group-hover:from-[#464747] rounded-lg p-3 flex items-end transition duration-300">
            <div className="absolute text-white text-left bottom-5">
              <span className="text-xs md:text-sm font-thin">Explore</span>
              <h3 className="text-xl md:text-2xl font-semibold -mt-1">
                {hotel.city}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TopDestinationCard;
