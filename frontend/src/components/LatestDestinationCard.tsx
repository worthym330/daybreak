import { AiFillStar } from "react-icons/ai";
import { FaMapMarkerAlt, FaShare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { toast } from "react-toastify";

const LatestDestinationCard = ({ hotel }: any) => {
  const navigate = useNavigate();

  const handleShare = () => {
    const frontendurl = import.meta.env.VITE_FRONTEND_URL;
    const link = `${frontendurl}/hotel-detail/name/${hotel.name}`; // Get the current URL
    console.log(link);
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Show success toast
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the link: ", err);
        toast.error("Failed to copy the link.");
      });
  };

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg font-poppins text-white bg-[#00c0cb] mb-5">
      <Link to={`/hotel-detail/${hotel._id}`}>
        <div className="relative">
          <img
            src={hotel.imageUrls[0]}
            alt="Hotel Image"
            className={`w-full h-48 object-cover ${
              !hotel.status && "grayscale"
            }`}
          />
          <p className="flex items-center text-sm font-semibold mb-2 absolute bottom-0 px-4">
            <FaMapMarkerAlt className="font-bold mr-1" />
            {hotel.city}, {hotel.state}
          </p>
          {!hotel.status && (
            <p className="flex items-center text-sm font-semibold mb-2 absolute top-0 right-0 px-4 bg-red-500 uppercase rounded-t-md">
              sold out
            </p>
          )}
        </div>
        <div className="px-6 pt-4">
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
          <div className="flex flex-wrap gap-1 text-white items-center">
            <span>
              {hotel?.productTitle
                ?.slice(0, 3)
                ?.map((facility: any, index: number) => (
                  <span
                    key={index}
                    className="pr-2 rounded-md text-sm text-nowrap"
                  >
                    {facility.title}
                  </span>
                ))}
            </span>
            {/* <span className="text-sm ">
            {hotel?.productTitle?.length > 3 &&
              `+${hotel?.productTitle?.length - 3} more`}
          </span> */}
          </div>
          <p className="text-base font-bold">
            Starting at ₹ {hotel?.productTitle[0]?.adultPrice || 2999}
          </p>
        </div>
      </Link>
      <div className="flex justify-between py-4 px-6 items-center">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => handleShare()}
        >
          <span className="text-lg underline">Share</span>
          <FaShare />
        </div>
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
  );
};

export default LatestDestinationCard;
