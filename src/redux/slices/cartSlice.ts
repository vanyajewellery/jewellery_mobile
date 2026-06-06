import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string; productId: string; name: string; image: string;
  price: number; originalPrice: number; quantity: number;
  variant?: { metal?: string; size?: string; color?: string };
}

interface CartState {
  items: CartItem[];
  coupon: string | null;
  couponDiscount: number;
  shippingCharge: number;
  total: number;
  shippingFreeThreshold: number;
  shippingChargeDefault: number;
}

const initialState: CartState = {
  items: [],
  coupon: null,
  couponDiscount: 0,
  shippingCharge: 0,
  total: 0,
  shippingFreeThreshold: 999,
  shippingChargeDefault: 99,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) { existing.quantity = Math.min(existing.quantity + action.payload.quantity, 10); }
      else { state.items.push(action.payload); }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.id === action.payload.id);
      if (item) item.quantity = Math.max(1, Math.min(action.payload.quantity, 10));
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.couponDiscount = 0;
      state.shippingCharge = 0;
      state.total = 0;
    },
    applyCoupon(state, action: PayloadAction<{ code: string; discount: number }>) {
      state.coupon = action.payload.code;
      state.couponDiscount = action.payload.discount;
    },
    removeCoupon(state) {
      state.coupon = null;
      state.couponDiscount = 0;
    },
    setCartTotals(
      state,
      action: PayloadAction<{
        shipping?: number;
        total?: number;
        couponCode?: string | null;
        couponDiscount?: number;
        shippingFreeThreshold?: number;
        shippingChargeDefault?: number;
      }>
    ) {
      const { shipping, total, couponCode, couponDiscount, shippingFreeThreshold, shippingChargeDefault } = action.payload;
      if (shipping !== undefined) state.shippingCharge = shipping;
      if (total !== undefined) state.total = total;
      if (couponCode !== undefined) state.coupon = couponCode;
      if (couponDiscount !== undefined) state.couponDiscount = couponDiscount;
      if (shippingFreeThreshold !== undefined) state.shippingFreeThreshold = shippingFreeThreshold;
      if (shippingChargeDefault !== undefined) state.shippingChargeDefault = shippingChargeDefault;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, applyCoupon, removeCoupon, setCartTotals } = cartSlice.actions;

export const selectCartItems    = (s: { cart: CartState }) => s.cart.items;
export const selectCartCount    = (s: { cart: CartState }) => s.cart.items.reduce((sum,i)=>sum+i.quantity,0);
export const selectCartSubtotal = (s: { cart: CartState }) => s.cart.items.reduce((sum,i)=>sum+i.price*i.quantity,0);
export const selectCoupon       = (s: { cart: CartState }) => ({ code: s.cart.coupon, discount: s.cart.couponDiscount });
export const selectShippingCharge = (s: { cart: CartState }) => s.cart.shippingCharge;
export const selectCartTotal      = (s: { cart: CartState }) => s.cart.total;
export const selectShippingFreeThreshold = (s: { cart: CartState }) => s.cart.shippingFreeThreshold;
export const selectShippingChargeDefault = (s: { cart: CartState }) => s.cart.shippingChargeDefault;

export default cartSlice.reducer;
