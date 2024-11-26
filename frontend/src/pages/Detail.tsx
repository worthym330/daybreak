import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import {
  // FaCalendar,
  FaDumbbell,
  FaHeart,
  FaParking,
  FaShuttleVan,
  FaSpa,
  FaSwimmingPool,
  FaUserCircle,
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
} from "../components/Auth";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import ConfirmationModal from "../components/AlertModal";
import { addHotel } from "../store/favSlice";
import {
  initialReviewState,
  RenderReviewModal,
} from "../components/ReviewModal";

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
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

export const AmenitiesIcons = {
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
        <div className="absolute bottom-full mb-2 px-2 py-1 border-2 border-black bg-white text-nowrap text-sm rounded-md shadow-full text-black">
          {text}
        </div>
      )}
      {children}
    </div>
  );
};

const useHotelData = (hotelId: any, name: any) => {
  const hotelQuery = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    { enabled: !!hotelId }
  );

  const hotelByNameQuery = useQuery(
    ["fetchHotelByName", name],
    () => apiClient.fetchHotelByName(name || ""),
    { enabled: !hotelId && !!name }
  );

  // Combined loading state
  const isLoading = useMemo(
    () => hotelQuery.isFetching || hotelByNameQuery.isFetching,
    [hotelQuery.isFetching, hotelByNameQuery.isFetching]
  );

  // Combined error
  const error = useMemo(
    () => hotelQuery.error || hotelByNameQuery.error,
    [hotelQuery.error, hotelByNameQuery.error]
  );

  // Combined data
  const hotel = useMemo(
    () => hotelQuery.data || hotelByNameQuery.data,
    [hotelQuery.data, hotelByNameQuery.data]
  );

  // Callback to handle fetching status
  const handleFetchStatus = useCallback(() => {
    if (isLoading) return "Loading...";
    if (error) return `Error: ${error}`;
    if (hotel) return "Hotel data fetched successfully!";
    return "No data available.";
  }, [isLoading, error, hotel]);

  return { hotel, isLoading, error, handleFetchStatus };
};

