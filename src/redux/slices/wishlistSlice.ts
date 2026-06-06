import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] } as WishlistState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export const selectWishlistItems = (s: { wishlist: WishlistState }) => s.wishlist.items;
export const selectWishlistIds   = (s: { wishlist: WishlistState }) => s.wishlist.items.map(i => i.id);
export const selectIsWishlisted  = (id: string) => (s: { wishlist: WishlistState }) => s.wishlist.items.some(i => i.id === id);

export default wishlistSlice.reducer;
