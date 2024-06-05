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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      checkIn,
    );
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);


  return (
    <form
  onSubmit={handleSubmit}
  className="absolute z-100 top-[52rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-8 p-3 bg-white rounded-full shadow-md w-[50rem]"
>
  <div className="flex justify-between items-center w-full space-x-4">
    <div className="flex items-center bg-white p-2 flex-1">
      <FaLocationDot size={25} className="mr-2" />
      <input
        placeholder="Where are you going?"
        className="text-md w-full focus:outline-none"
        value={destination}
        onChange={(event) => setDestination(event.target.value)}
      />
    </div>

    <div className="flex items-center space-x-2 flex-1">
      <MdCalendarMonth className="text-xl"/>
      <div className="w-full">
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date )}
          selectsStart
          startDate={checkIn}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in Date"
          className="w-full bg-white p-2 focus:outline-none"
          wrapperClassName="w-full"
        />
      </div>
    </div>

    <div className="flex flex-1 justify-end">
      <button
        className="w-2/3 bg-[#57BFCE] text-white h-full p-4 font-semibold text-md rounded-full hover:bg-[#2f8794]"
        type="submit"
      >
        Search
      </button>
    </div>
  </div>
</form>

  );
};

export default SearchBar;
