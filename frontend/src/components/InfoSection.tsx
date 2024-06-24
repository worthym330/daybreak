import { CiMap } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { MdOutlineSupportAgent } from "react-icons/md";

const InfoSection = () => {
  return (
    <div className="py-14 px-4 flex flex-col gap-8 lg:flex-row lg:gap-14 mt-20">
      <div className="flex items-start md:items-center gap-4">
        <div className="bg-darkGold rounded-full p-2">
          <CiMap className="text-4xl text-white" />
        </div>
        <div className="flex flex-col md:ml-4">
          <p className="font-semibold text-base text-goldColor font-LuzuryF3">Discover DayBreakPass</p>
          <p className="leading-5 text-sm text-darkGold">
            Select a date and explore pool, spa, beach access and more, at 1,000+ top hotels.
          </p>
        </div>
      </div>

      <div className="flex items-start md:items-center gap-4">
        <div className="bg-darkGold rounded-full p-2">
          <IoCartOutline className="text-4xl text-white" />
        </div>
        <div className="flex flex-col md:ml-4">
          <p className="font-semibold text-base text-goldColor font-LuzuryF3">Book Confidently</p>
          <p className="leading-5 text-sm text-darkGold">
            After booking, receive check-in instructions, parking details, and all necessary information.
          </p>
        </div>
      </div>

      <div className="flex items-start md:items-center gap-4">
        <div className="bg-darkGold rounded-full p-2">
          <MdOutlineSupportAgent className="text-4xl text-white" />
        </div>
        <div className="flex flex-col md:ml-4">
          <p className="font-semibold text-base text-goldColor font-LuzuryF3">Flexible Support and Cancellation</p>
          <p className="leading-5 text-sm text-darkGold">
            Invite guests or cancel bookings as needed with support on our website or app.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
