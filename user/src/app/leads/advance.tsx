import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { leadsStyle as styles } from '@/styles/leadsStyle';

export default function AdvancePaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    route: string;
    value: string;
  }>();

  const leadId = params.id ?? 'LEAD-1000';
  const customerName = params.name ?? 'Customer';
  const route = params.route ?? 'Route';
  const quotedAmount = parseFloat(params.value ?? '0');

  const [finalPrice, setFinalPrice] = useState(quotedAmount.toString());
  const [advanceAmount, setAdvanceAmount] = useState('');

  const finalPriceNum = parseFloat(finalPrice) || 0;
  const advanceNum = parseFloat(advanceAmount) || 0;
  const balance = finalPriceNum - advanceNum;

  const handleConfirmBooking = () => {
    if (finalPriceNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid final agreed price.');
      return;
    }
    if (advanceNum < 0) {
      Alert.alert('Invalid Amount', 'Advance amount cannot be negative.');
      return;
    }
    if (advanceNum > finalPriceNum) {
      Alert.alert(
        'Invalid Amount',
        'Advance amount cannot exceed the final agreed price.'
      );
      return;
    }

    Alert.alert(
      'Booking Confirmed!',
      `Booking for ${customerName} (${leadId}) confirmed.\n\nFinal Price: ₹${finalPriceNum.toLocaleString('en-IN')}\nAdvance Received: ₹${advanceNum.toLocaleString('en-IN')}\nBalance Due: ₹${balance.toLocaleString('en-IN')}`,
      [
        {
          text: 'Done',
          onPress: () => {
            // Navigate back to leads list — booking is now confirmed
            router.replace('/leads' as any);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.advanceSafe} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.advanceScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Title Row ── */}
        <View style={styles.advanceTitleRow}>
          <Text style={styles.advanceTitle}>Finalize Booking</Text>
          <TouchableOpacity style={styles.advanceCloseBtn} onPress={() => router.back()}>
            <Feather name="x" size={18} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* ── Initial Quoted Amount Box ── */}
        <View style={styles.advanceQuotedBox}>
          <View>
            <Text style={styles.advanceQuotedLabel}>Initial Quoted Amount</Text>
            <Text style={styles.advanceQuotedAmount}>
              ₹{quotedAmount.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text style={[styles.advanceInputHint, { color: '#6366F1', marginTop: 4 }]}>
              {leadId} · {route}
            </Text>
          </View>
          <View style={{
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center',
            shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
          }}>
            <Feather name="info" size={18} color="#4F46E5" />
          </View>
        </View>

        {/* ── Final Agreed Price ── */}
        <View style={styles.advanceFormGroup}>
          <Text style={styles.advanceFormLabel}>Final Agreed Price</Text>
          <TextInput
            style={styles.advanceInput}
            value={`₹${finalPrice}`}
            onChangeText={(val) => setFinalPrice(val.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.advanceInputHint}>
            This value will be the final billing amount for the customer.
          </Text>
        </View>

        {/* ── Advance Amount Received ── */}
        <View style={styles.advanceFormGroup}>
          <Text style={styles.advanceFormLabel}>Advance Amount Received</Text>
          <TextInput
            style={styles.advanceInput}
            value={advanceAmount === '' ? '' : `₹${advanceAmount}`}
            onChangeText={(val) => setAdvanceAmount(val.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            placeholder="₹0.00"
            placeholderTextColor="#9CA3AF"
          />
          {advanceNum > 0 && (
            <Text style={styles.advanceInputHint}>
              Balance due: ₹{balance.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          )}
        </View>

        {/* ── FleetSync Brand / Bill Preview Placeholder ── */}
        <View style={styles.advanceBrandBox}>
          <Feather name="truck" size={32} color="#C4C4C4" />
          <Text style={styles.advanceBrandText}>FLEETSYNC LOGISTICS</Text>
        </View>

        {/* ── Confirm Booking Button ── */}
        <TouchableOpacity style={styles.advanceConfirmBtn} onPress={handleConfirmBooking}>
          <Text style={styles.advanceConfirmText}>Confirm Booking</Text>
        </TouchableOpacity>

        {/* ── Cancel Button ── */}
        <TouchableOpacity style={styles.advanceCancelBtn} onPress={() => router.back()}>
          <Text style={styles.advanceCancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
