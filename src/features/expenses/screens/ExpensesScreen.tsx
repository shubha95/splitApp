import React, { useEffect } from 'react';
import {
  Text, StyleSheet, FlatList, View,
  ActivityIndicator, TouchableOpacity,
  Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import type { ExpenseTabScreenProps } from '../../../navigation/types';
import { Screen, Input, Button } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs, rSpacing, rms } from '../../../theme/device';
import { useExpenses } from './useExpenses';
import type { Expense } from '../../../types/api';

const CATEGORIES = ['Food', 'Travel', 'Stay', 'Utilities', 'Entertainment', 'General'];

const ExpensesScreen: React.FC<ExpenseTabScreenProps> = () => {
  const {
    expenses, loading, error,
    modalVisible, openModal, closeModal,
    title, setTitle,
    amount, setAmount,
    category, setCategory,
    creating, createError,
    submitExpense, fetchExpenses,
  } = useExpenses();

  useEffect(() => { fetchExpenses(); }, []);

  const renderExpense = ({ item }: { item: Expense }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.categoryDot, { backgroundColor: item.settled ? colors.secondary : colors.primary }]} />
        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.cardAmount}>₹{item.amount.toFixed(2)}</Text>
        <View style={[styles.statusBadge, item.settled ? styles.settledBadge : styles.unsettledBadge]}>
          <Text style={[styles.statusText, item.settled ? styles.settledText : styles.unsettledText]}>
            {item.settled ? 'Settled' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Screen padded style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openModal} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={styles.loader} color={colors.primary} />}

      {!loading && error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && expenses.length === 0 && (
        <Text style={styles.empty}>No expenses yet. Tap "+ Add" to create one.</Text>
      )}

      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={renderExpense}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Expense Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={closeModal} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalWrapper}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Title"
              placeholder="e.g. Dinner at restaurant"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
            />

            <Input
              label="Amount (₹)"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />

            <Text style={styles.catLabel}>Category</Text>
            <View style={styles.catRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {createError ? <Text style={styles.createError}>{createError}</Text> : null}

            <Button
              title="Add Expense"
              onPress={submitExpense}
              loading={creating}
              style={styles.submitBtn}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

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
  title: { fontSize: rfs(22), fontWeight: '700', color: colors.text },
  addBtn: {
    backgroundColor:   colors.primary,
    borderRadius:      rms(8),
    paddingVertical:   rvs(7),
    paddingHorizontal: rSpacing.sm,
  },
  addBtnText: { color: colors.textInverse, fontWeight: '600', fontSize: rfs(14) },

  loader: { marginTop: rvs(32) },
  error:  { color: colors.danger,        textAlign: 'center', fontSize: rfs(14), marginTop: rvs(16) },
  empty:  { color: colors.textSecondary, textAlign: 'center', fontSize: rfs(14), marginTop: rvs(16) },
  list:   { gap: rSpacing.sm, paddingBottom: rvs(32) },

  card: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: colors.surface,
    borderRadius:    rms(10),
    padding:         rSpacing.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: rSpacing.sm, flex: 1 },
  categoryDot: {
    width:        rfs(10),
    height:       rfs(10),
    borderRadius: rfs(5),
  },
  cardTitle:    { fontSize: rfs(15), fontWeight: '600', color: colors.text },
  cardCategory: { fontSize: rfs(12), color: colors.textSecondary, marginTop: 2 },
  cardRight:    { alignItems: 'flex-end', gap: rvs(4) },
  cardAmount:   { fontSize: rfs(15), fontWeight: '700', color: colors.text },
  statusBadge: {
    borderRadius:      rms(4),
    paddingVertical:   rvs(2),
    paddingHorizontal: rSpacing.xs,
  },
  settledBadge:   { backgroundColor: colors.settled },
  unsettledBadge: { backgroundColor: colors.unsettled },
  statusText:     { fontSize: rfs(11), fontWeight: '600' },
  settledText:    { color: colors.secondary },
  unsettledText:  { color: colors.danger },

  overlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalWrapper: {
    backgroundColor:      colors.surface,
    borderTopLeftRadius:  rms(20),
    borderTopRightRadius: rms(20),
  },
  modalSheet: { padding: rSpacing.lg, paddingBottom: rvs(40) },
  modalHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   rvs(20),
  },
  modalTitle: { fontSize: rfs(18), fontWeight: '700', color: colors.text },
  closeBtn:   { fontSize: rfs(18), color: colors.textSecondary, paddingHorizontal: rSpacing.sm },

  catLabel: {
    fontSize:     rfs(13),
    fontWeight:   '600',
    color:        colors.text,
    marginBottom: rvs(8),
  },
  catRow: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            rSpacing.xs,
    marginBottom:   rvs(16),
  },
  catChip: {
    borderRadius:      rms(20),
    paddingVertical:   rvs(5),
    paddingHorizontal: rSpacing.sm,
    backgroundColor:   colors.border,
    borderWidth:       1,
    borderColor:       colors.border,
  },
  catChipActive:     { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  catChipText:       { fontSize: rfs(12), color: colors.textSecondary, fontWeight: '500' },
  catChipTextActive: { color: colors.primary, fontWeight: '600' },

  createError: { color: colors.danger, fontSize: rfs(13), marginBottom: rvs(8) },
  submitBtn:   { marginTop: rvs(8) },
});

export default ExpensesScreen;
