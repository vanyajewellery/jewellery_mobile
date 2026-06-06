import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';

interface Filters {
  category: string[];
  material: string[];
  occasion: string[];
  color: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

interface ProductState {
  items: Product[];
  filtered: Product[];
  loading: boolean;
  error: string | null;
  filters: Filters;
  sort: string;
  view: 'grid' | 'list';
  page: number;
  hasMore: boolean;
  searchQuery: string;
  recentlyViewed: Product[];
}

const DEFAULT_FILTERS: Filters = {
  category: [],
  material: [],
  occasion: [],
  color: [],
  minPrice: 0,
  maxPrice: 20000,
  minRating: 0,
  inStockOnly: false,
  onSaleOnly: false
};

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    filtered: [],
    loading: false,
    error: null,
    filters: DEFAULT_FILTERS,
    sort: 'newest',
    view: 'grid',
    page: 1,
    hasMore: true,
    searchQuery: '',
    recentlyViewed: []
  } as ProductState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
      state.filtered = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
      state.page = 1;
    },
    setView(state, action: PayloadAction<'grid' | 'list'>) {
      state.view = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    updateFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    resetFilters(state) {
      state.filters = DEFAULT_FILTERS;
      state.page = 1;
    },
    addRecentlyViewed(state, action: PayloadAction<Product>) {
      state.recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter(p => p.id !== action.payload.id)
      ].slice(0, 10);
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  setSort,
  setView,
  setPage,
  setSearchQuery,
  updateFilters,
  resetFilters,
  addRecentlyViewed
} = productSlice.actions;

export const selectProducts       = (s: { product: ProductState }) => s.product.items;
export const selectProductFilters = (s: { product: ProductState }) => s.product.filters;
export const selectProductSort    = (s: { product: ProductState }) => s.product.sort;
export const selectProductView    = (s: { product: ProductState }) => s.product.view;
export const selectRecentlyViewed = (s: { product: ProductState }) => s.product.recentlyViewed;

export default productSlice.reducer;
