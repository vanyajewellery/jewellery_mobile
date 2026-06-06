import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber?: string;
  items: OrderItem[];
  total: number;
  status: string;
  address: Record<string, string>;
  paymentMethod: string;
  createdAt: string;
  estimatedDelivery: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
}

const orderSlice = createSlice({
  name: 'order',
  initialState: { orders: [], loading: false } as OrderState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus(state, action: PayloadAction<{ id: string; status: string }>) {
      const o = state.orders.find(o => o.id === action.payload.id);
      if (o) o.status = action.payload.status;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setOrders, addOrder, updateOrderStatus, setLoading } = orderSlice.actions;
export const selectOrders  = (s: { order: OrderState }) => s.order.orders;
export const selectOrderLoading = (s: { order: OrderState }) => s.order.loading;

export default orderSlice.reducer;
