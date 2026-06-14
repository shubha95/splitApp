import React from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import type { DashboardScreenProps } from '../../../navigation/types';
import { Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs, rSpacing, rms } from '../../../theme/device';
import { useHomeScreen } from '@features/home/screens/useHomeScreen';
type StatCardProps = { label: string; value: number; color: string };

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
 
 const {myGroups, myGroupsLoading, error} = useHomeScreen()

  return (
    <Screen padded style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Your expense overview</Text>
        </View>

        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.statsRow}>
          <StatCard label="Total Groups"   value={myGroups.length} color={colors.primary} />
          <StatCard label="Total Expenses" value={1} color={colors.secondary} />
        </View>
        <View style={styles.statsRow}>
          <StatCard label="You Owe"        value={1} color={colors.danger} />
          <StatCard label="Owed to You"    value={1} color={colors.info} />
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No recent activity yet.</Text>
        </View>

      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    marginBottom: rvs(24),
  },
  title: {
    fontSize:   rfs(24),
    fontWeight: '700',
    color:      colors.text,
  },
  subtitle: {
    fontSize:   rfs(14),
    color:      colors.textSecondary,
    marginTop:  rvs(4),
  },

  sectionTitle: {
    fontSize:     rfs(16),
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: rvs(12),
  },

  statsRow: {
    flexDirection:  'row',
    gap:            rSpacing.sm,
    marginBottom:   rSpacing.sm,
  },
  statCard: {
    flex:            1,
    backgroundColor: colors.surface,
    borderRadius:    rms(10),
    padding:         rSpacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
    borderLeftWidth: 4,
  },
  statValue: {
    fontSize:   rfs(22),
    fontWeight: '700',
    marginBottom: rvs(4),
  },
  statLabel: {
    fontSize: rfs(12),
    color:    colors.textSecondary,
  },

  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius:    rms(10),
    padding:         rSpacing.lg,
    alignItems:      'center',
    borderWidth:     1,
    borderColor:     colors.border,
    marginBottom:    rvs(32),
  },
  emptyText: {
    fontSize: rfs(14),
    color:    colors.textSecondary,
  },
});

export default DashboardScreen;
