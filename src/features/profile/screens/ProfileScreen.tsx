import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen, Button } from '../../../components/ui';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logoutThunk } from '../../auth/store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user     = useAppSelector(s => s.auth.user);

  return (
    <Screen>
      <Text style={styles.title}>Profile</Text>
      {user && (
        <View style={styles.card}>
          <Text style={styles.name}>{user.userName}</Text>
          <Text style={styles.email}>{user.emailId}</Text>
        </View>
      )}
      <View style={styles.gap} />
      <Button title="Sign out" variant="danger" onPress={() => dispatch(logoutThunk())} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
  card:  { backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  name:  { fontSize: 18, fontWeight: '600', color: colors.text },
  email: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  gap:   { flex: 1 },
});

export default ProfileScreen;
