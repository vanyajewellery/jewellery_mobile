import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { register } from '../../services/apiService';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  // States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(''); // Include phone for Indian backend regex compatibility
  const [showPassword, setShowPassword] = useState(false);
  const [newsletter, setNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Split Full Name into First and Last Name for the backend
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Sterling'; // Fallback last name if not provided

    try {
      setLoading(true);
      
      const payload: any = {
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        password,
      };

      if (phone.trim() !== '') {
        // If phone is provided, make sure it matches Indian 10 digit regex (e.g. 9876543210)
        const cleanPhone = phone.replace(/\s+/g, '').replace(/[^0-9]/g, '');
        const last10Digits = cleanPhone.slice(-10);
        if (/^[6-9]\d{9}$/.test(last10Digits)) {
          payload.phone = last10Digits;
        } else {
          Alert.alert('Error', 'Please enter a valid 10-digit Indian mobile number');
          setLoading(false);
          return;
        }
      }

      await register(payload);

      Alert.alert(
        'Registration Successful',
        'Please verify your email address with the OTP sent to you.',
        [
          {
            text: 'Verify Now',
            onPress: () => navigation.navigate('OtpVerification', { email: email.toLowerCase().trim() }),
          },
        ]
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      Alert.alert('Registration Failed', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-brand-cream" showsVerticalScrollIndicator={false}>
      <View className="flex-1 justify-center items-center px-6 py-12">
        {/* Atmospheric Blur Elements */}
        <View className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
        <View className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />

        <View className="w-full max-w-[400px] items-center">
          {/* Header Brand */}
          <View className="items-center mb-8">
            <Image 
              source={require('../../assets/images/png/logowithname.png')}
              style={{ width: 220, height: 65 }}
              resizeMode="contain"
            />
            <View className="w-8 h-[1px] bg-brand-gold mt-2" />
          </View>

          {/* Form Card */}
          <View className="w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <View className="text-center mb-6 items-center">
              <Text 
                className="text-2xl font-serif text-brand-charcoal mb-1"
                style={{ fontFamily: Platform.OS === 'android' ? 'serif' : 'Playfair Display' }}
              >
                Join the Inner Circle
              </Text>
              <Text className="text-xs text-gray-500 italic text-center">
                Enter a world of affordable radiance.
              </Text>
            </View>

            {/* Full Name Input */}
            <View className="mb-5 border-b border-gray-300 py-1">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Full Name *
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="e.g. Alexandra Sterling"
                placeholderTextColor="#9CA3AF"
                className="text-brand-charcoal text-sm py-1 font-semibold outline-none"
              />
            </View>

            {/* Email Input */}
            <View className="mb-5 border-b border-gray-300 py-1">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Email Address *
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
                className="text-brand-charcoal text-sm py-1 font-semibold outline-none"
              />
            </View>

            {/* Mobile Phone (Optional but matched to Indian DB validation) */}
            <View className="mb-5 border-b border-gray-300 py-1">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Mobile Number (Optional)
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="e.g. 9876543210"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                className="text-brand-charcoal text-sm py-1 font-semibold outline-none"
              />
            </View>

            {/* Password Input */}
            <View className="mb-5 border-b border-gray-300 py-1 relative">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Password *
              </Text>
              <View className="flex-row items-center justify-between">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="text-brand-charcoal text-sm py-1 font-semibold outline-none flex-1"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                  <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7F7663" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6 border-b border-gray-300 py-1">
              <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Confirm Password *
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="text-brand-charcoal text-sm py-1 font-semibold outline-none"
              />
            </View>

            {/* Newsletter Subscription Checkbox */}
            <TouchableOpacity 
              onPress={() => setNewsletter(!newsletter)}
              className="flex-row items-center gap-3 mb-6"
            >
              <View className={`w-5 h-5 rounded border ${
                newsletter ? 'bg-brand-charcoal border-brand-charcoal items-center justify-center' : 'border-gray-350'
              }`}>
                {newsletter && <Icon name="checkmark" size={14} color="#D4AF37" />}
              </View>
              <Text className="text-xs text-gray-600 flex-1 leading-relaxed">
                Sign up for our newsletter to receive updates on new collections and exclusive offers.
              </Text>
            </TouchableOpacity>

            {/* Create Account Action */}
            {loading ? (
              <ActivityIndicator size="small" color="#D4AF37" className="py-3" />
            ) : (
              <View className="space-y-4">
                <TouchableOpacity
                  onPress={handleRegister}
                  className="w-full bg-brand-charcoal py-4 rounded-full items-center justify-center shadow-md"
                >
                  <Text className="text-white font-bold text-xs uppercase tracking-widest">
                    Create Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  className="w-full py-2 items-center"
                >
                  <Text className="text-brand-charcoal text-xs font-semibold">
                    Already have an account? <Text className="text-brand-gold font-bold">Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer Links */}
          <View className="flex-row gap-6 mt-8">
            <Text className="text-[10px] font-bold text-gray-500 uppercase">Privacy</Text>
            <Text className="text-[10px] font-bold text-gray-500 uppercase">Terms</Text>
            <Text className="text-[10px] font-bold text-gray-500 uppercase">Help</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
