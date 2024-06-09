import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  hotel: HotelType;
};

const TopDestinationCard = ({ hotel }: Props) => {
  return (
    <div className="flex lg:flex-wrap mt-3 pl-5 lg:px-0">
      <Link
        to={`/detail/${hotel._id}`}
        className="min-w-[300px] lg:min-w-auto lg:w-1/4 pr-5 mb-3"
      >
        <div className="relative group overflow-hidden">
          <img
            src={hotel.imageUrls[0]}
            className="w-full h-96 object-cover rounded-lg"
            alt={hotel.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#303131] to-transparent group-hover:from-[#464747] rounded-lg p-3 flex items-end transition duration-300">
            <div className="absolute text-white text-left bottom-5">
              <span className="text-xs md:text-sm font-thin">Explore</span>
              <h3 className="text-xl md:text-2xl font-semibold -mt-1">
                {hotel.name}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TopDestinationCard;
