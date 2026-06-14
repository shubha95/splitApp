import React, { useEffect, useRef, useState } from 'react';
import {
  Text, StyleSheet, FlatList, View,
  ActivityIndicator, TouchableOpacity, Alert, Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { GroupDetailsScreenProps } from '../../../navigation/types';
import { Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs, rSpacing, rms, rs } from '../../../theme/device';
import { useGroupMember } from './useGroupMember';
import type { GroupMember } from '../../../types/api';

const TrashIcon = () => (
  <Svg width={rs(18)} height={rs(18)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke={colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

type Toast = { message: string; success: boolean };

const GroupDetailsScreen: React.FC<GroupDetailsScreenProps> = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { groupMembers, groupMembersLoading, groupMembersError, fetchMembers, removeMember, removeLoading } = useGroupMember();

  const [toast, setToast] = useState<Toast | null>(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchMembers(groupId);
  }, [groupId]);

  const showToast = (message: string, success: boolean) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, success });
    Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    toastTimer.current = setTimeout(() => {
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
        setToast(null),
      );
    }, 2500);
  };

  const handleRemove = (item: GroupMember) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${item.userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const result = await removeMember(item.memberRecordID, groupId);
            showToast(result.message, result.success);
          },
        },
      ],
    );
  };

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
      {item.role !== 'owner' && (
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => handleRemove(item)}
          activeOpacity={0.7}
          disabled={removeLoading}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <TrashIcon />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Screen padded style={styles.container}>

      <View style={styles.header}>
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

      {toast && (
        <Animated.View style={[styles.toast, toast.success ? styles.toastSuccess : styles.toastError, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}

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
    marginRight:       rSpacing.sm,
  },
  ownerBadge: { backgroundColor: colors.primary + '20' },
  roleText:   { fontSize: rfs(11), fontWeight: '600', color: colors.textSecondary, textTransform: 'capitalize' },
  ownerText:  { color: colors.primary },

  removeBtn: {
    padding:         rSpacing.xs,
    borderRadius:    rms(6),
    backgroundColor: colors.danger + '15',
  },

  toast: {
    position:          'absolute',
    bottom:            rvs(32),
    left:              rSpacing.lg,
    right:             rSpacing.lg,
    borderRadius:      rms(10),
    paddingVertical:   rvs(12),
    paddingHorizontal: rSpacing.md,
    alignItems:        'center',
  },
  toastSuccess: { backgroundColor: '#1a7a4a' },
  toastError:   { backgroundColor: colors.danger },
  toastText: {
    color:      '#ffffff',
    fontSize:   rfs(14),
    fontWeight: '600',
  },
});

export default GroupDetailsScreen;
