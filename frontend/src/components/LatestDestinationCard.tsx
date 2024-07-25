import { AiFillStar } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const LatestDestinationCard = ({ hotel }: any) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-[#00c0cb] font-poppins text-white">
      <div className="relative">
        <img
          src={hotel.imageUrls[0]}
          alt="Hotel Image"
          className="w-full h-48 object-cover"
        />
        <p className="flex items-center text-sm font-semibold mb-2 absolute bottom-0 px-4">
          <FaMapMarkerAlt className="font-bold mr-1" />
          {hotel.city}, {hotel.state}
        </p>
      </div>
      <div className="px-6 py-4 bg-[#00c0cb]">
        <div className="font-bold text-xl mb-2 truncate">{hotel.name}</div>
        <div className="flex items-center mb-2">
          <div className="text-yellow-500 flex">
            {[...Array(hotel.star)].map((_, i) => (
              <AiFillStar key={i} className="w-5 h-5" />
            ))}
            {[...Array(5 - hotel.star)].map((_, i) => (
              <AiFillStar key={i} className="w-5 h-5 text-gray-300" />
            ))}
          </div>
          <span className="ml-2">{hotel.star}.0</span>
        </div>
        <div className="flex flex-wrap gap-1 text-white">
          <span>
            {hotel?.productTitle
              ?.slice(0, 3)
              ?.map((facility: any, index: number) => (
                <span key={index} className="pr-2 rounded-md text-sm">
                  {facility.title}
                </span>
              ))}
          </span>
          <span className="text-sm text-black">
            {hotel?.productTitle?.length > 3 &&
              `+${hotel?.productTitle?.length - 3} more`}
          </span>
        </div>
        <p className="text-base font-bold">
          Starting at ₹ {hotel?.productTitle[0]?.adultPrice || 2999}
        </p>

        <div className="flex justify-end pt-4">
          <Button
            type="button"
            onClick={() => {
              navigate(`/hotel-detail/${hotel._id}`);
            }}
            className="w-32"
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LatestDestinationCard;
