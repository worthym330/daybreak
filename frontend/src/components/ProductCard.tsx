import React from "react";
// import { useDispatch } from "react-redux";
// import { openModal } from "../store/modalSlice";

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
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // const dispatch = useDispatch();

  // const handleSelect = () => {
  //   dispatch(openModal(product));
  // };

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
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
              // onClick={handleSelect}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
