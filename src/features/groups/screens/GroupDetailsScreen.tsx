import React, { useEffect } from 'react';
import {
  Text, StyleSheet, FlatList, View,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { GroupDetailsScreenProps } from '../../../navigation/types';
import { Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs, rSpacing, rms, rs } from '../../../theme/device';
import { useGroupMember } from './useGroupMember';
import type { GroupMember } from '../../../types/api';

const ICON = rs(20);

const BackIcon = () => (
  <Svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5"
      stroke={colors.text}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 19l-7-7 7-7"
      stroke={colors.text}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const GroupDetailsScreen: React.FC<GroupDetailsScreenProps> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { groupMembers, groupMembersLoading, groupMembersError, fetchMembers } = useGroupMember();

  useEffect(() => {
    fetchMembers(groupId);
  }, [groupId]);

  const renderMember = ({ item }: { item: GroupMember }) => (
    <View style={styles.memberCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.userName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.userName}</Text>
        <Text style={styles.memberEmail}>{item.emailId}</Text>
      </View>
      <View style={[styles.roleBadge, item.role === 'owner' && styles.ownerBadge]}>
        <Text style={[styles.roleText, item.role === 'owner' && styles.ownerText]}>
          {item.role}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen padded style={styles.container}>

      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <BackIcon />
        </TouchableOpacity> */}

        <Text style={styles.title}>Members</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddMemberScreen', { groupId })}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnText}>+ Add Member</Text>
        </TouchableOpacity>
      </View>

      {groupMembersLoading && (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      )}

      {!groupMembersLoading && groupMembersError && (
        <Text style={styles.error}>{groupMembersError}</Text>
      )}

      {!groupMembersLoading && !groupMembersError && groupMembers.length === 0 && (
        <Text style={styles.empty}>No members found.</Text>
      )}

      <FlatList
        data={groupMembers}
        keyExtractor={item => item.memberRecordID}
        renderItem={renderMember}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   rvs(16),
  },
  backBtn: {
    padding:         rSpacing.xs,
    borderRadius:    rms(8),
    backgroundColor: colors.border,
  },
  title: {
    fontSize:   rfs(18),
    fontWeight: '700',
    color:      colors.text,
  },
  addBtn: {
    backgroundColor:   colors.primary,
    borderRadius:      rms(8),
    paddingVertical:   rvs(7),
    paddingHorizontal: rSpacing.sm,
  },
  addBtnText: {
    color:      colors.textInverse,
    fontWeight: '600',
    fontSize:   rfs(13),
  },

  loader: { marginTop: rvs(16) },
  error:  { color: colors.danger,        textAlign: 'center', fontSize: rfs(14) },
  empty:  { color: colors.textSecondary, textAlign: 'center', fontSize: rfs(14) },
  list:   { gap: rSpacing.sm, paddingBottom: rvs(32) },

  memberCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderRadius:    rms(10),
    padding:         rSpacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  avatar: {
    width:           rfs(40),
    height:          rfs(40),
    borderRadius:    rfs(20),
    backgroundColor: colors.primary + '20',
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     rSpacing.sm,
  },
  avatarText: {
    fontSize:   rfs(16),
    fontWeight: '700',
    color:      colors.primary,
  },
  memberInfo:  { flex: 1 },
  memberName:  { fontSize: rfs(15), fontWeight: '600', color: colors.text },
  memberEmail: { fontSize: rfs(12), color: colors.textSecondary, marginTop: 2 },

  roleBadge: {
    backgroundColor:   colors.textSecondary + '20',
    borderRadius:      rms(6),
    paddingVertical:   rvs(3),
    paddingHorizontal: rSpacing.xs,
  },
  ownerBadge: { backgroundColor: colors.primary + '20' },
  roleText:   { fontSize: rfs(11), fontWeight: '600', color: colors.textSecondary, textTransform: 'capitalize' },
  ownerText:  { color: colors.primary },
});

export default GroupDetailsScreen;
