import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  trackOrderOpen: boolean;
  trackOrderNumber: string | null;
  quickViewProductId: string | null;
  theme: 'light' | 'dark';
  toastMessage: string | null;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartOpen: false,
    searchOpen: false,
    mobileMenuOpen: false,
    trackOrderOpen: false,
    trackOrderNumber: null,
    quickViewProductId: null,
    theme: 'light',
    toastMessage: null
  } as UIState,
  reducers: {
    openCart(state) {
      state.cartOpen = true;
    },
    closeCart(state) {
      state.cartOpen = false;
    },
    toggleCart(state) {
      state.cartOpen = !state.cartOpen;
    },
    openSearch(state) {
      state.searchOpen = true;
    },
    closeSearch(state) {
      state.searchOpen = false;
    },
    openMobileMenu(state) {
      state.mobileMenuOpen = true;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
    },
    openTrackOrder(state, action: PayloadAction<string | undefined>) {
      state.trackOrderOpen = true;
      state.trackOrderNumber = action.payload || null;
    },
    closeTrackOrder(state) {
      state.trackOrderOpen = false;
      state.trackOrderNumber = null;
    },
    setQuickView(state, action: PayloadAction<string | null>) {
      state.quickViewProductId = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setToast(state, action: PayloadAction<string | null>) {
      state.toastMessage = action.payload;
    },
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  openSearch,
  closeSearch,
  openMobileMenu,
  closeMobileMenu,
  openTrackOrder,
  closeTrackOrder,
  setQuickView,
  setTheme,
  setToast
} = uiSlice.actions;

export const selectCartOpen        = (s: { ui: UIState }) => s.ui.cartOpen;
export const selectSearchOpen      = (s: { ui: UIState }) => s.ui.searchOpen;
export const selectMobileMenuOpen  = (s: { ui: UIState }) => s.ui.mobileMenuOpen;
export const selectTrackOrderOpen  = (s: { ui: UIState }) => s.ui.trackOrderOpen;
export const selectTrackOrderNumber = (s: { ui: UIState }) => s.ui.trackOrderNumber;
export const selectQuickViewId     = (s: { ui: UIState }) => s.ui.quickViewProductId;
export const selectTheme           = (s: { ui: UIState }) => s.ui.theme;

export default uiSlice.reducer;
