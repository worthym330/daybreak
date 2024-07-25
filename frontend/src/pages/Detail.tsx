import { useState, useEffect, useRef } from "react";
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
// import { useAppContext } from "../contexts/AppContext";
import ProductCard from "../components/ProductCard";
import { FavouriteList } from "../../../backend/src/shared/types";
import Cookies from "js-cookie";
import Button from "../components/Button";
import moment from "moment";
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FaLocationDot } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { removeFromCart, setDate, setError } from "../store/cartSlice";
import { toast } from "react-toastify";
import {
  initialModalState,
  initialResetModal,
  initialSignupModalState,
  RenderLoginModal,
  RenderSignUpModal,
  ResetPassRequest,
} from "../components/Header";

mapboxgl.accessToken = import.meta.env.VITE_MAP_GL_TOKEN;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export type FacilityKey =
  | "Free WiFi"
  | "Parking"
  | "Airport Shuttle"
  | "Family Rooms"
  | "Non-Smoking Rooms"
  | "Outdoor Pool"
  | "Spa"
  | "Fitness Center";

export const facilityIcons = {
  "Free WiFi": <FaWifi />,
  Parking: <FaParking />,
  "Airport Shuttle": <FaShuttleVan />,
  "Family Rooms": <MdFamilyRestroom />,
  "Non-Smoking Rooms": <MdSmokeFree />,
  "Outdoor Pool": <FaSwimmingPool />,
  Spa: <FaSpa />,
  "Fitness Center": <FaDumbbell />,
};

