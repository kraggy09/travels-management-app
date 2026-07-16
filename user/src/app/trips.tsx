import React, { useState, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CalendarSelector } from '@/components/CalendarSelector';
import { tripsStyle as styles } from '@/styles/tripsStyle';

// ─── Interfaces ──────────────────────────────────────────────────────────────

interface Trip {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  date: Date;
  vehicle: string;
  pax: number;
  status: 'Confirmed' | 'In Transit' | 'Completed' | 'Cancelled';
  ownership: 'personal' | 'vendor';
  assigned: boolean;
  vendorName?: string;
  vendorVehicle?: string;
  
  // Financials for Personal Vehicle
  petrolCost?: number;
  driverPay?: number;
  
  // Financials for Vendor Vehicle
  vendorCost?: number;
  
  // Fare details
  tripAmount: number;
}

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ─── Mock Data Generator ─────────────────────────────────────────────────────

const generateMockTripsPool = (): Trip[] => {
  const refDate = new Date();
  const trips: Trip[] = [];
  
  const cities = [
    'Delhi', 'Manali', 'Mumbai', 'Goa', 'Pune', 'Shirdi', 'Bangalore', 'Coorg',
    'Jaipur', 'Agra', 'Chandigarh', 'Shimla', 'Udaipur', 'Ahmedabad'
  ];
  
  const personalVehicles = [
    'Innova Crysta (Own)', 'Tempo Traveller (Own)', 'Ertiga (Own)', 'XUV700 (Own)'
  ];
  
  const vendorVehicles = [
    { name: 'Sardar Travels', vehicle: 'Bus' },
    { name: 'HP Travels', vehicle: 'Bus' },
    { name: 'Sharma Cabs', vehicle: 'Dzire' },
    { name: 'Karan Travels', vehicle: 'Etios' },
    { name: 'Ravi Cabs', vehicle: 'Scorpio' }
  ];
  
  // Standard deterministic pseudo-random generator
  let seed = 88;
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
  
  const randomItem = <T,>(arr: T[]): T => arr[Math.floor(random() * arr.length)];
  
  for (let i = 0; i < 150; i++) {
    const from = randomItem(cities);
    let to = randomItem(cities);
    while (to === from) {
      to = randomItem(cities);
    }
    
    const ownership = random() < 0.5 ? 'personal' : 'vendor';
    
    let assigned = true;
    let vehicle = '';
    let vendorName: string | undefined;
    let vendorVehicle: string | undefined;
    
    if (ownership === 'personal') {
      vehicle = randomItem(personalVehicles);
      assigned = true;
    } else {
      // 20% of outsourced trips are unassigned
      if (random() < 0.2) {
        assigned = false;
        vehicle = 'Unassigned';
      } else {
        const vInfo = randomItem(vendorVehicles);
        vendorName = vInfo.name;
        vendorVehicle = vInfo.vehicle;
        vehicle = `${vInfo.name} ${vInfo.vehicle}`;
        assigned = true;
      }
    }
    
    // Distribute dates: some today, some past, some future
    let dayOffset = 0;
    if (i < 15) {
      dayOffset = 0; // Today
    } else if (i < 50) {
      dayOffset = Math.floor(random() * 15) - 15; // Past 15 days
    } else if (i < 80) {
      dayOffset = Math.floor(random() * 15) + 1;  // Upcoming 15 days
    } else {
      dayOffset = Math.floor(random() * 90) - 45; // -45 to +44 days
    }
    
    const tripDate = new Date(refDate);
    tripDate.setDate(refDate.getDate() + dayOffset);
    tripDate.setHours(6 + Math.floor(random() * 12), Math.floor(random() * 4) * 15, 0, 0);
    
    let status: Trip['status'] = 'Completed';
    if (dayOffset > 0) {
      status = random() < 0.1 ? 'Cancelled' : 'Confirmed';
    } else if (dayOffset === 0) {
      status = random() < 0.5 ? 'In Transit' : 'Confirmed';
    } else {
      status = random() < 0.06 ? 'Cancelled' : 'Completed';
    }
    
    const tripAmount = Math.floor(random() * 50000) + 6000;
    let petrolCost: number | undefined;
    let driverPay: number | undefined;
    let vendorCost: number | undefined;
    
    if (ownership === 'personal') {
      petrolCost = Math.round(tripAmount * (0.22 + random() * 0.08)); // 22-30% fuel
      driverPay = Math.round(tripAmount * (0.10 + random() * 0.06));  // 10-16% driver
    } else if (assigned) {
      vendorCost = Math.round(tripAmount * (0.72 + random() * 0.12)); // 72-84% vendor cost
    }
    
    // Format departure and arrival dates
    const hour = tripDate.getHours();
    const minStr = String(tripDate.getMinutes()).padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const dateStr = tripDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const departure = `${dateStr}, ${hour12}:${minStr} ${ampm}`;
    
    const arrDate = new Date(tripDate);
    arrDate.setHours(arrDate.getHours() + 4 + Math.floor(random() * 8));
    const arrHour = arrDate.getHours();
    const arrMinStr = String(arrDate.getMinutes()).padStart(2, '0');
    const arrAmpm = arrHour >= 12 ? 'PM' : 'AM';
    const arrHour12 = arrHour % 12 || 12;
    const arrDateStr = arrDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const arrival = `${arrDateStr}, ${arrHour12}:${arrMinStr} ${arrAmpm}`;
    
    trips.push({
      id: `TRIP-${3000 + i}`,
      from,
      to,
      departure,
      arrival,
      date: tripDate,
      vehicle,
      pax: Math.floor(random() * 36) + 4,
      status,
      ownership,
      assigned,
      vendorName,
      vendorVehicle,
      tripAmount,
      petrolCost,
      driverPay,
      vendorCost
    });
  }
  
  // Sort descending by trip date
  trips.sort((a, b) => b.date.getTime() - a.date.getTime());
  return trips;
};

