import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  TextInput,
  Modal,
  Image,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { leadsStyle as styles } from '@/styles/leadsStyle';
import { CalendarSelector } from '@/components/CalendarSelector';

// ─── Status Filter List ───────────────────────────────────────────────────────
const STATUSES = ['All', 'New', 'In Progress', 'Qualified', 'Won', 'Lost'] as const;
type Status = (typeof STATUSES)[number];

// Helper to format date key (YYYY-MM-DD)
const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper to determine if two dates belong to the same week (week starts on Monday)
const isSameWeek = (d1: Date, d2: Date) => {
  const getWeekStart = (date: Date) => {
    const temp = new Date(date);
    const day = temp.getDay();
    const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
    const start = new Date(temp);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };
  return formatDateKey(getWeekStart(d1)) === formatDateKey(getWeekStart(d2));
};

// ─── Mock Data Generation ─────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Lead {
  id: string;
  name: string;
  route: string;
  vehicle: string;
  pax: number;
  date: Date;
  status: Exclude<Status, 'All'>;
  value: number;
}

interface FollowUp {
  id: string;
  client: string;
  notes: string;
  time: string;
  date: Date;
  type: 'Call' | 'Email';
  attempt: number;
}

const generateMockPools = () => {
  const refDate = new Date();
  
  const clientNames = [
    'Rahul Sharma', 'Priya Mehta', 'Vikram Singh', 'Anjali Rao', 'Suresh Kumar',
    'Metropolitan Logistics Co.', 'Apex Freight Solutions', 'Titan Distribution',
    'Velocity Supply', 'Global Forwarding', 'Swift Intermodal', 'Barakah Logistics',
    'Neha Gupta', 'Amit Patel', 'Sunita Reddy', 'Rohan Das', 'Deepa Nair',
    'Manish Malhotra', 'Aarav Singhal', 'Siddharth Roy', 'Ishaan Sharma',
    'Aditi Verma', 'Riya Kapoor', 'Kunal Sen', 'Pooja Bhatia', 'Yash Wardhan'
  ];

  const routes = [
    'Delhi → Manali', 'Mumbai → Lonavala', 'Pune → Shirdi', 'Bangalore → Coorg', 'Chennai → Ooty',
    'Chicago → Denver', 'Austin → Seattle', 'Miami → New York', 'Phoenix → Las Vegas', 'Kolkata → Mandarmani',
    'Hyderabad → Vizag', 'Ahmedabad → Udaipur', 'Chandigarh → Shimla', 'Jaipur → Jaisalmer', 'Kochi → Munnar'
  ];

  const vehicles = ['Innova', 'Tempo Traveller', 'Coach Bus', 'Sedan', 'SUV', 'Mini Bus', 'Container Truck'];
  const statuses: Exclude<Status, 'All'>[] = ['New', 'In Progress', 'Qualified', 'Won', 'Lost'];

  let seed = 54321;
  const random = () => {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  const randomItem = <T,>(arr: T[]): T => arr[Math.floor(random() * arr.length)];

  // 1. Generate Leads (150 leads distributed across current period)
  const leadsList: Lead[] = [];
  for (let i = 0; i < 150; i++) {
    const client = randomItem(clientNames);
    const route = randomItem(routes);
    const vehicle = randomItem(vehicles);
    const pax = Math.floor(random() * 45) + 4;
    
    // Day offsets relative to today
    let dayOffset = 0;
    if (i < 25) {
      dayOffset = 0; // Today
    } else if (i < 50) {
      dayOffset = -1; // Yesterday
    } else if (i < 95) {
      dayOffset = Math.floor(random() * 10) - 5; // -5 to +4
      if (dayOffset === 0) dayOffset = -2;
      if (dayOffset === -1) dayOffset = 2;
    } else {
      dayOffset = -Math.floor(random() * 30) - 6; // -6 to -36 days
    }

    const leadDate = new Date(refDate);
    leadDate.setDate(refDate.getDate() + dayOffset);
    leadDate.setHours(9 + Math.floor(random() * 9), Math.floor(random() * 4) * 15, 0, 0);

    // Status distribution
    let status: Exclude<Status, 'All'> = 'New';
    if (dayOffset < 0) {
      const r = random();
      if (r < 0.45) status = 'Won';
      else if (r < 0.7) status = 'In Progress';
      else if (r < 0.85) status = 'Lost';
      else if (r < 0.95) status = 'Qualified';
      else status = 'New';
    } else if (dayOffset === 0) {
      const r = random();
      if (r < 0.3) status = 'New';
      else if (r < 0.65) status = 'In Progress';
      else if (r < 0.85) status = 'Qualified';
      else status = 'Won';
    } else {
      status = random() < 0.6 ? 'New' : 'Qualified';
    }

    leadsList.push({
      id: `LEAD-${1000 + i}`,
      name: client,
      route,
      vehicle,
      pax,
      date: leadDate,
      status,
      value: Math.floor(random() * 90000) + 10000,
    });
  }

  // 2. Generate Follow-ups
  const followUpsList: FollowUp[] = [];
  const followUpNotes = [
    'Awaiting initial route quote',
    'Contract renewal proposal',
    'Follow up on transport budget',
    'Check availability for premium SUV booking',
    'Clarify driver meals allowance and night halt charges',
    'Verify toll charges calculations',
    'Send customized itinerary proposal',
    'Confirm passenger count and bag sizes',
    'Finalize advance payment terms',
    'Discuss corporate account onboarding discounts'
  ];

  for (let i = 0; i < 30; i++) {
    const client = randomItem(clientNames);
    const notes = randomItem(followUpNotes);
    const type: 'Call' | 'Email' = random() < 0.6 ? 'Call' : 'Email';

    let dayOffset = 0;
    if (i < 8) {
      dayOffset = 0; // Today
    } else if (i < 15) {
      dayOffset = -1; // Yesterday
    } else if (i < 22) {
      dayOffset = 1; // Tomorrow
    } else {
      dayOffset = Math.floor(random() * 10) - 5; // -5 to +4
    }

    const fuDate = new Date(refDate);
    fuDate.setDate(refDate.getDate() + dayOffset);
    fuDate.setHours(9 + Math.floor(random() * 8), Math.floor(random() * 4) * 15, 0, 0);

    let timeStr = '';
    const hour = fuDate.getHours();
    const minStr = String(fuDate.getMinutes()).padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    if (dayOffset === 0) {
      timeStr = `Today, ${hour12}:${minStr} ${ampm}`;
    } else if (dayOffset === -1) {
      timeStr = `Yesterday, ${hour12}:${minStr} ${ampm}`;
    } else if (dayOffset === 1) {
      timeStr = `Tomorrow, ${hour12}:${minStr} ${ampm}`;
    } else {
      const formattedDate = `${MONTHS_SHORT[fuDate.getMonth()]} ${fuDate.getDate()}`;
      timeStr = `${formattedDate}, ${hour12}:${minStr} ${ampm}`;
    }

    followUpsList.push({
      id: `FU-${2000 + i}`,
      client,
      notes,
      time: timeStr,
      date: fuDate,
      type,
      attempt: Math.floor(random() * 3) + 1,
    });
  }

  // Sort by date descending
  leadsList.sort((a, b) => b.date.getTime() - a.date.getTime());
  followUpsList.sort((a, b) => b.date.getTime() - a.date.getTime());

  return { leadsList, followUpsList };
};

// Instantiate stable mock pools
const { leadsList: LEADS_POOL, followUpsList: FOLLOWUPS_POOL } = generateMockPools();

// ─── Component ────────────────────────────────────────────────────────────────

export default function LeadsScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [activeFilter, setActiveFilter] = useState<Status>('All');
  
  // Stateful collections to support dynamic mutations (saving leads)
  const [leads, setLeads] = useState<Lead[]>(() => LEADS_POOL);
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => FOLLOWUPS_POOL);

  // Sync leads/follow-ups created in the standalone screen
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'lead-created',
      ({ newLead, newFollowUp }: { newLead: Lead; newFollowUp: FollowUp | null }) => {
        setLeads((prev) => [newLead, ...prev]);
        if (newFollowUp) {
          setFollowUps((prev) => [newFollowUp, ...prev]);
        }
      }
    );
    return () => sub.remove();
  }, []);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination limits
  const [visibleFollowUps, setVisibleFollowUps] = useState<number>(2);
  const [visibleLeads, setVisibleLeads] = useState<number>(10);

  // Modal Visibility for New Lead
  const [isNewLeadVisible, setIsNewLeadVisible] = useState(false);

  // New Lead Form States
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

  // Reset pagination when date or timeframe changes
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setVisibleFollowUps(2);
    setVisibleLeads(10);
  };

  const handleTimeframeChange = (tf: 'day' | 'week' | 'month' | 'year') => {
    setSelectedTimeframe(tf);
    setVisibleFollowUps(2);
    setVisibleLeads(10);
  };

  // Build lead counts map (YYYY-MM-DD -> Count) for weekly calendar selector
  const leadCountsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((lead) => {
      const key = formatDateKey(lead.date);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [leads]);

  // Filter pools by Timeframe & Status
  const { filteredLeadsForTimeframe, filteredLeads, filteredFollowUps } = useMemo(() => {
    // 1. Timeframe filtering
    let timeLeads = leads;
    let timeFollowUps = followUps;

    if (selectedTimeframe === 'day') {
      timeLeads = leads.filter((l) => formatDateKey(l.date) === formatDateKey(selectedDate));
      timeFollowUps = followUps.filter((f) => formatDateKey(f.date) === formatDateKey(selectedDate));
    } else if (selectedTimeframe === 'week') {
      timeLeads = leads.filter((l) => isSameWeek(l.date, selectedDate));
      timeFollowUps = followUps.filter((f) => isSameWeek(f.date, selectedDate));
    } else if (selectedTimeframe === 'month') {
      timeLeads = leads.filter(
        (l) => l.date.getMonth() === selectedDate.getMonth() && l.date.getFullYear() === selectedDate.getFullYear()
      );
      timeFollowUps = followUps.filter(
        (f) => f.date.getMonth() === selectedDate.getMonth() && f.date.getFullYear() === selectedDate.getFullYear()
      );
    } else if (selectedTimeframe === 'year') {
      timeLeads = leads.filter((l) => l.date.getFullYear() === selectedDate.getFullYear());
      timeFollowUps = followUps.filter((f) => f.date.getFullYear() === selectedDate.getFullYear());
    }

    // 2. Status filtering (only affects active leads list, not summary cards or follow-ups)
    const statusLeads = activeFilter === 'All'
      ? timeLeads
      : timeLeads.filter((l) => l.status === activeFilter);

    return {
      filteredLeadsForTimeframe: timeLeads,
      filteredLeads: statusLeads,
      filteredFollowUps: timeFollowUps,
    };
  }, [leads, followUps, selectedDate, selectedTimeframe, activeFilter]);

  // Apply Search Query to filtered results
  const searchedLeads = useMemo(() => {
    if (!searchQuery.trim()) return filteredLeads;
    const query = searchQuery.toLowerCase();
    return filteredLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.route.toLowerCase().includes(query) ||
        lead.vehicle.toLowerCase().includes(query) ||
        lead.status.toLowerCase().includes(query)
    );
  }, [filteredLeads, searchQuery]);

  const searchedFollowUps = useMemo(() => {
    if (!searchQuery.trim()) return filteredFollowUps;
    const query = searchQuery.toLowerCase();
    return filteredFollowUps.filter(
      (item) =>
        item.client.toLowerCase().includes(query) ||
        item.notes.toLowerCase().includes(query)
    );
  }, [filteredFollowUps, searchQuery]);

  // Compute metrics from timeframe-filtered leads
  const metrics = useMemo(() => {
    const total = filteredLeadsForTimeframe.length;
    const won = filteredLeadsForTimeframe.filter((l) => l.status === 'Won').length;
    const lost = filteredLeadsForTimeframe.filter((l) => l.status === 'Lost').length;
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;

    return { total, won, lost, rate };
  }, [filteredLeadsForTimeframe]);

  // Format active period display title
  const activePeriodTitle = useMemo(() => {
    if (selectedTimeframe === 'day') {
      return `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    } else if (selectedTimeframe === 'week') {
      // Find start and end of week
      const day = selectedDate.getDay();
      const diff = selectedDate.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(selectedDate);
      start.setDate(diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);

      return `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()} - ${MONTHS_SHORT[end.getMonth()]} ${end.getDate()}, ${selectedDate.getFullYear()}`;
    } else if (selectedTimeframe === 'month') {
      return `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    } else {
      return `${selectedDate.getFullYear()}`;
    }
  }, [selectedDate, selectedTimeframe]);

  const handleSaveLead = () => {
    if (!customerName.trim() || !pickupPoint.trim() || !dropPoint.trim()) {
      Alert.alert('Missing Details', 'Please enter customer name, pickup and drop points to create a lead.');
      return;
    }

    // Create a new Lead object
    const newLeadId = `LEAD-${1000 + leads.length + 1}`;
    const newLead: Lead = {
      id: newLeadId,
      name: customerName.trim(),
      route: `${pickupPoint.trim()} → ${dropPoint.trim()}`,
      vehicle: vehicleType,
      pax: 4,
      date: new Date(),
      status: 'New',
      value: parseFloat(quotedAmount) || 0,
    };

    // If schedule details are provided, make a follow-up action automatically
    if (pickupDate.trim()) {
      const newFUId = `FU-${2000 + followUps.length + 1}`;
      const newFollowUp: FollowUp = {
        id: newFUId,
        client: customerName.trim(),
        notes: `Pickup scheduled at ${pickupDate.trim()}. Special notes: ${specialInstructions || 'None'}`,
        time: 'Today, 9:00 AM',
        date: new Date(),
        type: 'Call',
        attempt: 1,
      };
      setFollowUps(prev => [newFollowUp, ...prev]);
    }

    setLeads(prev => [newLead, ...prev]);

    // Reset Form fields
    setCustomerName('');
    setMobileNumber('');
    setBookingSource('');
    setPickupPoint('');
    setDropPoint('');
    setPickupDate('');
    setDropDate('');
    setQuotedAmount('');
    setVehicleType('Truck');
    setTollCharges(false);
    setParkingFees(false);
    setSpecialInstructions('');

    setIsNewLeadVisible(false);
    Alert.alert('Lead Created', `Lead for ${customerName.trim()} has been saved successfully!`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* ── AppBar Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/leads/new' as any)}>
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color="#6B6B6B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search leads, routes, or status..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Feather name="x-circle" size={16} color="#6B6B6B" />
            </Pressable>
          )}
        </View>

        {/* ── Reusable Calendar Selector (Timeframe at top) ── */}
        <CalendarSelector
          selectedDate={selectedDate}
          onSelectDate={handleDateChange}
          selectedTimeframe={selectedTimeframe}
          onSelectTimeframe={handleTimeframeChange}
          leadCounts={leadCountsMap}
        />

        {/* ── Dynamic Metric Cards ── */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricsRow}>
            <ModernMetricCard
              title="Total Leads"
              value={metrics.total.toLocaleString()}
              trend="+12%"
              trendType="positive"
            />
            <ModernMetricCard
              title="Conv. Rate"
              value={`${metrics.rate}%`}
              trend={metrics.rate > 10 ? 'Stable' : '-2%'}
              trendType={metrics.rate > 10 ? 'neutral' : 'negative'}
            />
          </View>
          <View style={styles.metricsRow}>
            <ModernMetricCard
              title="Won Leads"
              value={metrics.won.toLocaleString()}
              trend="+5%"
              trendType="positive"
            />
            <ModernMetricCard
              title="Lost Leads"
              value={metrics.lost.toLocaleString()}
              trend="-2%"
              trendType="negative"
            />
          </View>
        </View>

        {/* ── Priority Follow-ups ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Priority Follow-ups</Text>
            <TouchableOpacity onPress={() => setVisibleFollowUps((prev) => prev + 5)}>
              <Text style={styles.viewAllBtn}>View All</Text>
            </TouchableOpacity>
          </View>

          {searchedFollowUps.length === 0 ? (
            <Text style={styles.loadMoreEndText}>No follow-ups for this period.</Text>
          ) : (
            <View style={styles.followUpList}>
              {searchedFollowUps.slice(0, visibleFollowUps).map((item) => (
                <View key={item.id} style={styles.followUpCard}>
                  <View style={styles.followUpIconContainer}>
                    <Feather
                      name={item.type === 'Call' ? 'phone' : 'mail'}
                      size={18}
                      color="#6B6B6B"
                    />
                  </View>
                  <View style={styles.followUpDetails}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                      <Text style={[styles.followUpName, { flexShrink: 1 }]} numberOfLines={1}>
                        {item.client}
                      </Text>
                      <View
                        style={[
                          styles.attemptBadge,
                          {
                            backgroundColor:
                              item.attempt === 1
                                ? '#E0F2FE' // light blue
                                : item.attempt === 2
                                ? '#FEF3C7' // light amber
                                : '#FEE2E2', // light red
                          },
                        ]}>
                        <Text
                          style={[
                            styles.attemptBadgeText,
                            {
                              color:
                                item.attempt === 1
                                  ? '#0369A1'
                                  : item.attempt === 2
                                  ? '#B45309'
                                  : '#B91C1C',
                            },
                          ]}>
                          {item.attempt === 1 ? '1st' : item.attempt === 2 ? '2nd' : '3rd+'} Follow-up
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.followUpNotes} numberOfLines={1}>
                      {item.notes}
                    </Text>
                  </View>
                  <View style={styles.followUpTimeCol}>
                    <Text style={styles.followUpTimeText}>{item.time}</Text>
                    <Text style={styles.followUpTypeText}>
                      {item.type === 'Call' ? 'Follow up Call' : 'Send Email'}
                    </Text>
                  </View>
                </View>
              ))}

              {searchedFollowUps.length > visibleFollowUps ? (
                <Pressable
                  style={styles.loadMoreBtn}
                  onPress={() => setVisibleFollowUps((prev) => prev + 4)}>
                  <Text style={styles.loadMoreText}>Load More Follow-ups</Text>
                  <Feather name="chevron-down" size={14} color="#000" />
                </Pressable>
              ) : (
                searchedFollowUps.length > 2 && (
                  <Text style={styles.loadMoreEndText}>Showing all follow-ups</Text>
                )
              )}
            </View>
          )}
        </View>

        {/* ── Leads List with Selection Period Banner ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Leads for Selected Period</Text>
          </View>

          <View style={styles.periodSummaryCard}>
            <View style={styles.periodSummaryLeft}>
              <Text style={styles.periodSummaryLabel}>PERIOD SUMMARY</Text>
              <Text style={styles.periodSummaryTitle}>{activePeriodTitle}</Text>
            </View>
            <View style={styles.periodSummaryRight}>
              <Text style={styles.periodSummaryCount}>{searchedLeads.length} Leads</Text>
              <Text style={styles.periodSummarySub}>
                Filtered from {selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)} View
              </Text>
            </View>
          </View>

          {/* Status Filter Chips Inside the list area */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.filterRow, { paddingHorizontal: 0 }]}>
            {STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => {
                  setActiveFilter(s);
                  setVisibleLeads(10); // Reset page limits when changing status filter
                }}
                style={[styles.chip, activeFilter === s && styles.chipActive]}>
                <Text style={[styles.chipText, activeFilter === s && styles.chipTextActive]}>
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Leads Modern Table List */}
          {searchedLeads.length === 0 ? (
            <Text style={styles.loadMoreEndText}>No leads found matching filters.</Text>
          ) : (
            <View>
              <View style={styles.tableCard}>
                {/* Table Header Row */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, styles.clientRouteCol]}>CLIENT / ROUTE</Text>
                  <Text style={[styles.tableHeaderCell, styles.statusCol]}>STATUS</Text>
                  <Text style={[styles.tableHeaderCell, styles.actionCol]}>ACTION</Text>
                </View>

                {/* Table Data Rows */}
                {searchedLeads.slice(0, visibleLeads).map((lead, idx, arr) => (
                  <TouchableOpacity
                    key={lead.id}
                    activeOpacity={0.7}
                    style={[
                      styles.tableRow,
                      idx === arr.length - 1 && styles.tableRowLast,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: '/leads/[id]' as any,
                        params: {
                          id: lead.id,
                          name: lead.name,
                          route: lead.route,
                          vehicle: lead.vehicle,
                          pax: lead.pax.toString(),
                          status: lead.status,
                          value: lead.value.toString(),
                          date: lead.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        },
                      })
                    }
                  >
                    {/* Client / Route column */}
                    <View style={styles.clientRouteCol}>
                      <Text style={styles.clientName}>{lead.name}</Text>
                      <View style={styles.routeRow}>
                        <Feather name="map-pin" size={10} color="#8E8E93" />
                        <Text style={styles.routeText}>{lead.route}</Text>
                      </View>
                    </View>

                    {/* Status badge column */}
                    <View style={styles.statusCol}>
                      <StatusBadge status={lead.status} />
                    </View>

                    {/* Actions column - chevron indicates tappable */}
                    <View style={styles.actionCol}>
                      <Feather name="chevron-right" size={16} color="#8E8E93" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Load More Leads pagination */}
              {searchedLeads.length > visibleLeads ? (
                <Pressable
                  style={styles.loadMoreBtn}
                  onPress={() => setVisibleLeads((prev) => prev + 15)}>
                  <Text style={styles.loadMoreText}>
                    Load More Leads ({searchedLeads.length - visibleLeads} remaining)
                  </Text>
                  <Feather name="chevron-down" size={14} color="#000" />
                </Pressable>
              ) : (
                searchedLeads.length > 10 && (
                  <Text style={styles.loadMoreEndText}>Showing all {searchedLeads.length} leads</Text>
                )
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── New Lead Modal / Full Screen Form ── */}
      <Modal
        animationType="slide"
        visible={isNewLeadVisible}
        onRequestClose={() => setIsNewLeadVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom', 'left', 'right']}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsNewLeadVisible(false)} style={styles.modalBackBtn}>
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
                  <TextInput
                    style={styles.inputFieldWithIcon}
                    placeholder="mm/dd/yyyy, --:--"
                    placeholderTextColor="#9CA3AF"
                    value={pickupDate}
                    onChangeText={setPickupDate}
                  />
                  <Feather name="calendar" size={15} color="#6B6B6B" />
                </View>
              </View>

              <View style={styles.inputGroupLast}>
                <Text style={styles.inputLabel}>Drop Date & Time</Text>
                <View style={styles.inputFieldIconRow}>
                  <TextInput
                    style={styles.inputFieldWithIcon}
                    placeholder="mm/dd/yyyy, --:--"
                    placeholderTextColor="#9CA3AF"
                    value={dropDate}
                    onChangeText={setDropDate}
                  />
                  <Feather name="calendar" size={15} color="#6B6B6B" />
                </View>
              </View>
            </View>

            {/* Card 4: Financials */}
            <View style={styles.formCard}>
              <View style={styles.formCardTitleRow}>
                <Feather name="dollar-sign" size={15} color="#000000" />
                <Text style={styles.formCardTitle}>Financials</Text>
              </View>

              <View style={styles.inputGroupLast}>
                <Text style={styles.inputLabel}>Quoted Amount ($)</Text>
                <View style={styles.inputFieldIconRow}>
                  <Text style={{ fontSize: 13, fontFamily: 'Sora-Regular', color: '#6B6B6B', marginRight: 6 }}>$</Text>
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
            </View>

            {/* Card 5: Required Vehicle */}
            <View style={styles.formCard}>
              <View style={styles.formCardTitleRow}>
                <Feather name="truck" size={15} color="#000000" />
                <Text style={styles.formCardTitle}>Required Vehicle</Text>
              </View>

              <View style={styles.vehicleChipsRow}>
                {['Truck', 'Van', 'Flatbed', 'Reefer'].map((vType) => {
                  const isActive = vehicleType === vType;
                  return (
                    <TouchableOpacity
                      key={vType}
                      style={[styles.vehicleChip, isActive && styles.vehicleChipActive]}
                      onPress={() => setVehicleType(vType)}
                    >
                      <Feather
                        name={vType === 'Truck' ? 'truck' : vType === 'Van' ? 'compass' : 'layers'}
                        size={12}
                        color={isActive ? '#FFFFFF' : '#6B6B6B'}
                      />
                      <Text style={[styles.vehicleChipText, isActive && styles.vehicleChipTextActive]}>
                        {vType}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Card 6: Inclusions */}
            <View style={styles.formCard}>
              <View style={styles.formCardTitleRow}>
                <Feather name="plus-circle" size={15} color="#000000" />
                <Text style={styles.formCardTitle}>Inclusions</Text>
              </View>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setTollCharges(!tollCharges)}
              >
                <View style={[styles.checkboxBox, tollCharges && styles.checkboxBoxChecked]}>
                  {tollCharges && <Feather name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Toll / Permit Charges</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setParkingFees(!parkingFees)}
              >
                <View style={[styles.checkboxBox, parkingFees && styles.checkboxBoxChecked]}>
                  {parkingFees && <Feather name="check" size={12} color="#FFFFFF" />}
                </View>
                <Text style={styles.checkboxLabel}>Parking Fees</Text>
              </TouchableOpacity>
            </View>

            {/* Card 7: Special Instructions (Optional) */}
            <View style={styles.formCard}>
              <View style={styles.formCardTitleRow}>
                <Feather name="edit" size={15} color="#000000" />
                <Text style={styles.formCardTitle}>Special Instructions (Optional)</Text>
              </View>

              <TextInput
                style={[styles.inputField, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Handling instructions, dock codes, etc."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity style={styles.saveLeadButton} onPress={handleSaveLead}>
              <Text style={styles.saveLeadText}>Save Lead</Text>
            </TouchableOpacity>

          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'positive' | 'negative' | 'neutral';
}

function ModernMetricCard({ title, value, trend, trendType }: MetricCardProps) {
  const getTrendStyle = () => {
    if (trendType === 'positive') return styles.trendTextPos;
    if (trendType === 'negative') return styles.trendTextNeg;
    return styles.trendTextNeu;
  };

  const getTrendIcon = () => {
    if (trendType === 'positive') return <Feather name="arrow-up-right" size={11} color="#10B981" />;
    if (trendType === 'negative') return <Feather name="arrow-down-left" size={11} color="#EF4444" />;
    return <Feather name="minus" size={11} color="#F59E0B" />;
  };

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.metricTrendRow}>
        {getTrendIcon()}
        <Text style={[styles.trendText, getTrendStyle()]}>{trend}</Text>
      </View>
    </View>
  );
}

function StatusBadge({ status }: { status: Exclude<Status, 'All'> }) {
  const map: Record<Exclude<Status, 'All'>, { bg: string; color: string }> = {
    New: { bg: '#F1F5F9', color: '#475569' },
    'In Progress': { bg: '#E0E7FF', color: '#4338CA' },
    Qualified: { bg: '#F5F5F7', color: '#17171C' },
    Won: { bg: '#D1FAE5', color: '#065F46' },
    Lost: { bg: '#FEE2E2', color: '#991B1B' },
  };
  const { bg, color } = map[status] || { bg: '#F3F4F6', color: '#1F2937' };
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{status.toUpperCase()}</Text>
    </View>
  );
}
