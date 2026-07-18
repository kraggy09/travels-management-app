import { StyleSheet } from 'react-native';

export const cashFlowStyle = StyleSheet.create({
  // ─── Screen ──────────────────────────────────────────────────────────────────
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingBottom: 120,
  },

  // ─── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Sora-Bold',
    color: '#000000',
  },
  addEntryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addEntryText: {
    fontSize: 12,
    fontFamily: 'Sora-SemiBold',
    color: '#FFFFFF',
  },

  // ─── Period Navigator ─────────────────────────────────────────────────────────
  periodNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  periodNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  periodCenter: {
    alignItems: 'center',
    gap: 2,
  },
  periodLabel: {
    fontSize: 10,
    fontFamily: 'Sora-Regular',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  periodValue: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: '#000000',
  },

  // ─── Net Cash Flow Card ───────────────────────────────────────────────────────
  netCard: {
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  netCardLabel: {
    fontSize: 11,
    fontFamily: 'Sora-Regular',
    color: '#9CA3AF',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  netCardAmount: {
    fontSize: 34,
    fontFamily: 'Sora-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  netCardChangePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  netCardChangeText: {
    fontSize: 12,
    fontFamily: 'Sora-SemiBold',
    color: '#22C55E',
  },

  // ─── Summary Row (Inflow / Outflow) ──────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  summaryCardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  summaryCardLabel: {
    fontSize: 9,
    fontFamily: 'Sora-Bold',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  summaryCardAmount: {
    fontSize: 20,
    fontFamily: 'Sora-Bold',
    color: '#000000',
  },

  // ─── 3-Month Trends Card ──────────────────────────────────────────────────────
  trendCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  trendTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  trendTitle: {
    fontSize: 12,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  trendLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontFamily: 'Sora-Medium',
    color: '#6B7280',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: 10,
  },
  monthBarGroup: {
    flex: 1,
    alignItems: 'center',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 80,
  },
  barTrack: {
    width: 14,
    height: '100%',
    justifyContent: 'flex-end',
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  barInflow: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  barOutflow: {
    width: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: 11,
    fontFamily: 'Sora-SemiBold',
    color: '#374151',
    marginTop: 8,
  },
  monthNetText: {
    fontSize: 9,
    fontFamily: 'Sora-Bold',
    marginTop: 2,
  },

  // ─── Section Headers ──────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  sectionBadgeText: {
    fontSize: 10,
    fontFamily: 'Sora-Bold',
  },

  // ─── Transaction Item ─────────────────────────────────────────────────────────
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  txItemLast: {
    borderBottomWidth: 0,
    marginBottom: 24,
  },
  txIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txBody: {
    flex: 1,
    gap: 2,
  },
  txLabel: {
    fontSize: 14,
    fontFamily: 'Sora-SemiBold',
    color: '#000000',
  },
  txSub: {
    fontSize: 11,
    fontFamily: 'Sora-Regular',
    color: '#9CA3AF',
  },
  txAmount: {
    fontSize: 15,
    fontFamily: 'Sora-Bold',
  },

  // ─── Empty State ──────────────────────────────────────────────────────────────
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: 'Sora-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // ─── Load More ────────────────────────────────────────────────────────────────
  loadMoreBtn: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  loadMoreText: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#6B7280',
  },

  // ─── Modal Overlay ────────────────────────────────────────────────────────────
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    paddingHorizontal: 24,
    marginBottom: 20,
  },

  // ─── Type Toggle (Debit / Credit) ──────────────────────────────────────────
  typeToggleRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  typeToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  typeToggleBtnActive: {
    backgroundColor: '#000000',
  },
  typeToggleBtnText: {
    fontSize: 13,
    fontFamily: 'Sora-SemiBold',
    color: '#9CA3AF',
  },
  typeToggleBtnTextActive: {
    color: '#FFFFFF',
  },

  // ─── Category Chips ───────────────────────────────────────────────────────────
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: 'Sora-Medium',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },

  // ─── Form Fields ──────────────────────────────────────────────────────────────
  formGroup: {
    marginHorizontal: 24,
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontFamily: 'Sora-SemiBold',
    color: '#374151',
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Sora-Medium',
    color: '#000000',
    backgroundColor: '#FAFAFA',
  },
  formInputFocused: {
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
    gap: 6,
  },
  amountCurrency: {
    fontSize: 18,
    fontFamily: 'Sora-Bold',
    color: '#9CA3AF',
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'Sora-Bold',
    color: '#000000',
    paddingVertical: 12,
  },

  // ─── Submit Button ────────────────────────────────────────────────────────────
  submitBtn: {
    marginHorizontal: 24,
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontFamily: 'Sora-Bold',
    color: '#FFFFFF',
  },
});
