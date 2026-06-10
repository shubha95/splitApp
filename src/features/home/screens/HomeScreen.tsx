import React from 'react';
import {
  Text, StyleSheet, View, FlatList,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import type { HomeScreenProps } from '../../../navigation/types';
import { Screen, GroupCard, GroupFormModal } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs, rms, columnCount, rSpacing } from '../../../theme/device';
import { useHomeScreen } from './useHomeScreen';
import type { MyGroup } from '../../../types/api';

const COLS = columnCount(300);

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const {
    myGroups, myGroupsLoading, error,
    modalVisible, groupName, setGroupName,
    description, setDescription,
    creating, createError,
    editingGroup,
    openModal, openEditModal, closeModal, submitGroup,
    deleteGroup,
    Details
  } = useHomeScreen();

  const renderGroup = ({ item }: { item: MyGroup }) => (
    <GroupCard 
       item={item} 
       onPress={openEditModal} 
       onDelete={deleteGroup} 
       onDetails={Details}
       />
  );

  return (
    <Screen padded style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openModal} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>+ Add Group</Text>
        </TouchableOpacity>
      </View>

      {myGroupsLoading && (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      )}

      {!myGroupsLoading && error && (
        <Text style={styles.error}>{error}</Text>
      )}

      {!myGroupsLoading && !error && myGroups.length === 0 && (
        <Text style={styles.empty}>No groups yet.</Text>
      )}

      <FlatList
        data={myGroups}
        keyExtractor={item => item.groupID}
        renderItem={renderGroup}
        contentContainerStyle={styles.list}
        style={styles.flatList}
        numColumns={COLS}
        key={String(COLS)}
        columnWrapperStyle={COLS > 1 ? styles.columnWrapper : undefined}
      />

      <GroupFormModal
        visible={modalVisible}
        onClose={closeModal}
        editingGroup={editingGroup}
        groupName={groupName}
        setGroupName={setGroupName}
        description={description}
        setDescription={setDescription}
        creating={creating}
        createError={createError}
        onSubmit={submitGroup}
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
  title: {
    fontSize:   rfs(22),
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
    fontSize:   rfs(14),
  },

  loader:        { marginTop: rvs(32) },
  error:         { color: colors.danger,        marginTop: rvs(16), textAlign: 'center', fontSize: rfs(14) },
  empty:         { color: colors.textSecondary, marginTop: rvs(16), textAlign: 'center', fontSize: rfs(14) },
  flatList:      { flex: 1 },
  list:          { gap: rSpacing.sm, paddingBottom: rvs(32) },
  columnWrapper: { gap: rSpacing.sm },
});

export default HomeScreen;
