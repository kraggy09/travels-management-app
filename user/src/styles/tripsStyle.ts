import { StyleSheet } from 'react-native';

export const tripsStyle = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Sora-Bold',
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 100,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Sora-SemiBold',
    fontSize: 13,
  },

  // ─── Filter Tabs ───
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tabActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: '#6B6B6B',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Sora-Bold',
  },

  // ─── Metrics Cards ───
  metricsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  metricTitle: {
    fontSize: 11,
    fontFamily: 'Sora-Regular',
    color: '#8E8E93',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    marginBottom: 6,
  },
  metricDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 10,
    fontFamily: 'Sora-SemiBold',
  },
  detailTextPos: {
    color: '#22C55E',
  },
  detailTextNeg: {
    color: '#EF4444',
  },
  detailTextNeu: {
    color: '#F59E0B',
  },

  // ─── Section Header ───
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: '#6B6B6B',
  },

  // ─── Trip Card Design ───
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripIdText: {
    fontSize: 11,
    fontFamily: 'Sora-SemiBold',
    color: '#8E8E93',
  },
  
  // Timeline Route
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 20,
    marginRight: 8,
    marginTop: 4,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  timelineDotDest: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  timelineLine: {
    width: 1.5,
    height: 38,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  routeDetails: {
    flex: 1,
    gap: 12,
  },
  routePoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
  },
  timeText: {
    fontSize: 11,
    fontFamily: 'Sora-Regular',
    color: '#6B6B6B',
  },

  // Metadata Row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Sora-Bold',
  },
  vehicleLabel: {
    fontSize: 12,
    fontFamily: 'Sora-SemiBold',
    color: '#374151',
    flex: 1,
  },
  paxLabel: {
    fontSize: 11,
    fontFamily: 'Sora-Regular',
    color: '#6B6B6B',
  },

  // ─── Financial Breakdown Container ───
  financialsContainer: {
    marginTop: 12,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 12,
  },
  financialsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  financialsTitle: {
    fontSize: 10,
    fontFamily: 'Sora-Bold',
    color: '#8E8E93',
    textTransform: 'uppercase',
  },
  financialsGrid: {
    gap: 6,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 11,
    fontFamily: 'Sora-Regular',
    color: '#4B5563',
  },
  financialValue: {
    fontSize: 11,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
  },
  financialRowProfit: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  profitLabel: {
    fontSize: 11,
    fontFamily: 'Sora-Bold',
    color: '#111827',
  },
  profitValue: {
    fontSize: 12,
    fontFamily: 'Sora-Bold',
    color: '#22C55E',
  },

  // ─── Ownership Badges ───
  ownershipBadgeOwn: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  ownershipTextOwn: {
    color: '#065F46',
  },
  ownershipBadgeVendor: {
    backgroundColor: '#F3E8FF',
    borderColor: '#C084FC',
  },
  ownershipTextVendor: {
    color: '#5B21B6',
  },

  // Status Badge Colors
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'Sora-Bold',
  },

  // ─── Pagination Buttons ───
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 4,
    marginBottom: 20,
  },
  loadMoreText: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
    marginRight: 6,
  },
  loadMoreEndText: {
    fontSize: 12,
    fontFamily: 'Sora-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },

  // ─── Search Bar ───
  searchBarContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Sora-Regular',
    color: '#000000',
    padding: 0,
  },

  // ─── Assignment Filter ───
  assignmentFilterContainer: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  filterTitleLabel: {
    fontSize: 10,
    fontFamily: 'Sora-Bold',
    color: '#8E8E93',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  capsuleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  capsuleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  capsuleBtnActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  capsuleText: {
    fontSize: 11,
    fontFamily: 'Sora-Medium',
    color: '#4B5563',
  },
  capsuleTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Sora-Bold',
  },

  // ─── Detailed Chips ───
  detailedFilterContainer: {
    marginBottom: 14,
  },
  horizontalScrollPadding: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chipBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipBtnActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  chipText: {
    fontSize: 11,
    fontFamily: 'Sora-Medium',
    color: '#4B5563',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Sora-Bold',
  },
  assignBtn: {
    backgroundColor: '#000000',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  assignBtnText: {
    fontSize: 11,
    fontFamily: 'Sora-Bold',
    color: '#FFFFFF',
  },
});
