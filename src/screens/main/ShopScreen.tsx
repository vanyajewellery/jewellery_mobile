import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getProducts, getCategories, searchProducts } from '../../services/apiService';
import { IMAGE_BASE_URL } from '../../constants/Config';
import { Product, Category } from '../../types/product';

const { width } = Dimensions.get('window');

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Popularity', value: 'popular' },
];

export default function ShopScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Pagination & Loading
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Sync category parameter from navigation (e.g. from HomeScreen)
  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
      setPage(1);
      setProducts([]);
    }
  }, [route.params?.category]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getCategories();
        if (Array.isArray(res)) {
          const parentCats = res.filter((c: any) => !c.parent);
          setCategories(parentCats);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Main fetch function
  const fetchProductList = useCallback(async (
    catSlug: string,
    pageNum: number,
    sortVal: string,
    searchVal: string,
    isRefresh = false
  ) => {
    try {
      setLoading(true);
      let resProducts: any[] = [];
      
      if (searchVal.trim() !== '') {
        const res = await searchProducts(searchVal) as any;
        resProducts = res || [];
        setHasMore(false); // Search results are usually single-page flat arrays
      } else {
        const params: any = {
          page: pageNum,
          limit: 10,
          sort: sortVal,
        };
        if (catSlug !== 'all') {
          params.category = catSlug;
        }
        
        const res = await getProducts(params) as any;
        
        if (res && res.docs) {
          resProducts = res.docs;
          setHasMore(res.hasNextPage);
        } else if (Array.isArray(res)) {
          resProducts = res;
          setHasMore(false);
        } else {
          resProducts = [];
          setHasMore(false);
        }
      }

      setProducts(prev => isRefresh ? resProducts : [...prev, ...resProducts]);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch products on filter changes
  useEffect(() => {
    setProducts([]);
    fetchProductList(selectedCategory, 1, activeSort, searchQuery, true);
    setPage(1);
  }, [selectedCategory, activeSort, searchQuery, fetchProductList]);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchProductList(selectedCategory, 1, activeSort, searchQuery, true);
  };

  // Load more
  const handleLoadMore = () => {
    if (!loading && hasMore && searchQuery.trim() === '') {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProductList(selectedCategory, nextPage, activeSort, searchQuery, false);
    }
  };

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

  return (
    <View className="flex-1 bg-brand-cream">
      {/* Search Bar */}
      <View className="p-4 bg-white border-b border-gray-150 flex-row items-center gap-3">
        <View className="flex-1 bg-brand-cream rounded-[4px] border border-gray-200 px-4 py-2 flex-row items-center">
          <Icon name="search-outline" size={20} color="#7F7663" className="mr-2" />
          <TextInput 
            placeholder="Search collections, material, purity..." 
            placeholderTextColor="#7F7663"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-brand-charcoal text-sm py-1.5 outline-none"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={18} color="#7F7663" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowSortOptions(!showSortOptions)}
          className="p-2 border border-gray-200 rounded-[4px] bg-white items-center justify-center"
        >
          <Icon name="swap-vertical-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Sort Options Overlay */}
      {showSortOptions && (
        <View className="bg-white border-b border-gray-200 p-4 absolute top-16 left-0 right-0 z-50 shadow-md">
          <Text className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
            Sort By
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setActiveSort(opt.value);
                  setShowSortOptions(false);
                }}
                className={`px-4 py-2 rounded-[4px] border ${
                  activeSort === opt.value
                    ? 'bg-brand-charcoal border-brand-charcoal'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    activeSort === opt.value ? 'text-white' : 'text-brand-charcoal'
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Filter Chips */}
      <View className="py-3 px-4 border-b border-gray-100 bg-white">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          <TouchableOpacity 
            onPress={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-[4px] mr-2 border ${
              selectedCategory === 'all' 
                ? 'bg-brand-charcoal border-brand-charcoal' 
                : 'bg-white border-gray-200'
            }`}
          >
            <Text className={`text-xs font-bold uppercase tracking-wider ${
              selectedCategory === 'all' ? 'text-white' : 'text-brand-charcoal'
            }`}>
              All Items
            </Text>
          </TouchableOpacity>
          
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id || cat._id}
              onPress={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-[4px] mr-2 border ${
                selectedCategory === cat.slug 
                  ? 'bg-brand-charcoal border-brand-charcoal' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-xs font-bold uppercase tracking-wider ${
                selectedCategory === cat.slug ? 'text-white' : 'text-brand-charcoal'
              }`}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      {products.length === 0 && !loading ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg font-serif text-brand-charcoal mb-1">
            No Designs Found
          </Text>
          <Text className="text-xs text-gray-500 text-center">
            Try adjusting your search queries or selecting another collection.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item, index) => `${item.id || item._id}-${index}`}
          contentContainerStyle={{ padding: 16 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => 
            loading && !refreshing ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#D4AF37" />
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const activePrice = getActivePrice(item.price);
            const originalPrice = getOriginalPrice(item.price);
            const itemImage = item.images && item.images.length > 0
              ? (typeof item.images[0] === 'string' ? item.images[0] : (item.images[0] as any).url)
              : '';

            return (
              <TouchableOpacity 
                onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })}
                style={{ width: (width - 48) / 2 }}
                className="bg-white p-3 rounded-lg border border-gray-200 mb-4 shadow-sm"
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
          }}
        />
      )}
    </View>
  );
}
