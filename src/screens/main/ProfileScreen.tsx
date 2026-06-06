import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { selectIsAuthenticated, selectUser, logout } from '../../redux/slices/authSlice';
import { removeToken } from '../../utils/storage';

const CURATED_LIST = [
  { title: 'New Arrivals', image: 'https://lh3.googleusercontent.com/aida/AP1WRLvrGZMguhD8WqD1-k9Korl-4rE3LG03EU2B530ptKL-UOsEArjx-ZzMNPpR4CFxcPtLv7-2zhwerrSS4soo9n7wvFqvb4WT1Tb1te-2EZvrXTxh_yJrNh8oGdESTDlEYzp242Bpiwo4ICd87IlA5iAJQADrQd9dvOtl0AjYQKtsCi19id5SNsAHKvXG2mDN6V8KQGCzl7tdsZcslFzDd5TPvLFh3aHBPkYSv0EX1hnCfFMeAWG-tKJgQLse' },
  { title: 'Fine Rings', image: 'https://lh3.googleusercontent.com/aida/AP1WRLuqjF8Hb3T-KTTKMsdCYrCAIxK5UmJXhlcXsRvcDBmpCScsZCxHCCWc4Ik8sAUC75QEwZh24DSM3XgKfPkOxmkI0r-ltrgOf2Rw42-ubjeen2f7Jk-aXY5juqJiPGC4JtXJR6GD1hOwHQaFCIwZzSsavayd-LSIFwPHKb8i6uHHHZ4rtVo8Uo2YHpMZUZNxpyUbukpFvHBiN-lxwXYaTnmO25a0p27VWoDIhanJKrJPQY26V_G3k0N8PT4' },
  { title: 'The Pearl Edit', image: 'https://lh3.googleusercontent.com/aida/AP1WRLsN1AQv_COsMcO4pUoq5r2W3PoCI4qRk5ybuMEcCQIKTidPv8kxfQtufUbj-a-cMHanAOTKw6w1sgp7t1B9mMgAyJmxovProAncpiEP_d3AZVX3JgoXL681sR4BlTWzVMCP0XuHB7e7r-apbENxTqYIBgjc1q8CXb-RtvyxjOJ_iJ1aJi0TUBICewzFFMQ1mHZ01_u3Zq6ViXXHvb7CIjhdyIolKCm3ajClKoRbet4p5kQC1Ph4I9WFXME' },
  { title: 'Gift Curation', image: 'https://lh3.googleusercontent.com/aida/AP1WRLtgwcfEvuWJtdjjgH0UmoEzo7mzZ7l92LE4Y7wJMxAFJAQFEyxz7EuVLq4fnYANIGwwC_IrCmm66JGeTxBL04eFp4gSMTeagHONXruG-zPHtakM0ZBC7qcT2A26d0TVWTvJlrIdGpxSjkfV_Z1-4xAgrx39l8R5tjj5ilrUDxmUP4IA4mf4kz0JnoRxtVvw9ECPFJo1yaF3BrBdz8nCbUXolrjnGkzqJ_S26MF_IniubQhvSPc3B17_17br' }
];

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const handleLogout = async () => {
    dispatch(logout());
    await removeToken();
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-brand-cream justify-center px-6">
        {/* Decorative Atmospheric elements */}
        <View className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
        
        <View className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm items-center w-full max-w-[400px] self-center">
          {/* Brand Identity */}
          <View className="items-center mb-6">
            <Image 
              source={require('../../assets/images/png/logowithname.png')}
              style={{ width: 180, height: 50 }}
              resizeMode="contain"
            />
            <View className="w-6 h-[1px] bg-brand-gold mt-2" />
          </View>
          
          <Text 
            className="text-xl font-serif text-brand-charcoal text-center mb-2"
            style={{ fontFamily: Platform.OS === 'android' ? 'serif' : 'Playfair Display' }}
          >
            My Account
          </Text>
          <Text className="text-xs text-gray-500 text-center mb-8 px-4 leading-relaxed italic">
            Sign in to track orders, save shipping addresses, and manage your curated collections.
          </Text>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Auth')}
            className="w-full bg-brand-charcoal py-4 rounded-full items-center justify-center shadow-md"
          >
            <Text className="text-brand-gold font-bold text-xs uppercase tracking-widest">
              Sign In / Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const avatarUri = user?.avatar || 'https://picsum.photos/seed/useravatar/200/200';
  const fullName = user?.fullName || `${user?.firstName || 'Valued'} ${user?.lastName || 'Customer'}`;

  return (
    <ScrollView className="flex-1 bg-brand-cream" showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View className="bg-white px-6 py-8 items-center border-b border-gray-150 shadow-sm">
        <View className="relative mb-4">
          <View className="w-24 h-24 rounded-full overflow-hidden border border-brand-gold/30 bg-brand-cream/50 p-1">
            <Image source={{ uri: avatarUri }} className="w-full h-full rounded-full" />
          </View>
          <TouchableOpacity className="absolute bottom-0 right-0 bg-brand-gold p-1.5 rounded-full border-2 border-white shadow-sm">
            <Icon name="pencil" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text 
          className="text-lg font-serif text-brand-charcoal mb-1"
          style={{ fontFamily: Platform.OS === 'android' ? 'serif' : 'Playfair Display' }}
        >
          {fullName}
        </Text>
        
        <View className="flex-row items-center gap-1.5 bg-brand-gold/10 px-3 py-1 rounded-full">
          <Icon name="ribbon" size={12} color="#D4AF37" />
          <Text className="text-brand-gold text-[9px] font-bold uppercase tracking-widest">
            Inner Circle Member
          </Text>
        </View>
      </View>

      {/* Account Menu Options */}
      <View className="px-4 py-6">
        {[
          { label: 'My Orders', desc: 'Track, return or buy things again', icon: 'bag-handle-outline' },
          { label: 'Wishlist', desc: 'Manage saved designs', icon: 'heart-outline', action: () => navigation.navigate('Wishlist') },
          { label: 'Saved Addresses', desc: 'Manage delivery addresses', icon: 'location-outline' },
          { label: 'Payment Methods', desc: 'Manage saved cards and UPI IDs', icon: 'card-outline' },
          { label: 'Account Settings', desc: 'Update name, contact info, and security', icon: 'settings-outline' },
        ].map((item, idx) => (
          <TouchableOpacity 
            key={idx} 
            onPress={item.action}
            className="bg-white p-4 rounded-lg border border-gray-200 mb-2 flex-row justify-between items-center shadow-sm"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-9 h-9 items-center justify-center rounded-full bg-brand-cream border border-gray-100 mr-4">
                <Icon name={item.icon} size={18} color="#7F7663" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-serif text-brand-charcoal mb-0.5">{item.label}</Text>
                <Text className="text-[10px] text-gray-400">{item.desc}</Text>
              </View>
            </View>
            <Icon name="chevron-forward" size={16} color="#C5A880" />
          </TouchableOpacity>
        ))}

        {/* Sign Out Action */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="w-full bg-white p-4 rounded-lg border border-red-200 mt-6 items-center flex-row justify-center gap-2 shadow-sm"
        >
          <Icon name="log-out-outline" size={18} color="#EF4444" />
          <Text className="text-red-500 font-bold text-xs uppercase tracking-widest">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Curated Recommendations */}
      <View className="py-6 border-t border-gray-200/50 bg-white">
        <Text className="text-xs font-bold text-brand-gold tracking-[0.25em] uppercase text-center mb-4">
          Curated For You
        </Text>
        
        <View className="flex-row flex-wrap justify-between px-6">
          {CURATED_LIST.map((item, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => navigation.navigate('Shop')}
              className="w-[48%] mb-4 rounded-lg overflow-hidden relative shadow-sm"
            >
              <Image 
                source={{ uri: item.image }} 
                className="w-full h-32"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/30 justify-end p-3">
                <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Bottom navbar spacing spacer */}
      <View className="h-16" />
    </ScrollView>
  );
}
