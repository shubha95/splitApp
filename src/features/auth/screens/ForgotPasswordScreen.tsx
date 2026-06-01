import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ForgotPasswordScreenProps } from '../../../navigation/types';
import { Button, Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => (
  <Screen>
    <View style={styles.inner}>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.body}>Enter your email and we'll send you a reset link.</Text>
      <View style={styles.gap} />
      <Button title="Send reset link (demo)" onPress={() => {}} />
      <Button title="Back to login" variant="outline" onPress={() => navigation.navigate('Login')} style={styles.mt} />
    </View>
  </Screen>
);

const styles = StyleSheet.create({
  inner: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  body:  { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.lg },
  gap:   { height: spacing.md },
  mt:    { marginTop: spacing.sm },
});

export default ForgotPasswordScreen;
