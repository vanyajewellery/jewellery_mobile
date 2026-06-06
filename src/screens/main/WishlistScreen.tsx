import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

const WISHLIST_ITEMS = [
  { id: '1', name: 'Celestial Pearl Drop', category: 'Earrings', price: '₹899', image: 'https://picsum.photos/seed/earring1/300/400' },
  { id: '2', name: 'Midnight Bloom Ring', category: 'Rings', price: '₹1,299', image: 'https://picsum.photos/seed/ring1/300/400' },
];

export default function WishlistScreen() {
  return (
    <View className="flex-1 bg-brand-cream">
      {/* Header */}
      <View className="py-5 px-6 bg-white border-b border-brand-gold/10">
        <Text className="text-xl font-bold text-brand-charcoal uppercase tracking-wider">My Wishlist</Text>
      </View>

      {WISHLIST_ITEMS.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-semibold text-brand-charcoal mb-2">Your Wishlist is empty</Text>
          <Text className="text-sm text-gray-500 text-center mb-6">Explore our curated collections and save your favorite designs here.</Text>
          <TouchableOpacity className="bg-brand-gold py-3 px-8 rounded-xl">
            <Text className="text-white font-bold uppercase tracking-widest text-xs">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={WISHLIST_ITEMS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="flex-row bg-white p-4 rounded-2xl border border-brand-gold/15 mb-4 items-center">
              <Image 
                source={{ uri: item.image }} 
                className="w-20 h-20 rounded-xl mr-4"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-[10px] text-brand-gold uppercase tracking-widest font-semibold mb-1">{item.category}</Text>
                <Text className="text-base font-bold text-brand-charcoal mb-1">{item.name}</Text>
                <Text className="text-brand-charcoal font-bold text-base">{item.price}</Text>
              </View>
              <TouchableOpacity className="p-3 bg-brand-gold/10 border border-brand-gold/20 rounded-xl">
                <Text className="text-brand-gold font-bold text-xs">Buy</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
