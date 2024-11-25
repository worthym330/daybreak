export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
  phone: string;
  resetPasswordToken: any;
  resetPasswordExpires: any;
};

export interface HotelType {
  _id?: any;
  userId?: string;
  name: string;
  city: string;
  state: string;
  address?: string;
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
  pincode: string;
  mapurl: string;
  status: boolean;
  titlesId?: string[];
  addOns?: string[];
  createdAt?: Date;
  reviews?: string[];
  ispopular?: boolean;
  ranking?: number;
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
  totalCost: number;
  orderId: string;
  paymentId: string;
  cart?: any[];
  status: string;
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
  remainingGuests?: number;
  _id?: any;
  title: string;
  description: string[];
  adultPrice: number;
  childPrice: number;
  otherpoints: string;
  notes: string;
  maxPeople: string;
  selectedDates?: Date[];
  slotTime: string;
  startTime: string;
  endTime: string;
  isChildPrice: boolean;
  maxGuestsperDay: number;
  breakTime: string;
  addOns?: string[];
}
