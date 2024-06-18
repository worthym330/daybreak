import { useState } from 'react';
import CartModal from './CartModal';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Button from './Button';

interface Product {
  title: string;
  features: string[];
  priceAdult: string;
  feeAdult: string;
  priceChild: string;
  feeChild: string;
  priceInfant: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  hotelId: string;
  date?: any;
  error?: boolean;
  setError?: any;
  setCart?: any;
}

const ProductCard = ({
  product,
  hotelId,
  date,
  error,
  setError,
  setCart,
}: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelect = () => {
    if (!error && date === null) {
      setError(true);
    } else {
      setError(false);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Determine if we are on mobile or tablet (small screens)
  const isSmallScreen = window.innerWidth <= 768; // Example breakpoint for tablets

  return (
    <div className="bg-white rounded-lg lg:shadow-xl p-4 lg:p-8 mb-4 border border-gray-300">
      {/* Conditionally render based on screen size */}
      {isSmallScreen ? (
        <div className="flex justify-between items-center">
          <div className="w-2/3 pr-4">
            <h2 className="text-lg lg:text-xl font-semibold text-goldColor">{product.title}</h2>
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
      ) : (
        // Full view for larger screens
        <div className="flex justify-between">
          {/* Right Box */}
          <div className="w-2/3 pr-4">
            <h2 className="text-xl font-semibold text-goldColor">{product.title}</h2>
            <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc p-4">
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500">{product.description}</p>
          </div>
          {/* Left Box */}
          <div className="border-l-2 border-gray-200 h-auto"></div>
          <div className="w-1/3 pl-4 ml-4">
            <div className="flex justify-between items gap-2 text-gray-500 text-sm">
              {product.priceAdult !== '' && (
                <div className="flex flex-col gap-2">
                  <span>Adults</span>
                  <span className="text-xl font-medium text-goldColor">₹ {product.priceAdult} </span>
                  <span className="text-xs">+{product.feeAdult} in fees</span>
                </div>
              )}
              {product.priceChild !== '' && (
                <div className="flex flex-col gap-2">
                  <span>Children</span>
                  <span className="text-xl font-medium text-goldColor">₹ {product.priceChild}</span>
                  <span className="text-xs">+{product.feeChild} in fees</span>
                </div>
              )}
              {product.priceInfant !== '' && (
                <div className="flex flex-col gap-2">
                  <span>Infant</span>
                  <span className="text-xl font-medium text-goldColor">{product.priceInfant}</span>
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
      )}
      {isModalOpen && (
        <CartModal
          product={product}
          hotelId={hotelId}
          onClose={handleCloseModal}
          date={date}
          setCart={setCart}
        />
      )}
    </div>
  );
};

export default ProductCard;
