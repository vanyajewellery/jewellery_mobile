import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';

const CART_ITEMS = [
  { id: '1', name: 'Celestial Pearl Drop', category: 'Earrings', price: 899, quantity: 1, image: 'https://picsum.photos/seed/earring1/300/400' },
  { id: '2', name: 'Midnight Bloom Ring', category: 'Rings', price: 1299, quantity: 2, image: 'https://picsum.photos/seed/ring1/300/400' },
];

export default function CartScreen() {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View className="flex-1 bg-brand-cream">
      {/* Header */}
      <View className="py-5 px-6 bg-white border-b border-brand-gold/10">
        <Text className="text-xl font-bold text-brand-charcoal uppercase tracking-wider">Shopping Cart</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {CART_ITEMS.map((item) => (
          <View key={item.id} className="flex-row bg-white p-4 rounded-2xl border border-brand-gold/15 mb-4 items-center">
            <Image 
              source={{ uri: item.image }} 
              className="w-20 h-20 rounded-xl mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-[10px] text-brand-gold uppercase tracking-widest font-semibold mb-1">{item.category}</Text>
              <Text className="text-base font-bold text-brand-charcoal mb-1" numberOfLines={1}>{item.name}</Text>
              <Text className="text-brand-charcoal font-bold text-base mb-2">₹{item.price}</Text>
              
              {/* Quantity Controls */}
              <View className="flex-row items-center">
                <TouchableOpacity className="w-8 h-8 items-center justify-center border border-brand-gold/30 rounded-lg">
                  <Text className="text-brand-charcoal font-bold">-</Text>
                </TouchableOpacity>
                <Text className="mx-3 text-brand-charcoal font-semibold">{item.quantity}</Text>
                <TouchableOpacity className="w-8 h-8 items-center justify-center border border-brand-gold/30 rounded-lg">
                  <Text className="text-brand-charcoal font-bold">+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity className="p-2">
              <Text className="text-red-500 font-semibold text-xs uppercase">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Pricing Summary */}
        <View className="bg-white p-6 rounded-2xl border border-brand-gold/15 mb-10">
          <Text className="text-sm font-bold text-brand-charcoal uppercase tracking-wider mb-4">Price Details</Text>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-sm">Subtotal ({CART_ITEMS.length} items)</Text>
            <Text className="text-brand-charcoal font-semibold text-sm">₹{subtotal}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="text-gray-500 text-sm">Shipping Charge</Text>
            <Text className="text-green-600 font-semibold text-sm">FREE</Text>
          </View>
          <View className="border-t border-brand-gold/10 my-3" />
          <View className="flex-row justify-between">
            <Text className="text-brand-charcoal font-bold text-base">Total Amount</Text>
            <Text className="text-brand-charcoal font-bold text-lg">₹{subtotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Checkout Button */}
      <View className="bg-white p-4 border-t border-brand-gold/15">
        <TouchableOpacity className="w-full bg-brand-charcoal p-4 rounded-xl items-center shadow-md">
          <Text className="text-brand-gold font-bold uppercase tracking-widest text-sm">Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
