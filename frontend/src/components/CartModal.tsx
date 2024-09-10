import { useState, useEffect } from "react";
import Button from "./Button";
import moment from "moment";
import { addToCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import { FaCalendar } from "react-icons/fa";

const CartModal = ({ product, hotel, onClose, setCart }: any) => {
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [date, setDate] = useState<string | undefined>(undefined);
  const dispatch = useDispatch();
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart) as any[];
      const savedProduct = cart.find(
        (item) =>
          item.product.title === product.title && item.hotel._id === hotel._id
      );
      if (savedProduct) {
        setAdultCount(savedProduct.adultCount);
        setChildCount(savedProduct.childCount);
        setTotal(savedProduct.total);
        if (savedProduct.date) {
          setDate(savedProduct.date);
        }
      }
    }
  }, [product.title, hotel]);

  useEffect(() => {
    const calculateGST = (amount: number) => amount * 1;
    const adultTotal = calculateGST(adultCount * product.adultPrice);
    const childTotal =
      product.childPrice > 0
        ? calculateGST(childCount * product.childPrice)
        : 0;
    setTotal(adultTotal + childTotal);
  }, [adultCount, childCount, product.adultPrice, product.childPrice]);

  const handleAddToCart = () => {
    if (adultCount > 0 || childCount > 0) {
      let cart: any[] = [];
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        cart = JSON.parse(savedCart) as any[];
      }

      // Check if there are products with different hotelId
      const differentHotelId = cart.some(
        (item) => item.hotel._id !== hotel._id
      );

      // if (differentHotelId) {
      //   toast.warning(
      //     "Please select the same hotel or remove the current selection from your cart before booking a new hotel."
      //   );
      //   return;
      // }

      const existingProductIndex = cart.findIndex(
        (item) =>
          item.product.title === product.title && item.hotel._id === hotel._id
      );

      const cartItem = {
        product,
        hotel,
        adultCount,
        childCount,
        total,
        date,
      };

      if (differentHotelId) {
        cart = [];
        cart.push(cartItem);
      } else {
        if (existingProductIndex !== -1) {
          cart[existingProductIndex] = cartItem;
        } else {
          cart.push(cartItem);
        }
      }

      try {
        localStorage.setItem("cart", JSON.stringify(cart));
        setCart(cart);
        // dispatch(setCart(cart));
        dispatch(addToCart(cartItem));
        onClose();
      } catch (error) {
        console.error("Error setting local storage: ", error);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Large Screen Modal */}
      <div
        className="bg-white py-3 px-5 rounded-lg shadow-lg relative hidden lg:block w-1/4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 rounded-full px-2 py-1 border"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col space-y-4 mt-10">
          <div>
            <label htmlFor="date" className="block text-sm font-medium ">
              Select Date
            </label>
            <div className="relative rounded-md w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaCalendar aria-hidden="true" className="h-5 w-5" />
              </div>
              <input
                id="date"
                name="date"
                type="date"
                placeholder="dd-mm-yyyy"
                value={date ? date : ""}
                onChange={(date) => {
                  setDate(date.target.value);
                }}
                min={new Date().toISOString().split("T")[0]}
                className="pl-10 w-full px-4 py-2"
              />
            </div>
          </div>

          <div className="flex justify-between items-center px-2 py-2">
            <span>Adult (over 13)</span>
            <div className="flex items-center">
              <button
                className="px-2 py-1 text-gray-600"
                onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
              >
                −
              </button>
              <span className="mx-2">{adultCount}</span>
              <button
                className="px-2 py-1 text-gray-600"
                disabled={!date}
                onClick={() => setAdultCount(adultCount + 1)}
              >
                +
              </button>
            </div>
          </div>
          {product.childPrice > 0 && (
            <div className="flex justify-between items-center px-2 py-2">
              <span>Children (age 3 to 12)</span>
              <div className="flex items-center">
                <button
                  className="px-2 py-1 text-gray-600"
                  onClick={() => setChildCount(Math.max(0, childCount - 1))}
                >
                  −
                </button>
                <span className="mx-2">{childCount}</span>
                <button
                  className="px-2 py-1 text-gray-600"
                  onClick={() => setChildCount(childCount + 1)}
                  disabled={!date}
                >
                  +
                </button>
              </div>
            </div>
          )}
          <hr />
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <span>Total</span>
              <span className="font-semibold text-lg text-darkGold">
                ₹ {total.toFixed(2)}
              </span>
            </div>

            <Button
              className="bg-goldColor text-white px-4 py-2 rounded-lg"
              onClick={handleAddToCart}
              disabled={!date}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Small Screen Modal */}
      <div
        className={`bg-white p-6 rounded-t-lg rounded-b-none shadow-lg fixed bottom-0 left-0 right-0 w-full h-[35rem] lg:hidden ${
          isVisible ? "animate-slide-up" : "animate-slide-down"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 rounded-full px-2 py-1 border"
          onClick={handleClose}
        >
          ×
        </button>
        <div className="flex flex-col space-y-4 mt-4 pb-20">
          <div>
            <label htmlFor="date" className="block text-sm font-medium ">
              Select Date
            </label>
            <div className="relative rounded-md w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaCalendar aria-hidden="true" className="h-5 w-5" />
              </div>
              <input
                id="date"
                name="date"
                type="date"
                placeholder="dd-mm-yyyy"
                value={date ? date : ""}
                onChange={(date) => {
                  setDate(date.target.value);
                }}
                min={new Date().toISOString().split("T")[0]}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span>Adult (over 13)</span>
            <div className="flex items-center">
              <button
                className="px-2 py-1 text-gray-600"
                onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
              >
                −
              </button>
              <span className="mx-2">{adultCount}</span>
              <button
                className="px-2 py-1 text-gray-600"
                onClick={() => setAdultCount(adultCount + 1)}
                disabled={!date}
              >
                +
              </button>
            </div>
          </div>
          {product.childPrice > 0 && (
            <div className="flex justify-between items-center">
              <span>Children (age 3 to 12)</span>
              <div className="flex items-center">
                <button
                  className="px-2 py-1 text-gray-600"
                  onClick={() => setChildCount(Math.max(0, childCount - 1))}
                >
                  −
                </button>
                <span className="mx-2">{childCount}</span>
                <button
                  className="px-2 py-1 text-gray-600"
                  onClick={() => setChildCount(childCount + 1)}
                  disabled={!date}
                >
                  +
                </button>
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-[24rem] pb-5">
            <div className="flex text-gray-700 text-sm gap-2">
              <span>Access till</span>
              <span>
                {moment(product.startTime, "HH:mm").format("hh:mm A")} -{" "}
                {moment(product.endTime, "HH:mm").format("hh:mm A")}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              {/* {product.features.map((feature:any, index:number) => (
                <li key={index}>{feature}</li>
              ))} */}
              <h1 className="text-gray-800 font-semibold">Description</h1>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc p-4">
                {product.description.map((feature: any, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            {/* <div>
              <h1 className="text-gray-800 font-semibold">
                All the points that needs to be mentioned in the product.
              </h1>
              <p className="text-sm text-gray-500 px-2">
                {product.otherpoints}
              </p>
            </div> */}
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <h1 className="text-gray-800 font-semibold">Notes</h1>
              <span className="px-2">{product.notes}</span>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span>Total</span>
              <span className="font-semibold text-lg text-darkGold">
                ₹ {total.toFixed(2)}
              </span>
            </div>
            <Button
              className="bg-goldColor text-white py-3 rounded-lg w-[160px]"
              onClick={handleAddToCart}
              disabled={!date}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Small Screen Modal Ends */}
    </div>
  );
};

export default CartModal;
