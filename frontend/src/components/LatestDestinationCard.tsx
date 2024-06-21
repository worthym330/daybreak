import { AiFillStar } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";

const LatestDestinationCard = ({ hotel }: any) => {
  const navigate = useNavigate();
  return (
    <div className="relative border border-goldColor pb-5 pt-3 px-3 rounded-xl" key={hotel._id}>
      <div className="relative bg-cover bg-center block max-w-full overflow-hidden">
        <Link to={`/detail/${hotel._id}`}>
          <div className="h-[250px]">
            <img
              src={hotel.imageUrls[0]}
              alt="hotel Image"
              className="rounded-md w-full h-full object-cover object-center"
            />
          </div>
        </Link>
        <div className="">
          <Link to={`/detail/${hotel._id}`}>
            <p className="flex gap-2 mt-4 text-sm font-semibold items-center">
              <FaLocationDot className="text-darkGold" />
              <span className="text-goldColor">
                {hotel.city}, {hotel.country}
              </span>
            </p>
            <span className="p-2 font-semibold truncate">{hotel.name}</span>
          </Link>
        </div>
        <div className="flex justify-between p-2 mt-4 items-center">
          <span className="flex gap-2 bg-goldColor text-white font-semibold rounded-lg px-3 py-2">
            <AiFillStar className="w-5 h-5 " />
            {hotel.starRating}
          </span>
          <Button onClick={() => navigate(`/waitlist`)} type="button">
            Join Waitlist
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LatestDestinationCard;
