import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';

const LOGO_WITH_NAME = require('../../assets/images/png/logwithname.png');

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  console.log("LoginScreen rendering!");

  const handleSignIn = () => {
    // Dispatch a mock successful login
    dispatch(setCredentials({
      user: {
        id: 'user_123',
        firstName: 'Prakash',
        lastName: 'Kumar',
        email: email || 'prakash@example.com',
        phone: '+91 98765 43210',
        avatar: 'https://picsum.photos/seed/useravatar/200/200',
        fullName: 'Prakash Kumar',
      },
      token: 'mock-jwt-token-value',
    }));
    
    // Go back to the screen we came from
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-brand-cream px-6">
      <View className="w-full bg-white p-8 rounded-2xl shadow-lg border border-brand-gold/20">
        <View className="items-center mb-6">
          <Image 
            source={LOGO_WITH_NAME} 
            style={{ width: 160, height: 45 }} 
            resizeMode="contain" 
          />
        </View>
        
        <Text className="text-xl font-semibold text-brand-charcoal mb-6">Log In</Text>

        <TextInput 
          placeholder="Phone Number / Email" 
          placeholderTextColor="#C5A880"
          value={email}
          onChangeText={setEmail}
          className="w-full p-4 mb-4 bg-brand-cream/50 rounded-xl border border-brand-gold/30 text-brand-charcoal"
        />

        <TextInput 
          placeholder="Password" 
          placeholderTextColor="#C5A880"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="w-full p-4 mb-6 bg-brand-cream/50 rounded-xl border border-brand-gold/30 text-brand-charcoal"
        />

        <TouchableOpacity 
          onPress={handleSignIn}
          className="w-full bg-brand-gold p-4 rounded-xl items-center mb-4 shadow-md"
        >
          <Text className="text-white font-semibold text-base">Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')}
          className="w-full p-2 items-center"
        >
          <Text className="text-brand-gold text-sm font-medium">Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
