import React, { useEffect } from 'react';
import {
  Text, StyleSheet, FlatList, View,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { AddMemberScreenProps } from '../../../navigation/types';
import { Screen, Input } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs, rSpacing, rms, rs } from '../../../theme/device';
import { useAddMember } from './useAddMember';
import type { ListUser } from '../../../types/api';

const SearchIcon = () => (
  <Svg width={rs(18)} height={rs(18)} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35"
      stroke={colors.textSecondary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AddMemberScreen: React.FC<AddMemberScreenProps> = ({ route }) => {
  const { groupId } = route.params;
  const {
    searchQuery, setSearchQuery,
    searchResults, searchLoading, searchError,
    selectedIds, toggleSelect,
    addMembers, addLoading,
    getAllMember,
  } = useAddMember();

  useEffect(() => {
    getAllMember(groupId);
  }, [groupId]);

  const renderUser = ({ item }: { item: ListUser }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <View style={styles.contactCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.userName}</Text>
          {item.emailId ? (
            <Text style={styles.contactEmail}>{item.emailId}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.cardBtn, isSelected ? styles.removeBtn : styles.addBtn]}
          onPress={() => toggleSelect(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardBtnText}>
            {isSelected ? 'Remove' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen padded style={styles.container}>

      {/* Header */}
      <View style={styles.header}>


        <Text style={styles.title}>Add Member</Text>
        {/* <View style={styles.headerSpacer} /> */}
                {/* Left — submit button when selection exists, else spacer */}
        {selectedIds.length > 0 ? (
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => addMembers(groupId)}
            activeOpacity={0.8}
            disabled={addLoading}
          >
            {addLoading
              ? <ActivityIndicator color={colors.textInverse} size="small" />
              : <Text style={styles.submitBtnText}>Add {selectedIds.length} Member{selectedIds.length > 1 ? 's' : ''}</Text>
            }
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {/* Search bar */}
      <Input
        placeholder="Search by name or email..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoCapitalize="none"
        autoCorrect={false}
        containerStyle={styles.searchContainer}
        rightElement={<SearchIcon />}
      />

      {/* States */}
      {searchLoading && (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      )}

      {!searchLoading && searchError && (
        <Text style={styles.error}>{searchError}</Text>
      )}

      {!searchLoading && !searchError && searchQuery.trim().length > 0 && searchResults.length === 0 && (
        <Text style={styles.empty}>No users found for "{searchQuery}"</Text>
      )}

      {/* User list */}
      <FlatList
        data={searchResults}
        keyExtractor={item => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
    marginBottom:   rvs(4),
  },
  headerSpacer: { width: rs(90), height: rs(36) },

  title: {
    fontSize:   rfs(18),
    fontWeight: '700',
    color:      colors.text,
  },

  submitBtn: {
    backgroundColor:   colors.primary,
    borderRadius:      rms(8),
    paddingVertical:   rvs(7),
    paddingHorizontal: rSpacing.sm,
    minWidth:          rs(90),
    alignItems:        'center',
  },
  submitBtnText: {
    color:      colors.textInverse,
    fontWeight: '600',
    fontSize:   rfs(13),
  },

  searchContainer: { marginBottom: rSpacing.sm },

  loader: { marginTop: rvs(16) },
  error:  { color: colors.danger,        textAlign: 'center', fontSize: rfs(14), marginTop: rvs(12) },
  empty:  { color: colors.textSecondary, textAlign: 'center', fontSize: rfs(14), marginTop: rvs(12) },
  list:   { gap: rSpacing.sm, paddingBottom: rvs(32) },

  contactCard: {
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
    backgroundColor: colors.secondary + '20',
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     rSpacing.sm,
  },
  avatarText: {
    fontSize:   rfs(16),
    fontWeight: '700',
    color:      colors.secondary,
  },
  contactInfo:  { flex: 1 },
  contactName:  { fontSize: rfs(15), fontWeight: '600', color: colors.text },
  contactEmail: { fontSize: rfs(12), color: colors.textSecondary, marginTop: 2 },

  cardBtn: {
    borderRadius:      rms(6),
    paddingVertical:   rvs(6),
    paddingHorizontal: rSpacing.sm,
    minWidth:          rs(64),
    alignItems:        'center',
  },
  addBtn:    { backgroundColor: colors.primary },
  removeBtn: { backgroundColor: colors.danger },
  cardBtnText: {
    color:      colors.textInverse,
    fontWeight: '600',
    fontSize:   rfs(13),
  },
});

export default AddMemberScreen;
