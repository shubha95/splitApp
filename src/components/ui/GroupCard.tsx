import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Svg, { Path, Polyline, Line } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { rfs, rms, rSpacing, rs } from '../../theme/device';
import type { MyGroup } from '../../types/api';

type Props = {
  item:     MyGroup;
  onPress:  (item: MyGroup) => void;
  onDelete: (item: MyGroup) => void;
  onDetails:(item: MyGroup) => void;
};

const ICON = rs(16);

const PencilIcon = () => (
  <Svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
      stroke={colors.primary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke={colors.primary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TrashIcon = () => (
  <Svg width={ICON} height={ICON} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="3 6 5 6 21 6"
      stroke={colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
      stroke={colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 11v6M14 11v6"
      stroke={colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1="9" y1="6" x2="9" y2="4"
      stroke={colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1="15" y1="6" x2="15" y2="4"
      stroke={colors.danger}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const GroupCard: React.FC<Props> = ({ item, onPress, onDelete, onDetails }) => {
  const confirmDelete = () => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${item.groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(item) },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.info} onPress={() => onDetails(item)} activeOpacity={0.7}>
        <Text style={styles.groupName}>{item.groupName}</Text>
        <Text style={styles.groupMeta}>{item.description}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.iconBtn, styles.editBtn]}
          onPress={() => onPress(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <PencilIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconBtn, styles.deleteBtn]}
          onPress={confirmDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <TrashIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex:            1,
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderRadius:    rms(10),
    padding:         rSpacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  info:      { flex: 1, marginRight: rSpacing.sm },
  groupName: { fontSize: rfs(16), fontWeight: '600', color: colors.text },
  groupMeta: { fontSize: rfs(13), color: colors.textSecondary, marginTop: rSpacing.xs },
  actions:   { flexDirection: 'row', alignItems: 'center', gap: rSpacing.xs },
  iconBtn: {
    padding:      rSpacing.xs,
    borderRadius: rms(6),
  },
  editBtn:   { backgroundColor: colors.primary + '15' },
  deleteBtn: { backgroundColor: colors.danger  + '15' },
});

export default GroupCard;
