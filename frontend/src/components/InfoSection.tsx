import { FaMap } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineSupportAgent } from "react-icons/md";

const InfoSection = () => {
  return (
    <div className="py-14 px-16 flex flex-col gap-8 lg:flex-row lg:gap-14 bg-[#f8efe6] rounded-3xl mx-4 md:mx-0">
      <div className="flex flex-col items-center gap-4 lg:w-1/3">
        <div className="">
          <FaMap className="text-4xl text-[#02596c]" />
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold text-xl text-goldColor font-LuzuryF3">Discover DayBreakPass</p>
          <p className="leading-5 text-sm">
            Select a date and explore pool, spa, beach access and more, at 1,000+ top hotels.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 lg:w-1/3">
        <div className="">
          <IoCartOutline className="text-4xl text-[#02596c]" />
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold text-xl text-goldColor font-LuzuryF3">Book Confidently</p>
          <p className="leading-5 text-sm">
            After booking, receive check-in instructions, parking details, and all necessary information.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 lg:w-1/3">
        <div className="">
          <MdOutlineSupportAgent className="text-4xl text-[#02596c]" />
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="font-semibold text-xl text-goldColor font-LuzuryF3">Flexible Support and Cancellation</p>
          <p className="leading-5 text-sm">
            Invite guests or cancel bookings as needed with support on our website or app.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
