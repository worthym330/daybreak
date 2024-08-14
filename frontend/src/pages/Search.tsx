import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
// import PriceFilter from "../components/PriceFilter";
import { useLocation } from "react-router-dom";

const useQueryParams = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  // const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const queryParams = useQueryParams();
  const city = queryParams.get("city");

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
    // maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  if (queryParams.size === 0) {
    search.saveSearchValues("", search.checkIn);
  }

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
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
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
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
            <StarRatingFilter
              selectedStars={selectedStars}
              onChange={handleStarsChange}
            />

            <HotelTypesFilter
              selectedHotelTypes={selectedHotelTypes}
              onChange={handleHotelTypeChange}
            />
            <FacilitiesFilter
              selectedFacilities={selectedFacilities}
              onChange={handleFacilityChange}
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
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="px-4 py-3 border rounded-md bg-transparent"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">Price (low to high)</option>
              <option value="pricePerNightDesc">Price (high to low)</option>
            </select>
          </div>
        </div>
        <span className="text-lg font-semi-bold text-center md:text-left">
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
