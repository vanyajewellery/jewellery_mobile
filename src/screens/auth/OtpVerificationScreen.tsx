import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyOtp, resendOtp } from '../../services/apiService';

export default function OtpVerificationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const { email } = route.params || {};

  const [code, setCode] = useState(['', '', '', '', '', '']); // Express backend seeds generate 6-digit OTP codes
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<any[]>([]);

  const handleTextChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = code.join('');
    if (otpCode.length < 6) {
      Alert.alert('Error', 'Please enter the full 6-digit code');
      return;
    }

    try {
      setLoading(true);
      await verifyOtp({ email, code: otpCode });
      Alert.alert('Success', 'Email verified successfully! You can now log in.', [
        { text: 'Log In', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      console.error('OTP verify error:', err);
      Alert.alert('Verification Failed', err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await resendOtp(email);
      Alert.alert('Success', 'A new verification code has been sent to your email.');
    } catch (err: any) {
      console.error('OTP resend error:', err);
      Alert.alert('Error', err.message || 'Unable to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-brand-cream px-6">
      <View className="w-full max-w-[400px] bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        {/* Brand identity */}
        <View className="items-center mb-6">
          <Text className="text-xl font-bold tracking-[0.3em] text-brand-charcoal uppercase">
            ADORA
          </Text>
          <View className="w-6 h-[1px] bg-brand-gold mt-2" />
        </View>

        <Text 
          className="text-xl font-serif text-brand-charcoal mb-2 text-center"
          style={{ fontFamily: Platform.OS === 'android' ? 'serif' : 'Playfair Display' }}
        >
          OTP Verification
        </Text>
        <Text className="text-xs text-gray-500 mb-6 text-center leading-relaxed">
          Enter the 6-digit code sent to your registered email: {'\n'}
          <Text className="font-bold text-brand-charcoal">{email}</Text>
        </Text>

        {/* 6 code input blocks */}
        <View className="flex-row justify-between mb-8">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              maxLength={1}
              keyboardType="number-pad"
              value={code[index]}
              onChangeText={(text) => handleTextChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              className="w-10 h-12 text-center text-lg font-bold bg-brand-cream border border-gray-300 rounded-[4px] text-brand-charcoal"
            />
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#D4AF37" className="py-3" />
        ) : (
          <TouchableOpacity 
            onPress={handleVerify}
            className="w-full bg-brand-charcoal py-4 rounded-full items-center justify-center shadow-md mb-4"
          >
            <Text className="text-white font-bold text-xs uppercase tracking-widest">
              Verify OTP
            </Text>
          </TouchableOpacity>
        )}

        {resending ? (
          <ActivityIndicator size="small" color="#D4AF37" />
        ) : (
          <TouchableOpacity onPress={handleResend} className="w-full p-2 items-center">
            <Text className="text-brand-gold text-xs font-bold uppercase tracking-wider">
              Resend Code
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
