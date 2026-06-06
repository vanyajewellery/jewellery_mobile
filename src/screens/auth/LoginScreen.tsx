import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { login } from '../../services/apiService';
import { setCredentials } from '../../redux/slices/authSlice';
import { saveToken } from '../../utils/storage';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email: email.toLowerCase().trim(), password }) as any;
      
      if (res && res.user) {
        // Save token to keychain
        if (res.accessToken) {
          await saveToken(res.accessToken);
        }
        
        // Save user to redux
        dispatch(
          setCredentials({
            user: {
              id: res.user._id || res.user.id,
              firstName: res.user.firstName,
              lastName: res.user.lastName,
              email: res.user.email,
              phone: res.user.phone || '',
              avatar: res.user.avatar || 'https://picsum.photos/seed/useravatar/200/200',
              fullName: res.user.fullName || `${res.user.firstName} ${res.user.lastName}`,
            },
            token: res.accessToken || 'mock-token',
          })
        );

        Alert.alert('Success', 'Logged in successfully!');
        
        const redirect = route.params?.redirect;
        if (redirect === 'Checkout') {
          navigation.replace('Checkout');
        } else {
          navigation.navigate('Main');
        }
      } else {
        Alert.alert('Error', 'Invalid login response');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      Alert.alert('Login Failed', err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-brand-cream px-6">
      {/* Decorative Atmospheric Elements */}
      <View className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />
      <View className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-brand-gold/10 rounded-full blur-[80px]" />

      <View className="w-full max-w-[400px] items-center">
        {/* Brand Identity */}
        <View className="items-center mb-8">
          <Image 
            source={require('../../assets/images/png/logowithname.png')}
            style={{ width: 220, height: 65 }}
            resizeMode="contain"
          />
          <View className="w-8 h-[1px] bg-brand-gold mt-2" />
        </View>

        {/* Login Card */}
        <View className="w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <View className="text-center mb-6 items-center">
            <Text 
              className="text-2xl font-serif text-brand-charcoal mb-1"
              style={{ fontFamily: Platform.OS === 'android' ? 'serif' : 'Playfair Display' }}
            >
              Welcome Back
            </Text>
            <Text className="text-xs text-gray-500 italic text-center">
              Enter your details to access your curated collection
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-5 border-b border-gray-300 py-1">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Email Address
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

          {/* Password Input */}
          <View className="mb-6 border-b border-gray-300 py-1 relative">
            <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Password
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
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="p-1"
              >
                <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#7F7663" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="self-end mb-6">
            <Text className="text-xs text-gray-400 underline">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          {loading ? (
            <ActivityIndicator size="small" color="#D4AF37" className="py-3" />
          ) : (
            <View className="space-y-4">
              <TouchableOpacity
                onPress={handleSignIn}
                className="w-full bg-brand-charcoal py-4 rounded-full items-center justify-center shadow-md"
              >
                <Text className="text-brand-gold font-bold text-xs uppercase tracking-widest">
                  Sign In
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center gap-2 my-2 justify-center">
                <View className="h-[1px] flex-1 bg-gray-200" />
                <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  or access via
                </Text>
                <View className="h-[1px] flex-1 bg-gray-200" />
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                className="w-full border border-gray-300 py-4 rounded-full items-center justify-center bg-white"
              >
                <Text className="text-brand-charcoal font-bold text-xs uppercase tracking-widest">
                  Create an Account
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Crafted for the Radiant
          </Text>
          <View className="flex-row gap-4">
            <Text className="text-[10px] font-bold text-gray-500 uppercase">Privacy Policy</Text>
            <Text className="text-gray-300">•</Text>
            <Text className="text-[10px] font-bold text-gray-500 uppercase">Support</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