export const Tooltip = ({ children, text }: any) => {
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
  // const { showToast } = useAppContext();
  const [carts, setCart] = useState([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const auth_token = Cookies.get("authentication") || "null";
  const userLogined = JSON.parse(auth_token);
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const mapContainerRef = useRef(null);
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.cart.error);
  const date = useSelector((state: RootState) => state.cart.date);
  const [modal, setModal] = useState(initialModalState);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);
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

  useEffect(() => {
    const getAddressFromUrl = async () => {
      const response = hotel?.mapurl && (await expandUrl(hotel.mapurl as any));
      if (response) {
        const coords = extractCoordinatesFromUrl(response);

        if (coords) {
          setCoordinates({
            lat: parseFloat(coords.lat),
            lng: parseFloat(coords.lng),
          });
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${mapboxgl.accessToken}`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            setAddress(data.features[0].place_name);
          }
        }
      }
    };

    getAddressFromUrl();
  }, [hotel]);

  // useEffect(() => {
  //   const getAddressFromUrl = async () => {
  //     const expandedUrl = await expandUrl(hotel?.mapurl);
  //     const coords = extractCoordinatesFromUrl(expandedUrl);
  //     if (coords) {
  //       setCoordinates({
  //         lat: parseFloat(coords.lat),
  //         lng: parseFloat(coords.lng),
  //       });
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
  //       );
  //       const data = await response.json();
  //       if (data.results && data.results.length > 0) {
  //         setAddress(data.results[0].formatted_address);
  //       }
  //     }
  //   };

  //   getAddressFromUrl();
  // }, [hotel]);

  useEffect(() => {
    if (coordinates && mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [coordinates.lng, coordinates.lat],
        zoom: 10,
      });

      new mapboxgl.Marker()
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map);

      return () => map.remove();
    }
  }, [coordinates]);

  const expandUrl = async (shortUrl: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/expand-url?url=${encodeURIComponent(shortUrl)}`
      );
      const data = await response.json();
      return data.expandedUrl;
    } catch (error) {
      console.error("Error expanding URL:", error);
      return "";
    }
  };

  const extractCoordinatesFromUrl = (url: string) => {
    const regex = /@([-0-9.]+),([-0-9.]+),/;
    const match = url.match(regex);
    if (match) {
      return {
        lat: match[1],
        lng: match[2],
      };
    }
    return null;
  };

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
    console.log(userLogined);
    if (userLogined !== null) {
      const user: FavouriteList = {
        userId: userLogined.id,
        firstName: userLogined.name.split(" ")[0],
        lastName: userLogined.name.split(" ").pop(),
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
      // showToast({ message: "Please log in to save", type: "ERROR" });
      toast.error("Please log in to save");
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
    const storedDate = Cookies.get("date");
    const parsedDate = storedDate ? new Date(storedDate) : null;
    dispatch(setDate(parsedDate?.toISOString()));
    if (parsedDate !== null) {
      dispatch(setError(false));
    }
  }, []);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    const parsedCart = cart ? JSON.parse(cart) : [];
    setCartItems(parsedCart);
  }, [carts]);

  if (!hotel) {
    return <></>;
  }

  const calculateSubtotal = (items: any) => {
    // const GST_RATE = 0.18;
    return items.reduce((total: number, item: any) => {
      const adultTotal =
        item.adultCount > 0 ? item.adultCount * item.product.adultPrice : 0;
      const childTotal =
        item.childCount > 0 ? item.childCount * item.product.childPrice : 0;

      // Calculate GST for adult and child totals
      // const adultGST = adultTotal * (1 + GST_RATE);
      // const childGST = childTotal * (1 + GST_RATE);

      return total + adultTotal + childTotal;
    }, 0);
  };

  const subtotal = calculateSubtotal(cartItems);

  function handleRemoveItem(itemId: any) {
    let cart: any[] = [];
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart) as any[];
      cart = cart.filter((item) => item.product.title !== itemId);
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    dispatch(removeFromCart(itemId));
    setCartItems(cart);
  }

  const handleDateChange = (event: any) => {
    const dateString = event.target.value;
    const selectedDate = new Date(dateString);

    if (!isNaN(selectedDate.getTime())) {
      dispatch(setError(false));
      dispatch(setDate(selectedDate.toISOString()));
      Cookies.set("date", dateString, { expires: 1 });
    } else {
      dispatch(setDate(null));
      Cookies.remove("date");
    }
  };

  return (
    <div className="space-y-6">
      <RenderLoginModal
        modal={modal}
        setModal={setModal}
        setResetModal={setResetModal}
        setSignupModal={setSignupModal}
        isHeader={false}
        isBooking={false}
      />
      <RenderSignUpModal
        modal={signupModal}
        setModal={setSignupModal}
        initialModalState={initialSignupModalState}
        setLoginModal={setModal}
        isHeader={false}
      />
      <ResetPassRequest modal={resetModal} setModal={setResetModal} />
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
                value={date ? date.split("T")[0] : ""}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
                placeholder="Please select the date"
                className={`px-4 py-2 text-goldColor placeholder:text-goldColor border rounded ${
                  error ? "border-red-500" : "border-goldColor"
                }`}
              />
            </div>
            <div className="">
              {error && (
                <p className="text-red-500 errorMessage">
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
                  hotel={hotel}
                  setCart={setCart}
                />
              ))}
            </div>
            {/* Hours Div */}
            <div className="mb-8 p-4">
              <h1 className="text-lg font-medium mb-4">Hours</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {hotel?.productTitle.map((product: any, index: number) => (
                  <div key={index}>
                    <p>{product.title}</p>
                    <p className="text-sm text-gray-400">
                      {moment(product.startTime, "HH:mm").format("hh:mm A")} -{" "}
                      {moment(product.endTime, "HH:mm").format("hh:mm A")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
              <h2 className="text-lg font-medium mb-4">How it works</h2>
              <ol className="list-decimal list-inside">
                <li>
                  Select an available day in the calendar, the number of guests,
                  and complete booking
                </li>
                <li>
                  Receive booking confirmation with details and instructions
                </li>
                <li>Bring valid photo ID and check-in at the front desk</li>
                <li>Enjoy your daycation!</li>
              </ol>
            </div>
            {/* Hours Div */}
            <div className="w-full mx-auto px-4 text-justify">
              <h2 className="text-lg font-medium mb-4">Cancellation Policy</h2>
              {/* <span className="mb-4 block">
                Read our full <Link to= '' className="text-blue-500 underline">cancellation policy </Link>
              </span> */}
              <h3 className="text-lg font-medium mb-2">Cancel Online</h3>
              <p className="mb-4">
                You can cancel your booking online for a full refund back to
                your original payment method or for DayBreakPass Credit to use
                another time. Bookings can be cancelled online up until the
                following times:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-8">
                {hotel?.cancellationPolicy
                  ?.split(".")
                  .map(
                    (e: any, index) =>
                      e !== "" && e.trim() !== "" && <li key={index}>{e}.</li>
                  )}
              </ul>
            </div>
            <div className="w-full mx-auto px-4">
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <p className="mb-4 flex justify-between items-center">
                <span>{address}</span>
                <a
                  href={hotel.mapurl}
                  target="_blank"
                  className="flex gap-2 items-center"
                >
                  <FaLocationDot className="text-goldColor w-6 h-6" />
                  <span className="underline decoration-blue-600 text-blue-600 hover:text-blue-900">
                    Preview
                  </span>
                </a>
              </p>
              <div className="border rounded-lg overflow-hidden border-goldColor">
                <div className="border rounded-lg overflow-hidden">
                  {coordinates && (
                    <div
                      id="map"
                      ref={mapContainerRef}
                      style={{ width: "100%", height: "400px" }}
                    ></div>
                  )}
                  {/* {coordinates && (
                    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={coordinates}
                        zoom={13}
                      >
                        <Marker position={coordinates} />
                      </GoogleMap>
                    </LoadScript>
                  )} */}
                </div>
              </div>
            </div>
          </div>
          {/* Hotel Details Start */}

          {/* Cart Section */}
          <div className="w-full lg:w-1/3">
            {cartItems.length > 0 && (
              <div className="h-fit sticky top-4 lg:hidden">
                <div className="p-4 bg-white rounded-lg shadow-md border border-goldColor">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Your Cart</h2>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={cartItems[0].hotel.imageUrls[0]}
                        alt={cartItems[0].hotel.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div>
                        <h3 className="text-md font-semibold">
                          {cartItems[0].hotel.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {/* {moment(selectedDate).format('DD/MM/YYYY')} */}
                        </p>
                      </div>
                    </div>

                    {cartItems.map((item: any, index: any) => (
                      <div
                        key={index}
                        className="flex justify-between items-center mb-4"
                      >
                        <div>
                          <h3 className="text-sm">
                            {item.product.title} Adult ({item.adultCount}){" "}
                            {item.childCount > 0 && (
                              <p>Child ({item.childCount})</p>
                            )}
                          </h3>
                        </div>
                        <button
                          className="text-gray-500"
                          onClick={() => handleRemoveItem(item.product.title)}
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
                      <div className="flex justify-between text-gray-700 mb-2">
                        <span>GST:</span>
                        <span>₹{(subtotal * 0.18).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 mb-2">
                        <span>Total:</span>
                        <span>₹{(subtotal * (1 + 0.18)).toFixed(2)}</span>
                      </div>
                      {userLogined !== null ? (
                        <Button
                          className="w-full bg-goldColor text-white py-2 rounded-lg"
                          onClick={() => navigate(`/checkout`)}
                        >
                          Book Now
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-goldColor text-white py-2 rounded-lg"
                          onClick={() =>
                            setModal((prev: any) => ({ ...prev, state: true }))
                          }
                        >
                          Login
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="h-fit sticky top-4 hidden lg:block">
              <div className="p-4 bg-white rounded-lg shadow-md border border-goldColor">
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
                          src={cartItems[0].hotel.imageUrls[0]}
                          alt={cartItems[0].hotel.name}
                          className="w-16 h-16 rounded-lg"
                        />
                        <div>
                          <h3 className="text-md font-semibold">
                            {cartItems[0].hotel.name}
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
                                {item.product.title} Adult ({item.adultCount}){" "}
                                {item.childCount > 0 && (
                                  <p>Child ({item.childCount})</p>
                                )}
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
                          <span>Subtotal:</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span>GST:</span>
                          <span>₹{(subtotal * 0.18).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span>Total:</span>
                          <span>₹{(subtotal * (1 + 0.18)).toFixed(2)}</span>
                        </div>
                        {userLogined !== null ? (
                          <Button
                            className="w-full bg-goldColor text-white py-2 rounded-lg"
                            onClick={() => navigate(`/checkout`)}
                          >
                            Book Now
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-goldColor text-white py-2 rounded-lg"
                            onClick={() =>
                              setModal((prev: any) => ({
                                ...prev,
                                state: true,
                              }))
                            }
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
