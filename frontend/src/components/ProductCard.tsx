import { useState } from 'react';
import CartModal from './CartModal';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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
  date?:any;
  error?:boolean;
  setError?:any;
  setCart?:any;
}

const ProductCard = ({ product, hotelId,date, error, setError, setCart }: ProductCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleSelect = () => {
    if(!error && date !== null){
      setError(true)
    }else{
      setError(false)
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-4 mb-4">
      <div className="flex justify-between">
        <div className="w-2/3">
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc p-4">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
        <div className="border-l-2 border-gray-300 h-auto"></div>
        <div className="w-1/3 p-4">
          <div className="flex justify-center justify-between gap-2 text-gray-500 text-sm">
            {product.priceAdult !== "" && (
              <div className="flex flex-col gap-2">
                <span>Adults</span>
                <span className="">₹ {product.priceAdult} </span>
                <span className="text-xs">+{product.feeAdult} in fees</span>
              </div>
            )}
            {product.priceChild !== "" && (
              <div className="flex flex-col gap-2">
                <span>Children</span>
                <span className="">₹ {product.priceChild}</span>
                <span className="text-xs">+{product.feeChild} in fees</span>
              </div>
            )}
            {product.priceInfant !== "" && (
              <div className="flex flex-col gap-2">
                <span>Infant</span>
                <span className="">{product.priceInfant}</span>
              </div>
            )}
          </div>
          <div className="mt-2">
            <button
              className="bg-goldColor text-white px-4 py-2 rounded-lg w-full flex gap-2 items-center justify-center"
              onClick={handleSelect}
            >
              <span>Select</span>
              <span className="font-thin">{isModalOpen ? <FaChevronUp className='w-5 h-5 text-sm' /> : <FaChevronDown className='w-5 h-5 text-sm' />}</span>
            </button>
          </div>
        </div>
      </div>
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
