import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 justify-center items-center bg-brand-cream px-6">
      <View className="w-full bg-white p-8 rounded-2xl shadow-lg border border-brand-gold/20">
        <Text className="text-3xl font-bold text-brand-charcoal text-center mb-2">VANYA</Text>
        <Text className="text-sm text-brand-gold text-center mb-8 tracking-widest uppercase">Jewellery</Text>
        
        <Text className="text-xl font-semibold text-brand-charcoal mb-6">Create Account</Text>

        <TextInput 
          placeholder="First Name" 
          placeholderTextColor="#C5A880"
          className="w-full p-4 mb-4 bg-brand-cream/50 rounded-xl border border-brand-gold/30 text-brand-charcoal"
        />

        <TextInput 
          placeholder="Last Name" 
          placeholderTextColor="#C5A880"
          className="w-full p-4 mb-4 bg-brand-cream/50 rounded-xl border border-brand-gold/30 text-brand-charcoal"
        />

        <TextInput 
          placeholder="Phone Number" 
          placeholderTextColor="#C5A880"
          keyboardType="phone-pad"
          className="w-full p-4 mb-4 bg-brand-cream/50 rounded-xl border border-brand-gold/30 text-brand-charcoal"
        />

        <TextInput 
          placeholder="Email Address" 
          placeholderTextColor="#C5A880"
          keyboardType="email-address"
          className="w-full p-4 mb-6 bg-brand-cream/50 rounded-xl border border-brand-gold/30 text-brand-charcoal"
        />

        <TouchableOpacity className="w-full bg-brand-gold p-4 rounded-xl items-center mb-4 shadow-md">
          <Text className="text-white font-semibold text-base">Register</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          className="w-full p-2 items-center"
        >
          <Text className="text-brand-gold text-sm font-medium">Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
