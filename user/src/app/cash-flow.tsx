import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { cashFlowStyle as styles } from '@/styles/cashFlowStyle';

interface CashFlowItem {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'inflow' | 'outflow';
  category: 'advance' | 'party' | 'fuel' | 'driver' | 'maintenance' | 'misc';
  date: Date;
}

const CATEGORIES = [
  { id: 'advance', label: 'Advance Incoming', type: 'inflow', icon: 'credit-card', bg: '#D1FAE5', color: '#059669' },
  { id: 'party', label: 'Party Payments', type: 'inflow', icon: 'dollar-sign', bg: '#D1FAE5', color: '#059669' },
  { id: 'fuel', label: 'Fuel', type: 'outflow', icon: 'droplet', bg: '#E5E7EB', color: '#374151' },
  { id: 'driver', label: 'Driver Charges', type: 'outflow', icon: 'user-check', bg: '#E5E7EB', color: '#374151' },
  { id: 'maintenance', label: 'Maintenance', type: 'outflow', icon: 'tool', bg: '#E5E7EB', color: '#374151' },
  { id: 'misc', label: 'Miscellaneous', type: 'outflow', icon: 'file-text', bg: '#E5E7EB', color: '#374151' },
] as const;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CashFlowScreen() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2023, 9, 15)); // Default to October 2023 per design
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Form State
  const [entryType, setEntryType] = useState<'inflow' | 'outflow'>('inflow');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('advance');

  // Initial Seed Data matching screenshot & scalable (includes last 3 months: Aug, Sep, Oct)
  const [transactions, setTransactions] = useState<CashFlowItem[]>([
    // October 2023
    { id: 'CF-101', title: 'Advance Incoming', subtitle: 'Trip ID: #FL-9082 • Oct 14', amount: 3200, type: 'inflow', category: 'advance', date: new Date(2023, 9, 14) },
    { id: 'CF-102', title: 'Party Payments', subtitle: 'Bulk Settlement • Oct 12', amount: 12850, type: 'inflow', category: 'party', date: new Date(2023, 9, 12) },
    { id: 'CF-103', title: 'Advance Incoming', subtitle: 'Trip ID: #FL-9104 • Oct 08', amount: 4500, type: 'inflow', category: 'advance', date: new Date(2023, 9, 8) },
    { id: 'CF-104', title: 'Party Payments', subtitle: 'Corporate Event Settlement • Oct 05', amount: 24650, type: 'inflow', category: 'party', date: new Date(2023, 9, 5) },
    { id: 'CF-201', title: 'Fuel', subtitle: 'Fleet Card #4421 • Oct 15', amount: 8400, type: 'outflow', category: 'fuel', date: new Date(2023, 9, 15) },
    { id: 'CF-202', title: 'Driver Charges', subtitle: 'Salary & Allowances • Oct 01', amount: 15000, type: 'outflow', category: 'driver', date: new Date(2023, 9, 1) },
    { id: 'CF-203', title: 'Maintenance', subtitle: 'Periodic Service • Oct 08', amount: 4200, type: 'outflow', category: 'maintenance', date: new Date(2023, 9, 8) },
    { id: 'CF-204', title: 'Miscellaneous', subtitle: 'Tolls & Parking • Oct 10', amount: 5150, type: 'outflow', category: 'misc', date: new Date(2023, 9, 10) },

    // September 2023
    { id: 'CF-301', title: 'Party Payments', subtitle: 'Sep Corporate Advance', amount: 38000, type: 'inflow', category: 'party', date: new Date(2023, 8, 20) },
    { id: 'CF-302', title: 'Advance Incoming', subtitle: 'Trip ID: #FL-8890', amount: 2800, type: 'inflow', category: 'advance', date: new Date(2023, 8, 12) },
    { id: 'CF-303', title: 'Driver Charges', subtitle: 'Monthly Allowances', amount: 13500, type: 'outflow', category: 'driver', date: new Date(2023, 8, 1) },
    { id: 'CF-304', title: 'Fuel', subtitle: 'Fleet Topup Sep', amount: 9200, type: 'outflow', category: 'fuel', date: new Date(2023, 8, 15) },
    { id: 'CF-305', title: 'Maintenance', subtitle: 'Engine Tuning', amount: 6500, type: 'outflow', category: 'maintenance', date: new Date(2023, 8, 25) },

    // August 2023
    { id: 'CF-401', title: 'Party Payments', subtitle: 'Aug Group Bookings', amount: 34500, type: 'inflow', category: 'party', date: new Date(2023, 7, 22) },
    { id: 'CF-402', title: 'Advance Incoming', subtitle: 'Trip ID: #FL-8720', amount: 5200, type: 'inflow', category: 'advance', date: new Date(2023, 7, 10) },
    { id: 'CF-403', title: 'Fuel', subtitle: 'Aug Highway Fuel', amount: 10400, type: 'outflow', category: 'fuel', date: new Date(2023, 7, 18) },
    { id: 'CF-404', title: 'Driver Charges', subtitle: 'August Salaries', amount: 14000, type: 'outflow', category: 'driver', date: new Date(2023, 7, 1) },
  ]);

  // Navigate reporting month
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Filter transactions for reporting period
  const monthFiltered = useMemo(() => {
    const targetYear = currentDate.getFullYear();
    const targetMonth = currentDate.getMonth();
    return transactions.filter(t => t.date.getFullYear() === targetYear && t.date.getMonth() === targetMonth);
  }, [currentDate, transactions]);

  // Calculation summaries
  const inflows = useMemo(() => monthFiltered.filter(t => t.type === 'inflow'), [monthFiltered]);
  const outflows = useMemo(() => monthFiltered.filter(t => t.type === 'outflow'), [monthFiltered]);

  const totalInflow = useMemo(() => inflows.reduce((acc, curr) => acc + curr.amount, 0), [inflows]);
  const totalOutflow = useMemo(() => outflows.reduce((acc, curr) => acc + curr.amount, 0), [outflows]);
  const netCashFlow = useMemo(() => totalInflow - totalOutflow, [totalInflow, totalOutflow]);

  // 3-Month Trends Computation (current month + 2 preceding months)
  const last3MonthsTrend = useMemo(() => {
    const result = [];
    let maxVal = 1; // avoid division by zero

    for (let i = 2; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const mYear = d.getFullYear();
      const mMonth = d.getMonth();

      const mTx = transactions.filter(t => t.date.getFullYear() === mYear && t.date.getMonth() === mMonth);
      const inf = mTx.filter(t => t.type === 'inflow').reduce((sum, t) => sum + t.amount, 0);
      const out = mTx.filter(t => t.type === 'outflow').reduce((sum, t) => sum + t.amount, 0);
      const net = inf - out;

      if (inf > maxVal) maxVal = inf;
      if (out > maxVal) maxVal = out;

      result.push({
        label: MONTH_NAMES[mMonth].substring(0, 3),
        fullMonth: MONTH_NAMES[mMonth],
        year: mYear,
        inflow: inf,
        outflow: out,
        net,
      });
    }

    return result.map(m => ({
      ...m,
      inflowPct: Math.max(12, Math.round((m.inflow / maxVal) * 100)),
      outflowPct: Math.max(12, Math.round((m.outflow / maxVal) * 100)),
    }));
  }, [currentDate, transactions]);

  // Handle Adding New Entry
  const handleSaveEntry = () => {
    const parsedAmount = parseFloat(amountStr.replace(/[^0-9.]/g, ''));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for the transaction.');
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === selectedCategory);
    const dayStr = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`;
    const monthShort = MONTH_NAMES[currentDate.getMonth()].substring(0, 3);

    const newTx: CashFlowItem = {
      id: `CF-${Math.floor(Math.random() * 9000 + 1000)}`,
      title: title.trim(),
      subtitle: subtitle.trim() || `${catObj?.label ?? 'General'} • ${monthShort} ${dayStr}`,
      amount: parsedAmount,
      type: entryType,
      category: (selectedCategory as any) || 'misc',
      date: new Date(currentDate),
    };

    setTransactions(prev => [newTx, ...prev]);
    setIsAddModalVisible(false);
    // Reset form
    setTitle('');
    setSubtitle('');
    setAmountStr('');
  };

  const getCategoryMeta = (cat: string, type: 'inflow' | 'outflow') => {
    const found = CATEGORIES.find(c => c.id === cat);
    if (found) return found;
    return type === 'inflow'
      ? { icon: 'plus-circle', bg: '#D1FAE5', color: '#059669' }
      : { icon: 'minus-circle', bg: '#E5E7EB', color: '#374151' };
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cash Flow</Text>
        <TouchableOpacity style={styles.addEntryBtn} onPress={() => setIsAddModalVisible(true)}>
          <Feather name="plus" size={16} color="#FFFFFF" />
          <Text style={styles.addEntryText}>Add Entry</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Reporting Period Selector ────────────────────────────────────── */}
        <View style={styles.periodNav}>
          <TouchableOpacity style={styles.periodNavBtn} onPress={handlePrevMonth}>
            <Feather name="chevron-left" size={18} color="#000000" />
          </TouchableOpacity>
          <View style={styles.periodCenter}>
            <Text style={styles.periodLabel}>Reporting Period</Text>
            <Text style={styles.periodValue}>
              {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
          </View>
          <TouchableOpacity style={styles.periodNavBtn} onPress={handleNextMonth}>
            <Feather name="chevron-right" size={18} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* ── Net Cash Flow Main Card ──────────────────────────────────────── */}
        <View style={styles.netCard}>
          <Text style={styles.netCardLabel}>Net Cash Flow</Text>
          <Text style={styles.netCardAmount}>
            ${netCashFlow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <View style={styles.netCardChangePill}>
            <Feather name="trending-up" size={12} color="#22C55E" />
            <Text style={styles.netCardChangeText}>+12.5% from last month</Text>
          </View>
        </View>

        {/* ── Total Inflow / Outflow Summary Cards ─────────────────────────── */}
        <View style={styles.summaryRow}>
          {/* Inflow Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardLabelRow}>
              <Feather name="arrow-down-left" size={14} color="#059669" />
              <Text style={[styles.summaryCardLabel, { color: '#059669' }]}>TOTAL INFLOW</Text>
            </View>
            <Text style={styles.summaryCardAmount}>
              ${totalInflow.toLocaleString('en-US')}
            </Text>
          </View>

          {/* Outflow Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryCardLabelRow}>
              <Feather name="arrow-up-right" size={14} color="#DC2626" />
              <Text style={[styles.summaryCardLabel, { color: '#DC2626' }]}>TOTAL OUTFLOW</Text>
            </View>
            <Text style={styles.summaryCardAmount}>
              ${totalOutflow.toLocaleString('en-US')}
            </Text>
          </View>
        </View>

        {/* ── 3-Month Trends Card ───────────────────────────────────────────── */}
        <View style={styles.trendCard}>
          <View style={styles.trendTitleRow}>
            <Text style={styles.trendTitle}>3-Month Performance Trend</Text>
            <View style={styles.trendLegendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#059669' }]} />
                <Text style={styles.legendText}>Inflow</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>Outflow</Text>
              </View>
            </View>
          </View>

          {/* Dual Bar Comparison Chart */}
          <View style={styles.chartContainer}>
            {last3MonthsTrend.map((item, idx) => (
              <View key={`${item.year}-${item.label}-${idx}`} style={styles.monthBarGroup}>
                <View style={styles.barsRow}>
                  {/* Inflow bar */}
                  <View style={styles.barTrack}>
                    <View style={[styles.barInflow, { height: `${item.inflowPct}%` }]} />
                  </View>
                  {/* Outflow bar */}
                  <View style={styles.barTrack}>
                    <View style={[styles.barOutflow, { height: `${item.outflowPct}%` }]} />
                  </View>
                </View>

                {/* Month label */}
                <Text style={styles.monthLabel}>{item.label}</Text>
                <Text style={[styles.monthNetText, { color: item.net >= 0 ? '#059669' : '#DC2626' }]}>
                  {item.net >= 0 ? '+' : '-'}${Math.abs(item.net / 1000).toFixed(1)}k
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── UNIFIED TRANSACTIONS LIST (SORTED BY DATE) ────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <View style={[styles.sectionBadge, { backgroundColor: '#F3F4F6' }]}>
            <Text style={[styles.sectionBadgeText, { color: '#374151' }]}>
              {monthFiltered.length} Items
            </Text>
          </View>
        </View>

        {monthFiltered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No transactions recorded for this month.</Text>
          </View>
        ) : (
          [...monthFiltered]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((item, index, array) => {
              const isTypeInflow = item.type === 'inflow';
              const meta = getCategoryMeta(item.category, item.type);
              return (
                <View
                  key={item.id}
                  style={[styles.txItem, index === array.length - 1 && styles.txItemLast]}
                >
                  <View style={[styles.txIconWrap, { backgroundColor: meta.bg }]}>
                    <Feather name={meta.icon as any} size={18} color={meta.color} />
                  </View>
                  <View style={styles.txBody}>
                    <Text style={styles.txLabel}>{item.title}</Text>
                    <Text style={styles.txSub}>{item.subtitle}</Text>
                  </View>
                  <Text style={[styles.txAmount, { color: isTypeInflow ? '#059669' : '#000000' }]}>
                    {isTypeInflow ? '+' : '-'}${item.amount.toLocaleString('en-US')}
                  </Text>
                </View>
              );
            })
        )}
      </ScrollView>

      {/* ── ADD DEBIT/CREDIT MODAL ─────────────────────────────────────────── */}
      <Modal visible={isAddModalVisible} transparent animationType="slide" onRequestClose={() => setIsAddModalVisible(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setIsAddModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={e => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Add Cash Flow Entry</Text>

            {/* Inflow / Outflow Toggle */}
            <View style={styles.typeToggleRow}>
              <TouchableOpacity
                style={[styles.typeToggleBtn, entryType === 'inflow' && styles.typeToggleBtnActive]}
                onPress={() => {
                  setEntryType('inflow');
                  setSelectedCategory('advance');
                }}
              >
                <Text style={[styles.typeToggleBtnText, entryType === 'inflow' && styles.typeToggleBtnTextActive]}>
                  Inflow (Credit)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.typeToggleBtn, entryType === 'outflow' && styles.typeToggleBtnActive]}
                onPress={() => {
                  setEntryType('outflow');
                  setSelectedCategory('fuel');
                }}
              >
                <Text style={[styles.typeToggleBtnText, entryType === 'outflow' && styles.typeToggleBtnTextActive]}>
                  Outflow (Debit)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Category Chips */}
            <View style={styles.categoryRow}>
              {CATEGORIES.filter(c => c.type === entryType).map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    if (!title) setTitle(cat.label);
                  }}
                >
                  <Feather
                    name={cat.icon as any}
                    size={13}
                    color={selectedCategory === cat.id ? '#FFFFFF' : '#6B7280'}
                  />
                  <Text style={[styles.categoryChipText, selectedCategory === cat.id && styles.categoryChipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Title / Particulars</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Bulk Settlement, Fuel Topup"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Subtitle Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Reference / Details (Optional)</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Trip ID: #FL-9082 or Fleet Card #4421"
                placeholderTextColor="#9CA3AF"
                value={subtitle}
                onChangeText={setSubtitle}
              />
            </View>

            {/* Amount Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Amount ($)</Text>
              <View style={styles.amountInputRow}>
                <Text style={styles.amountCurrency}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={amountStr}
                  onChangeText={setAmountStr}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: entryType === 'inflow' ? '#059669' : '#000000' }]}
              onPress={handleSaveEntry}
            >
              <Text style={styles.submitBtnText}>
                Save {entryType === 'inflow' ? 'Inflow' : 'Outflow'} Entry
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
