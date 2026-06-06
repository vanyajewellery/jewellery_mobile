import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getFeaturedProducts, getCategories } from '../../services/apiService';
import { IMAGE_BASE_URL } from '../../constants/Config';
import { selectCartCount } from '../../redux/slices/cartSlice';
import { Product, Category } from '../../types/product';

const { width } = Dimensions.get('window');

const HERO_IMAGE = 'https://lh3.googleusercontent.com/aida/AP1WRLt57LfEbviG-bhS6ItWzdsLUruSw-EhY26CRIvubWm0p74uAbG_7hGCPjX6-V8w8AnB72SWzQDZKA3TEu3fop_rMnSXiJXcmkvNnlWtBDEche9Avc8WIkam5nm-I9n4kKqFDZr4jfXNGbu0YWWuL3YRRIEjJSFO0gNUSCT83oCIfwk2S7w4zs6ddUMH8Is_0_cUqRTzJGit7PfxxK0AF55UVDH059Y8n-KzwiPMWVtCOy-F_iH9aScwKm8';
const STORY_IMAGE = 'https://lh3.googleusercontent.com/aida/AP1WRLv_D-qiHHCn8q-MRAKO1158WRiYHWnmSTGbGjgO_2KdNp4LqEO0g3jUAInrYR2tNx-DeQcs1p2Lw9K74FUqj2fS0CD08iCpsOFWSoQW4-2kyy73_WUHfXUNqDjObZSbAHnKreNVQgdykcZ3yH-zcxOGbj-9Zg_wG2BsVVxNNz1-1EZKANIuLHIc0LrwmL0DqbECf1E8Czne97rb1xxDlyIxUrY0cN0-vwP1ah0NyrCh6PjVbRKhnNzzxp3K';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const cartCount = useSelector(selectCartCount);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        const [catsRes, productsRes] = await Promise.all([
          getCategories(),
          getFeaturedProducts(),
        ]);
        
        // Filter out parent categories for shop category display
        if (Array.isArray(catsRes)) {
          const parentCats = catsRes.filter((c: any) => !c.parent);
          setCategories(parentCats);
        }
        
        if (Array.isArray(productsRes)) {
          setFeaturedProducts(productsRes);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return 'https://picsum.photos/seed/placeholder/300/400';
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  const getActivePrice = (price: any) => {
    if (typeof price === 'number') return price;
    if (price && typeof price === 'object') {
      return price.discounted || price.base;
    }
    return 0;
  };

  const getOriginalPrice = (price: any) => {
    if (price && typeof price === 'object' && price.discounted && price.discounted !== price.base) {
      return price.base;
    }
    return null;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-brand-cream justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-brand-cream" showsVerticalScrollIndicator={false}>

      {/* Brand Header */}
      <View className="py-4 px-6 bg-white border-b border-gray-150 items-center justify-between flex-row">
        <TouchableOpacity className="p-1">
          <Icon name="menu-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Image 
          source={require('../../assets/images/png/logowithname.png')}
          style={{ width: 140, height: 38 }}
          resizeMode="contain"
        />
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
            <Icon name="search-outline" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
            className="relative p-1"
          >
            <Icon name="bag-outline" size={24} color="#1A1A1A" />
            {cartCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-brand-gold w-4 h-4 rounded-full items-center justify-center">
                <Text className="text-white text-[9px] font-bold">{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Banner */}
      <View className="relative">
        <Image 
          source={{ uri: HERO_IMAGE }} 
          style={{ width: width, height: 380 }}
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/20 justify-end items-center pb-8 px-6 text-center">
          <Text className="text-brand-gold text-[11px] font-bold tracking-[0.25em] uppercase mb-2">
            The Wedding Collection
          </Text>
          <Text 
            className="text-white text-3xl font-serif text-center mb-2 tracking-wide"
            style={{ fontFamily: Platform.OS === 'android' ? 'serif' : 'Playfair Display' }}
          >
            Bridal Radiance
          </Text>
          <Text className="text-gray-200 text-xs text-center mb-5 max-w-xs leading-relaxed">
            Timeless elegance designed for your most precious moments. Experience the glow of handcrafted fine jewelry.
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Shop')}
            className="bg-brand-gold py-3.5 px-8 rounded-[4px] shadow-lg"
          >
            <Text className="text-white text-xs font-bold uppercase tracking-widest">
              Explore Collection
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Slider */}
      <View className="py-10 px-6">
        <View className="flex items-center justify-between flex-row mb-6">
          <Text className="text-base font-serif italic text-brand-charcoal">
            Shop by Category
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Shop')}>
            <Text className="text-[11px] text-brand-gold font-bold tracking-wider uppercase border-b border-brand-gold pb-0.5">
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id || cat._id} 
              onPress={() => navigation.navigate('Shop', { category: cat.slug })}
              className="items-center mr-6"
            >
              <View className="w-[100px] h-[125px] overflow-hidden rounded-lg border border-gray-200 bg-white mb-3 shadow-sm">
                <Image 
                  source={{ uri: getImageUrl(cat.image) }} 
                  className="w-full h-full" 
                  resizeMode="cover"
                />
              </View>
              <Text className="text-xs font-bold text-brand-charcoal tracking-widest uppercase">
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Products (Our Bestsellers) */}
      <View className="py-10 bg-white border-t border-b border-gray-100">
        <View className="items-center mb-8 px-6">
          <Text className="text-xl font-serif text-brand-charcoal mb-1 text-center">
            Our Bestsellers
          </Text>
          <Text className="text-xs text-gray-500 text-center italic">
            The pieces you love the most, crafted to last a lifetime.
          </Text>
        </View>
        
        <View className="flex-row flex-wrap justify-between px-6">
          {featuredProducts.slice(0, 4).map((item) => {
            const activePrice = getActivePrice(item.price);
            const originalPrice = getOriginalPrice(item.price);
            const itemImage = item.images && item.images.length > 0
              ? (typeof item.images[0] === 'string' ? item.images[0] : (item.images[0] as any).url)
              : '';

            return (
              <TouchableOpacity 
                key={item.id || item._id} 
                onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })}
                style={{ width: (width - 64) / 2 }} 
                className="bg-brand-cream p-3 rounded-lg border border-gray-200 mb-6 shadow-sm"
              >
                <View className="aspect-square w-full bg-white mb-3 rounded-md overflow-hidden relative border border-gray-100">
                  <Image 
                    source={{ uri: getImageUrl(itemImage) }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {item.isBestseller && (
                    <View className="absolute top-2 left-2 bg-brand-charcoal px-2 py-0.5 rounded-[2px]">
                      <Text className="text-brand-gold text-[8px] font-bold uppercase tracking-wider">
                        Bestseller
                      </Text>
                    </View>
                  )}
                </View>
                
                <Text 
                  className="text-sm font-serif text-brand-charcoal mb-1" 
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-brand-gold font-bold text-sm">
                    ₹{activePrice}
                  </Text>
                  {originalPrice && (
                    <Text className="text-gray-400 text-xs line-through">
                      ₹{originalPrice}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Brand Story */}
      <View className="py-14 px-6 max-w-md mx-auto">
        <View className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-6 border border-gray-200">
          <Image 
            source={{ uri: STORY_IMAGE }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-xs font-bold text-brand-gold tracking-[0.2em] uppercase mb-2">
          Our Story
        </Text>
        <Text className="text-xl font-serif text-brand-charcoal mb-4">
          Crafting Radiance for Every Moment
        </Text>
        <Text className="text-gray-600 text-sm italic leading-relaxed mb-4">
          At Adora, we believe that luxury shouldn't be a privilege of the few. Our journey began with a simple mission: to bridge the gap between high-end fine jewelry and accessible fashion.
        </Text>
        <Text className="text-gray-500 text-xs leading-relaxed mb-6">
          Every Adora piece is designed with an eye for timeless aesthetic and crafted using sustainable practices. We source the finest ethical stones and use recycled golds to ensure your radiance doesn't come at a cost to the earth.
        </Text>
        <TouchableOpacity className="border-b-2 border-brand-charcoal py-1 self-start">
          <Text className="text-brand-charcoal text-xs font-bold uppercase tracking-widest">
            Learn More
          </Text>
        </TouchableOpacity>
      </View>

      {/* Newsletter */}
      <View className="bg-brand-charcoal p-8 items-center text-center">
        <Text className="text-lg font-serif text-white mb-2">
          Join the Inner Circle
        </Text>
        <Text className="text-gray-400 text-xs text-center mb-6 leading-relaxed">
          Sign up for early access to new collections and exclusive invitations to Adora events.
        </Text>
        
        <View className="w-full flex-row gap-3">
          <View className="flex-1 bg-white/10 rounded-[4px] border border-white/20 px-4 py-3 justify-center">
            <Text className="text-gray-400 text-xs italic">Your Email Address</Text>
          </View>
          <TouchableOpacity className="bg-brand-gold px-6 rounded-[4px] justify-center shadow-md">
            <Text className="text-white text-xs font-bold uppercase tracking-wider">
              Subscribe
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Spacer to avoid navbar overlap */}
      <View className="h-16" />
    </ScrollView>
  );
}
