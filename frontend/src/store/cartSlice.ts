import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: any[];
  error: boolean;
  date?: any;
  appliedCoupon?: string;
  discount?: number;
  total: number;
  subtotal: number;
}

const initialState: CartState = {
  items: [],
  error: false,
  date: null,
  appliedCoupon: "",
  discount: 0,
  total: 0,
  subtotal: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const newItem = action.payload;
      const existingProductIndex = state.items.findIndex(
        (item) =>
          item.product.title === newItem.product.title &&
          item.hotel._id === newItem.hotel._id
      );

      if (existingProductIndex !== -1) {
        state.items[existingProductIndex] = newItem;
      } else {
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemIdToRemove = action.payload;
      state.items = state.items.filter(
        (item) => item.product.title !== itemIdToRemove
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
    setAppliedCoupon: (state, action: PayloadAction<string>) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = ""; // Remove the applied coupon
    },
    setDiscountValue: (state, action: PayloadAction<any>) => {
      state.discount = action.payload;
    },
    removeDiscount: (state) => {
      state.discount = 0; // Remove the applied coupon
    },
    setTotalAmount: (state, action: PayloadAction<any>) => {
      state.total = action.payload;
    },
    RemoveTotalAmount: (state) => {
      state.total = 0;
    },
    setSubtotalAmount: (state, action: PayloadAction<any>) => {
      state.subtotal = action.payload;
    },
    RemoveSubTotalAmount: (state) => {
      state.subtotal = 0;
    },
  },
});

export const {
  addToCart,
  clearCart,
  setError,
  setDate,
  removeFromCart,
  setAppliedCoupon,
  removeCoupon,
  setDiscountValue,
  removeDiscount,
  setSubtotalAmount,
  setTotalAmount,
  RemoveSubTotalAmount,
  RemoveTotalAmount,
} = cartSlice.actions;

export default cartSlice.reducer;
