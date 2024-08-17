import { useState } from "react";
import CartModal from "./CartModal";
import { FaChevronDown, FaChevronUp, FaSpa, FaUsers } from "react-icons/fa";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setError } from "../store/cartSlice";
import { PiCampfire } from "react-icons/pi";
import { FiSun } from "react-icons/fi";

interface ProductCardProps {
  product: any;
  hotel: any;
  setCart?: any;
}

export type TitleKey = "SPA PASS" | "DAY PASS" | "BORNFIRE" |"CONFERENCE HALL";

export const titleIcons = {
  "SPA PASS": <FaSpa />,
  "DAY PASS": <FiSun />,
  "BORNFIRE": <PiCampfire />,
  "CONFERENCE HALL" : <FaUsers />
};

const ProductCard = ({ product, hotel, setCart }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLess, setShowLess] = useState(false);
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.cart.error);
  const date = useSelector((state: RootState) => state.cart.date);
  const handleSelect = () => {
    console.log(error, date);
    if (date === undefined) {
      dispatch(setError(true));
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`bg-white rounded-lg lg:shadow-xl p-4 lg:p-8 mb-4 border-2 hover:border-[#00C0CB]`}
    >
      {/* Conditionally render based on screen size */}
      <div className={` ${showLess ? "h-36 overflow-hidden" : "h-fit"}`}>
        <div className="flex justify-between items-center md:hidden">
          <div className="w-2/3 pr-4">
            <h2 className="text-lg lg:text-xl font-semibold text-[#00C0CB]">
              {product.title}
            </h2>
          </div>
          <div className="pl-4 ml-4">
            <Button
              className="bg-goldColor text-white px-4 py-2 rounded-lg w-24 flex items-center justify-center"
              onClick={handleSelect}
            >
              <span>Select</span>
              <span className="font-thin">
                {isModalOpen ? (
                  <FaChevronUp className="w-5 h-5 text-sm" />
                ) : (
                  <FaChevronDown className="w-5 h-5 text-sm" />
                )}
              </span>
            </Button>
          </div>
        </div>
        <div className="md:flex justify-between hidden">
          {/* Left Box */}
          <div className="w-2/3 pr-4">
            <h2 className="text-xl flex">
              <span className="text-white bg-[#00C0CB] text-center content-center border border-[#00C0CB] p-2 rounded-l-md">
                {titleIcons[product.title.toUpperCase() as TitleKey] && (
                  <span>
                    {titleIcons[product.title.toUpperCase() as TitleKey]}
                  </span>
                )}
              </span>
              <span className="font-semibold text-[#00C0CB] border border-[#00C0CB] rounded-r-md p-2">
                {product.title}
              </span>
            </h2>
            <div className="text-sm text-gray-600 mt-2 space-y-1">
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
            <p className="text-sm text-gray-500 px-2">{product.otherpoints}</p>
          </div> */}
            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <h1 className="text-gray-800 font-semibold">Notes</h1>
              <span className="px-2">{product.notes}</span>
            </div>
          </div>
          {/* Right Box */}
          <div className="border-l-2 border-gray-200 h-auto"></div>
          <div className="w-1/3 pl-4 ml-4">
            <div className="flex justify-between items gap-2 text-gray-500 text-sm">
              {product.adultPrice > 0 && (
                <div className="flex flex-col gap-2 text-center">
                  <span className="text-center">Adults</span>
                  <span className="text-xl font-medium text-goldColor text-nowrap">
                    ₹ {product.adultPrice}{" "}
                  </span>
                </div>
              )}
              {product.childPrice > 0 && (
                <div className="flex flex-col gap-2 text-center">
                  <span className="">Children</span>
                  <span className="text-xl font-medium text-goldColor">
                    ₹ {product.childPrice}
                  </span>
                </div>
              )}
              {product.priceInfant > 0 && (
                <div className="flex flex-col gap-2">
                  <span>Infant</span>
                  <span className="text-xl font-medium text-goldColor">
                    {product.priceInfant}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-2">
              <Button
                className="bg-goldColor text-white px-4 py-2 rounded-lg w-full flex items-center justify-center"
                onClick={handleSelect}
              >
                <span>Select</span>
                <span className="font-thin">
                  {isModalOpen ? (
                    <FaChevronUp className="w-5 h-5 text-sm" />
                  ) : (
                    <FaChevronDown className="w-5 h-5 text-sm" />
                  )}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <button
        className="text-goldColor mt-2 hidden md:block"
        onClick={() => setShowLess(!showLess)}
      >
        {showLess ? (
          <span className="flex gap-2 items-center text-[#00C0CB]">
            <span>Show more</span>
            <FaChevronDown className="w-4 h-4 " />
          </span>
        ) : (
          <span className="flex gap-2 items-center text-[#00C0CB]">
            <span>Show less</span>
            <FaChevronUp className="w-4 h-4 " />
          </span>
        )}
      </button>
      {isModalOpen && (
        <CartModal
          product={product}
          hotel={hotel}
          onClose={handleCloseModal}
          date={date}
          setCart={setCart}
        />
      )}
    </div>
  );
};

export default ProductCard;