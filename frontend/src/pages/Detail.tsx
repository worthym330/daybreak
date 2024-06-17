import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { MdCalendarMonth } from "react-icons/md";
import {
  FaDumbbell,
  FaHeart,
  FaParking,
  FaShuttleVan,
  FaSpa,
  FaSwimmingPool,
  FaWifi,
} from "react-icons/fa";
import { MdFamilyRestroom, MdSmokeFree } from "react-icons/md";
import { useAppContext } from "../contexts/AppContext";
import ProductCard from "../components/ProductCard";
import { FavouriteList } from "../../../backend/src/shared/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from "js-cookie";
import Button from "../components/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type FacilityKey =
  | "Free WiFi"
  | "Parking"
  | "Airport Shuttle"
  | "Family Rooms"
  | "Non-Smoking Rooms"
  | "Outdoor Pool"
  | "Spa"
  | "Fitness Center";

const facilityIcons = {
  "Free WiFi": <FaWifi />,
  Parking: <FaParking />,
  "Airport Shuttle": <FaShuttleVan />,
  "Family Rooms": <MdFamilyRestroom />,
  "Non-Smoking Rooms": <MdSmokeFree />,
  "Outdoor Pool": <FaSwimmingPool />,
  Spa: <FaSpa />,
  "Fitness Center": <FaDumbbell />,
};

const products = [
  {
    title: "Day Pass",
    features: [
      "Kona Pool",
      "Kohala River Pool with waterslides",
      "Hot tub",
      "Saltwater lagoon with white sand beach",
      "Grab-n-go food and beverages",
      "Kayaks, paddle-boats, and water bikes",
      "Complimentary wifi",
      "Valet parking available for a fee",
    ],
    priceAdult: "100",
    feeAdult: "9",
    priceChild: "60",
    feeChild: "5",
    priceInfant: "FREE",
    description:
      "Free admission for children under 5. $50 food and beverage minimum at Kona Pool Bar or Orchid Marketplace required for complimentary self-parking. No coolers or outside food and beverage allowed.",
  },
  {
    title: "Spa Pass",
    features: [
      "Indoor Jacuzzi",
      "Steam room",
      "Hot tub",
      "Fitness Center",
      "Relaxation Lounge",
      "Men's and Women's lockers and showers",
      "10% discount at spa retail shop",
      "Complimentary wifi",
      "Self Parking and valet parking available for a free",
    ],
    priceAdult: "40",
    feeAdult: "4",
    priceChild: "",
    feeChild: "",
    priceInfant: "",
    description:
      "Adults 18+ only. All amenities are unisex unless otherwise specified. Does not include access to property pools.",
  },
  {
    title: "Paradise Pool Daybed",
    features: [
      "Day Passes for up to 4 people (all amenities included in the Day Pass)",
      "Cushioned daybed for up to 4 people with towel service",
      "Chef's daily fruit selection plate",
      "Bottled water",
    ],
    priceAdult: "250",
    feeAdult: "22",
    priceChild: "",
    feeChild: "",
    priceInfant: "",
    description:
      "Located at the family-friendly Paradise Pool. Memorial Day, 4th of July and Labor Day Weekends - Groove & splash with a DJ performance on Saturday & Sunday, kid-friendly activities & exciting poolside events. Does not include access to the adult-only Saguaro Pool. If not checked in by 12:00pm, the resort reserves the right to cancel the reservation & re-sell the daybed. 20% service fee on the total price of the daybed, plus food and beverage purchased, will be charged at the property on the day of the rental. No outside food and beverages are permitted. Enhance your experience with food & beverage add-ons: Kid's Paradise: 2 non-alcoholic piña coladas or strawberry daiquiris, 2 orders of crispy chicken tenders, 1 pineapple pool float ($70). Sonoran Package: pitcher of skinny margaritas (serves 5-6), one order of chips, salsa, and guacamole ($99). Go Big Package: choice of any two flatbreads, 2 buckets of beer, 1 dessert of choice ($125). To book, select the Add-on at checkout. Does not include service charge. Service charge will be collected on property.",
  },
];

const Tooltip = ({ children, text }: any) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <div className="absolute bottom-full mb-2 px-2 py-1 border-2 border-black bg-white text-nowrap text-sm rounded-md shadow-full">
          {text}
        </div>
      )}
      {children}
    </div>
  );
};

