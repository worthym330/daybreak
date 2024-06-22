export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
};

export interface HotelType {
  _id?: any;
  userId?: string;
  name: string;
  city: string;
  state: string;
  description: string;
  cancellationPolicy: string;
  facilities: string[];
  hotelType: string[];
  imageUrls: string[];
  productTitle: ProductType[];
  star: number;
  lastUpdated: Date;
  bookings: BookingType[];
  favourites: FavouriteList[];
}

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


export interface ProductType {
  title: string;
  description: string;
  adultPrice: number;
  childPrice: number;
  otherpoints: string;
  notes: string;
  maxPeople: string;
  selectedDates: Date[];
  slotTime: string;
  startTime: string;
  endTime: string;
  isChildPrice: boolean;
  maxGuestsperDay: number;
}
