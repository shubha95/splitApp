import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LoginScreenProps } from '../../../navigation/types';
import { Button } from '../../../components/ui';
import { Screen } from '../../../components/ui';
import { useAppDispatch } from '../../../store/hooks';
import { signIn } from '../store/authSlice';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const handleSignIn = () => {
    dispatch(signIn({ id: '1', name: 'Demo User', email: 'demo@example.com' }));
  };

  return (
    <Screen>
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        <View style={styles.gap} />
        <Button title="Sign in (demo)" onPress={handleSignIn} />
        <Button title="Create account" variant="outline" onPress={() => navigation.navigate('Register')} style={styles.mt} />
        <Button title="Forgot password?" variant="outline" onPress={() => navigation.navigate('ForgotPassword')} style={styles.mt} />
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

export default LoginScreen;
