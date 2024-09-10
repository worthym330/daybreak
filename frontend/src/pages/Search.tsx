import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useEffect, useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
// import PriceFilter from "../components/PriceFilter";
import { useLocation } from "react-router-dom";
import GuestRatingFilter from "../components/GuestRatingFilter";
import PassesFilter from "../components/PassesFilter";
import Select from "react-select";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

type CityOption = {
  value: string;
  label: string;
};

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [guestStars, setGuestStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedPassesTypes, setSelectedPassesTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  // const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  // const [sortOption, setSortOption] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const queryParams = useQueryParams();
  const city = queryParams.get("city");
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [selectedCities, setSelectedCities] = useState<any[]>([]);

  const searchParams = {
    destination: city ? city : "",
    checkIn: search.checkIn.toISOString(),
    // checkOut: search.checkOut.toISOString(),
    // adultCount: search.adultCount.toString(),
    // childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    passes: selectedPassesTypes,
    // maxPrice: selectedPrice?.toString(),
    // sortOption,
    isAvailable,
    guestStars,
    cities: selectedCities,
  };

  if (queryParams.size === 0) {
    search.saveSearchValues("", search.checkIn);
  }

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const getHotelData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/hotels/search`);
      if (response.ok) {
        const data = await response.json();
        const cities = data.data.map((hotel: { city: string }) => hotel.city); // Adjust to your data structure
        const uniqueCities = [...new Set(cities)].map((city) => ({
          value: city,
          label: city,
        })) as CityOption[];
        setCityOptions(uniqueCities);
      } else {
        console.log(response.ok);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHotelData();
  }, []);

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleGuestsStarsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const starRating = event.target.value;

    setGuestStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;
    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType)
    );
  };

  const handlePassesTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;

    setSelectedPassesTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType)
    );
  };
  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  const handleClear = () => {
    setSelectedStars([]);
    setSelectedHotelTypes([]);
    setSelectedFacilities([]);
    setIsAvailable(false);
    setSelectedPassesTypes([]);
    setGuestStars([]);
  };

  return (
    <div className="relative w-full 2xl:max-w-screen-2xl 2xl:mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5">
      <div
        className={`fixed lg:static top-0 left-0 w-full lg:w-auto h-full lg:h-auto bg-white z-50 lg:z-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0`}
      >
        <div className="rounded-lg  p-5 h-full lg:h-fit lg:sticky lg:top-10 overflow-y-auto">
          <div className="space-y-5 h-full flex flex-col">
            <div className="flex justify-between items-center border-b pb-5">
              <h3 className="text-lg font-semibold">Select Filters</h3>
              <button
                className="lg:hidden text-xl"
                onClick={() => setIsSidebarOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="border-b pb-5 font-inter">
              <h4 className="text-lg mb-2">Availability</h4>
              <label className="flex justify-between items-center space-x-2 leading-loose">
                <span className="text-sm text-black ">
                  Only show hotels with availability
                </span>
                <input
                  type="checkbox"
                  className="rounded input-box text-[#4A4A4A]"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(!isAvailable)}
                />
              </label>
            </div>
            <div className="border-b pb-5 font-inter">
              <h4 className="text-lg mb-2">Cities</h4>
              <label className="w-full leading-loose">
                <Select
                  isMulti={true}
                  isClearable
                  isSearchable
                  options={cityOptions}
                  value={selectedCities}
                  onChange={(option) => {
                    setSelectedCities(option.map((e) => e));
                  }}
                  placeholder="Select Cities"
                  className="mt-4"
                />
              </label>
            </div>
            <StarRatingFilter
              selectedStars={selectedStars}
              onChange={handleStarsChange}
            />
            <GuestRatingFilter
              selectedStars={guestStars}
              onChange={handleGuestsStarsChange}
            />

            <PassesFilter
              selectedHotelTypes={selectedPassesTypes}
              onChange={handlePassesTypeChange}
            />

            <FacilitiesFilter
              selectedFacilities={selectedFacilities}
              onChange={handleFacilityChange}
            />
            <HotelTypesFilter
              selectedHotelTypes={selectedHotelTypes}
              onChange={handleHotelTypeChange}
            />

            <div>
              <button
                className="text-[#00C0CB] underline underline-offset-4 text-lg"
                onClick={() => handleClear()}
              >
                Clear All
              </button>
            </div>

            {/* <PriceFilter
              selectedPrice={selectedPrice}
              onChange={(value?: number) => setSelectedPrice(value)}
            /> */}
            <div className="flex-grow pb-5">
              <button
                className="lg:hidden w-full bg-goldColor text-white py-2 rounded-md"
                onClick={() => setIsSidebarOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center mx-auto md:mx-0">
          <div className="flex items-center gap-2">
            <button
              className="lg:hidden bg-goldColor text-white py-2 px-4 rounded-md"
              onClick={() => setIsSidebarOpen(true)}
            >
              Filters
            </button>
            {/* <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="px-4 py-3 border rounded-md bg-transparent"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">Price (low to high)</option>
              <option value="pricePerNightDesc">Price (high to low)</option>
            </select> */}
          </div>
        </div>
        <span className="text-sm font-semi-bold text-center lg:text-left font-poppins">
          Showing {hotelData?.pagination.total} Hotels
          {search.destination ? ` in ${search.destination}` : ""}
        </span>
        {hotelData?.data?.map((hotel: any) => (
          <SearchResultsCard key={hotel.id} hotel={hotel} />
        ))}
        <div>
          <Pagination
            page={hotelData?.pagination.page || 1}
            pages={hotelData?.pagination.pages || 1}
            onPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
