import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  getAddresses,
  addAddress,
  createOrder,
  updateCart,
  initiateRazorpay,
  verifyRazorpay,
} from '../../services/apiService';
import { selectCartItems, selectCartSubtotal, clearCart } from '../../redux/slices/cartSlice';
import { selectUser } from '../../redux/slices/authSlice';
import { IMAGE_BASE_URL } from '../../constants/Config';

const { width } = Dimensions.get('window');

type Step = 'address' | 'payment' | 'review';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const user = useSelector(selectUser);

  // States
  const [step, setStep] = useState<Step>('address');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressType, setAddressType] = useState('home');

  // Fetch addresses on mount
  const fetchUserAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await getAddresses();
      const addrList = Array.isArray(res) ? res : (res?.data ?? res ?? []);
      setAddresses(addrList);
      if (addrList.length > 0) {
        const defaultAddr = addrList.find((a: any) => a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr._id : addrList[0]._id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  const handleAddAddress = async () => {
    if (!firstName || !lastName || !phone || !pincode || !line1 || !city || !state) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const values = {
        firstName,
        lastName,
        phone,
        pincode,
        line1,
        line2,
        city,
        state,
        addressType,
      };
      const res: any = await addAddress(values);
      const updatedList = res.data || res || [];
      setAddresses(updatedList);
      if (updatedList.length > 0) {
        setSelectedAddressId(updatedList[updatedList.length - 1]._id);
      }
      Alert.alert('Success', 'Address added successfully!');
      setShowAddressForm(false);
      resetAddressForm();
    } catch (err: any) {
      console.error('Error adding address:', err);
      Alert.alert('Error', err.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAddressForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setPincode('');
    setLine1('');
    setLine2('');
    setCity('');
    setState('');
    setAddressType('home');
  };

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select or add a shipping address');
      return;
    }

    try {
      setSubmitting(true);

      // 1. Sync cart to backend
      await updateCart(cartItems);

      // 2. Format delivery address
      const shippingAddressData = {
        fullName: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
        phone: selectedAddress.phone,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2 || '',
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country || 'India',
      };

      // 3. Create order in backend
      const res: any = await createOrder({
        shippingAddress: shippingAddressData,
        paymentMethod: paymentMethod,
      });

      const order = res.order || res;

      if (paymentMethod === 'online') {
        // Razorpay / Online Simulated Payment
        Alert.alert(
          'Secure Payment Gateway',
          'This is a payment simulation. Click Success to complete the payment and place your order.',
          [
            {
              text: 'Cancel',
              onPress: () => {
                Alert.alert('Payment Cancelled', 'Your order was not placed.');
                setSubmitting(false);
              },
              style: 'cancel',
            },
            {
              text: 'Success',
              onPress: async () => {
                dispatch(clearCart());
                Alert.alert('Order Placed', 'Payment successful! Your order has been placed. 🎉');
                navigation.navigate('Main', { screen: 'Home' });
              },
            },
          ]
        );
      } else {
        // COD Success
        dispatch(clearCart());
        Alert.alert('Order Placed', 'Your Cash on Delivery order has been placed successfully! 🎉');
        navigation.navigate('Main', { screen: 'Home' });
      }
    } catch (err: any) {
      console.error('Error placing order:', err);
      Alert.alert('Order Failed', err.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return 'https://picsum.photos/seed/placeholder/300/400';
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  return (
    <View className="flex-1 bg-brand-cream">
      {/* Header */}
      <View className="pt-4 pb-4 px-6 bg-white border-b border-gray-150 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => {
            if (step === 'payment') setStep('address');
            else if (step === 'review') setStep('payment');
            else navigation.goBack();
          }}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-100"
        >
          <Icon name="arrow-back-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>

        <Text className="text-base font-bold text-brand-charcoal uppercase tracking-widest">
          Checkout
        </Text>

        <View className="w-10" />
      </View>

      {/* Wizard Progress Bar */}
      <View className="bg-white border-b border-gray-100 py-3 px-6 flex-row justify-between items-center">
        {[
          { key: 'address', label: 'Address' },
          { key: 'payment', label: 'Payment' },
          { key: 'review', label: 'Review' },
        ].map((s, idx) => {
          const active = s.key === step;
          const isDone =
            (step === 'payment' && idx === 0) ||
            (step === 'review' && (idx === 0 || idx === 1));

          return (
            <View key={s.key} className="flex-row items-center flex-1">
              <View className="flex-row items-center gap-2">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center border ${
                    active
                      ? 'bg-brand-charcoal border-brand-charcoal'
                      : isDone
                      ? 'bg-brand-gold border-brand-gold'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {isDone ? (
                    <Icon name="checkmark" size={12} color="#FFFFFF" />
                  ) : (
                    <Text
                      className={`text-xs font-bold ${
                        active ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <Text
                  className={`text-xs font-semibold ${
                    active ? 'text-brand-charcoal font-bold' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </Text>
              </View>
              {idx < 2 && (
                <View className="h-[1px] bg-gray-200 flex-1 mx-4 min-w-[20px]" />
              )}
            </View>
          );
        })}
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="py-20 justify-center items-center">
            <ActivityIndicator size="large" color="#D4AF37" />
          </View>
        ) : (
          <View className="p-6">
            {/* STEP 1: ADDRESS */}
            {step === 'address' && (
              <View>
                {showAddressForm ? (
                  <View className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="text-sm font-bold text-brand-charcoal uppercase tracking-wider">
                        Add Delivery Address
                      </Text>
                      <TouchableOpacity onPress={() => setShowAddressForm(false)}>
                        <Text className="text-xs text-brand-gold font-bold">Cancel</Text>
                      </TouchableOpacity>
                    </View>

                    <View className="flex-row gap-3">
                      <View className="flex-1 border-b border-gray-200 pb-1">
                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          First Name *
                        </Text>
                        <TextInput
                          value={firstName}
                          onChangeText={setFirstName}
                          placeholder="John"
                          placeholderTextColor="#9CA3AF"
                          className="text-brand-charcoal text-sm py-1"
                        />
                      </View>
                      <View className="flex-1 border-b border-gray-200 pb-1">
                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Last Name *
                        </Text>
                        <TextInput
                          value={lastName}
                          onChangeText={setLastName}
                          placeholder="Doe"
                          placeholderTextColor="#9CA3AF"
                          className="text-brand-charcoal text-sm py-1"
                        />
                      </View>
                    </View>

                    <View className="border-b border-gray-200 pb-1">
                      <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Phone Number *
                      </Text>
                      <TextInput
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="10-digit mobile"
                        keyboardType="phone-pad"
                        placeholderTextColor="#9CA3AF"
                        className="text-brand-charcoal text-sm py-1"
                      />
                    </View>

                    <View className="flex-row gap-3">
                      <View className="flex-1 border-b border-gray-200 pb-1">
                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Pincode *
                        </Text>
                        <TextInput
                          value={pincode}
                          onChangeText={setPincode}
                          placeholder="600001"
                          keyboardType="number-pad"
                          placeholderTextColor="#9CA3AF"
                          className="text-brand-charcoal text-sm py-1"
                        />
                      </View>
                      <View className="flex-1 border-b border-gray-200 pb-1">
                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Address Type *
                        </Text>
                        <View className="flex-row gap-2 mt-1">
                          {['home', 'work'].map((t) => (
                            <TouchableOpacity
                              key={t}
                              onPress={() => setAddressType(t)}
                              className={`px-3 py-1 rounded-[4px] border ${
                                addressType === t
                                  ? 'bg-brand-charcoal border-brand-charcoal'
                                  : 'bg-white border-gray-300'
                              }`}
                            >
                              <Text
                                className={`text-[10px] font-bold uppercase tracking-wider ${
                                  addressType === t ? 'text-white' : 'text-gray-500'
                                }`}
                              >
                                {t}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>

                    <View className="border-b border-gray-200 pb-1">
                      <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Address Line 1 (Flat, Block, Street) *
                      </Text>
                      <TextInput
                        value={line1}
                        onChangeText={setLine1}
                        placeholder="Flat 101, block B"
                        placeholderTextColor="#9CA3AF"
                        className="text-brand-charcoal text-sm py-1"
                      />
                    </View>

                    <View className="border-b border-gray-200 pb-1">
                      <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Address Line 2 (Area, Sector, Landmark)
                      </Text>
                      <TextInput
                        value={line2}
                        onChangeText={setLine2}
                        placeholder="Near Central Park"
                        placeholderTextColor="#9CA3AF"
                        className="text-brand-charcoal text-sm py-1"
                      />
                    </View>

                    <View className="flex-row gap-3">
                      <View className="flex-1 border-b border-gray-200 pb-1">
                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          City *
                        </Text>
                        <TextInput
                          value={city}
                          onChangeText={setCity}
                          placeholder="Mumbai"
                          placeholderTextColor="#9CA3AF"
                          className="text-brand-charcoal text-sm py-1"
                        />
                      </View>
                      <View className="flex-1 border-b border-gray-200 pb-1">
                        <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          State *
                        </Text>
                        <TextInput
                          value={state}
                          onChangeText={setState}
                          placeholder="Maharashtra"
                          placeholderTextColor="#9CA3AF"
                          className="text-brand-charcoal text-sm py-1"
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleAddAddress}
                      disabled={submitting}
                      className="bg-brand-charcoal py-3.5 rounded-[4px] items-center justify-center shadow-md mt-4"
                    >
                      {submitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text className="text-white font-bold uppercase tracking-widest text-xs">
                          Save & Use Address
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="space-y-4">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                        Select Delivery Address
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowAddressForm(true)}
                        className="flex-row items-center gap-1"
                      >
                        <Icon name="add-circle-outline" size={16} color="#D4AF37" />
                        <Text className="text-xs font-bold text-brand-gold">Add New</Text>
                      </TouchableOpacity>
                    </View>

                    {addresses.length === 0 ? (
                      <View className="bg-white p-8 rounded-lg border border-gray-250 items-center justify-center">
                        <Icon name="location-outline" size={48} color="#7F7663" className="mb-2" />
                        <Text className="text-sm font-serif text-brand-charcoal mb-4">
                          No saved addresses
                        </Text>
                        <TouchableOpacity
                          onPress={() => setShowAddressForm(true)}
                          className="bg-brand-charcoal py-2.5 px-6 rounded-[4px]"
                        >
                          <Text className="text-white font-bold uppercase tracking-wider text-[10px]">
                            Add First Address
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View className="space-y-3">
                        {addresses.map((addr) => {
                          const selected = addr._id === selectedAddressId;
                          return (
                            <TouchableOpacity
                              key={addr._id}
                              onPress={() => setSelectedAddressId(addr._id)}
                              className={`bg-white p-4 rounded-lg border ${
                                selected ? 'border-brand-gold shadow-sm' : 'border-gray-200'
                              }`}
                            >
                              <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-row items-center gap-2">
                                  <View
                                    className={`w-4 h-4 rounded-full border items-center justify-center ${
                                      selected ? 'border-brand-gold' : 'border-gray-300'
                                    }`}
                                  >
                                    {selected && (
                                      <View className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                                    )}
                                  </View>
                                  <Text className="text-xs font-bold text-brand-charcoal capitalize">
                                    {addr.firstName} {addr.lastName}
                                  </Text>
                                </View>
                                <View className="bg-brand-cream border border-gray-205 px-2 py-0.5 rounded-[2px]">
                                  <Text className="text-[8px] font-bold uppercase tracking-wider text-gray-500">
                                    {addr.addressType}
                                  </Text>
                                </View>
                              </View>
                              <Text className="text-xs text-gray-500 leading-relaxed pl-6">
                                {addr.line1}
                                {addr.line2 ? `, ${addr.line2}` : ''}
                                {'\n'}
                                {addr.city}, {addr.state} — {addr.pincode}
                                {'\n'}
                                Phone: {addr.phone}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}

                        <TouchableOpacity
                          onPress={() => setStep('payment')}
                          disabled={!selectedAddressId}
                          className={`py-4 rounded-[4px] items-center justify-center shadow-md mt-6 ${
                            selectedAddressId ? 'bg-brand-charcoal' : 'bg-gray-300'
                          }`}
                        >
                          <Text className="text-white font-bold uppercase tracking-widest text-xs">
                            Continue to Payment
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* STEP 2: PAYMENT */}
            {step === 'payment' && (
              <View className="space-y-6">
                <Text className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                  Choose Payment Method
                </Text>

                <View className="space-y-3">
                  {[
                    {
                      id: 'cod',
                      title: 'Cash on Delivery (COD)',
                      desc: 'Pay with cash upon package receipt',
                      icon: 'cash-outline',
                    },
                    {
                      id: 'online',
                      title: 'Online Payment (UPI/Card/NetBanking)',
                      desc: 'Instant, secure checkout via gateway',
                      icon: 'card-outline',
                    },
                  ].map((method) => {
                    const selected = paymentMethod === method.id;
                    return (
                      <TouchableOpacity
                        key={method.id}
                        onPress={() => setPaymentMethod(method.id as any)}
                        className={`bg-white p-4 rounded-lg border flex-row items-center gap-4 ${
                          selected ? 'border-brand-gold shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <View
                          className={`w-4 h-4 rounded-full border items-center justify-center ${
                            selected ? 'border-brand-gold' : 'border-gray-300'
                          }`}
                        >
                          {selected && (
                            <View className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                          )}
                        </View>

                        <View className="w-10 h-10 rounded-full bg-brand-cream border border-gray-100 items-center justify-center">
                          <Icon name={method.icon} size={20} color="#7F7663" />
                        </View>

                        <View className="flex-1">
                          <Text className="text-xs font-bold text-brand-charcoal">
                            {method.title}
                          </Text>
                          <Text className="text-[10px] text-gray-400 mt-0.5">
                            {method.desc}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  onPress={() => setStep('review')}
                  className="bg-brand-charcoal py-4 rounded-[4px] items-center justify-center shadow-md mt-6"
                >
                  <Text className="text-white font-bold uppercase tracking-widest text-xs">
                    Continue to Review
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 3: REVIEW */}
            {step === 'review' && (
              <View className="space-y-6">
                {/* Delivery Summary */}
                <View className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <View className="flex-row items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                    <Icon name="location-outline" size={16} color="#D4AF37" />
                    <Text className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                      Delivery Details
                    </Text>
                  </View>
                  {selectedAddress && (
                    <Text className="text-xs text-gray-500 leading-relaxed">
                      <Text className="font-bold text-brand-charcoal">
                        {selectedAddress.firstName} {selectedAddress.lastName}
                      </Text>
                      {'\n'}
                      {selectedAddress.line1}
                      {selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}
                      {'\n'}
                      {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                      {'\n'}
                      Phone: {selectedAddress.phone}
                    </Text>
                  )}
                </View>

                {/* Payment Summary */}
                <View className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <View className="flex-row items-center gap-2 border-b border-gray-100 pb-2 mb-2">
                    <Icon name="card-outline" size={16} color="#D4AF37" />
                    <Text className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                      Payment Method
                    </Text>
                  </View>
                  <Text className="text-xs font-bold text-brand-charcoal capitalize">
                    {paymentMethod === 'cod'
                      ? 'Cash on Delivery (COD)'
                      : 'Online Payment (UPI/Card)'}
                  </Text>
                </View>

                {/* Order Summary */}
                <View className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <View className="flex-row items-center gap-2 border-b border-gray-100 pb-2 mb-4">
                    <Icon name="bag-handle-outline" size={16} color="#D4AF37" />
                    <Text className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                      Items Ordered
                    </Text>
                  </View>

                  <View className="space-y-3 max-h-[160px] overflow-y-auto mb-4">
                    {cartItems.map((item) => (
                      <View key={item.id} className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                          <Image
                            source={{ uri: getImageUrl(item.image) }}
                            className="w-10 h-10 rounded-md border border-gray-100"
                            resizeMode="cover"
                          />
                          <View>
                            <Text className="text-xs font-bold text-brand-charcoal max-w-[150px]" numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text className="text-[10px] text-gray-400">Qty: {item.quantity}</Text>
                          </View>
                        </View>
                        <Text className="text-xs font-bold text-brand-charcoal">
                          ₹{item.price * item.quantity}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className="border-t border-gray-100 pt-3 space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-500">Subtotal</Text>
                      <Text className="text-xs font-bold text-brand-charcoal">₹{subtotal}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-gray-500">Shipping</Text>
                      <Text className="text-xs font-bold text-green-600">FREE</Text>
                    </View>
                    <View className="border-t border-gray-100 my-2" />
                    <View className="flex-row justify-between items-baseline">
                      <Text className="text-xs font-bold text-brand-charcoal">Total Amount</Text>
                      <Text className="text-sm font-bold text-brand-gold">₹{subtotal}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handlePlaceOrder}
                  disabled={submitting}
                  className="bg-brand-charcoal py-4 rounded-[4px] items-center justify-center shadow-md mt-6 flex-row gap-2"
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Icon name="checkmark-circle-outline" size={18} color="#D4AF37" />
                      <Text className="text-white font-bold uppercase tracking-widest text-xs">
                        Place Order (₹{subtotal})
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
