import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";

// Icons
import { FaLocationDot } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
//

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(destination, checkIn);
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  return (
    <div className="absolute z-100 top-[38rem] md:[38rem] lg:top-[38rem] xl:top-[44rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 w-11/12 md:w-2/3 lg:w-1/2">
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white rounded-full shadow-md h-14 flex items-center justify-between"
      >
        <div className="md:w-5/12 w-2/5 flex items-center border-r-2 h-full relative border-dark-200">
          <FaLocationDot className="text-xl mr-2 text-btnColor" />
          <input
            placeholder="Where are you going?"
            className="text-md w-full focus:outline-none"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
          />
        </div>

        <div className="flex-1 flex items-center h-full pl-5">
          <MdCalendarMonth className="text-2xl mr-2 text-btnColor" />
          <div className="w-full">
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date as Date)}
              selectsStart
              startDate={checkIn}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="w-full bg-white focus:outline-none"
              wrapperClassName="w-full"
            />
          </div>
        </div>
        <div className="h-10 w-10 md:w-28 text-white text-sm font-medium rounded-full bg-orange-500 flex items-center justify-center">
          <button
            className="flex-1 bg-btnColor text-white h-full font-semibold text-md rounded-full hover:bg-[#2f8794] transition-all duration-200 flex items-center justify-center py-5"
            type="submit"
          >
            <FaSearch className="sm:mr-3 mr-0 items-center" />
            <span className="hidden md:inline-block">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
