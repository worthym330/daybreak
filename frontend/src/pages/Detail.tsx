// src/pages/Detail.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
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
    title: "Kama'aina Day Pass",
    features: [
      "Discounted Day Pass for local Hawaii residents",
      "All amenities included in the Day Pass",
    ],
    priceAdult: "65",
    feeAdult: "6",
    priceChild: "40",
    feeChild: "4",
    priceInfant: "FREE",
    description:
      "Must show a valid Hawaii state ID upon check-in. No coolers or outside food and beverage allowed.",
  },
  {
    title: "HamacLand Experience",
    features: ["Located on an Island in the saltwater lagoon."],
    priceAdult: "750",
    feeAdult: "",
    priceChild: "",
    feeChild: "",
    priceInfant: "",
    description: "",
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
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-white text-nowrap text-sm rounded-md shadow-full">
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
  const [cartItems, setCartItems] = useState([]);
  const auth_token = localStorage.getItem("auth_token");
  const userLogined = auth_token ? JSON.parse(auth_token) : null;
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
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
    const cart = localStorage.getItem("cart");
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
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.filter((item: any) => item.product.title !== itemId);
    localStorage.setItem("cart", JSON.stringify(cart));
    return cart;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-hidden px-2">
          {getDisplayedImages().map((image, index) => (
            <div key={index} className="h-[300px]">
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center border"
              />
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
      <div className="w-full lg:container px-8 lg:mx-auto space-y-2">
        <div className="flex lg:flex-row flex-col-reverse gap-4 space-y-2 justify-between">
          <div className="flex flex-col gap-2 w-full lg:w-2/3">
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-bold">{hotel.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="flex">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <AiFillStar key={i} className="fill-yellow-400" />
                  ))}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2 flex-wrap">
                {hotel.facilities.map((facility, index) => (
                  <Tooltip key={index} text={facility}>
                    <div className="border border-goldColor rounded-sm p-3 flex items-center space-x-2 cursor-pointer bg-darkGold text-white">
                      {facilityIcons[facility as FacilityKey] && (
                        <span>{facilityIcons[facility as FacilityKey]}</span>
                      )}
                    </div>
                  </Tooltip>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
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

            <div className="w-full break-words">{hotel.description}</div>
            <div className="flex items-center gap-4">
              <span>Date</span>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  Cookies.set("date", date !== null ? date.toISOString() : "", {
                    expires: 1,
                  });
                  setError(false); // Set cookie with expiry of 7 days
                }}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Please select the date"
                className={`px-2 py-1 text-goldColor placeholder:text-goldColor border border-darkGold rounded`}
              />
            </div>
            <div className="">
              {error && (
                <span className="mt-4 text-red-500">
                  Please Select the date first
                </span>
              )}
            </div>
            <div className="">
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  hotelId={hotel._id}
                  date={selectedDate !== null && selectedDate}
                  error={error}
                  setError={setError}
                  setCart={setCart}
                />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/3 hidden md:block">
            <div className="h-fit">
              <div className="p-4 bg-white rounded-lg shadow-md">
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
                        <button className="w-full bg-goldColor text-white py-2 rounded-lg"
                        onClick={()=>navigate(`hotel/${hotelId}/booking`)}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
