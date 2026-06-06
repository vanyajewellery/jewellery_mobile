import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { selectIsAuthenticated, selectUser, logout } from '../../redux/slices/authSlice';

const LOGO_ICON = require('../../assets/images/png/log.png');

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-brand-cream justify-center px-6">
        <View className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gold/20 items-center">
          {/* Brand Logo Icon */}
          <View className="w-20 h-20 rounded-full overflow-hidden bg-white border border-brand-gold/30 items-center justify-center mb-6 p-2">
            <Image 
              source={LOGO_ICON} 
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          
          <Text className="text-2xl font-bold text-brand-charcoal text-center mb-2">Vanya Profile</Text>
          <Text className="text-sm text-gray-500 text-center mb-8 px-4 leading-relaxed">
            Sign in to track orders, save shipping addresses, and manage your account details.
          </Text>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Auth')}
            className="w-full bg-brand-gold p-4 rounded-xl items-center shadow-md mb-3"
          >
            <Text className="text-white font-semibold text-base uppercase tracking-wider">Sign In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Fallback avatar if user doesn't have one
  const avatarUri = user?.avatar || 'https://picsum.photos/seed/useravatar/200/200';
  const fullName = user?.fullName || `${user?.firstName || 'Valued'} ${user?.lastName || 'Customer'}`;

  return (
    <ScrollView className="flex-1 bg-brand-cream">
      {/* Profile Header */}
      <View className="bg-white px-6 py-8 items-center border-b border-brand-gold/15 shadow-sm">
        <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-gold bg-brand-cream/50 mb-4">
          <Image source={{ uri: avatarUri }} className="w-full h-full" />
        </View>
        <Text className="text-xl font-bold text-brand-charcoal mb-1">{fullName}</Text>
        <Text className="text-xs text-gray-500 mb-1">{user?.email}</Text>
        <Text className="text-xs text-gray-500">{user?.phone}</Text>
      </View>

      {/* Menu Options */}
      <View className="px-4 py-6">
        {[
          { label: 'My Orders', desc: 'Track, return or buy things again' },
          { label: 'Saved Addresses', desc: 'Manage delivery addresses' },
          { label: 'Payment Methods', desc: 'Manage saved cards and UPI IDs' },
          { label: 'Edit Profile', desc: 'Update name, contact info, and birth date' },
          { label: 'Notification Settings', desc: 'Manage marketing updates' },
        ].map((item, idx) => (
          <TouchableOpacity key={idx} className="bg-white p-4 rounded-xl border border-brand-gold/10 mb-3 flex-row justify-between items-center shadow-sm">
            <View>
              <Text className="text-base font-semibold text-brand-charcoal mb-0.5">{item.label}</Text>
              <Text className="text-xs text-gray-400">{item.desc}</Text>
            </View>
            <Text className="text-brand-gold font-bold text-lg">›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="w-full bg-white p-4 rounded-xl border border-red-200 mt-6 items-center shadow-sm"
        >
          <Text className="text-red-500 font-bold text-base">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