const Detail = () => {
  const { hotelId, name } = useParams();
  const queryClient = useQueryClient();
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  // const { showToast } = useAppContext();
  const [carts, setCart] = useState([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const auth_token = Cookies.get("authentication") || "null";
  const userLogined = JSON.parse(auth_token);
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.cart.error);
  // const date = useSelector((state: RootState) => state.cart.date);
  const [modal, setModal] = useState(initialModalState);
  const [resetModal, setResetModal] = useState(initialResetModal);
  const [signupModal, setSignupModal] = useState(initialSignupModalState);
  const dateRef = useRef<HTMLInputElement>(null);
  const auth = useSelector((state: RootState) => state.auth);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const [reviews, setReviews] = useState({
    loading: true,
    data: [],
  });
  const { hotel } = useHotelData(hotelId, name);
  const [reviewModal, setReviewModal] = useState(initialReviewState);

  useEffect(() => {
    if (!hotel?.mapurl) return;

    const fetchCoordinates = async () => {
      try {
        const expandedUrl = await expandUrl(hotel._id);
        console.log(expandedUrl);
        // const coords = extractCoordinatesFromUrl(expandedUrl);
        if (expandedUrl.reverseData.location) {
          setCoordinates({
            lat: parseFloat(expandedUrl.reverseData.location.lat),
            lng: parseFloat(expandedUrl.reverseData.location.lng),
          });
          setAddress(expandedUrl.reverseData.formatted_address);
        }
      } catch (error) {
        console.error("Error fetching coordinates or address:", error);
      }
    };
    fetchCoordinates();
  }, [hotel]);

  useEffect(() => {
    let map, marker: google.maps.Marker;
    if (coordinates && mapRef.current) {
      map = new google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 13,
      });
      marker = new google.maps.Marker({
        position: coordinates,
        map: map,
      });
    }

    return () => {
      if (marker) marker.setMap(null);
    };
  }, [coordinates]);

  const expandUrl = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/google/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error expanding URL:", error);
      return "";
    }
  };

  useEffect(() => {
    if (error && dateRef.current) {
      dateRef.current.scrollIntoView({ behavior: "smooth" });
      dispatch(setDate(null));
      Cookies.remove("date");
      setError(false);
    }
  }, [error]);

  const toggleFavourite = async () => {
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
          setConfirmationDialog(true);
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
    if (auth.isAuthenticated) {
      toggleFavouriteMutation.mutate();
    } else {
      dispatch(addHotel(hotel));
      setModal((prev: any) => ({ ...prev, state: true, hotel }));
    }
  };

  const isFavourite = hotel?.favourites?.some(
    (fav: FavouriteList) => fav?.userId === userLogined?.id
  );

  const fetchReviews = async () => {
    setReviews((prevState) => ({
      ...prevState,
      loading: true,
    }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${hotelId}/detail`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews({
        loading: false,
        data: data,
      });
    } catch (err) {}
  };

  useEffect(() => {
    fetchReviews();
  }, [hotelId]);

  const handleReviewModal = () => {
    if (auth.isAuthenticated) {
      setReviewModal((prev: any) => ({ ...prev, state: true }));
    } else {
      setModal((prev: any) => ({ ...prev, state: true }));
    }
  };

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
    return items.reduce((total: number, item: any) => {
      const adultTotal =
        item.adultCount > 0 ? item.adultCount * item.product.adultPrice : 0;
      const childTotal =
        item.childCount > 0 ? item.childCount * item.product.childPrice : 0;
      let itemSubtotal = adultTotal + childTotal;
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        item.selectedAddOns.forEach((addOn: any) => {
          itemSubtotal += addOn.price * addOn.quantity;
        });
      }
      return total + itemSubtotal;
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

  return (
    <div className="space-y-6">
      {modal.state && (
        <RenderLoginModal
          modal={modal}
          setModal={setModal}
          setResetModal={setResetModal}
          setSignupModal={setSignupModal}
          isHeader={false}
          isBooking={false}
          isFavourite={true}
        />
      )}
      {signupModal.state && (
        <RenderSignUpModal
          modal={signupModal}
          setModal={setSignupModal}
          initialModalState={initialSignupModalState}
          setLoginModal={setModal}
          isHeader={false}
        />
      )}
      {resetModal && (
        <ResetPassRequest modal={resetModal} setModal={setResetModal} />
      )}
      {reviewModal.state && (
        <RenderReviewModal
          modal={reviewModal}
          setModal={setReviewModal}
          hotelId={hotel._id}
          userId={auth.user.id}
          callback={fetchReviews}
        />
      )}
      <ConfirmationModal
        setOpen={setConfirmationDialog}
        open={confirmationDialog}
        onDelete={() => navigate("/my-favourites")}
        title={isFavourite ? "Added to favorites" : "Removed from favorites"}
        confirmationButtonText="View Favourites"
        description={
          isFavourite
            ? "This hotel has been successfully added to your favorites list. You can view it anytime in your favorites."
            : "This hotel has been removed from your favorites list. You can view your updated favorites anytime."
        }
      />
      {/* Image Slider Starts */}
      <div className="relative">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          loop={true}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation]}
        >
          {hotel.imageUrls.concat(hotel.imageUrls).map((image, index) => (
            <SwiperSlide key={index}>
              <div className="h-[300px] relative">
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
            </SwiperSlide>
          ))}
          {/* Custom navigation buttons */}
          <div className="swiper-button-prev swiper-button-custom w-8 h-8 rounded-full flex items-center justify-center text-white"></div>
          <div className="swiper-button-next swiper-button-custom w-8 h-8 rounded-full flex items-center justify-center text-white"></div>
        </Swiper>
      </div>
      {/* Image Slider Ends */}

      {/* Hotel Details Start */}
      <div className="w-full lg:container px-8 md:pt-10 lg:mx-auto space-y-2">
        <div className="flex lg:flex-row flex-col gap-4 md:gap-10 space-y-2 justify-between">
          <div className="flex flex-col gap-2 w-full lg:w-2/3">
            <div className="flex justify-between flex-col md:flex-row">
              <div className="flex flex-col gap-2">
                <span className="text-lg md:text-3xl font-semibold font-LuxuryF1 text-[#02596C] break-normal">
                  {hotel.name}, {hotel.city}
                </span>
              </div>
            </div>
            <div className="text-goldColor flex gap-4 items-center">
              <div className="flex">
                {[...Array(hotel.star)].map((_, i) => (
                  <AiFillStar key={i} className="w-5 h-5" />
                ))}
                {[...Array(5 - hotel.star)].map((_, i) => (
                  <AiFillStar key={i} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              <div>
                <span className="text-base md:text-xl ">
                  {hotel.star.toFixed(1)}
                </span>
              </div>
            </div>
            {/* Facilities Section */}
            <div className="flex justify-between mt-3">
              <div className="flex gap-2 flex-wrap">
                {hotel.facilities.map((facility, index) => (
                  <Tooltip key={index} text={facility}>
                    <div className="rounded-md p-2 flex items-center space-x-2 cursor-pointer text-goldColor text-base md:text-xl border hover:border-[#00C0CB]">
                      {AmenitiesIcons[facility as FacilityKey] && (
                        <span>{AmenitiesIcons[facility as FacilityKey]}</span>
                      )}
                    </div>
                  </Tooltip>
                ))}
              </div>
              {/* Favorite Hotel Button for Desktop */}
              <div className="hidden lg:flex gap-2 flex-wrap border border-[#02596C] px-4 py-2 rounded-full">
                <button onClick={handleToggleFavourite}>
                  {isFavourite ? (
                    <span className="flex gap-2">
                      <FaHeart className="w-6 h-6 text-red-500 fill-current " />
                      <span className="text-[#02596C]">Saved</span>
                    </span>
                  ) : (
                    <span className="flex gap-2">
                      <FaHeart className="w-6 h-6 text-gray-300 fill-current " />
                      <span className="text-[#02596C]">Save</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
            {/* Facilities Section */}

            <div className="w-full break-words mb-5 lg:hidden">
              <p>
                {isExpanded
                  ? hotel.description
                  : `${hotel.description.substring(0, 100)}...`}
              </p>
              <button
                onClick={toggleExpand}
                className="text-[#00C0CB] mt-2 text-sm md:text-base"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>

            <div className="w-full break-words mb-5 hidden lg:block">
              {hotel.description}
            </div>
            <hr className="border-gray-200 mb-3 w-full" />
            <span className="text-base md:text-lg font-medium">
              Select a product
            </span>
            <div className="mt-5">
              {hotel.productTitle.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  hotel={hotel}
                  titles={hotel.titlesId}
                  setCart={setCart}
                />
              ))}
            </div>
            {/* Hours Div */}
            <div className="mb-8 p-4">
              <h1 className="text-base md:text-lg font-medium mb-4">Hours</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {hotel?.productTitle.map((product: any, index: number) => (
                  <div key={index}>
                    <p className="text-sm">{product.title}</p>
                    <p className="text-sm text-gray-400">
                      {moment(product.startTime, "HH:mm").format("hh:mm A")} -{" "}
                      {moment(product.endTime, "HH:mm").format("hh:mm A")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-8">
              <h2 className="text-base md:text-lg font-medium mb-4">
                How it works
              </h2>
              <ol className="list-decimal list-inside text-sm md:text-base">
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
            <div className="w-full mx-auto p-4 text-justify bg-gray-100 rounded-lg shadow-md">
              <h2 className="text-base md:text-lg font-medium mb-4">
                Cancellation Policy
              </h2>
              {/* <span className="mb-4 block">
                Read our full <Link to= '' className="text-blue-500 underline">cancellation policy </Link>
              </span> */}
              <h3 className="text-sm md:text-lg font-medium mb-2">
                Cancel Online
              </h3>
              <p className="mb-4 text-sm md:text-base">
                You can cancel your booking online for a full refund back to
                your original payment method or for DayBreakPass Credit to use
                another time. Bookings can be cancelled online up until the
                following times:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-8 text-sm md:text-base">
                {hotel?.cancellationPolicy
                  ?.split(".")
                  .map(
                    (e: any, index) =>
                      e !== "" && e.trim() !== "" && <li key={index}>{e}.</li>
                  )}
              </ul>
            </div>
            <div className="w-full mx-auto px-4">
              <h3 className="text-base md:text-lg font-medium mb-2">
                Location
              </h3>
              <p className="mb-4 flex justify-between items-center text-sm md:text-base">
                <span>{address}</span>
                <a
                  href={hotel?.mapurl}
                  target="_blank"
                  className="flex gap-2 items-center"
                >
                  <FaLocationDot className="text-[#02596c] w-6 h-6" />
                  <span className="text-[#02596c] hover:text-[#02596c]">
                    Preview
                  </span>
                </a>
              </p>
              <div className="rounded-lg overflow-hidden">
                {coordinates && (
                  <div
                    ref={mapRef}
                    style={{ width: "100%", height: "400px" }}
                  ></div>
                )}
              </div>
            </div>
            <div className="w-full mx-auto space-y-4">
              <div className="max-w-4xl mx-auto p-6 bg-white">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>

                {/* Average Rating Inline Calculation */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center space-x-1 text-yellow-500 text-lg">
                    {[
                      ...Array(
                        reviews?.data?.length > 0
                          ? Math.round(
                              reviews.data.reduce(
                                (sum: any, review: any) => sum + review?.rating,
                                0
                              ) / reviews.data.length
                            )
                          : 0
                      ),
                    ].map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                    <span className="text-gray-400">
                      {[
                        ...Array(
                          5 -
                            (reviews?.data?.length > 0
                              ? Math.round(
                                  reviews.data.reduce(
                                    (sum: any, review: any) =>
                                      sum + review?.rating,
                                    0
                                  ) / reviews.data.length
                                )
                              : 0)
                        ),
                      ].map((_, index) => (
                        <span key={index}>☆</span>
                      ))}
                    </span>
                  </div>
                  <span className="ml-2 text-gray-700 text-lg">
                    Based on {reviews?.data?.length || 0} reviews
                  </span>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews?.data?.filter(
                      (review: any) => review.rating === star
                    ).length;
                    const percentage =
                      reviews?.data?.length > 0
                        ? (count / reviews.data.length) * 100
                        : 0;
                    return (
                      <div className="flex items-center" key={star}>
                        <span className="w-8 text-gray-700">{star}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                          <div
                            className="h-2 bg-yellow-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-gray-700">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Review Submission */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Share your thoughts
                  </h3>
                  <button
                    className="bg-[#02596C] text-white px-4 py-2 rounded-md shadow hover:bg-[#02596C]"
                    type="button"
                    onClick={handleReviewModal}
                  >
                    Write a review
                  </button>
                </div>

                {/* Individual Reviews */}
                <div className="mt-6">
                  <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    grabCursor={true}
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="mySwiper"
                    style={{ paddingBottom: "40px" }}
                  >
                    {reviews?.data?.map((review: any, idx) => (
                      <SwiperSlide key={idx}>
                        <div className="p-4 bg-gray-50 rounded-lg shadow flex items-center space-x-4">
                          <FaUserCircle className="w-12 h-12 text-[#00C0CB]" />
                          <div>
                            <h4 className="font-bold text-gray-800">{`${review.userId.firstName} ${review.userId.lastName}`}</h4>
                            <div className="flex space-x-1 text-yellow-500">
                              {[...Array(review.rating)].map((_, index) => (
                                <span key={index}>★</span>
                              ))}
                              {[...Array(5 - review.rating)].map((_, index) => (
                                <span key={index} className="text-gray-300">
                                  ☆
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-700 mt-2">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
          {/* Hotel Details Start */}
          <div className="w-full lg:w-1/3">
            <div className="h-fit sticky top-4 hidden lg:block">
              <div className="p-4 bg-white rounded-lg shadow-md border-2 border-[#00C0CB]">
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
                        </div>
                      </div>

                      {cartItems.length > 0 &&
                        cartItems.map((item: any, index: any) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="text-sm">
                                  {item.product.title} Adult ({item.adultCount}){" "}
                                  {item.childCount > 0 && (
                                    <span>Child ({item.childCount})</span>
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
                            {/* Display selected add-ons */}
                            {item.selectedAddOns &&
                              item.selectedAddOns.length > 0 && (
                                <div className="mt-2 text-xs text-gray-600">
                                  <h4 className="font-semibold">Add-Ons:</h4>
                                  {item.selectedAddOns.map(
                                    (addOn: any, addOnIndex: number) => (
                                      <div
                                        key={addOnIndex}
                                        className="flex justify-between"
                                      >
                                        <span>
                                          {addOn.name} ({addOn.quantity})
                                        </span>
                                        <span>
                                          ₹
                                          {(
                                            addOn.price * addOn.quantity
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        ))}
                      <div className="mt-4 border-t pt-4">
                        <div className="flex justify-between text-gray-700 mb-2">
                          <span>Total:</span>
                          <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <Button
                          className="w-full bg-goldColor text-white py-2 rounded-lg"
                          onClick={() => navigate(`/checkout`)}
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
          {cartItems.length > 0 && (
            <div className="fixed bottom-0 pb-4 left-0 w-full bg-white shadow-lg border-t p-2 z-10 md:hidden">
              <div className="flex justify-between items-center">
                {/* Display amount */}
                <div className="flex flex-col text-[#02596C] gap-2">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-base font-bold">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  {/* Book Now Button */}
                  <Button
                    onClick={() => navigate(`/checkout`)}
                    className="bg-[#02596C] text-white px-6 py-3 rounded-full text-lg"
                  >
                    Book Now
                  </Button>
                  {/* <button
                    className="text-gray-500"
                    onClick={() => clearAllCart()}
                  >
                    ×
                  </button> */}
                </div>
              </div>
            </div>
          )}
          {/* Cart Section */}
        </div>
      </div>

      <style>{`
        .swiper-pagination {
          bottom: -20px;
        }
        .swiper-button-next,
        .swiper-button-prev {
          width: 25px;
          height: 25px;
          color: #02596c;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 2rem;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Detail);
