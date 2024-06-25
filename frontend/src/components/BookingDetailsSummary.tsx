import { HotelType } from "../../../backend/src/shared/types";

type CartItemType = {
  adultCount: number;
  childCount: number;
  date: string;
  product: {
    title: string;
    features: string[];
    priceAdult: string;
    feeAdult: string;
    priceChild: string;
    feeChild: string;
    priceInfant: string;
    description: string;
  };
  total: number;
};

type Props = {
  hotel: HotelType;
  cartItems: CartItemType[];
};

const BookingDetailsSummary = ({ hotel, cartItems }: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div>
        Hotel Name:
        <div className="font-bold">{`${hotel.name}, ${hotel.city}, India`}</div>
      </div>
      {cartItems.map((cartItem, index) => (
        <details key={index} className="border-b py-2 px-2">
          <summary className="cursor-pointer font-bold flex justify-between">
            {" "}
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 fill-current text-gray-600"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 3a1 1 0 0 1 1 1v1.585l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L9 5.586V4a1 1 0 0 1 1-1zM4 7a1 1 0 1 1 0-2h12a1 1 0 1 1 0 2H4zm12 6a1 1 0 0 1-1 1H5a1 1 0 0 1 0-2h10a1 1 0 0 1 1 1zM8 13a1 1 0 1 1 0-2h2a1 1 0 1 1 0 2H8z" />
              </svg>
              <span>{cartItem?.product?.title}</span>
            </span>
            <span className="flex gap-2 items-center">
              <span>Total Cost:</span>
              <span>₹{cartItem.total}</span>
            </span>
          </summary>
          <div className="px-4 mt-2">
            <div className="flex justify-between">
              <div>
                Date
                <div className="font-bold">
                  {new Date(cartItem.date).toDateString()}
                </div>
              </div>
            </div>
            <div className="border-t border-b py-2">
              Guests
              <div className="font-bold">
                {cartItem.adultCount} adults & {cartItem.childCount} children
              </div>
            </div>
            <div className="overflow-y-auto max-h-[24rem] pb-5">

            <div className="text-sm text-gray-600 mt-2 space-y-1">
              <h1 className="text-gray-800 font-semibold">
                Description of the {cartItem?.product?.title}
              </h1>
              <span className="px-2">{cartItem.product.description}</span>
            </div>
          </div>
          </div>
        </details>
      ))}
    </div>
  );
};

export default BookingDetailsSummary;
