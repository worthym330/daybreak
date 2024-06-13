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
      {cartItems.map((cartItem, index) => (
        <div key={index} className="border-b py-2">
          <div>
            Location:
            <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
          </div>
          <div className="flex justify-between">
            <div>
              Date
              <div className="font-bold">{new Date(cartItem.date).toDateString()}</div>
            </div>
          </div>
          <div className="border-t border-b py-2">
            Guests
            <div className="font-bold">
              {cartItem.adultCount} adults & {cartItem.childCount} children
            </div>
          </div>
          <div className="border-t border-b py-2">
            Product:
            <div className="font-bold">{cartItem?.product?.title}</div>
            <ul className="list-disc ml-5">
              {cartItem.product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <div className="text-sm mt-2">{cartItem.product.description}</div>
          </div>
          <div className="border-t border-b py-2">
            Total Cost:
            <div className="font-bold">₹{cartItem.total}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingDetailsSummary;
