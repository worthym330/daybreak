import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const CartModal = ({ product, hotelId, onClose, date, setCart }: any) => {
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = Cookies.get("cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart) as any[]; // Use 'as any[]' to handle array type
      const savedProduct = cart.find(
        (item) =>
          item.product.title === product.title && item.hotelId === hotelId
      );
      if (savedProduct) {
        setAdultCount(savedProduct.adultCount);
        setChildCount(savedProduct.childCount);
        setTotal(savedProduct.total);
      }
    }
  }, [product.title, hotelId]);  

  useEffect(() => {
    const adultTotal =
      adultCount *
      (parseFloat(product.priceAdult) + parseFloat(product.feeAdult));
    const childTotal = product.priceChild
      ? childCount *
        (parseFloat(product.priceChild) + parseFloat(product.feeChild))
      : 0;
    setTotal(adultTotal + childTotal);
  }, [
    adultCount,
    childCount,
    product.priceAdult,
    product.feeAdult,
    product.priceChild,
    product.feeChild,
  ]);

  const handleAddToCart = () => {
    if (adultCount > 0 || childCount > 0) {
      let cart: any[] = [];
      const savedCart = Cookies.get("cart");
      if (savedCart) {
        cart = JSON.parse(savedCart) as any[]; // Ensure cart is initialized correctly
      }
  
      const existingProductIndex = cart.findIndex(
        (item) =>
          item.product.title === product.title && item.hotelId === hotelId
      );
  
      const cartItem = {
        product,
        hotelId,
        adultCount,
        childCount,
        total,
        date,
      };
  
      if (existingProductIndex !== -1) {
        cart[existingProductIndex] = cartItem;
      } else {
        cart.push(cartItem);
      }
  
      Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
      setCart(cart);
      onClose();
    }
  };  

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 text-gray-600 rounded-full px-2 py-1 border"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col space-y-4 mt-4">
          {/* <h2 className="text-xl font-semibold">Select Tickets</h2> */}
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
              >
                +
              </button>
            </div>
          </div>
          {product.priceChild && (
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
                >
                  +
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span>Total</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>
          <div className="text-right">
            <button
              className="bg-goldColor text-white px-4 py-2 rounded-lg"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
