import { Platform } from 'react-native';

// UPDATE THIS to your local development machine IP for physical device testing
export const LOCAL_IP = '192.168.1.100'; 

export const BASE_URL = Platform.select({
  ios: 'http://localhost:5544/api/v1',
  android: 'http://localhost:5544/api/v1',
  default: `http://${LOCAL_IP}:5544/api/v1`,
}) || 'http://localhost:5544/api/v1';

export const IMAGE_BASE_URL = BASE_URL.replace('/api/v1', '');

export const API_ENDPOINTS = {
  PRODUCTS: '/products/get-products',
  PRODUCT_BY_ID: (id: string) => `/products/get-product-by-id/${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `/products/get-product-by-slug/${slug}`,
  CATEGORIES: '/categories/get-all',
  SEARCH: '/products/search-products',
  FEATURED: '/products/get-featured',
  CART: '/cart',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  BANNERS: '/banners',
  BLOGS: '/blogs',
  BLOG_BY_SLUG: (slug: string) => `/blogs/s/${slug}`,
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    REFRESH: '/auth/refresh-token',
  },
  USERS: {
    PROFILE: '/users/get-profile',
    UPDATE_PROFILE: '/users/update-profile',
    ADD_ADDRESS: '/users/addresses',
    UPDATE_ADDRESS: (id: string) => `/users/addresses/${id}`,
    DELETE_ADDRESS: (id: string) => `/users/addresses/${id}`,
    GET_ADDRESSES: '/users/addresses',
  },
  PAYMENTS: {
    RAZORPAY_INITIATE: '/payments/razorpay/initiate',
    RAZORPAY_VERIFY: '/payments/razorpay/verify',
  },
};
