import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getWeeksInMonth = (year: number, month: number) => {
  const days = getDaysInMonth(year, month);
  const weeks: { start: Date; end: Date; label: string; days: Date[] }[] = [];
  let currentWeek: Date[] = [];

  days.forEach((day, index) => {
    currentWeek.push(day);
    // Group ending on Sunday (0) or last day of month
    if (day.getDay() === 0 || index === days.length - 1) {
      weeks.push({
        start: currentWeek[0],
        end: currentWeek[currentWeek.length - 1],
        label: `Week ${weeks.length + 1}`,
        days: [...currentWeek],
      });
      currentWeek = [];
    }
  });

  return weeks;
};

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CalendarSelectorProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  selectedTimeframe: 'day' | 'week' | 'month' | 'year';
  onSelectTimeframe: (timeframe: 'day' | 'week' | 'month' | 'year') => void;
  leadCounts?: Record<string, number>; // maps YYYY-MM-DD -> count
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CalendarSelector({
  selectedDate,
  onSelectDate,
  selectedTimeframe,
  onSelectTimeframe,
  leadCounts = {},
}: CalendarSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const daysScrollRef = useRef<ScrollView>(null);
  const weeksScrollRef = useRef<ScrollView>(null);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handlePrevHeader = () => {
    const newDate = new Date(selectedDate);
    if (selectedTimeframe === 'month') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    onSelectDate(newDate);
  };

  const handleNextHeader = () => {
    const newDate = new Date(selectedDate);
    if (selectedTimeframe === 'month') {
      newDate.setFullYear(newDate.getFullYear() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onSelectDate(newDate);
  };

  // Auto-scroll to active day or active week when month or view opens
  useEffect(() => {
    if (isExpanded && selectedTimeframe === 'day' && daysScrollRef.current) {
      const dayIndex = selectedDate.getDate() - 1;
      setTimeout(() => {
        daysScrollRef.current?.scrollTo({ x: dayIndex * 66, animated: true });
      }, 100);
    }
  }, [selectedDate.getMonth(), selectedDate.getFullYear(), selectedTimeframe, isExpanded]);

  const activeYear = selectedDate.getFullYear();
  const activeMonth = selectedDate.getMonth();
  const monthName = MONTHS[activeMonth];

  // Dynamic aggregators based on the day-level leadCounts map
  const getWeekLeadsSum = (daysList: Date[]) => {
    return daysList.reduce((sum, d) => sum + (leadCounts[formatDateKey(d)] ?? 0), 0);
  };

  const getMonthLeadsSum = (year: number, month: number) => {
    const monthDays = getDaysInMonth(year, month);
    return monthDays.reduce((sum, d) => sum + (leadCounts[formatDateKey(d)] ?? 0), 0);
  };

  const getYearLeadsSum = (year: number) => {
    const yearPrefix = `${year}-`;
    return Object.entries(leadCounts).reduce((sum, [key, count]) => {
      if (key.startsWith(yearPrefix)) {
        return sum + count;
      }
      return sum;
    }, 0);
  };

  // Get active period display label
  const getActivePeriodLabel = () => {
    const today = new Date();
    if (formatDateKey(selectedDate) === formatDateKey(today)) {
      return 'Today';
    }
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (formatDateKey(selectedDate) === formatDateKey(yesterday)) {
      return 'Yesterday';
    }

    if (selectedTimeframe === 'day') {
      return `${monthName} ${selectedDate.getDate()}, ${activeYear}`;
    } else if (selectedTimeframe === 'week') {
      const weeks = getWeeksInMonth(activeYear, activeMonth);
      const activeWeek = weeks.find(w => 
        selectedDate.getTime() >= w.start.getTime() && selectedDate.getTime() <= w.end.getTime()
      ) || weeks[0];
      if (activeWeek) {
        return `${MONTHS_SHORT[activeWeek.start.getMonth()]} ${activeWeek.start.getDate()} - ${MONTHS_SHORT[activeWeek.end.getMonth()]} ${activeWeek.end.getDate()}, ${activeYear}`;
      }
      return `Week, ${monthName} ${activeYear}`;
    } else if (selectedTimeframe === 'month') {
      return `${monthName} ${activeYear}`;
    } else {
      return `${activeYear}`;
    }
  };

  // Lists of renderable elements
  const currentMonthDays = getDaysInMonth(activeYear, activeMonth);
  const currentMonthWeeks = getWeeksInMonth(activeYear, activeMonth);
  
  // Year grid shows a range around selectedDate
  const yearsList = [activeYear - 2, activeYear - 1, activeYear, activeYear + 1, activeYear + 2, activeYear + 3];

  return (
    <View style={styles.container}>
      {/* ── Collapsed Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.periodLabel}>Active Period</Text>
          <Text style={styles.periodValue}>{getActivePeriodLabel()}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.changeDateBtn,
            pressed && styles.pressed,
          ]}
          onPress={toggleExpand}>
          <Feather name="calendar" size={16} color="#FFFFFF" style={styles.btnIcon} />
          <Text style={styles.changeDateText}>
            {isExpanded ? 'Collapse' : 'Change Date'}
          </Text>
        </Pressable>
      </View>

      {/* ── Expanded Content ── */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Divider */}
          <View style={styles.divider} />

          {/* Timeframe Selector Toggles (Top of expansion) */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleTitle}>Granularity</Text>
            <View style={styles.toggleGroup}>
              {(['day', 'week', 'month', 'year'] as const).map((tf) => {
                const isActive = selectedTimeframe === tf;
                return (
                  <Pressable
                    key={tf}
                    onPress={() => onSelectTimeframe(tf)}
                    style={[styles.toggleBtn, isActive && styles.toggleBtnActive]}>
                    <Text style={[styles.toggleText, isActive && styles.toggleTextActive]}>
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Navigator Header (Changes based on what is selected) */}
          <View style={styles.navigationHeader}>
            <Pressable onPress={handlePrevHeader} style={styles.navArrow}>
              <Feather name="chevron-left" size={18} color="#6B6B6B" />
            </Pressable>
            <Text style={styles.navTitle}>
              {selectedTimeframe === 'year' 
                ? `${yearsList[0]} - ${yearsList[yearsList.length - 1]}`
                : selectedTimeframe === 'month' 
                  ? `${activeYear}` 
                  : `${monthName} ${activeYear}`
              }
            </Text>
            <Pressable onPress={handleNextHeader} style={styles.navArrow}>
              <Feather name="chevron-right" size={18} color="#6B6B6B" />
            </Pressable>
          </View>

          {/* ── Sub-component Renderers based on selectedTimeframe ── */}
          
          {/* 1. DAY VIEW: Shows horizontal scroll of all days in the current month */}
          {selectedTimeframe === 'day' && (
            <View style={styles.stripContainer}>
              <ScrollView
                ref={daysScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daysScroll}>
                {currentMonthDays.map((day, idx) => {
                  const dayKey = formatDateKey(day);
                  const count = leadCounts[dayKey] ?? 0;
                  const isSelected = formatDateKey(selectedDate) === dayKey;
                  const isToday = formatDateKey(new Date()) === dayKey;

                  return (
                    <Pressable
                      key={idx}
                      onPress={() => onSelectDate(day)}
                      style={[
                        styles.dayCard,
                        isSelected && styles.dayCardSelected,
                      ]}>
                      <Text
                        style={[
                          styles.dayName,
                          isSelected && styles.dayNameSelected,
                        ]}>
                        {isToday && !isSelected ? 'TODAY' : DAYS_SHORT[day.getDay()]}
                      </Text>
                      <Text
                        style={[
                          styles.dayNumber,
                          isSelected && styles.dayNumberSelected,
                        ]}>
                        {day.getDate()}
                      </Text>
                      <View
                        style={[
                          styles.countBadge,
                          isSelected ? styles.countBadgeSelected : styles.countBadgeDefault,
                        ]}>
                        <Text
                          style={[
                            styles.countText,
                            isSelected && styles.countTextSelected,
                          ]}>
                          {count}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* 2. WEEK VIEW: Shows horizontal scroll of the weeks in the selected month */}
          {selectedTimeframe === 'week' && (
            <View style={styles.stripContainer}>
              <ScrollView
                ref={weeksScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weeksScroll}>
                {currentMonthWeeks.map((week, idx) => {
                  const isSelected = selectedDate.getTime() >= week.start.getTime() && selectedDate.getTime() <= week.end.getTime();
                  const weekSum = getWeekLeadsSum(week.days);
                  
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => onSelectDate(week.start)}
                      style={[
                        styles.weekCard,
                        isSelected && styles.weekCardSelected,
                      ]}>
                      <Text style={[styles.weekLabel, isSelected && styles.weekLabelSelected]}>
                        {week.label}
                      </Text>
                      <Text style={[styles.weekRange, isSelected && styles.weekRangeSelected]}>
                        {`${MONTHS_SHORT[week.start.getMonth()]} ${week.start.getDate()} - ${week.start.getMonth() !== week.end.getMonth() ? MONTHS_SHORT[week.end.getMonth()] + ' ' : ''}${week.end.getDate()}`}
                      </Text>
                      <View style={[styles.countBadge, isSelected ? styles.countBadgeSelected : styles.countBadgeDefault]}>
                        <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                          {weekSum}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* 3. MONTH VIEW: Dates are hidden. Shows a grid of all 12 months in the year */}
          {selectedTimeframe === 'month' && (
            <View style={styles.gridContainer}>
              <Text style={styles.gridSectionLabel}>Select Month</Text>
              <View style={styles.grid}>
                {MONTHS_SHORT.map((mShort, idx) => {
                  const isSelected = activeMonth === idx;
                  const monthLeads = getMonthLeadsSum(activeYear, idx);

                  return (
                    <Pressable
                      key={mShort}
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(idx);
                        onSelectDate(newDate);
                      }}
                      style={[
                        styles.gridItem,
                        isSelected && styles.gridItemActive,
                      ]}>
                      <Text style={[styles.gridItemLabel, isSelected && styles.gridItemLabelActive]}>
                        {mShort.toUpperCase()}
                      </Text>
                      <Text style={[styles.gridItemCount, isSelected && styles.gridItemCountActive]}>
                        {monthLeads} Leads
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* 4. YEAR VIEW: Dates are hidden. Shows a grid of selectable years */}
          {selectedTimeframe === 'year' && (
            <View style={styles.gridContainer}>
              <Text style={styles.gridSectionLabel}>Select Year</Text>
              <View style={styles.grid}>
                {yearsList.map((yr) => {
                  const isSelected = activeYear === yr;
                  const yearLeads = getYearLeadsSum(yr);

                  return (
                    <Pressable
                      key={yr}
                      onPress={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(yr);
                        onSelectDate(newDate);
                      }}
                      style={[
                        styles.gridItem,
                        isSelected && styles.gridItemActive,
                      ]}>
                      <Text style={[styles.gridItemLabel, isSelected && styles.gridItemLabelActive]}>
                        {yr}
                      </Text>
                      <Text style={[styles.gridItemCount, isSelected && styles.gridItemCountActive]}>
                        {yearLeads} Leads
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: '#8E8E93',
    marginBottom: 4,
  },
  periodValue: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: '#000000',
  },
  changeDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  btnIcon: {
    marginRight: 6,
  },
  changeDateText: {
    color: '#FFFFFF',
    fontFamily: 'Sora-SemiBold',
    fontSize: 13,
  },
  pressed: {
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  expandedContent: {
    marginTop: -4,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleTitle: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 100,
    padding: 2,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 11,
    fontFamily: 'Sora-Medium',
    color: '#6B6B6B',
  },
  toggleTextActive: {
    color: '#000000',
    fontFamily: 'Sora-Bold',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  navArrow: {
    padding: 4,
  },
  navTitle: {
    fontSize: 14,
    fontFamily: 'Sora-Bold',
    color: '#000000',
  },
  stripContainer: {
    minHeight: 80,
  },
  daysScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  dayCard: {
    width: 58,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  dayCardSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  dayName: {
    fontSize: 9,
    fontFamily: 'Sora-Bold',
    color: '#8E8E93',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontSize: 16,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    marginBottom: 6,
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
  countBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeDefault: {
    backgroundColor: '#E8F0FE',
  },
  countBadgeSelected: {
    backgroundColor: '#FFFFFF',
  },
  countText: {
    fontSize: 9,
    fontFamily: 'Sora-Bold',
    color: '#1A73E8',
  },
  countTextSelected: {
    color: '#000000',
  },
  weeksScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  weekCard: {
    width: 120,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  weekCardSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  weekLabel: {
    fontSize: 11,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    marginBottom: 2,
  },
  weekLabelSelected: {
    color: '#FFFFFF',
  },
  weekRange: {
    fontSize: 9,
    fontFamily: 'Sora-Regular',
    color: '#8E8E93',
    marginBottom: 8,
    textAlign: 'center',
  },
  weekRangeSelected: {
    color: '#D1D5DB',
  },
  gridContainer: {
    marginTop: 4,
  },
  gridSectionLabel: {
    fontSize: 11,
    fontFamily: 'Sora-Bold',
    color: '#8E8E93',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1.4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    marginBottom: 4,
  },
  gridItemActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  gridItemLabel: {
    fontSize: 12,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    marginBottom: 2,
  },
  gridItemLabelActive: {
    color: '#FFFFFF',
  },
  gridItemCount: {
    fontSize: 9,
    fontFamily: 'Sora-Regular',
    color: '#6B6B6B',
  },
  gridItemCountActive: {
    color: '#E5E7EB',
  },
});
