import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { RegisterScreenProps } from '../../../navigation/types';
import { Button, Screen } from '../../../components/ui';
import { useAppDispatch } from '../../../store/hooks';
import { signUp } from '../store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const handleSignUp = () => {
    dispatch(signUp({ id: '1', name: 'Demo User', email: 'demo@example.com' }));
  };

  return (
    <Screen>
      <View style={styles.inner}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join ExpenseSplit today</Text>
        <View style={styles.gap} />
        <Button title="Create account (demo)" onPress={handleSignUp} />
        <Button title="Back to login" variant="outline" onPress={() => navigation.navigate('Login')} style={styles.mt} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  inner:    { flex: 1, justifyContent: 'center' },
  title:    { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  subtitle: { fontSize: 16, color: colors.textSecondary, marginBottom: spacing.lg },
  gap:      { height: spacing.lg },
  mt:       { marginTop: spacing.sm },
});

export default RegisterScreen;
