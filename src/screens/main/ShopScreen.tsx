import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

const PRODUCTS = [
  { id: '1', name: 'Celestial Pearl Drop', category: 'Earrings', price: '₹899', image: 'https://picsum.photos/seed/earring1/300/400' },
  { id: '2', name: 'Midnight Bloom Ring', category: 'Rings', price: '₹1,299', image: 'https://picsum.photos/seed/ring1/300/400' },
  { id: '3', name: 'Gold Mesh Bracelet', category: 'Bracelets', price: '₹749', image: 'https://picsum.photos/seed/bracelet1/300/400' },
  { id: '4', name: 'Antique Meenakari Bangle', category: 'Bangles', price: '₹1,899', image: 'https://picsum.photos/seed/bangle1/300/400' },
];

export default function ShopScreen() {
  return (
    <View className="flex-1 bg-brand-cream">
      {/* Search Bar */}
      <View className="p-4 bg-white border-b border-brand-gold/10">
        <TextInput 
          placeholder="Search collections, material, purity..." 
          placeholderTextColor="#C5A880"
          className="w-full px-4 py-3 bg-brand-cream/50 rounded-xl border border-brand-gold/30 text-brand-charcoal text-sm"
        />
      </View>

      {/* Filter Chips */}
      <View className="py-3 px-4 flex-row border-b border-brand-gold/15 bg-white">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {['All Items', 'Gold', 'Silver', 'Bridal', 'Bestsellers'].map((tag, idx) => (
            <TouchableOpacity 
              key={idx} 
              className={`px-4 py-2 rounded-full mr-2 border ${idx === 0 ? 'bg-brand-charcoal border-brand-charcoal' : 'bg-white border-brand-gold/30'}`}
            >
              <Text className={`text-xs font-semibold ${idx === 0 ? 'text-white' : 'text-brand-charcoal'}`}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <FlatList
        data={PRODUCTS}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity className="bg-white p-3 rounded-2xl border border-brand-gold/15 mb-4 shadow-sm w-[48%]">
            <Image 
              source={{ uri: item.image }} 
              className="w-full h-40 rounded-xl mb-3"
              resizeMode="cover"
            />
            <Text className="text-[10px] text-brand-gold uppercase tracking-widest font-semibold mb-1">{item.category}</Text>
            <Text className="text-sm font-bold text-brand-charcoal mb-2" numberOfLines={1}>{item.name}</Text>
            <Text className="text-brand-charcoal font-bold text-base">{item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
