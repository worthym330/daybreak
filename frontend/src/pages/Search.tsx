import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import hotelImg1 from "../assets/taj.jpg";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    // checkOut: search.checkOut.toISOString(),
    // adultCount: search.adultCount.toString(),
    // childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

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

  const topRowHotels = [
    {
      _id: 1,
      imageUrls: [hotelImg1, "//r1imghtlak.mmtcdn.com/56d4be4e-3f01-4c60-a5c0-bb28ffd869ae.jpeg?&output-quality=75&downsize=243:162&crop=243:162;0,10&output-format=webp", hotelImg1, "//r1imghtlak.mmtcdn.com/1bd28797-1a31-441e-b3c2-e56bbfd18010.jpg?&output-quality=75&downsize=243:162&crop=243:162;0,10&output-format=webp", hotelImg1],
      name: "Taj Hotel",
      location: "Mumbai, India",
      rating: 4.9,
      price: 1000,
      starRating: 4.2,
      description:
        "Hotels are available for customers and customers with more than one hotel available for customers and customers with more than one hotel available for customers and customers with more than.",
      facilities: ["Swimming Pool", "Fitness Center", "Restaurant", "Parking"],
      pricePerNight: 1000,
      type: "Hotel",
    },
    {
      _id: 2,
      imageUrls: [hotelImg1, "//r1imghtlak.mmtcdn.com/56d4be4e-3f01-4c60-a5c0-bb28ffd869ae.jpeg?&output-quality=75&downsize=243:162&crop=243:162;0,10&output-format=webp", hotelImg1, "//r1imghtlak.mmtcdn.com/1bd28797-1a31-441e-b3c2-e56bbfd18010.jpg?&output-quality=75&downsize=243:162&crop=243:162;0,10&output-format=webp", hotelImg1],
      name: "Taj Hotel",
      location: "Mumbai, India",
      rating: 4.9,
      price: 1000,
      starRating: 4.2,
      description:
        "Hotels are available for customers and customers with more than one hotel",
      facilities: ["Swimming Pool", "Fitness Center", "Restaurant", "Parking"],
      pricePerNight: 1000,
      type: "Hotel",
    },
  ];

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className={`fixed lg:static top-0 left-0 w-full lg:w-auto h-full lg:h-auto bg-white z-50 lg:z-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 lg:translate-x-0`}>
        <div className="rounded-lg border border-slate-300 p-5 h-full lg:h-fit lg:sticky lg:top-10 overflow-y-auto">
          <div className="space-y-5 h-full flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-300 pb-5">
              <h3 className="text-lg font-semibold">
                Filter by:
              </h3>
              <button className="lg:hidden text-xl" onClick={() => setIsSidebarOpen(false)}>&times;</button>
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
            <PriceFilter
              selectedPrice={selectedPrice}
              onChange={(value?: number) => setSelectedPrice(value)}
            />
            <div className="flex-grow pb-5">
              <button className="lg:hidden w-full bg-blue-500 text-white py-2 rounded-md" onClick={() => setIsSidebarOpen(false)}>Apply</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center mx-auto md:mx-0">
          <div className="flex items-center gap-2">
            <button className="lg:hidden bg-blue-500 text-white py-2 px-4 rounded-md" onClick={() => setIsSidebarOpen(true)}>Filters</button>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
            </select>
          </div>
        </div>
        <span className="text-xl font-bold text-center md:text-left">
            {hotelData?.pagination.total} Hotels found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
        {topRowHotels.map((hotel: any) => (
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
