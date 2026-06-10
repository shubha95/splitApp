import React from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import Input from './Input';
import Button from './Button';
import { colors } from '../../theme/colors';
import { rfs, rms, rSpacing, rvs } from '../../theme/device';
import type { MyGroup } from '../../types/api';

type Props = {
  visible:       boolean;
  onClose:       () => void;
  editingGroup:  MyGroup | null;
  groupName:     string;
  setGroupName:  (v: string) => void;
  description:   string;
  setDescription:(v: string) => void;
  creating:      boolean;
  createError:   string | null;
  onSubmit:      () => void;
};

const GroupFormModal: React.FC<Props> = ({
  visible, onClose, editingGroup,
  groupName, setGroupName,
  description, setDescription,
  creating, createError, onSubmit,
}) => (
  <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.modalWrapper}
    >
      <View style={styles.modalSheet}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingGroup ? 'Edit Group' : 'Add Group'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Group Name"
          placeholder="e.g. Delhi Trip"
          value={groupName}
          onChangeText={setGroupName}
          autoCapitalize="words"
        />

        <Input
          label="Description"
          placeholder="e.g. Expenses for the trip"
          value={description}
          onChangeText={setDescription}
        />

        {createError ? <Text style={styles.createError}>{createError}</Text> : null}

        <Button
          title={editingGroup ? 'Save Changes' : 'Create Group'}
          onPress={onSubmit}
          loading={creating}
          style={styles.submitBtn}
        />
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const styles = StyleSheet.create({
  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalWrapper: {
    backgroundColor:      colors.surface,
    borderTopLeftRadius:  rms(20),
    borderTopRightRadius: rms(20),
  },
  modalSheet: {
    padding:       rSpacing.lg,
    paddingBottom: rvs(40),
    width:         '100%',
  },
  modalHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   rvs(20),
  },
  modalTitle:  { fontSize: rfs(18), fontWeight: '700', color: colors.text },
  closeBtn:    { fontSize: rfs(18), color: colors.textSecondary, paddingHorizontal: rSpacing.sm },
  createError: { color: colors.danger, fontSize: rfs(13), marginBottom: rvs(8) },
  submitBtn:   { marginTop: rvs(8) },
});

export default GroupFormModal;
