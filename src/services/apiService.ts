import apiClient from './api';
import { API_ENDPOINTS } from '../constants/Config';

// ─── Products ─────────────────────────────────────────────
export const getProducts = async (params?: any, config?: any) => {
  return apiClient.get(API_ENDPOINTS.PRODUCTS, { params, ...config });
};

export const getProductById = async (id: string, config?: any) => {
  return apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id), config);
};

export const getProductBySlug = async (slug: string, config?: any) => {
  return apiClient.get(API_ENDPOINTS.PRODUCT_BY_SLUG(slug), config);
};

export const getCategories = async (config?: any) => {
  return apiClient.get(API_ENDPOINTS.CATEGORIES, config);
};

export const searchProducts = async (query: string) => {
  return apiClient.get(API_ENDPOINTS.SEARCH, { params: { q: query } });
};

export const getFeaturedProducts = async () => {
  return apiClient.get(API_ENDPOINTS.FEATURED);
};

// ─── Auth ─────────────────────────────────────────────────
export const login = async (data: any) => {
  return apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);
};

export const register = async (data: any) => {
  return apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
};

export const verifyOtp = async (data: { phone: string; otp: string }) => {
  return apiClient.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
};

export const resendOtp = async (phone: string) => {
  return apiClient.post(API_ENDPOINTS.AUTH.RESEND_OTP, { phone });
};

export const getProfile = async () => {
  return apiClient.get(API_ENDPOINTS.USERS.PROFILE);
};

export const updateProfile = async (data: any) => {
  return apiClient.patch(API_ENDPOINTS.USERS.UPDATE_PROFILE, data);
};

export const getAddresses = async () => {
  return apiClient.get(API_ENDPOINTS.USERS.GET_ADDRESSES);
};

export const addAddress = async (data: any) => {
  return apiClient.post(API_ENDPOINTS.USERS.ADD_ADDRESS, data);
};

export const deleteAddress = async (id: string) => {
  return apiClient.delete(API_ENDPOINTS.USERS.DELETE_ADDRESS(id));
};

// ─── Cart & Wishlist ──────────────────────────────────────
export const getCart = async () => {
  return apiClient.get(API_ENDPOINTS.CART);
};

export const updateCart = async (items: any[]) => {
  return apiClient.post(API_ENDPOINTS.CART, { items });
};

export const getWishlist = async () => {
  return apiClient.get(API_ENDPOINTS.WISHLIST);
};

// ─── Orders ───────────────────────────────────────────────
export const getOrders = async () => {
  return apiClient.get(API_ENDPOINTS.ORDERS);
};

export const createOrder = async (orderData: any) => {
  return apiClient.post(API_ENDPOINTS.ORDERS, orderData);
};

export const getOrderById = async (id: string) => {
  return apiClient.get(`${API_ENDPOINTS.ORDERS}/${id}`);
};

export const trackOrder = async (orderNumber: string) => {
  return apiClient.get(`/orders/track/${orderNumber}`);
};

// ─── Payments ─────────────────────────────────────────────
export const initiateRazorpay = async (orderId: string) => {
  return apiClient.post(API_ENDPOINTS.PAYMENTS.RAZORPAY_INITIATE, { orderId });
};

export const verifyRazorpay = async (verificationData: any) => {
  return apiClient.post(API_ENDPOINTS.PAYMENTS.RAZORPAY_VERIFY, verificationData);
};
