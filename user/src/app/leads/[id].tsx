import React, { useState, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { leadsStyle as styles } from '@/styles/leadsStyle';

type LeadStatus = 'New' | 'In Progress' | 'Qualified' | 'Won' | 'Lost';
type TripStatus = 'Confirmed' | 'In Transit' | 'Completed' | 'Cancelled';

interface FollowUpEntry {
  id: string; date: string; time: string;
  type: 'Call' | 'Email'; notes: string; attempt: number;
}

const MOCK_FOLLOW_UPS: FollowUpEntry[] = [
  { id: 'FU-1', date: 'Jul 14, 2026', time: '10:00 AM', type: 'Call', attempt: 1, notes: 'Initial contact. Customer interested. Awaiting confirmation on dates.' },
  { id: 'FU-2', date: 'Jul 15, 2026', time: '3:30 PM', type: 'Call', attempt: 2, notes: 'Route confirmed. Requested toll and driver charges breakdown. Sent quote.' },
  { id: 'FU-3', date: 'Jul 16, 2026', time: '11:15 AM', type: 'Email', attempt: 3, notes: 'Customer agreed to quoted amount. Asked about advance payment options.' },
];

// ─── Status Pills ──────────────────────────────────────────────────────────────
function LeadStatusPill({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, { bg: string; color: string }> = {
    New: { bg: '#EFF6FF', color: '#1D4ED8' },
    'In Progress': { bg: '#FEF3C7', color: '#92400E' },
    Qualified: { bg: '#F3E8FF', color: '#5B21B6' },
    Won: { bg: '#D1FAE5', color: '#065F46' },
    Lost: { bg: '#FEE2E2', color: '#991B1B' },
  };
  const { bg, color } = map[status];
  return <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 }}><Text style={{ fontSize: 10, fontFamily: 'Sora-Bold', color }}>{status.toUpperCase()}</Text></View>;
}

function TripStatusPill({ status }: { status: TripStatus }) {
  const map: Record<TripStatus, { bg: string; color: string }> = {
    Confirmed: { bg: '#111827', color: '#FFFFFF' },
    'In Transit': { bg: '#DBEAFE', color: '#1E40AF' },
    Completed: { bg: '#D1FAE5', color: '#065F46' },
    Cancelled: { bg: '#FEE2E2', color: '#991B1B' },
  };
  const { bg, color } = map[status];
  return <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 }}><Text style={{ fontSize: 10, fontFamily: 'Sora-Bold', color }}>{status.toUpperCase()}</Text></View>;
}

