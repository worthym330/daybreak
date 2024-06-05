import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";

// Icons
import { FaLocationDot } from "react-icons/fa6";
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
  const [checkOut] = useState<Date>(search.checkOut);
  const [adultCount] = useState<number>(search.adultCount);
  const [childCount] = useState<number>(search.childCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
      checkOut,
      adultCount,
      childCount
    );
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);


  return (
    <form
      onSubmit={handleSubmit}
      className="absolute z-100 top-[40rem] mt-8 mr-[10rem] p-5 bg-white rounded-xl shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols- items-center gap-4"
    >
      <div className="flex flex-row items-center flex-1 bg-white p-2">
        <FaLocationDot size={25} className="mr-2" />
        <input
          placeholder="Where are you going?"
          className="text-md w-full focus:outline-none"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <MdCalendarMonth className="text-xl"/>
        <div className="flex-1">
          <DatePicker
            selected={checkIn}
            onChange={(date) => setCheckIn(date as Date )}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText="Check-in Date"
            className="w-full bg-white p-2 focus:outline-none"
            wrapperClassName="w-full"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="w-2/3 bg-[#57BFCE] text-white h-full p-4 font-semibold text-md rounded-xl hover:bg-[#2f8794]"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
