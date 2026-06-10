import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ForgotPasswordScreenProps } from '../../../navigation/types';
import { Button, Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { rfs, rvs, rSpacing } from '../../../theme/device';

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
  title: { fontSize: rfs(24), fontWeight: '700', color: colors.text, marginBottom: rSpacing.sm },
  body:  { fontSize: rfs(15), color: colors.textSecondary, marginBottom: rSpacing.lg },
  gap:   { height: rSpacing.md },
  mt:    { marginTop: rSpacing.sm },
});

export default ForgotPasswordScreen;
