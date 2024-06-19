export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
};

export type HotelType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdated: Date;
  bookings: BookingType[];
  favourites: FavouriteList[];
  productTitle: any;
  hotelType: any;
};

export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  adultCount?: number;
  childCount?: number;
  checkIn?: Date;
  checkOut?: Date;
  totalCost?: number;
  cart?: any[];
};

export type FavouriteList = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  amount: any;
  currency: any;
  orderId: any;
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};
