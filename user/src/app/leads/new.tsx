import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { leadsStyle as styles } from '@/styles/leadsStyle';

export default function NewLeadScreen() {
  const router = useRouter();

  // Form States
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bookingSource, setBookingSource] = useState('');
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropPoint, setDropPoint] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropDate, setDropDate] = useState('');
  const [quotedAmount, setQuotedAmount] = useState('');
  const [vehicleType, setVehicleType] = useState('Truck'); // default Truck
  const [tollCharges, setTollCharges] = useState(false);
  const [parkingFees, setParkingFees] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleSaveLead = () => {
    if (!customerName.trim() || !pickupPoint.trim() || !dropPoint.trim()) {
      Alert.alert('Missing Details', 'Please enter customer name, pickup and drop points to create a lead.');
      return;
    }

    // Create a new Lead object
    const newLeadId = `LEAD-${1000 + Date.now()}`;
    const newLead = {
      id: newLeadId,
      name: customerName.trim(),
      route: `${pickupPoint.trim()} → ${dropPoint.trim()}`,
      vehicle: vehicleType,
      pax: 4,
      date: new Date(),
      status: 'New' as const,
      value: parseFloat(quotedAmount) || 0,
    };

    // If schedule details are provided, make a follow-up action automatically
    let newFollowUp = null;
    if (pickupDate.trim()) {
      const newFUId = `FU-${2000 + Date.now()}`;
      newFollowUp = {
        id: newFUId,
        client: customerName.trim(),
        notes: `Pickup scheduled at ${pickupDate.trim()}. Special notes: ${specialInstructions || 'None'}`,
        time: 'Today, 9:00 AM',
        date: new Date(),
        type: 'Call' as const,
        attempt: 1,
      };
    }

    // Emit event so the Leads List index.tsx receives the updates
    DeviceEventEmitter.emit('lead-created', { newLead, newFollowUp });

    // Navigate to nested success view route
    router.replace({
      pathname: '/leads/success' as any,
      params: {
        name: customerName.trim(),
        route: `${pickupPoint.trim()} → ${dropPoint.trim()}`,
        amount: quotedAmount,
      },
    });
  };

  return (
    <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.modalBackBtn}>
          <Feather name="arrow-left" size={22} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.modalTitle}>New Lead</Text>
        <View style={styles.modalAvatar}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.modalAvatarImg}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.modalScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Title Section */}
        <View style={styles.formIntroBlock}>
          <Text style={styles.formIntroTag}>Entry Form</Text>
          <Text style={styles.formIntroTitle}>Logistical Details</Text>
          <Text style={styles.formIntroDesc}>
            Fill in the transit requirements for the new logistics lead.
          </Text>
        </View>

        {/* Card 1: Customer Information */}
        <View style={styles.formCard}>
          <View style={styles.formCardTitleRow}>
            <Feather name="user" size={15} color="#000000" />
            <Text style={styles.formCardTitle}>Customer Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Customer Name</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter full name"
              placeholderTextColor="#9CA3AF"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.inputField}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>

          <View style={styles.inputGroupLast}>
            <Text style={styles.inputLabel}>Source of Booking</Text>
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
            >
              <Text
                style={[
                  styles.dropdownTriggerText,
                  !bookingSource && styles.dropdownTriggerPlaceholder,
                ]}
              >
                {bookingSource || 'Select source'}
              </Text>
              <Feather name="chevron-down" size={16} color="#6B6B6B" />
            </TouchableOpacity>

            {isSourceDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {['Direct', 'Referral', 'Website', 'Cold Call', 'Partner'].map((source, index, arr) => (
                  <TouchableOpacity
                    key={source}
                    style={[
                      styles.dropdownItem,
                      index === arr.length - 1 && styles.dropdownItemLast,
                    ]}
                    onPress={() => {
                      setBookingSource(source);
                      setIsSourceDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{source}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Card 2: Route Information */}
        <View style={styles.formCard}>
          <View style={styles.formCardTitleRow}>
            <Feather name="navigation" size={15} color="#000000" />
            <Text style={styles.formCardTitle}>Route Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pickup Point</Text>
            <View style={styles.inputFieldIconRow}>
              <Feather name="map-pin" size={15} color="#6B6B6B" style={styles.inputIcon} />
              <TextInput
                style={styles.inputFieldWithIcon}
                placeholder="Enter pickup address..."
                placeholderTextColor="#9CA3AF"
                value={pickupPoint}
                onChangeText={setPickupPoint}
              />
            </View>
          </View>

          <View style={styles.inputGroupLast}>
            <Text style={styles.inputLabel}>Drop Point</Text>
            <View style={styles.inputFieldIconRow}>
              <Feather name="flag" size={15} color="#6B6B6B" style={styles.inputIcon} />
              <TextInput
                style={styles.inputFieldWithIcon}
                placeholder="Enter destination address..."
                placeholderTextColor="#9CA3AF"
                value={dropPoint}
                onChangeText={setDropPoint}
              />
            </View>
          </View>
        </View>

        {/* Card 3: Schedule */}
        <View style={styles.formCard}>
          <View style={styles.formCardTitleRow}>
            <Feather name="calendar" size={15} color="#000000" />
            <Text style={styles.formCardTitle}>Schedule</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Pickup Date & Time</Text>
            <View style={styles.inputFieldIconRow}>
              <Feather name="calendar" size={15} color="#6B6B6B" style={styles.inputIcon} />
              <TextInput
                style={styles.inputFieldWithIcon}
                placeholder="e.g. 2026-07-20 10:00 AM"
                placeholderTextColor="#9CA3AF"
                value={pickupDate}
                onChangeText={setPickupDate}
              />
            </View>
          </View>

          <View style={styles.inputGroupLast}>
            <Text style={styles.inputLabel}>Drop Date & Time</Text>
            <View style={styles.inputFieldIconRow}>
              <Feather name="calendar" size={15} color="#6B6B6B" style={styles.inputIcon} />
              <TextInput
                style={styles.inputFieldWithIcon}
                placeholder="e.g. 2026-07-21 04:00 PM"
                placeholderTextColor="#9CA3AF"
                value={dropDate}
                onChangeText={setDropDate}
              />
            </View>
          </View>
        </View>

        {/* Card 4: Financials */}
        <View style={styles.formCard}>
          <View style={styles.formCardTitleRow}>
            <Feather name="dollar-sign" size={15} color="#000000" />
            <Text style={styles.formCardTitle}>Financials & Vehicle</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quoted Amount</Text>
            <View style={styles.inputFieldIconRow}>
              <Text style={[styles.inputIcon, { fontSize: 16, fontFamily: 'Sora-Bold', color: '#000000' }]}>₹</Text>
              <TextInput
                style={styles.inputFieldWithIcon}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={quotedAmount}
                onChangeText={setQuotedAmount}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Required Vehicle Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vehicleChipsRow}
            >
              {['Truck', 'Innova', 'Tempo Traveller', 'Coach Bus', 'Sedan', 'SUV', 'Mini Bus'].map((vType) => (
                <TouchableOpacity
                  key={vType}
                  onPress={() => setVehicleType(vType)}
                  style={[
                    styles.vehicleChip,
                    vehicleType === vType && styles.vehicleChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.vehicleChipText,
                      vehicleType === vType && styles.vehicleChipTextActive,
                    ]}
                  >
                    {vType}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroupLast}>
            <Text style={styles.inputLabel}>Inclusions Required</Text>
            <View style={{ gap: 4 }}>
              <TouchableOpacity
                onPress={() => setTollCharges(!tollCharges)}
                style={styles.checkboxRow}
              >
                <View style={[styles.checkboxBox, tollCharges && styles.checkboxBoxChecked]}>
                  {tollCharges && <Feather name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Toll Charges Included</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setParkingFees(!parkingFees)}
                style={styles.checkboxRow}
              >
                <View style={[styles.checkboxBox, parkingFees && styles.checkboxBoxChecked]}>
                  {parkingFees && <Feather name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Parking Fees Included</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Card 5: Special Instructions */}
        <View style={[styles.formCard, { marginBottom: 20 }]}>
          <View style={styles.formCardTitleRow}>
            <Feather name="file-text" size={15} color="#000000" />
            <Text style={styles.formCardTitle}>Special Instructions</Text>
          </View>

          <View style={styles.inputGroupLast}>
            <Text style={styles.inputLabel}>Notes / Requirements</Text>
            <TextInput
              style={[styles.inputField, { height: 100, textAlignVertical: 'top', paddingTop: 10 }]}
              placeholder="Enter special requirements or note instructions..."
              placeholderTextColor="#9CA3AF"
              multiline
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
            />
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveLeadButton} onPress={handleSaveLead}>
          <Text style={styles.saveLeadText}>Save Lead</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
