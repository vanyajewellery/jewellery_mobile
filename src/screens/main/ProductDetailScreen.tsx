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
  Share,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { getProductBySlug, getProductById, getProducts } from '../../services/apiService';
import { IMAGE_BASE_URL } from '../../constants/Config';
import { addItem } from '../../redux/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../../redux/slices/wishlistSlice';
import { Product } from '../../types/product';

const { width } = Dimensions.get('window');

type TabType = 'materials' | 'care' | 'shipping';

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const { slug, id } = route.params || {};

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('materials');
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  // Variant states
  const [selectedMetal, setSelectedMetal] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('Adjustable');

  const isWishlisted = useSelector(selectIsWishlisted(product?.id || product?._id || ''));

  useEffect(() => {
    async function loadProductData() {
      try {
        setLoading(true);
        let prodData: any = null;
        if (slug) {
          prodData = await getProductBySlug(slug);
        } else if (id) {
          prodData = await getProductById(id);
        }

        if (prodData) {
          // Normalize API fields to react native state
          const normalizedProduct: Product = {
            id: prodData._id || prodData.id,
            name: prodData.name,
            slug: prodData.slug,
            category: prodData.category?.name || prodData.category || 'Jewellery',
            material: prodData.material || '',
            price: prodData.price,
            originalPrice: prodData.price?.base || prodData.price || 0,
            discount: prodData.discount || 0,
            rating: prodData.rating || { average: 4.5, count: 10 },
            reviewCount: prodData.rating?.count || 10,
            images: prodData.images || [],
            tags: prodData.tags || [],
            occasion: prodData.occasion || '',
            inStock: prodData.inStock !== false,
            isNew: prodData.isNewArrival || false,
            isBestseller: prodData.isBestSeller || false,
            description: prodData.description || '',
            variants: prodData.variants || {},
          };

          setProduct(normalizedProduct);
          
          // Set first image
          const defaultImage = normalizedProduct.images && normalizedProduct.images.length > 0
            ? (typeof normalizedProduct.images[0] === 'string' ? normalizedProduct.images[0] : (normalizedProduct.images[0] as any).url)
            : '';
          setSelectedImage(defaultImage);

          // Select default variants if available
          if (prodData.variants && Array.isArray(prodData.variants) && prodData.variants.length > 0) {
            setSelectedMetal(prodData.variants[0].material || '');
            setSelectedColor(prodData.variants[0].color || '');
            setSelectedSize(prodData.variants[0].size || 'Adjustable');
          }

          // Fetch related/featured products
          const relatedRes = await getProducts({ limit: 4, category: prodData.category?._id || prodData.category }) as any;
          if (relatedRes && relatedRes.docs) {
            setRelatedProducts(relatedRes.docs.filter((p: any) => (p._id || p.id) !== normalizedProduct.id));
          }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [slug, id]);

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

  const handleAddToBag = () => {
    if (!product) return;
    
    const activePrice = getActivePrice(product.price);
    const originalPrice = getOriginalPrice(product.price) || activePrice;
    
    dispatch(addItem({
      id: `${product.id}-${selectedMetal}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      image: selectedImage,
      price: activePrice,
      originalPrice: originalPrice,
      quantity: 1,
      variant: {
        metal: selectedMetal,
        color: selectedColor,
        size: selectedSize,
      }
    }));
    
    // Navigate to Cart
    navigation.navigate('Cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const activePrice = getActivePrice(product.price);
    const originalPrice = getOriginalPrice(product.price) || activePrice;

    dispatch(toggleWishlist({
      id: product.id,
      name: product.name,
      image: selectedImage,
      price: activePrice,
      originalPrice: originalPrice,
      category: product.category,
    }));
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out this gorgeous ${product.name} on Adora Jewels!`,
        url: `https://adorajewels.com/product/${product.slug}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-brand-cream justify-center items-center">
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 bg-brand-cream justify-center items-center px-6">
        <Text className="text-lg font-serif text-brand-charcoal mb-4">Design Not Found</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="bg-brand-charcoal py-3 px-8 rounded-[4px]"
        >
          <Text className="text-white font-bold uppercase tracking-widest text-xs">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const activePrice = getActivePrice(product.price);
  const originalPrice = getOriginalPrice(product.price);

  return (
    <ScrollView className="flex-1 bg-brand-cream" showsVerticalScrollIndicator={false}>
      {/* Top Breadcrumbs & Back Button */}
      <View className="pt-4 px-6 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-100"
        >
          <Icon name="arrow-back-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        
        <View className="flex-row items-center gap-1.5 max-w-[200px]">
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Shop</Text>
          <Icon name="chevron-forward-outline" size={10} color="#9CA3AF" />
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider" numberOfLines={1}>
            {product.category}
          </Text>
        </View>
        
        <View className="w-10" />
      </View>

      {/* Image Gallery */}
      <View className="mt-4 px-6">
        <View className="w-full aspect-[4/5] bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
          <Image 
            source={{ uri: getImageUrl(selectedImage) }} 
            className="w-full h-full"
            resizeMode="cover"
          />
          {product.isBestseller && (
            <View className="absolute top-4 left-4 bg-brand-charcoal px-3 py-1 rounded-[2px] shadow-md">
              <Text className="text-brand-gold text-[9px] font-bold uppercase tracking-wider">
                Bestseller
              </Text>
            </View>
          )}
        </View>
        
        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-4">
            {product.images.map((img: any, idx: number) => {
              const imgUrl = typeof img === 'string' ? img : img.url;
              return (
                <TouchableOpacity 
                  key={idx}
                  onPress={() => setSelectedImage(imgUrl)}
                  className={`w-16 h-16 rounded-md mr-3 overflow-hidden bg-white border ${
                    selectedImage === imgUrl ? 'border-brand-gold' : 'border-gray-200'
                  }`}
                >
                  <Image source={{ uri: getImageUrl(imgUrl) }} className="w-full h-full" resizeMode="cover" />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Product Information */}
      <View className="mt-6 px-6">
        <View className="bg-emerald-50 border border-emerald-200/50 px-3 py-1 rounded-full w-fit mb-3">
          <Text className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
            Limited Edition
          </Text>
        </View>
        
        <Text 
          className="text-2xl font-serif text-brand-charcoal mb-2"
          style={{ fontFamily: Platform.OS === 'android' ? 'serif' : 'Playfair Display' }}
        >
          {product.name}
        </Text>
        
        <View className="flex-row items-baseline gap-2 mb-4">
          <Text className="text-xl font-bold text-brand-gold">
            ₹{activePrice}
          </Text>
          {originalPrice && (
            <Text className="text-sm text-gray-400 line-through">
              ₹{originalPrice}
            </Text>
          )}
        </View>

        <Text className="text-gray-600 text-sm leading-relaxed mb-6">
          {product.description || `A masterpiece of traditional craftsmanship, meticulously hand-set using the ancient techniques. Accented with tumbles and delicate seed pearls, it bridges the gap between historical grandeur and modern sophistication.`}
        </Text>

        {/* Dynamic Detail Tabs */}
        <View className="border-b border-gray-200 flex-row gap-6 mb-4">
          {(['materials', 'care', 'shipping'] as TabType[]).map((tab) => (
            <TouchableOpacity 
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`pb-2 border-b-2 ${
                activeTab === tab ? 'border-brand-charcoal' : 'border-transparent'
              }`}
            >
              <Text className={`text-[11px] font-bold uppercase tracking-wider ${
                activeTab === tab ? 'text-brand-charcoal' : 'text-gray-400'
              }`}>
                {tab === 'materials' ? 'Materials' : tab === 'care' ? 'Care Guide' : 'Shipping'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="min-h-[80px]">
          {activeTab === 'materials' && (
            <View className="space-y-1">
              <Text className="text-xs text-gray-600">• 22kt Gold Plated Brass base</Text>
              <Text className="text-xs text-gray-600">• Hand-cut Polki glass stones</Text>
              <Text className="text-xs text-gray-600">• Sustainably sourced seed pearls</Text>
            </View>
          )}
          
          {activeTab === 'care' && (
            <Text className="text-xs text-gray-600 leading-relaxed">
              Keep your jewelry away from moisture and perfumes. Store in the provided airtight pouch when not in use. Use a soft, dry cloth for cleaning.
            </Text>
          )}
          
          {activeTab === 'shipping' && (
            <Text className="text-xs text-gray-600 leading-relaxed">
              Free express shipping worldwide on orders above ₹999. Estimated delivery: 3-5 business days. Easy 14-day hassle-free returns.
            </Text>
          )}
        </View>
      </View>

      {/* Action CTA Block */}
      <View className="mt-8 px-6 space-y-4">
        <TouchableOpacity 
          onPress={handleAddToBag}
          className="w-full bg-brand-charcoal py-4 rounded-lg items-center justify-center flex-row gap-2 shadow-md"
        >
          <Icon name="bag-handle" size={18} color="#D4AF37" />
          <Text className="text-white text-xs font-bold uppercase tracking-widest">
            Add to Bag
          </Text>
        </TouchableOpacity>

        <View className="flex-row gap-4">
          <TouchableOpacity 
            onPress={handleToggleWishlist}
            className="flex-1 border border-gray-300 py-3.5 rounded-lg items-center justify-center flex-row gap-2 bg-white"
          >
            <Icon 
              name={isWishlisted ? 'heart' : 'heart-outline'} 
              size={18} 
              color={isWishlisted ? '#ba1a1a' : '#1A1A1A'} 
            />
            <Text className="text-brand-charcoal text-xs font-bold uppercase tracking-widest">
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleShare}
            className="flex-1 border border-gray-300 py-3.5 rounded-lg items-center justify-center flex-row gap-2 bg-white"
          >
            <Icon name="share-outline" size={18} color="#1A1A1A" />
            <Text className="text-brand-charcoal text-xs font-bold uppercase tracking-widest">
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Style It With Section */}
      {relatedProducts.length > 0 && (
        <View className="mt-12 py-8 bg-white border-t border-gray-100">
          <View className="px-6 mb-6">
            <Text className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.25em] mb-1">
              Curated Look
            </Text>
            <Text className="text-lg font-serif text-brand-charcoal">
              Style It With
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 24 }}
            className="flex-row"
          >
            {relatedProducts.map((item) => {
              const priceVal = getActivePrice(item.price);
              const itemImage = item.images && item.images.length > 0
                ? (typeof item.images[0] === 'string' ? item.images[0] : (item.images[0] as any).url)
                : '';

              return (
                <TouchableOpacity
                  key={item.id || item._id}
                  onPress={() => navigation.push('ProductDetail', { slug: item.slug })}
                  className="w-40 mr-4"
                >
                  <View className="w-full aspect-[3/4] bg-brand-cream rounded-md overflow-hidden border border-gray-100 mb-2 relative">
                    <Image source={{ uri: getImageUrl(itemImage) }} className="w-full h-full" resizeMode="cover" />
                  </View>
                  <Text className="text-xs font-serif text-brand-charcoal" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-brand-gold font-bold text-[11px] mt-0.5">
                    ₹{priceVal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
      
      {/* Footer spacing */}
      <View className="h-12" />
    </ScrollView>
  );
}
