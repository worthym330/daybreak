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

interface CartHotel {
  imageUrls: string[];
  name: string;
}

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
  const [CartHotel, SetCartHotel] = useState<CartHotel>();

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
  }, []);

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

  async function getCartHotel() {
    const hotelId = cartItems[0].hotelId;
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if (response.ok) {
      const data = await response.json();
      SetCartHotel(data);
    } else {
      console.error("Error fetching Hotels");
    }
  }

  useEffect(() => {
    if (cartItems.length > 0) {
      getCartHotel();
    }
  }, []);

  const calculateSubtotal = (items: any) => {
    const GST_RATE = 0.18;
    return items.reduce((total: number, item: any) => {
      const adultTotal =
        item.adultCount > 0 ? item.adultCount * item.product.adultPrice : 0;
      const childTotal =
        item.childCount > 0 ? item.childCount * item.product.childPrice : 0;

      // Calculate GST for adult and child totals
      const adultGST = adultTotal * (1 + GST_RATE);
      const childGST = childTotal * (1 + GST_RATE);

      return total + adultGST + childGST;
    }, 0);
  };

  const subtotal = calculateSubtotal(cartItems);

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
        <div className="flex lg:flex-row flex-col gap-10 space-y-2 justify-between">
          <div className="flex flex-col gap-2 w-full lg:w-2/3">
            <div className="flex justify-between flex-col md:flex-row">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-semibold font-LuxuryF1 text-goldColor break-normal">
                  {hotel.name}
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="bg-darkGold py-1 px-3 rounded-lg text-white">
                  {hotel.star}
                </span>
                <span className="flex">
                  {Array.from({ length: hotel.star }).map((_, i) => (
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
              <input
                type="date"
                value={
                  selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                }
                onChange={(event) => {
                  const dateString = event.target.value;
                  const date = new Date(dateString);
                  setSelectedDate(date);
                  Cookies.set("date", dateString, { expires: 1 });
                  setError(dateString === "");
                }}
                min={new Date().toISOString().split("T")[0]}
                placeholder="Please select the date"
                className={`px-4 py-2 text-goldColor placeholder:text-goldColor border border-gray-300 rounded ${
                  error ? "border-red-500" : ""
                }`}
              />
            </div>
            <div className="">
              {error && (
                <p className="text-red-500">
                  Invalid date. Please select a valid date.
                </p>
              )}
            </div>
            <hr className="border-gray-200 my-3 w-full" />
            <span className="text-lg font-medium">Select a product</span>
            <div className="mt-5">
              {hotel.productTitle.map((product, index) => (
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
          <div className="w-full lg:w-1/3">
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
                        {CartHotel ? (
                          <>
                            <img
                              src={CartHotel?.imageUrls[0]}
                              alt={CartHotel?.name}
                              className="w-16 h-16 rounded-lg"
                            />
                            <div>
                              <h3 className="text-md font-semibold">
                                {CartHotel?.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {/* {moment(selectedDate).format('DD/MM/YYYY')} */}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>

                      {cartItems.length > 0 &&
                        cartItems.map((item: any, index: any) => (
                          <div
                            key={index}
                            className="flex justify-between items-center mb-4"
                          >
                            <div>
                              <h3 className="text-sm">{item.product.title}</h3>
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
                          <span>Subtotal:</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {userLogined !== null ? (
                          <Button
                            className="w-full bg-goldColor text-white py-2 rounded-lg"
                            onClick={() =>
                              navigate(`/hotel/${hotelId}/booking`)
                            }
                          >
                            Book Now
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-goldColor text-white py-2 rounded-lg"
                            onClick={() => navigate(`/login`)}
                          >
                            Login
                          </Button>
                        )}
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