const TRIPS_POOL = generateMockTripsPool();

// ─── Sub-Component: Metric Card ──────────────────────────────────────────────

interface ModernMetricCardProps {
  title: string;
  value: string;
  detailText: string;
  detailType: 'positive' | 'negative' | 'neutral';
}

function ModernMetricCard({ title, value, detailText, detailType }: ModernMetricCardProps) {
  const getDetailStyle = () => {
    if (detailType === 'positive') return [styles.detailText, styles.detailTextPos];
    if (detailType === 'negative') return [styles.detailText, styles.detailTextNeg];
    return [styles.detailText, styles.detailTextNeu];
  };

  const getIcon = () => {
    if (detailType === 'positive') return <Feather name="arrow-up-right" size={11} color="#22C55E" />;
    if (detailType === 'negative') return <Feather name="arrow-down-left" size={11} color="#EF4444" />;
    return <Feather name="minus" size={11} color="#F59E0B" />;
  };

  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <View style={styles.metricDetailRow}>
        {getIcon()}
        <Text style={getDetailStyle()}>{detailText}</Text>
      </View>
    </View>
  );
}

// ─── Sub-Component: Status Badge ─────────────────────────────────────────────

function StatusBadge({ status }: { status: Trip['status'] }) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Completed':
        return { bg: '#D1FAE5', color: '#065F46' };
      case 'In Transit':
        return { bg: '#DBEAFE', color: '#1E40AF' };
      case 'Confirmed':
        return { bg: '#111827', color: '#FFFFFF' };
      case 'Cancelled':
        return { bg: '#FEE2E2', color: '#991B1B' };
    }
  };
  const { bg, color } = getBadgeStyle();
  return (
    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
      <Text style={[styles.statusText, { color }]}>{status}</Text>
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TripsScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('month');
  
  // Basic & Sub Filters
  const [activeTab, setActiveTab] = useState<'combined' | 'personal' | 'vendor'>('combined');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Own fleet vehicle filter
  const [selectedOwnVehicle, setSelectedOwnVehicle] = useState('all');
  
  // Vendor filters
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedVendorVehicle, setSelectedVendorVehicle] = useState('all');

  const [visibleTrips, setVisibleTrips] = useState<number>(10);
  const router = useRouter();

  // Generate aggregate counts for the calendar view
  const tripCountsMap = useMemo(() => {
    const counts: Record<string, number> = {};
    TRIPS_POOL.forEach(trip => {
      const key = formatDateKey(trip.date);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, []);

  // Vendor vehicles helper based on selected vendor
  const availableVendorVehicles = useMemo(() => {
    if (selectedVendor === 'all') return [];
    const vehiclesSet = new Set<string>();
    TRIPS_POOL.forEach(t => {
      if (t.ownership === 'vendor' && t.vendorName === selectedVendor && t.vendorVehicle) {
        vehiclesSet.add(t.vendorVehicle);
      }
    });
    return ['all', ...Array.from(vehiclesSet)];
  }, [selectedVendor]);

  // Filter trips based on time, tabs, assignment status, search query, and specific entities
  const filteredTrips = useMemo(() => {
    return TRIPS_POOL.filter(trip => {
      // 1. Timeframe Matching
      const isSameDay = (d1: Date, d2: Date) => formatDateKey(d1) === formatDateKey(d2);
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
      const isSameMonth = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
      const isSameYear = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear();

      let inTimeframe = false;
      if (selectedTimeframe === 'day') {
        inTimeframe = isSameDay(trip.date, selectedDate);
      } else if (selectedTimeframe === 'week') {
        inTimeframe = isSameWeek(trip.date, selectedDate);
      } else if (selectedTimeframe === 'month') {
        inTimeframe = isSameMonth(trip.date, selectedDate);
      } else if (selectedTimeframe === 'year') {
        inTimeframe = isSameYear(trip.date, selectedDate);
      }

      if (!inTimeframe) return false;

      // 2. Ownership Filter
      if (activeTab === 'personal' && trip.ownership !== 'personal') return false;
      if (activeTab === 'vendor' && trip.ownership !== 'vendor') return false;

      // 3. Assignment Filter
      if (assignmentFilter === 'assigned' && !trip.assigned) return false;
      if (assignmentFilter === 'unassigned' && trip.assigned) return false;

      // 4. Search Query Filtering
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesFrom = trip.from.toLowerCase().includes(q);
        const matchesTo = trip.to.toLowerCase().includes(q);
        const matchesVehicle = trip.vehicle.toLowerCase().includes(q);
        const matchesId = trip.id.toLowerCase().includes(q);
        const matchesVendor = trip.vendorName ? trip.vendorName.toLowerCase().includes(q) : false;

        if (!matchesFrom && !matchesTo && !matchesVehicle && !matchesId && !matchesVendor) {
          return false;
        }
      }

      // 5. Detailed Own Vehicle filter
      if (activeTab === 'personal' && selectedOwnVehicle !== 'all') {
        if (trip.vehicle !== selectedOwnVehicle) return false;
      }

      // 6. Detailed Vendor / Vendor Vehicle filters
      if (activeTab === 'vendor') {
        if (selectedVendor !== 'all' && trip.vendorName !== selectedVendor) return false;
        if (selectedVendorVehicle !== 'all' && trip.vendorVehicle !== selectedVendorVehicle) return false;
      }

      return true;
    });
  }, [
    selectedDate,
    selectedTimeframe,
    activeTab,
    assignmentFilter,
    searchQuery,
    selectedOwnVehicle,
    selectedVendor,
    selectedVendorVehicle,
  ]);

  // Compute aggregated financials based on filtered list
  const metrics = useMemo(() => {
    let totalRevenue = 0;
    let totalPetrol = 0;
    let totalDriver = 0;
    let totalVendor = 0;

    filteredTrips.forEach(trip => {
      if (trip.status !== 'Cancelled') {
        totalRevenue += trip.tripAmount;
        if (trip.ownership === 'personal') {
          totalPetrol += trip.petrolCost ?? 0;
          totalDriver += trip.driverPay ?? 0;
        } else if (trip.assigned) {
          totalVendor += trip.vendorCost ?? 0;
        }
      }
    });

    const totalCost = totalPetrol + totalDriver + totalVendor;
    const netProfit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      revenue: totalRevenue,
      petrol: totalPetrol,
      driver: totalDriver,
      vendorCost: totalVendor,
      cost: totalCost,
      profit: netProfit,
      margin: margin,
    };
  }, [filteredTrips]);

  const activePeriodTitle = useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    if (selectedTimeframe === 'day') {
      return `${months[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    } else if (selectedTimeframe === 'week') {
      const temp = new Date(selectedDate);
      const day = temp.getDay();
      const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
      const start = new Date(temp);
      start.setDate(diff);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${selectedDate.getFullYear()}`;
    } else if (selectedTimeframe === 'month') {
      return `${selectedDate.toLocaleString('default', { month: 'long' })} ${selectedDate.getFullYear()}`;
    } else {
      return `Year ${selectedDate.getFullYear()}`;
    }
  }, [selectedDate, selectedTimeframe]);

  const handleAssignVehicle = (tripId: string) => {
    Alert.alert(
      'Assign Vehicle & Vendor',
      `Select mapping options to provision vehicle and crew logistics for trip ${tripId}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Assign Own Fleet', onPress: () => Alert.alert('Success', 'Trip assigned to personal vehicle Innova Crysta.') },
        { text: 'Outsource to Vendor', onPress: () => Alert.alert('Success', 'Trip outsourced to HP Travels Bus.') }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Trips Dashboard</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('Feature Demo', 'Create Trip request initiated.')}>
          <Text style={styles.addButtonText}>+ Book Trip</Text>
        </TouchableOpacity>
      </View>

      {/* ── Premium Search Bar ── */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trips by route, vehicle, ID or vendor..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={(val) => {
              setSearchQuery(val);
              setVisibleTrips(10);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Timeframe Calendar Selector ── */}
        <CalendarSelector
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setVisibleTrips(10);
          }}
          selectedTimeframe={selectedTimeframe}
          onSelectTimeframe={(tf) => {
            setSelectedTimeframe(tf);
            setVisibleTrips(10);
          }}
          leadCounts={tripCountsMap}
        />

        {/* ── Assignment Status Capsule Bar ── */}
        <View style={styles.assignmentFilterContainer}>
          <Text style={styles.filterTitleLabel}>ASSIGNMENT STATUS</Text>
          <View style={styles.capsuleRow}>
            {[
              { key: 'all', label: 'All Trips' },
              { key: 'assigned', label: 'Assigned' },
              { key: 'unassigned', label: 'Unassigned' }
            ].map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => {
                  setAssignmentFilter(option.key as any);
                  setVisibleTrips(10);
                }}
                style={[
                  styles.capsuleBtn,
                  assignmentFilter === option.key && styles.capsuleBtnActive
                ]}
              >
                <Text
                  style={[
                    styles.capsuleText,
                    assignmentFilter === option.key && styles.capsuleTextActive
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Ownership Selector Tabs ── */}
        <View style={styles.tabRow}>
          <Pressable
            onPress={() => {
              setActiveTab('combined');
              setVisibleTrips(10);
            }}
            style={[styles.tab, activeTab === 'combined' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'combined' && styles.tabTextActive]}>
              Combined View
            </Text>
          </Pressable>
          
          <Pressable
            onPress={() => {
              setActiveTab('personal');
              setVisibleTrips(10);
            }}
            style={[styles.tab, activeTab === 'personal' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'personal' && styles.tabTextActive]}>
              Own Fleet
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setActiveTab('vendor');
              setVisibleTrips(10);
            }}
            style={[styles.tab, activeTab === 'vendor' && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === 'vendor' && styles.tabTextActive]}>
              Vendor Fleet
            </Text>
          </Pressable>
        </View>

        {/* ── Sub-Filters for Detailed Own Vehicles ── */}
        {activeTab === 'personal' && (
          <View style={styles.detailedFilterContainer}>
            <Text style={[styles.filterTitleLabel, { paddingHorizontal: 20 }]}>FILTER BY OWN VEHICLE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
              {['all', 'Innova Crysta (Own)', 'Tempo Traveller (Own)', 'Ertiga (Own)', 'XUV700 (Own)'].map((vehicle) => (
                <TouchableOpacity
                  key={vehicle}
                  onPress={() => {
                    setSelectedOwnVehicle(vehicle);
                    setVisibleTrips(10);
                  }}
                  style={[
                    styles.chipBtn,
                    selectedOwnVehicle === vehicle && styles.chipBtnActive
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedOwnVehicle === vehicle && styles.chipTextActive
                    ]}
                  >
                    {vehicle === 'all' ? 'All Vehicles' : vehicle.replace(' (Own)', '')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Sub-Filters for Detailed Vendors & Vendor Vehicles ── */}
        {activeTab === 'vendor' && (
          <View style={styles.detailedFilterContainer}>
            <Text style={[styles.filterTitleLabel, { paddingHorizontal: 20 }]}>FILTER BY VENDOR</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
              {['all', 'Sardar Travels', 'HP Travels', 'Sharma Cabs', 'Karan Travels', 'Ravi Cabs'].map((vendor) => (
                <TouchableOpacity
                  key={vendor}
                  onPress={() => {
                    setSelectedVendor(vendor);
                    setSelectedVendorVehicle('all');
                    setVisibleTrips(10);
                  }}
                  style={[
                    styles.chipBtn,
                    selectedVendor === vendor && styles.chipBtnActive
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedVendor === vendor && styles.chipTextActive
                    ]}
                  >
                    {vendor === 'all' ? 'All Vendors' : vendor}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {selectedVendor !== 'all' && availableVendorVehicles.length > 1 && (
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.filterTitleLabel, { paddingHorizontal: 20 }]}>
                  VEHICLE FOR {selectedVendor.toUpperCase()}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
                  {availableVendorVehicles.map((vType) => (
                    <TouchableOpacity
                      key={vType}
                      onPress={() => {
                        setSelectedVendorVehicle(vType);
                        setVisibleTrips(10);
                      }}
                      style={[
                        styles.chipBtn,
                        selectedVendorVehicle === vType && styles.chipBtnActive
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedVendorVehicle === vType && styles.chipTextActive
                        ]}
                      >
                        {vType === 'all' ? `All ${selectedVendor} Fleets` : vType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* ── Financial Metrics Grid ── */}
        <View style={styles.metricsContainer}>
          {activeTab === 'combined' && (
            <>
              <View style={styles.metricsRow}>
                <ModernMetricCard
                  title="Total Revenue"
                  value={`₹${metrics.revenue.toLocaleString()}`}
                  detailText={`${filteredTrips.filter(t => t.status !== 'Cancelled').length} Active Trips`}
                  detailType="positive"
                />
                <ModernMetricCard
                  title="Total Expenses"
                  value={`₹${metrics.cost.toLocaleString()}`}
                  detailText="Own + Vendor cost"
                  detailType="neutral"
                />
              </View>
              <View style={styles.metricsRow}>
                <ModernMetricCard
                  title="Net Profit"
                  value={`₹${metrics.profit.toLocaleString()}`}
                  detailText="Net revenue margin"
                  detailType={metrics.profit >= 0 ? 'positive' : 'negative'}
                />
                <ModernMetricCard
                  title="Profit Margin"
                  value={`${metrics.margin.toFixed(1)}%`}
                  detailText="Combined efficiency"
                  detailType={metrics.margin >= 20 ? 'positive' : 'neutral'}
                />
              </View>
            </>
          )}

          {activeTab === 'personal' && (
            <>
              <View style={styles.metricsRow}>
                <ModernMetricCard
                  title="Own Fleet Revenue"
                  value={`₹${metrics.revenue.toLocaleString()}`}
                  detailText={`${filteredTrips.filter(t => t.status !== 'Cancelled').length} Owned Trips`}
                  detailType="positive"
                />
                <ModernMetricCard
                  title="Fuel Expense"
                  value={`₹${metrics.petrol.toLocaleString()}`}
                  detailText="Petrol & Diesel cost"
                  detailType="negative"
                />
              </View>
              <View style={styles.metricsRow}>
                <ModernMetricCard
                  title="Driver Wages"
                  value={`₹${metrics.driver.toLocaleString()}`}
                  detailText="Driver payments"
                  detailType="negative"
                />
                <ModernMetricCard
                  title="Net Own Profit"
                  value={`₹${metrics.profit.toLocaleString()}`}
                  detailText={`${metrics.margin.toFixed(1)}% Fleet Margin`}
                  detailType={metrics.profit >= 0 ? 'positive' : 'negative'}
                />
              </View>
            </>
          )}

          {activeTab === 'vendor' && (
            <>
              <View style={styles.metricsRow}>
                <ModernMetricCard
                  title="Vendor Gross"
                  value={`₹${metrics.revenue.toLocaleString()}`}
                  detailText={`${filteredTrips.filter(t => t.status !== 'Cancelled').length} Outsource Trips`}
                  detailType="positive"
                />
                <ModernMetricCard
                  title="Paid to Vendor"
                  value={`₹${metrics.vendorCost.toLocaleString()}`}
                  detailText="Vendor payout costs"
                  detailType="negative"
                />
              </View>
              <View style={styles.metricsRow}>
                <ModernMetricCard
                  title="Net Commission"
                  value={`₹${metrics.profit.toLocaleString()}`}
                  detailText="Agency net margin"
                  detailType={metrics.profit >= 0 ? 'positive' : 'neutral'}
                />
                <ModernMetricCard
                  title="Profit Margin"
                  value={`${metrics.margin.toFixed(1)}%`}
                  detailText="Agency commission rate"
                  detailType={metrics.margin >= 15 ? 'positive' : 'neutral'}
                />
              </View>
            </>
          )}
        </View>

        {/* ── Trips List Section ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'combined' 
                ? 'All Fleet Trips' 
                : activeTab === 'personal' 
                  ? 'Owned Fleet Trips' 
                  : 'Vendor Fleet Trips'}
            </Text>
            <Text style={styles.summaryText}>
              {activePeriodTitle}
            </Text>
          </View>

          {filteredTrips.length === 0 ? (
            <Text style={styles.loadMoreEndText}>No trips recorded for this timeframe.</Text>
          ) : (
            <>
              {filteredTrips.slice(0, visibleTrips).map((trip) => {
                const isOwn = trip.ownership === 'personal';
                const netProfit = isOwn
                  ? trip.tripAmount - (trip.petrolCost ?? 0) - (trip.driverPay ?? 0)
                  : trip.tripAmount - (trip.vendorCost ?? 0);

                return (
                  <TouchableOpacity
                    key={trip.id}
                    activeOpacity={0.85}
                    onPress={() =>
                      router.push({
                        pathname: '/leads/[id]' as any,
                        params: {
                          source: 'trip',
                          id: `LEAD-${trip.id}`,
                          name: 'Customer (from Trip)',
                          route: `${trip.from} → ${trip.to}`,
                          vehicle: trip.vehicle,
                          pax: trip.pax.toString(),
                          status: 'In Progress',
                          value: trip.tripAmount.toString(),
                          date: trip.departure,
                          tripId: trip.id,
                          tripFrom: trip.from,
                          tripTo: trip.to,
                          tripDeparture: trip.departure,
                          tripArrival: trip.arrival,
                          tripVehicle: trip.vehicle,
                          tripPax: trip.pax.toString(),
                          tripStatus: trip.status,
                          tripOwnership: trip.ownership,
                          tripAssigned: trip.assigned.toString(),
                          tripAmount: trip.tripAmount.toString(),
                          petrolCost: (trip.petrolCost ?? 0).toString(),
                          driverPay: (trip.driverPay ?? 0).toString(),
                          vendorCost: (trip.vendorCost ?? 0).toString(),
                          vendorName: trip.vendorName ?? '',
                          vendorVehicleType: trip.vendorVehicle ?? '',
                        },
                      })
                    }
                  >
                  <View style={styles.card}>
                    {/* Card Header: Route ID + Status */}
                    <View style={styles.cardHeader}>
                      <Text style={styles.tripIdText}>{trip.id}</Text>
                      <StatusBadge status={trip.status} />
                    </View>

                    {/* Timeline representation */}
                    <View style={styles.routeContainer}>
                      <View style={styles.timelineColumn}>
                        <View style={styles.timelineDot} />
                        <View style={styles.timelineLine} />
                        <View style={[styles.timelineDot, styles.timelineDotDest]} />
                      </View>
                      
                      <View style={styles.routeDetails}>
                        <View style={styles.routePoint}>
                          <Text style={styles.cityName}>{trip.from}</Text>
                          <Text style={styles.timeText}>{trip.departure}</Text>
                        </View>
                        <View style={styles.routePoint}>
                          <Text style={styles.cityName}>{trip.to}</Text>
                          <Text style={styles.timeText}>{trip.arrival}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Basic Meta: Vehicle Name + Pax Count */}
                    <View style={styles.metaRow}>
                      {trip.assigned ? (
                        <View style={[
                          styles.badge, 
                          isOwn ? styles.ownershipBadgeOwn : styles.ownershipBadgeVendor
                        ]}>
                          <Text style={[
                            styles.badgeText, 
                            isOwn ? styles.ownershipTextOwn : styles.ownershipTextVendor
                          ]}>
                            {isOwn ? 'OWNED FLEET' : 'OUTSOURCED'}
                          </Text>
                        </View>
                      ) : (
                        <View style={[styles.badge, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}>
                          <Text style={[styles.badgeText, { color: '#991B1B' }]}>
                            UNASSIGNED
                          </Text>
                        </View>
                      )}
                      
                      <Text style={styles.vehicleLabel} numberOfLines={1}>
                        {trip.vehicle}
                      </Text>
                      <Text style={styles.paxLabel}>
                        {trip.pax} Passengers
                      </Text>
                    </View>

                    {/* Financial Breakdown Table or Assignment CTA */}
                    <View style={styles.financialsContainer}>
                      <View style={styles.financialsTitleRow}>
                        <Text style={styles.financialsTitle}>Trip Financials</Text>
                        {trip.status === 'Cancelled' && (
                          <Text style={[styles.badgeText, { color: '#991B1B' }]}>CANCELLED TRIP (NO REVENUE)</Text>
                        )}
                        {!trip.assigned && (
                          <Text style={[styles.badgeText, { color: '#F59E0B' }]}>PENDING ALLOCATION</Text>
                        )}
                      </View>
                      
                      {trip.status === 'Cancelled' ? (
                        <View style={styles.financialsGrid}>
                          <View style={styles.financialRow}>
                            <Text style={styles.financialLabel}>Cancellation Loss</Text>
                            <Text style={[styles.financialValue, { color: '#EF4444' }]}>₹0</Text>
                          </View>
                        </View>
                      ) : !trip.assigned ? (
                        <View style={styles.financialsGrid}>
                          <View style={styles.financialRow}>
                            <Text style={styles.financialLabel}>Quoted Fare (Contract)</Text>
                            <Text style={styles.financialValue}>₹{trip.tripAmount.toLocaleString()}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.assignBtn}
                            onPress={() => handleAssignVehicle(trip.id)}
                          >
                            <Text style={styles.assignBtnText}>Assign Vehicle & Crew</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.financialsGrid}>
                          <View style={styles.financialRow}>
                            <Text style={styles.financialLabel}>Trip Fare (Revenue)</Text>
                            <Text style={styles.financialValue}>₹{trip.tripAmount.toLocaleString()}</Text>
                          </View>
                          
                          {isOwn ? (
                            <>
                              <View style={styles.financialRow}>
                                <Text style={styles.financialLabel}>Fuel Expense (Petrol)</Text>
                                <Text style={[styles.financialValue, { color: '#EF4444' }]}>
                                  -₹{trip.petrolCost?.toLocaleString()}
                                </Text>
                              </View>
                              <View style={styles.financialRow}>
                                <Text style={styles.financialLabel}>Driver Wages</Text>
                                <Text style={[styles.financialValue, { color: '#EF4444' }]}>
                                  -₹{trip.driverPay?.toLocaleString()}
                                </Text>
                              </View>
                            </>
                          ) : (
                            <View style={styles.financialRow}>
                              <Text style={styles.financialLabel}>Vendor Payout Cost</Text>
                              <Text style={[styles.financialValue, { color: '#EF4444' }]}>
                                -₹{trip.vendorCost?.toLocaleString()}
                              </Text>
                            </View>
                          )}

                          <View style={[styles.financialRow, styles.financialRowProfit]}>
                            <Text style={styles.profitLabel}>Net Margin Profit</Text>
                            <Text style={[
                              styles.profitValue, 
                              netProfit < 0 && { color: '#EF4444' }
                            ]}>
                              ₹{netProfit.toLocaleString()}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                  </View>
                  </TouchableOpacity>
                );
              })}

              {/* Load More Pagination controls */}
              {filteredTrips.length > visibleTrips ? (
                <Pressable
                  style={styles.loadMoreBtn}
                  onPress={() => setVisibleTrips((prev) => prev + 10)}>
                  <Text style={styles.loadMoreText}>
                    Load More Trips ({filteredTrips.length - visibleTrips} remaining)
                  </Text>
                  <Feather name="chevron-down" size={14} color="#000" />
                </Pressable>
              ) : (
                filteredTrips.length > 5 && (
                  <Text style={styles.loadMoreEndText}>
                    Showing all {filteredTrips.length} trips for this period
                  </Text>
                )
              )}
            </>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
