import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const USER_MOCK = {
  name: 'Prakash Kumar',
  email: 'prakash@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://picsum.photos/seed/useravatar/200/200',
};

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-brand-cream">
      {/* Profile Header */}
      <View className="bg-white px-6 py-8 items-center border-b border-brand-gold/15 shadow-sm">
        <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-gold bg-brand-cream/50 mb-4">
          <Image source={{ uri: USER_MOCK.avatar }} className="w-full h-full" />
        </View>
        <Text className="text-xl font-bold text-brand-charcoal mb-1">{USER_MOCK.name}</Text>
        <Text className="text-xs text-gray-500 mb-1">{USER_MOCK.email}</Text>
        <Text className="text-xs text-gray-500">{USER_MOCK.phone}</Text>
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
        <TouchableOpacity className="w-full bg-white p-4 rounded-xl border border-red-200 mt-6 items-center shadow-sm">
          <Text className="text-red-500 font-bold text-base">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
