import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MOCK_BANNER = 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1000&q=80';

const CATEGORIES = [
  { id: '1', name: 'Necklaces', image: 'https://picsum.photos/seed/necklace/200/200' },
  { id: '2', name: 'Earrings', image: 'https://picsum.photos/seed/earring/200/200' },
  { id: '3', name: 'Rings', image: 'https://picsum.photos/seed/ring/200/200' },
  { id: '4', name: 'Bracelets', image: 'https://picsum.photos/seed/bracelet/200/200' },
];

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-brand-cream">
      {/* Promotion Ticker */}
      <View className="bg-brand-charcoal py-2 items-center">
        <Text className="text-brand-gold text-xs font-semibold tracking-widest uppercase">
          ✦ Free Shipping Worldwide on orders over ₹999 ✦
        </Text>
      </View>

      {/* Brand Header */}
      <View className="py-6 px-6 bg-white border-b border-brand-gold/10 items-center justify-between flex-row">
        <Text className="text-2xl font-bold text-brand-charcoal tracking-widest">VANYA</Text>
        <TouchableOpacity className="p-2 border border-brand-gold/30 rounded-full">
          <Text className="text-brand-gold text-xs font-bold uppercase tracking-wider">Search</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Banner Banner */}
      <View className="relative">
        <Image 
          source={{ uri: MOCK_BANNER }} 
          style={{ width: width, height: 260 }}
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-brand-charcoal/40 justify-center px-8">
          <Text className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-1">
            Bridal Collection
          </Text>
          <Text className="text-white text-3xl font-bold leading-tight mb-4">
            Adorned for{"\n"}your forever
          </Text>
          <TouchableOpacity className="bg-brand-gold py-3 px-6 rounded-md self-start">
            <Text className="text-white text-xs font-bold uppercase tracking-widest">
              Explore Collection
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Slider */}
      <View className="py-8 px-6">
        <Text className="text-lg font-bold text-brand-charcoal tracking-wide mb-4 uppercase">
          Shop by Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} className="items-center mr-6">
              <View className="w-16 h-16 rounded-full overflow-hidden border border-brand-gold/30 bg-white mb-2">
                <Image source={{ uri: cat.image }} className="w-full h-full" />
              </View>
              <Text className="text-xs font-semibold text-brand-charcoal">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products */}
      <View className="px-6 pb-12">
        <Text className="text-lg font-bold text-brand-charcoal tracking-wide mb-4 uppercase">
          New Arrivals
        </Text>
        
        {/* Basic Grid */}
        <View className="flex-row flex-wrap justify-between">
          {[1, 2].map((id) => (
            <View key={id} style={{ width: (width - 60) / 2 }} className="bg-white p-3 rounded-2xl border border-brand-gold/15 mb-4 shadow-sm">
              <Image 
                source={{ uri: `https://picsum.photos/seed/product${id}/300/400` }} 
                className="w-full h-40 rounded-xl mb-3"
                resizeMode="cover"
              />
              <Text className="text-xs text-brand-gold uppercase tracking-widest font-semibold mb-1">Necklaces</Text>
              <Text className="text-sm font-bold text-brand-charcoal mb-2" numberOfLines={1}>Royal Kundan Set</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-brand-charcoal font-bold text-base">₹2,499</Text>
                <Text className="text-gray-400 text-xs line-through">₹4,999</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