// ─── Follow-up Timeline Item ──────────────────────────────────────────────────
function FollowUpItem({ entry, isLast }: { entry: FollowUpEntry; isLast: boolean }) {
  const color = entry.type === 'Call' ? '#1D4ED8' : '#059669';
  const ordinal = entry.attempt === 1 ? '1st' : entry.attempt === 2 ? '2nd' : entry.attempt === 3 ? '3rd' : `${entry.attempt}th`;
  return (
    <View style={styles.fuTimelineItem}>
      <View style={styles.fuTimelineLeft}>
        <View style={styles.fuTimelineDot} />
        {!isLast && <View style={styles.fuTimelineConnector} />}
      </View>
      <View style={[styles.fuTimelineContent, isLast && { marginBottom: 0 }]}>
        <View style={styles.fuTimelineTopRow}>
          <View style={styles.fuAttemptBadge}>
            <Feather name="repeat" size={9} color="#1D4ED8" />
            <Text style={styles.fuAttemptText}>{ordinal} Follow-up</Text>
          </View>
          <Text style={styles.fuTimeText}>{entry.date} · {entry.time}</Text>
        </View>
        <View style={styles.fuTypeRow}>
          <Feather name={entry.type === 'Call' ? 'phone' : 'mail'} size={11} color={color} />
          <Text style={[styles.fuTypeText, { color }]}>{entry.type}</Text>
        </View>
        <Text style={styles.fuNotesText}>{entry.notes}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function UnifiedDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    source: string;        // 'lead' | 'trip'
    // Lead params
    id: string; name: string; route: string; vehicle: string;
    pax: string; status: string; value: string; date: string;
    // Trip params
    tripId: string; tripFrom: string; tripTo: string;
    tripDeparture: string; tripArrival: string;
    tripVehicle: string; tripPax: string;
    tripStatus: string; tripOwnership: string;
    tripAssigned: string; tripAmount: string;
    petrolCost: string; driverPay: string; vendorCost: string;
    vendorName: string; vendorVehicleType: string;
  }>();

  const source = params.source ?? 'lead';
  const isFromTrip = source === 'trip';

  // ── Lead data ──
  const leadId    = params.id ?? 'LEAD-1000';
  const name      = params.name ?? 'Customer';
  const route     = params.route ?? '—';
  const vehicle   = params.vehicle ?? '—';
  const pax       = params.pax ?? '0';
  const leadStatus = (params.status ?? 'New') as LeadStatus;
  const value     = parseFloat(params.value ?? '0');
  const date      = params.date ?? '—';

  // ── Trip data ──
  const tripId           = params.tripId ?? '';
  const tripFrom         = params.tripFrom ?? '—';
  const tripTo           = params.tripTo ?? '—';
  const tripDeparture    = params.tripDeparture ?? '—';
  const tripArrival      = params.tripArrival ?? '—';
  const tripVehicle      = params.tripVehicle ?? '—';
  const tripPax          = params.tripPax ?? '0';
  const tripStatus       = (params.tripStatus ?? 'Confirmed') as TripStatus;
  const tripOwnership    = params.tripOwnership ?? 'personal';
  const tripAssigned     = params.tripAssigned === 'true';
  const tripAmount       = parseFloat(params.tripAmount ?? '0');
  const petrolCost       = parseFloat(params.petrolCost ?? '0');
  const driverPay        = parseFloat(params.driverPay ?? '0');
  const vendorCostAmt    = parseFloat(params.vendorCost ?? '0');
  const vendorName       = params.vendorName ?? '';
  const vendorVehicleType = params.vendorVehicleType ?? '';

  const isOwnFleet = tripOwnership === 'personal';
  const revenue = isFromTrip ? tripAmount : value;

  // Net profit calc
  const netProfit = useMemo(() => {
    if (isOwnFleet) return revenue - petrolCost - driverPay;
    return revenue - vendorCostAmt;
  }, [isOwnFleet, revenue, petrolCost, driverPay, vendorCostAmt]);

  const showFinancials = isFromTrip
    ? (tripStatus === 'Completed' || tripStatus === 'Cancelled')
    : leadStatus === 'Won';

  const [whatsappVisible, setWhatsappVisible] = useState(false);
  const [followUps] = useState<FollowUpEntry[]>(MOCK_FOLLOW_UPS);

  const displayId = isFromTrip ? tripId : leadId;
  const displayRoute = isFromTrip ? `${tripFrom} → ${tripTo}` : route;
  const displayVehicle = isFromTrip ? tripVehicle : vehicle;
  const displayPax = isFromTrip ? tripPax : pax;

  const sendWhatsApp = (type: 'advance' | 'followup' | 'vehicle') => {
    setWhatsappVisible(false);
    const msgs: Record<string, string> = {
      advance: `Hello ${name},\n\nYour advance payment for trip ${displayId} (${displayRoute}) has been confirmed.\nAmount: ₹${revenue.toLocaleString('en-IN')}\n\nThank you — FleetSync Logistics`,
      followup: `Hello ${name},\n\nFollow-up regarding your booking for route ${displayRoute}.\nPlease confirm your availability.\n\nTeam FleetSync`,
      vehicle: `Hello ${name},\n\nVehicle details for ${displayId}:\nRoute: ${displayRoute}\nVehicle: ${displayVehicle}\nPassengers: ${displayPax}\n\nDriver info will be shared 24h before departure.\n\nTeam FleetSync`,
    };
    const msg = msgs[type];
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.canOpenURL(url)
      .then(ok => Linking.openURL(ok ? url : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`))
      .catch(() => Alert.alert('Error', 'Could not open WhatsApp.'));
  };

  const handleFollowUp = () =>
    Alert.alert('Schedule Follow-up', 'Choose a method:', [
      { text: 'Phone Call', onPress: () => Alert.alert('Scheduled', 'Call follow-up added.') },
      { text: 'Email', onPress: () => Alert.alert('Scheduled', 'Email task created.') },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const handleMarkCompleted = () =>
    Alert.alert('Mark Completed', 'Confirm this has been successfully fulfilled?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Complete', onPress: () => Alert.alert('Updated', 'Status updated to Won!') },
    ]);

  const handleAdvancePayment = () =>
    router.push({ pathname: '/leads/advance' as any, params: { id: leadId, name, route: displayRoute, value: revenue.toString() } });

  const titleText = isFromTrip ? 'Trip Details' : 'Lead Details';
  const subtitleText = displayId;

  return (
    <SafeAreaView style={styles.detailSafe} edges={['top', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.detailHeader}>
        <View style={styles.detailHeaderLeft}>
          <TouchableOpacity style={styles.detailBackBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color="#000000" />
          </TouchableOpacity>
          <View>
            <Text style={styles.detailHeaderTitle}>{titleText}</Text>
            <Text style={styles.detailHeaderSubtitle}>{subtitleText}</Text>
          </View>
        </View>
        {isFromTrip ? <TripStatusPill status={tripStatus} /> : <LeadStatusPill status={leadStatus} />}
      </View>

      <ScrollView contentContainerStyle={styles.detailScroll} showsVerticalScrollIndicator={false}>

        {/* ── Customer / Lead Info Card ── */}
        <View style={styles.leadInfoCard}>
          <View style={styles.leadInfoTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.leadInfoIdText}>{leadId}</Text>
              <Text style={styles.leadInfoName}>{name}</Text>
            </View>
            <Text style={styles.leadInfoAmountValue}>₹{revenue.toLocaleString('en-IN')}</Text>
          </View>
          <View style={styles.leadInfoFieldRow}>
            <View style={styles.leadInfoField}>
              <Text style={styles.leadInfoFieldLabel}>Route</Text>
              <Text style={styles.leadInfoRouteValue}>{displayRoute}</Text>
            </View>
          </View>
          <View style={styles.leadInfoFieldRow}>
            <View style={styles.leadInfoField}>
              <Text style={styles.leadInfoFieldLabel}>Vehicle</Text>
              <Text style={styles.leadInfoFieldValue}>{displayVehicle}</Text>
            </View>
            <View style={styles.leadInfoField}>
              <Text style={styles.leadInfoFieldLabel}>Passengers</Text>
              <Text style={styles.leadInfoFieldValue}>{displayPax} pax</Text>
            </View>
            <View style={styles.leadInfoField}>
              <Text style={styles.leadInfoFieldLabel}>Created</Text>
              <Text style={styles.leadInfoFieldValue}>{date}</Text>
            </View>
          </View>
        </View>

        {/* ── Trip Route & Schedule Card (only when from trips) ── */}
        {isFromTrip && (
          <View style={styles.detailSectionCard}>
            <View style={styles.detailSectionTitleRow}>
              <Feather name="map" size={14} color="#000000" />
              <Text style={styles.detailSectionTitle}>Trip Route & Schedule</Text>
              {/* Ownership badge */}
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: isOwnFleet ? '#D1FAE5' : '#F3E8FF' }}>
                <Text style={{ fontSize: 9, fontFamily: 'Sora-Bold', color: isOwnFleet ? '#065F46' : '#5B21B6' }}>
                  {isOwnFleet ? 'OWN FLEET' : 'OUTSOURCED'}
                </Text>
              </View>
            </View>

            {/* Route timeline */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View style={{ alignItems: 'center', width: 20, marginTop: 4 }}>
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#000' }} />
                <View style={{ width: 1.5, height: 36, backgroundColor: '#E5E7EB', marginVertical: 3 }} />
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#000' }} />
              </View>
              <View style={{ flex: 1, justifyContent: 'space-between', height: 68 }}>
                <View>
                  <Text style={{ fontSize: 15, fontFamily: 'Sora-Bold', color: '#000' }}>{tripFrom}</Text>
                  <Text style={{ fontSize: 11, fontFamily: 'Sora-Regular', color: '#6B7280' }}>{tripDeparture}</Text>
                </View>
                <View>
                  <Text style={{ fontSize: 15, fontFamily: 'Sora-Bold', color: '#000' }}>{tripTo}</Text>
                  <Text style={{ fontSize: 11, fontFamily: 'Sora-Regular', color: '#6B7280' }}>{tripArrival}</Text>
                </View>
              </View>
            </View>

            {/* Assignment / Vendor details row */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {!isOwnFleet && vendorName ? (
                <>
                  <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#F0F0F0' }}>
                    <Text style={{ fontSize: 10, fontFamily: 'Sora-Regular', color: '#9CA3AF', marginBottom: 2 }}>VENDOR</Text>
                    <Text style={{ fontSize: 13, fontFamily: 'Sora-SemiBold', color: '#111827' }}>{vendorName}</Text>
                  </View>
                  <View style={{ flex: 1, backgroundColor: '#FAFAFA', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#F0F0F0' }}>
                    <Text style={{ fontSize: 10, fontFamily: 'Sora-Regular', color: '#9CA3AF', marginBottom: 2 }}>VEHICLE TYPE</Text>
                    <Text style={{ fontSize: 13, fontFamily: 'Sora-SemiBold', color: '#111827' }}>{vendorVehicleType}</Text>
                  </View>
                </>
              ) : !tripAssigned ? (
                <View style={{ flex: 1, backgroundColor: '#FEF3C7', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#FCD34D', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name="alert-circle" size={14} color="#D97706" />
                  <Text style={{ fontSize: 12, fontFamily: 'Sora-SemiBold', color: '#92400E' }}>Vehicle not yet assigned</Text>
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* ── Follow-up History ── */}
        <View style={styles.detailSectionCard}>
          <View style={styles.detailSectionTitleRow}>
            <Feather name="clock" size={14} color="#000000" />
            <Text style={styles.detailSectionTitle}>Follow-up History</Text>
            <Text style={styles.detailSectionCount}>{followUps.length} recorded</Text>
          </View>
          {followUps.length === 0
            ? <Text style={styles.fuNotesText}>No follow-ups recorded yet.</Text>
            : followUps.map((fu, i) => <FollowUpItem key={fu.id} entry={fu} isLast={i === followUps.length - 1} />)
          }
        </View>

        {/* ── Action Buttons (lead flow) ── */}
        {!isFromTrip && leadStatus !== 'Won' && leadStatus !== 'Lost' && (
          <View style={styles.actionButtonRow}>
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleFollowUp}>
              <Feather name="phone-call" size={16} color="#FFFFFF" />
              <Text style={styles.actionBtnPrimaryText}>Schedule Follow-up</Text>
            </TouchableOpacity>
            <View style={styles.actionBtnRow}>
              <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleMarkCompleted}>
                <Feather name="check-circle" size={15} color="#000000" />
                <Text style={styles.actionBtnSecondaryText}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnGreen} onPress={handleAdvancePayment}>
                <Feather name="credit-card" size={15} color="#065F46" />
                <Text style={styles.actionBtnGreenText}>Advance Paid</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── WhatsApp Button ── */}
        <TouchableOpacity style={styles.whatsappRowBtn} onPress={() => setWhatsappVisible(true)}>
          <FontAwesome5 name="whatsapp" size={18} color="#FFFFFF" />
          <Text style={styles.whatsappRowBtnText}>WhatsApp Customer</Text>
        </TouchableOpacity>

        {/* ── Financial Breakdown ── */}
        {showFinancials && (
          <View style={styles.financialBreakdownCard}>
            <View style={styles.detailSectionTitleRow}>
              <Feather name="bar-chart-2" size={14} color="#000000" />
              <Text style={styles.detailSectionTitle}>Financial Summary</Text>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: isOwnFleet ? '#D1FAE5' : '#F3E8FF' }}>
                <Text style={{ fontSize: 9, fontFamily: 'Sora-Bold', color: isOwnFleet ? '#065F46' : '#5B21B6' }}>
                  {isOwnFleet ? 'OWN FLEET' : 'OUTSOURCED'}
                </Text>
              </View>
            </View>

            {tripStatus === 'Cancelled' ? (
              <View style={styles.finRow}>
                <Text style={styles.finLabel}>Trip was cancelled — No revenue</Text>
                <Text style={[styles.finValue, styles.finValueNeg]}>₹0</Text>
              </View>
            ) : isOwnFleet ? (
              <>
                <View style={styles.finRow}><Text style={styles.finLabel}>Trip Revenue</Text><Text style={styles.finValue}>₹{revenue.toLocaleString('en-IN')}</Text></View>
                <View style={styles.finRow}><Text style={styles.finLabel}>Petrol / Fuel</Text><Text style={[styles.finValue, styles.finValueNeg]}>-₹{petrolCost.toLocaleString('en-IN')}</Text></View>
                <View style={styles.finRow}><Text style={styles.finLabel}>Driver Charges</Text><Text style={[styles.finValue, styles.finValueNeg]}>-₹{driverPay.toLocaleString('en-IN')}</Text></View>
                {/* Toll & Misc shown as estimated if from trip source */}
                {!isFromTrip && <>
                  <View style={styles.finRow}><Text style={styles.finLabel}>Toll Charges</Text><Text style={[styles.finValue, styles.finValueNeg]}>-₹1,800</Text></View>
                  <View style={[styles.finRow, styles.finRowLast]}><Text style={styles.finLabel}>Miscellaneous</Text><Text style={[styles.finValue, styles.finValueNeg]}>-₹600</Text></View>
                </>}
                <View style={styles.finDivider} />
                <View style={styles.finProfitRow}>
                  <Text style={styles.finProfitLabel}>Net Profit</Text>
                  <Text style={[styles.finProfitValue, netProfit < 0 && styles.finProfitNeg]}>₹{netProfit.toLocaleString('en-IN')}</Text>
                </View>
              </>
            ) : (
              <>
                {vendorName ? <View style={styles.finRow}><Text style={styles.finLabel}>Vendor Partner</Text><Text style={styles.finValue}>{vendorName}</Text></View> : null}
                <View style={styles.finRow}><Text style={styles.finLabel}>Amount Received from Customer</Text><Text style={styles.finValue}>₹{revenue.toLocaleString('en-IN')}</Text></View>
                <View style={[styles.finRow, styles.finRowLast]}><Text style={styles.finLabel}>Amount Paid to Vendor</Text><Text style={[styles.finValue, styles.finValueNeg]}>-₹{vendorCostAmt.toLocaleString('en-IN')}</Text></View>
                <View style={styles.finDivider} />
                <View style={styles.finProfitRow}>
                  <Text style={styles.finProfitLabel}>Net Commission</Text>
                  <Text style={[styles.finProfitValue, netProfit < 0 && styles.finProfitNeg]}>₹{netProfit.toLocaleString('en-IN')}</Text>
                </View>
              </>
            )}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── WhatsApp Action Sheet ── */}
      <Modal visible={whatsappVisible} transparent animationType="slide" onRequestClose={() => setWhatsappVisible(false)}>
        <TouchableOpacity style={styles.waSheetOverlay} activeOpacity={1} onPress={() => setWhatsappVisible(false)}>
          <View style={styles.waSheet}>
            <View style={styles.waSheetHandle} />
            <Text style={styles.waSheetTitle}>Send via WhatsApp</Text>
            {[
              { key: 'advance', icon: 'credit-card', bg: '#ECFDF5', color: '#10B981', title: 'Advance Payment Receipt', sub: 'Share advance amount & confirmation details' },
              { key: 'followup', icon: 'message-circle', bg: '#EFF6FF', color: '#3B82F6', title: 'Follow-up Message', sub: 'Send a polite reminder or status update' },
              { key: 'vehicle', icon: 'truck', bg: '#FEF3C7', color: '#D97706', title: 'Vehicle Assignment Details', sub: 'Share driver and vehicle information' },
            ].map((item, i, arr) => (
              <TouchableOpacity
                key={item.key}
                style={[styles.waSheetItem, i === arr.length - 1 && styles.waSheetItemLast]}
                onPress={() => sendWhatsApp(item.key as any)}
              >
                <View style={[styles.waSheetItemIcon, { backgroundColor: item.bg }]}>
                  <Feather name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.waSheetItemTitle}>{item.title}</Text>
                  <Text style={styles.waSheetItemSub}>{item.sub}</Text>
                </View>
                <Feather name="chevron-right" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
