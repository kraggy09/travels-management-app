import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { leadsStyle as styles } from '@/styles/leadsStyle';

export default function LeadSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name: string; route: string; amount: string }>();

  const customerName = params.name || 'N/A';
  const routeName = params.route || 'N/A';
  const rawAmount = parseFloat(params.amount) || 0;
  const formattedAmount = rawAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

  const handleShareWhatsApp = () => {
    const message = `Hello ${customerName},\n\nWe have created a new logistics lead for your route from ${routeName}.\nQuoted Amount: ₹${formattedAmount}.\n\nThank you for choosing FleetSync!`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to web link if app isn't installed
          return Linking.openURL(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const handleSkip = () => {
    // Navigate back to leads list
    router.replace('/leads' as any);
  };

  return (
    <SafeAreaView style={styles.successContainer} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View style={styles.successHeader}>
        <View style={styles.successHeaderLeft}>
          <TouchableOpacity>
            <Feather name="menu" size={22} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.successLogoText}>FleetSync</Text>
        </View>
        <View style={styles.modalAvatar}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80' }}
            style={styles.modalAvatarImg}
          />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.successContent}>
        <View style={styles.successIconCircle}>
          <View style={styles.successInnerCircle}>
            <Feather name="check" size={32} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.successTitleText}>Lead Created Successfully</Text>
        <Text style={styles.successSubtitleText}>
          The lead has been securely saved to the FleetSync database.
        </Text>

        {/* Lead Details Card */}
        <View style={styles.successCard}>
          <View style={styles.successCardHeader}>
            <Text style={styles.successCardLabel}>LEAD DETAILS</Text>
            <View style={styles.successActiveBadge}>
              <Text style={styles.successActiveBadgeText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.successFieldGroup}>
            <Text style={styles.successFieldLabel}>Customer Name</Text>
            <Text style={styles.successFieldValue}>{customerName}</Text>
          </View>

          <View style={styles.successFieldGroup}>
            <Text style={styles.successFieldLabel}>Route</Text>
            <Text style={styles.successFieldValue}>{routeName}</Text>
          </View>

          <View style={styles.successFieldGroupLast}>
            <Text style={styles.successFieldLabel}>Quoted Amount</Text>
            <Text style={styles.successFieldAmountValue}>₹ {formattedAmount}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.whatsappButton} onPress={handleShareWhatsApp}>
          <FontAwesome name="whatsapp" size={18} color="#FFFFFF" />
          <Text style={styles.whatsappButtonText}>Share via WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipSharingButton} onPress={handleSkip}>
          <Feather name="x" size={14} color="#6B7280" />
          <Text style={styles.skipSharingText}>Skip Sharing</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
