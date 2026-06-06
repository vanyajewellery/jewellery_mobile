import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  selectCartItems,
  selectCartSubtotal,
  removeItem,
  updateQuantity,
} from '../../redux/slices/cartSlice';
import { IMAGE_BASE_URL } from '../../constants/Config';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const getImageUrl = (path: string) => {
    if (!path) return 'https://picsum.photos/seed/placeholder/300/400';
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  return (
    <View className="flex-1 bg-brand-cream">
      {/* Header */}
      <View className="py-5 px-6 bg-white border-b border-gray-150 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-brand-charcoal uppercase tracking-wider">
          Shopping Bag
        </Text>
        <Text className="text-xs font-semibold text-gray-400">
          {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Icon name="bag-handle-outline" size={64} color="#7F7663" className="mb-4" />
          <Text className="text-lg font-serif text-brand-charcoal mb-2">
            Your Bag is Empty
          </Text>
          <Text className="text-xs text-gray-500 text-center mb-6 max-w-xs leading-relaxed">
            Add beautiful handcrafted pieces to your collection to display them here.
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Shop')}
            className="bg-brand-charcoal py-3 px-8 rounded-[4px]"
          >
            <Text className="text-white font-bold uppercase tracking-widest text-xs">
              Shop Collections
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
            {cartItems.map((item) => (
              <View 
                key={item.id} 
                className="flex-row bg-white p-3 rounded-lg border border-gray-200 mb-4 items-center shadow-sm"
              >
                <Image 
                  source={{ uri: getImageUrl(item.image) }} 
                  className="w-20 h-20 rounded-md mr-4 border border-gray-100"
                  resizeMode="cover"
                />
                
                <View className="flex-1 py-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-sm font-serif text-brand-charcoal flex-1 mr-2" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveItem(item.id)} className="p-1">
                      <Icon name="close" size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                  
                  {item.variant && (item.variant.metal || item.variant.color) && (
                    <Text className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">
                      {item.variant.metal ? `${item.variant.metal}` : ''}
                      {item.variant.metal && item.variant.color ? ' • ' : ''}
                      {item.variant.color ? `${item.variant.color}` : ''}
                    </Text>
                  )}

                  <Text className="text-brand-gold font-bold text-sm mb-3">
                    ₹{item.price}
                  </Text>
                  
                  {/* Quantity Controls */}
                  <View className="flex-row items-center border border-gray-200 rounded-full px-2 py-0.5 bg-brand-cream/30 self-start">
                    <TouchableOpacity 
                      onPress={() => handleUpdateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 items-center justify-center rounded-full"
                    >
                      <Icon name="remove" size={14} color="#7F7663" />
                    </TouchableOpacity>
                    
                    <Text className="mx-3 text-xs font-bold text-brand-charcoal">
                      {item.quantity}
                    </Text>
                    
                    <TouchableOpacity 
                      onPress={() => handleUpdateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 items-center justify-center rounded-full"
                    >
                      <Icon name="add" size={14} color="#7F7663" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* Pricing Summary */}
            <View className="bg-white p-5 rounded-lg border border-gray-200 mb-8 shadow-sm">
              <Text className="text-xs font-bold text-brand-charcoal uppercase tracking-wider mb-4">
                Order Summary
              </Text>
              
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-xs">Subtotal</Text>
                <Text className="text-brand-charcoal font-semibold text-xs">₹{subtotal}</Text>
              </View>
              
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-xs">Estimated Shipping</Text>
                <Text className="text-green-600 font-bold text-xs">FREE</Text>
              </View>
              
              <View className="border-t border-gray-150 my-3" />
              
              <View className="flex-row justify-between items-baseline">
                <Text className="text-brand-charcoal font-bold text-sm">Total Amount</Text>
                <Text className="text-brand-gold font-bold text-base">₹{subtotal}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Secure Checkout Action Footer */}
          <View className="bg-white p-4 border-t border-gray-150">
            <TouchableOpacity className="w-full bg-brand-charcoal py-4 rounded-lg items-center justify-center flex-row gap-2 shadow-md">
              <Icon name="lock-closed" size={16} color="#D4AF37" />
              <Text className="text-white font-bold uppercase tracking-widest text-xs">
                Secure Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