const Detail = () => {
  const { hotelId, name } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState(false);
  const [carts, setCart] = useState([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const auth_token = Cookies.get("authentication") || "null";
  const userLogined = JSON.parse(auth_token);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSlidesToShow(1);
      } else {
        setSlidesToShow(3);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hotelQuery = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
    }
  );

  const hotelByNameQuery = useQuery(
    ["fetchHotelByName", name],
    () => apiClient.fetchHotelByName(name || ""),
    {
      enabled: !hotelId && !!name,
    }
  );

  const hotel = hotelQuery.data || hotelByNameQuery.data;

  const handleNext = () => {
    if (!hotel?.imageUrls) return;
    const isLastSlide = currentIndex === hotel.imageUrls.length - slidesToShow;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const handlePrev = () => {
    if (!hotel?.imageUrls) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide
      ? hotel.imageUrls.length - slidesToShow
      : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const getDisplayedImages = () => {
    if (!hotel?.imageUrls || hotel.imageUrls.length === 0) {
      return [];
    }

    const images = hotel.imageUrls;
    const totalImages = images.length;
    const displayedImages = [];

    for (let i = 0; i < slidesToShow; i++) {
      const index = (currentIndex + i) % totalImages;
      displayedImages.push(images[index]);
    }

    return displayedImages;
  };

  const toggleFavourite = async () => {
    if (userLogined !== null) {
      const user: FavouriteList = {
        userId: userLogined.id,
        firstName: userLogined.name.split(" ")[0],
        lastName:
          userLogined.name.split(" ")[userLogined.name.split(" ").length - 1],
        email: userLogined.email,
      };

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/hotels/${hotelId}/favourite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );
        if (res.ok) {
          // Handle success if necessary
        }
      } catch (error) {
        // Handle error if necessary
      }
    } else {
      showToast({ message: "Please log in to save", type: "ERROR" });
    }
  };

  const toggleFavouriteMutation = useMutation(toggleFavourite, {
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchHotelById", hotelId]);
    },
  });

  const handleToggleFavourite = () => {
    toggleFavouriteMutation.mutate();
  };

  const isFavourite = hotel?.favourites?.some(
    (fav: FavouriteList) => fav?.userId === userLogined?.id
  );

  useEffect(() => {
    const cart = Cookies.get("cart");
    const parsedCart = cart ? JSON.parse(cart) : [];
    setCartItems(parsedCart);
  }, [carts]);

  useEffect(() => {
    const storedDate = Cookies.get("date");
    const parsedDate = storedDate ? new Date(storedDate) : null;
    setSelectedDate(parsedDate);
  }, []);

  if (!hotel) {
    return <></>;
  }

  const calculateFees = (items: any) => {
    return items.reduce((total: number, item: any) => {
      const adultFees = item.adultCount * parseFloat(item.product.feeAdult);
      const childFees = item.childCount * parseFloat(item.product.feeChild);
      return total + adultFees + childFees;
    }, 0);
  };

  const calculateSubtotal = (items: any) => {
    return items.reduce((total: number, item: any) => {
      const adultTotal = item.adultCount * parseFloat(item.product.priceAdult);
      const childTotal = item.childCount * parseFloat(item.product.priceChild);
      return total + adultTotal + childTotal;
    }, 0);
  };

  const fees = calculateFees(cartItems);
  const subtotal = calculateSubtotal(cartItems);
  // const total = fees + subtotal;

  function handleRemoveItem(itemId: any) {
    let cart: any[] = [];
    const savedCart = Cookies.get("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart) as any[];
      cart = cart.filter((item) => item.product.title !== itemId);
      Cookies.set("cart", JSON.stringify(cart), { expires: 1 });
    }
    setCartItems(cart);
    return cart;
  }

  return (
    <div className="space-y-6">
      {/* Image Slider Starts */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden px-2">
          {getDisplayedImages().map((image, index) => (
            <div key={index} className="h-[300px] relative">
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center border"
              />
              {/* Favourite Button for Mobile and Tablet */}
              <div className="absolute top-2 right-2 lg:hidden">
                <button onClick={handleToggleFavourite}>
                  {isFavourite ? (
                    <FaHeart className="w-6 h-6 text-red-500 fill-current" />
                  ) : (
                    <FaHeart className="w-6 h-6 text-gray-300 fill-current" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={handlePrev}
          className="absolute z-10 top-1/2 left-0 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-md"
        >
          <BiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute z-10 top-1/2 right-0 transform -translate-y-1/2 bg-white p-4 rounded-full shadow-md"
        >
          <BiChevronRight className="w-6 h-6" />
        </button>
      </div>
      {/* Image Slider Ends */}

      {/* Hotel Details Start */}
      <div className="w-full lg:container px-8 pt-10 lg:mx-auto space-y-2">
        <div className="flex lg:flex-row flex-col-reverse gap-10 space-y-2 justify-between">
          <div className="flex flex-col gap-2 w-full lg:w-2/3">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-semibold font-LuxuryF1 text-goldColor break-normal">
                  {hotel.name}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="bg-darkGold py-1 px-3 rounded-lg text-white">
                  {hotel.starRating}
                </span>
                <span className="flex">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <AiFillStar key={i} className="fill-yellow-400" />
                  ))}
                </span>
              </div>
            </div>
            {/* Facilities Section */}
            <div className="flex justify-between mt-3">
              <div className="flex gap-2 flex-wrap">
                {hotel.facilities.map((facility, index) => (
                  <Tooltip key={index} text={facility}>
                    <div className="border border-goldColor rounded-md p-2 flex items-center space-x-2 cursor-pointer text-goldColor text-xl">
                      {facilityIcons[facility as FacilityKey] && (
                        <span>{facilityIcons[facility as FacilityKey]}</span>
                      )}
                    </div>
                  </Tooltip>
                ))}
              </div>
              {/* Favorite Hotel Button for Desktop */}
              <div className="hidden lg:flex gap-2 flex-wrap border border-gray-200 px-4 py-2 rounded-full">
                <button onClick={handleToggleFavourite}>
                  {isFavourite ? (
                    <span className="flex gap-2">
                      <FaHeart className="w-6 h-6 text-red-500 fill-current" />
                      <span>Saved</span>
                    </span>
                  ) : (
                    <span className="flex gap-2">
                      <FaHeart className="w-6 h-6 text-gray-300 fill-current" />
                      <span>Save</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
            {/* Facilities Section */}

            <div className="w-full break-words mb-5">{hotel.description}</div>

            <span className="text-lg font-medium mb-3">Select a Date</span>
            <div className="flex items-center gap-2">
              <MdCalendarMonth className="text-2xl text-btnColor" />
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  Cookies.set("date", date !== null ? date.toISOString() : "", {
                    expires: 1,
                  });
                  if (selectedDate === null) {
                    setError(false);
                  }
                }}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Please select the date"
                className={`px-4 py-2 text-goldColor placeholder:text-goldColor border border-gray-300 rounded`}
              />
            </div>
            <div className="">
              {error && (
                <span className="mt-4 text-red-500">
                  Please Select the date first
                </span>
              )}
            </div>
            <hr className="border-gray-200 my-3 w-full" />
            <span className="text-lg font-medium">Select a product</span>
            <div className="mt-5">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  hotelId={hotel._id}
                  date={selectedDate}
                  error={error}
                  setError={setError}
                  setCart={setCart}
                />
              ))}
            </div>
          </div>
          {/* Hotel Details Start */}

          {/* Cart Section */}
          <div className="w-full lg:w-1/3 md:block">
            <div className="h-fit sticky top-4">
              <div className="p-4 bg-white rounded-lg shadow-md border border-gray-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Your Cart</h2>
                </div>
                <div className="border-t pt-4">
                  {cartItems.length === 0 ? (
                    <div className="flex items-center space-x-4">
                      <img
                        src={hotel.imageUrls[0]}
                        alt={hotel.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div>
                        <h3 className="text-md font-semibold">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">
                          Please select a product to continue
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={hotel.imageUrls[0]}
                          alt={hotel.name}
                          className="w-16 h-16 rounded-lg"
                        />
                        <div>
                          <h3 className="text-md font-semibold">
                            {hotel.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {/* {moment(selectedDate).format('DD/MM/YYYY')} */}
                          </p>
                        </div>
                      </div>
                      
                      {cartItems.length > 0 &&
                        cartItems.map((item: any, index: any) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-4"
                          >
                            <div>
                              <h3 className="text-sm">
                                {item.product.title} - adult (
                                {item.product.priceAdult})
                              </h3>
                              <h3 className="text-sm">
                                {item.product.title} - child (
                                {item.product.priceChild})
                              </h3>
                            </div>
                            <button
                              className="text-gray-500"
                              onClick={() =>
                                handleRemoveItem(item.product.title)
                              }
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span>Fees:</span>
                          <span>₹{fees.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span>Subtotal:</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <Button
                          className="w-full bg-goldColor text-white py-2 rounded-lg"
                          onClick={() => navigate(`/hotel/${hotelId}/booking`)}
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Cart Section */}
        </div>
      </div>
    </div>
  );
};

export default Detail;
