import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function OtpVerificationScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-brand-cream px-6">
      <View className="w-full bg-white p-8 rounded-2xl shadow-lg border border-brand-gold/20">
        <Text className="text-3xl font-bold text-brand-charcoal text-center mb-2">VANYA</Text>
        <Text className="text-sm text-brand-gold text-center mb-8 tracking-widest uppercase">Jewellery</Text>
        
        <Text className="text-xl font-semibold text-brand-charcoal mb-4">OTP Verification</Text>
        <Text className="text-sm text-gray-500 mb-6">Enter the 4-digit code sent to your mobile phone number.</Text>

        <View className="flex-row justify-between mb-8 px-4">
          {[1, 2, 3, 4].map((index) => (
            <TextInput
              key={index}
              maxLength={1}
              keyboardType="number-pad"
              className="w-12 h-12 text-center text-xl font-bold bg-brand-cream/50 border border-brand-gold/30 rounded-xl text-brand-charcoal"
            />
          ))}
        </View>

        <TouchableOpacity className="w-full bg-brand-gold p-4 rounded-xl items-center mb-4 shadow-md">
          <Text className="text-white font-semibold text-base">Verify OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full p-2 items-center">
          <Text className="text-brand-gold text-sm font-medium">Resend Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
