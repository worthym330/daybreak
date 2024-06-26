import { AiFillStar } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const LatestDestinationCard = ({ hotel }: any) => {
  const navigate = useNavigate();
  return (
    <div
      className="border border-goldColor pb-5 pt-3 px-3 rounded-xl"
      key={hotel._id}
    >
      <div className="relative max-w-full">
        <div className="h-[250px]">
          <img
            src={hotel.imageUrls[0]}
            alt="hotel Image"
            className="rounded-md w-full h-full object-cover object-center"
          />
        </div>
        <div className="">
          <p className="flex gap-2 mt-4 text-sm font-semibold items-center">
            <FaLocationDot className="text-goldColor" />
            <span className="text-goldColor">
              {hotel.city}, {hotel.state}, India
            </span>
          </p>
          <span className="p-2 font-semibold truncate">{hotel.name}</span>
        </div>
        <div className="flex gap-4 justify-end">
          {/* <span className="flex flex-wrap w-1/2">
            {hotel.productTitle
              .slice(0, 3)
              .map((facility: any, index: number) => (
                <span
                  key={index}
                  className="bg-goldColor p-2 rounded-md text-xs text-white"
                >
                  {facility.title}
                </span>
              ))}
          </span> */}
          <span className="text-btnColor font-bold text-nowrap">
            <span className="text-gray-700 font-medium">Starting from</span> ₹{" "}
            {hotel?.productTitle[0]?.adultPrice}
          </span>
        </div>
        <div className="flex justify-between p-2 mt-4 items-center">
          <span className="flex gap-2 bg-goldColor text-white rounded px-3 py-2 items-center">
            <AiFillStar className="w-5 h-5 " />
            {hotel.star}
          </span>
          <Button
            type="button"
            onClick={() => {
              navigate(`/detail/${hotel._id}`);
            }}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LatestDestinationCard;
