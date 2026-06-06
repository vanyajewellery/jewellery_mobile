import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { selectWishlistItems, toggleWishlist } from '../../redux/slices/wishlistSlice';
import { addItem } from '../../redux/slices/cartSlice';
import { IMAGE_BASE_URL } from '../../constants/Config';

const { width } = Dimensions.get('window');

export default function WishlistScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const wishlistItems = useSelector(selectWishlistItems);

  const getImageUrl = (path: string) => {
    if (!path) return 'https://picsum.photos/seed/placeholder/300/400';
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  const handleToggleWishlist = (item: any) => {
    dispatch(toggleWishlist(item));
  };

  const handleAddToBag = (item: any) => {
    dispatch(addItem({
      id: `${item.id}-default`,
      productId: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice || item.price,
      quantity: 1,
    }));
    // Remove from wishlist after adding to bag
    dispatch(toggleWishlist(item));
    // Navigate to Cart
    navigation.navigate('Main', { screen: 'Cart' });
  };

  return (
    <View className="flex-1 bg-brand-cream">
      {/* Header */}
      <View className="py-5 px-6 bg-white border-b border-gray-150 flex-row justify-between items-center">
        <Text className="text-lg font-bold text-brand-charcoal uppercase tracking-wider">
          My Wishlist
        </Text>
        <Text className="text-xs font-semibold text-gray-400">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'Design' : 'Designs'}
        </Text>
      </View>

      {wishlistItems.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Icon name="heart-outline" size={64} color="#7F7663" className="mb-4" />
          <Text className="text-lg font-serif text-brand-charcoal mb-2">
            Your Wishlist is Empty
          </Text>
          <Text className="text-xs text-gray-500 text-center mb-6 max-w-xs leading-relaxed">
            Save your favorite handcrafted designs here while exploring our collections.
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Shop')}
            className="bg-brand-gold py-3.5 px-8 rounded-[4px] shadow-md"
          >
            <Text className="text-white font-bold uppercase tracking-widest text-xs">
              Start Exploring
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View className="flex-row bg-white p-3 rounded-lg border border-gray-200 mb-4 items-center shadow-sm">
              <TouchableOpacity 
                onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                className="flex-row items-center flex-1"
              >
                <Image 
                  source={{ uri: getImageUrl(item.image) }} 
                  className="w-20 h-20 rounded-md mr-4 border border-gray-100"
                  resizeMode="cover"
                />
                
                <View className="flex-1 py-1">
                  <Text className="text-[10px] text-brand-gold uppercase tracking-widest font-bold mb-1">
                    {item.category}
                  </Text>
                  <Text className="text-sm font-serif text-brand-charcoal mb-1" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-brand-charcoal font-bold text-sm">
                    ₹{item.price}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <View className="items-end gap-3 pl-2">
                <TouchableOpacity 
                  onPress={() => handleToggleWishlist(item)}
                  className="p-1"
                >
                  <Icon name="trash-outline" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleAddToBag(item)}
                  className="px-4 py-2 bg-brand-charcoal rounded-[4px]"
                >
                  <Text className="text-brand-gold font-bold text-[10px] uppercase tracking-wider">
                    Add
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
