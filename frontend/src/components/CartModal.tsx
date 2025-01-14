import { useState, useEffect } from "react";
import Button from "./Button";
import moment from "moment";
import { addToCart } from "../store/cartSlice";
import { useDispatch } from "react-redux";
import { FaCalendar, FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const CartModal = ({ product, hotel, onClose, setCart, slotValues }: any) => {
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [date, setDate] = useState<string | undefined>(undefined);
  const [slot, setSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const dispatch = useDispatch();
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);

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
        setSelectedAddOns(savedProduct.selectedAddOns || []);
        if (savedProduct.date) {
          setDate(savedProduct.date);
          setSlot(savedProduct.slot);
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
    const addOnsTotal = selectedAddOns.reduce(
      (acc, addOn) => acc + addOn.quantity * addOn.price,
      0
    );
    setTotal(adultTotal + childTotal + addOnsTotal);
  }, [
    adultCount,
    childCount,
    product.adultPrice,
    product.childPrice,
    selectedAddOns,
  ]);

  const handleAddToCart = () => {
    if (!date) {
      toast.warning("Please select the date");
    } else if (!slot) {
      toast.warning("Please select the slot");
    } else {
      if (adultCount > 0 || childCount > 0) {
        let cart: any[] = [];
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          cart = JSON.parse(savedCart) as any[];
        }

        const differentHotelId = cart.some(
          (item) => item.hotel._id !== hotel._id
        );

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
          slot,
          selectedAddOns, // Include add-ons in cart item
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
          dispatch(addToCart(cartItem));
          onClose();
        } catch (error) {
          console.error("Error setting local storage: ", error);
        }
      } else {
        toast.warning("Please select the number of Adults or Childrens");
      }
    }
  };

  useEffect(() => {
    if (slotValues && date) {
      const availableSlots = slotValues
        .filter(
          (slot: any) =>
            moment(slot.startTime).isSame(date, "day") &&
            slot?.title === product?.title
        )
        .map((e: any) => e.slots)
        .flat();

      setAvailableSlots(availableSlots);
    }
  }, [slotValues, date]);

  useEffect(() => {
    if (childCount === 0 && adultCount === 0) {
      setSelectedAddOns([]);
    }
  }, [childCount, adultCount]);

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
              Please Select Date
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
                className="pl-10 w-full px-4 py-2 border"
              />
            </div>
          </div>

          <div>
            <label htmlFor="slot" className="block text-sm font-medium">
              Select Time Slot
            </label>
            <select
              id="slot"
              name="slot"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select a date first</option>
              {availableSlots
                .filter(
                  (e: any) => e.status && moment(e.startTime).isAfter(moment())
                )
                .map((slot: any, index) => (
                  <option
                    key={index}
                    value={`${moment(slot.startTime).format("LT")} - ${moment(
                      slot.endTime
                    ).format("LT")}`}
                  >
                    {`${moment(slot.startTime).format("LT")} - ${moment(
                      slot.endTime
                    ).format("LT")}`}
                  </option>
                ))}
            </select>
          </div>

          {/* Adult Count */}
          <div className="flex justify-between items-center px-2 py-2">
            <span>Adult (over 13)</span>
            <div className="flex items-center">
              <button
                className="px-2 py-1 text-red-600 disabled:cursor-not-allowed"
                disabled={!date}
                onClick={() => {
                  setAdultCount(Math.max(0, adultCount - 1));
                  setTotal(total - product.adultPrice);
                }}
              >
                <FaMinusCircle className="w-4 h-4" />
              </button>
              <span className="mx-2">{adultCount}</span>
              <button
                className="px-2 py-1 text-green-600 disabled:cursor-not-allowed"
                disabled={!date}
                onClick={() => {
                  setAdultCount(adultCount + 1);
                  setTotal(total + product.adultPrice);
                }}
              >
                <FaPlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Child Count */}
          {product.childPrice > 0 && (
            <div className="flex justify-between items-center px-2 py-2">
              <span>Children (age 3 to 12)</span>
              <div className="flex items-center">
                <button
                  className="px-2 py-1 text-red-600 disabled:cursor-not-allowed"
                  onClick={() => {
                    setChildCount(Math.max(0, childCount - 1));
                    setTotal(total - product.childPrice);
                  }}
                  disabled={!date}
                >
                  <FaMinusCircle className="w-4 h-4" />
                </button>
                <span className="mx-2">{childCount}</span>
                <button
                  className="px-2 py-1 text-green-600 disabled:cursor-not-allowed"
                  onClick={() => {
                    setChildCount(childCount + 1);
                    setTotal(total + product.childPrice);
                  }}
                  disabled={!date}
                >
                  {" "}
                  <FaPlusCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {product?.addOns?.length > 0 && (
            <div className="h-40 overflow-y-auto">
              <hr className="mb-2" />
              <h3 className="font-semibold text-lg mb-1">Add-ons</h3>
              {product.addOns.map((addOn: any, index: number) => (
                <div
                  className="flex justify-between items-center px-2 py-2"
                  key={index}
                >
                  <span>
                    {addOn.name} (₹{addOn.price})
                  </span>
                  <div className="flex items-center">
                    {/* Checkbox to select the addon */}
                    {selectedAddOns.some(
                      (item: any) => item.name === addOn.name
                    ) && (
                      <select
                        value={
                          selectedAddOns.find(
                            (item: any) => item.name === addOn.name
                          )?.quantity || 1
                        }
                        className="ml-2 w-16"
                        disabled={true}
                        onChange={(e) => {
                          const quantity = Number(e.target.value);
                          const currentAddOn = selectedAddOns.find(
                            (item: any) => item.name === addOn.name
                          );

                          if (currentAddOn) {
                            const difference = quantity - currentAddOn.quantity;
                            setTotal(
                              (prevTotal) =>
                                prevTotal + difference * addOn.price
                            );

                            const updatedAddOns = selectedAddOns.map(
                              (item: any) => {
                                if (item.name === addOn.name) {
                                  return { ...item, quantity };
                                }
                                return item;
                              }
                            );
                            setSelectedAddOns(updatedAddOns);
                          }
                        }}
                      >
                        {[...Array(10).keys()].map((i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="checkbox"
                      className="ml-2 disabled:cursor-not-allowed"
                      checked={selectedAddOns.some(
                        (item: any) => item.name === addOn.name
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newAddOn = {
                            name: addOn.name,
                            price: addOn.price,
                            quantity: 1,
                          };
                          setSelectedAddOns((prev) => [...prev, newAddOn]);
                        } else {
                          const updatedAddOns = selectedAddOns.filter(
                            (item: any) => item.name !== addOn.name
                          );
                          setSelectedAddOns(updatedAddOns);
                        }
                      }}
                      disabled={childCount === 0 && adultCount === 0}
                    />
                  </div>
                </div>
              ))}
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
              // disabled={!date}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Small Screen Modal */}
      <div
        className={`bg-white p-6 rounded-t-lg rounded-b-none shadow-lg fixed bottom-0 left-0 right-0 w-full h-[35rem] z-10 overflow-y-auto lg:hidden ${
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
              Please Select Date
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
                className="pl-10 w-full px-4 py-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label htmlFor="slot" className="block text-sm font-medium">
              Select Time Slot
            </label>
            <select
              id="slot"
              name="slot"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select a date first</option>
              {availableSlots
                .filter(
                  (e: any) => e.status && moment(e.startTime).isAfter(moment())
                )
                .map((slot: any, index) => (
                  <option
                    key={index}
                    value={`${moment(slot.startTime).format("LT")} - ${moment(
                      slot.endTime
                    ).format("LT")}`}
                  >
                    {`${moment(slot.startTime).format("LT")} - ${moment(
                      slot.endTime
                    ).format("LT")}`}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-between items-center">
            <span>Adult (over 13)</span>
            <div className="flex items-center">
              <button
                className="px-2 py-1 text-red-600 disabled:cursor-not-allowed"
                onClick={() => setAdultCount(Math.max(0, adultCount - 1))}
                disabled={!date}
              >
                <FaMinusCircle className="w-4 h-4" />
              </button>
              <span className="mx-2">{adultCount}</span>
              <button
                className="px-2 py-1 text-green-600 disabled:cursor-not-allowed"
                onClick={() => setAdultCount(adultCount + 1)}
                disabled={!date}
              >
                <FaPlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
          {product.childPrice > 0 && (
            <div className="flex justify-between items-center">
              <span>Children (age 3 to 12)</span>
              <div className="flex items-center">
                <button
                  className="px-2 py-1 text-red-600 disabled:cursor-not-allowed"
                  onClick={() => setChildCount(Math.max(0, childCount - 1))}
                  disabled={!date}
                >
                  <FaMinusCircle className="w-4 h-4" />
                </button>
                <span className="mx-2">{childCount}</span>
                <button
                  className="px-2 py-1 text-green-600 disabled:cursor-not-allowed"
                  onClick={() => setChildCount(childCount + 1)}
                  disabled={!date}
                >
                  {" "}
                  <FaPlusCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {product?.addOns?.length > 0 && (
            <div className="h-40 overflow-y-auto">
              <hr className="mb-2" />
              <h3 className="font-semibold text-base md:text-lg mb-1">Add-ons</h3>
              {product.addOns.map((addOn: any, index: number) => (
                <div
                  className="flex justify-between items-center px-2 py-2"
                  key={index}
                >
                  <span>
                    {addOn.name} (₹{addOn.price})
                  </span>
                  <div className="flex items-center">
                    {/* Checkbox to select the addon */}
                    {selectedAddOns.some(
                      (item: any) => item.name === addOn.name
                    ) && (
                      <select
                        value={
                          selectedAddOns.find(
                            (item: any) => item.name === addOn.name
                          )?.quantity || 1
                        }
                        className="ml-2 w-16"
                        disabled={true}
                        onChange={(e) => {
                          const quantity = Number(e.target.value);
                          const currentAddOn = selectedAddOns.find(
                            (item: any) => item.name === addOn.name
                          );

                          if (currentAddOn) {
                            const difference = quantity - currentAddOn.quantity;
                            setTotal(
                              (prevTotal) =>
                                prevTotal + difference * addOn.price
                            );

                            const updatedAddOns = selectedAddOns.map(
                              (item: any) => {
                                if (item.name === addOn.name) {
                                  return { ...item, quantity };
                                }
                                return item;
                              }
                            );
                            setSelectedAddOns(updatedAddOns);
                          }
                        }}
                      >
                        {[...Array(10).keys()].map((i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="checkbox"
                      className="ml-2 disabled:cursor-not-allowed"
                      checked={selectedAddOns.some(
                        (item: any) => item.name === addOn.name
                      )}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const newAddOn = {
                            name: addOn.name,
                            price: addOn.price,
                            quantity: 1,
                          };
                          setSelectedAddOns((prev) => [...prev, newAddOn]);
                        } else {
                          const updatedAddOns = selectedAddOns.filter(
                            (item: any) => item.name !== addOn.name
                          );
                          setSelectedAddOns(updatedAddOns);
                        }
                      }}
                      disabled={childCount === 0 && adultCount === 0}
                    />
                  </div>
                </div>
              ))}
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
            <div className="text-sm text-gray-600 my-2 space-y-1">
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
              // disabled={!date}
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
