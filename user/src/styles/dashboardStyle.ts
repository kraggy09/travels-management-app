import { StyleSheet } from "react-native";

export const dashboardStyle = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FFFFFF' },
    scroll: { paddingHorizontal: 24, paddingBottom: 120 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 28,
    },
    greeting: { fontSize: 13, color: '#6B6B6B', fontFamily: 'Sora-Regular', marginBottom: 2 },
    title: { fontSize: 28, fontFamily: 'Sora-Bold', color: '#000000' },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: { color: '#FFFFFF', fontFamily: 'Sora-SemiBold', fontSize: 13 },

    kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    kpiCard: {
        flex: 1,
        backgroundColor: '#F6F6F6',
        borderRadius: 16,
        padding: 16,
    },
    kpiCardDark: { backgroundColor: '#000000' },
    kpiValue: { fontSize: 22, fontFamily: 'Sora-Bold', color: '#000000', marginBottom: 4 },
    kpiValueDark: { color: '#FFFFFF' },
    kpiLabel: { fontSize: 11, fontFamily: 'Sora-Regular', color: '#6B6B6B' },
    kpiLabelDark: { color: '#9E9E9E' },

    sectionTitle: {
        fontSize: 17,
        fontFamily: 'Sora-SemiBold',
        color: '#000000',
        marginBottom: 16,
    },

    activityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    activityDot: { width: 10, height: 10, borderRadius: 5 },
    activityLabel: { fontSize: 14, fontFamily: 'Sora-Medium', color: '#000000', marginBottom: 2 },
    activitySub: { fontSize: 12, fontFamily: 'Sora-Regular', color: '#6B6B6B' },
    activityTime: { fontSize: 11, fontFamily: 'Sora-Regular', color: '#9E9E9E' },
});
