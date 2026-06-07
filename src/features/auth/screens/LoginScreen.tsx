import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LoginScreenProps } from '../../../navigation/types';
import { Button, Input, Screen } from '../../../components/ui';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { useAuthLogin } from '../hooks/useAuthLogin';
import SocialLoginButtons from '../components/SocialLoginButtons';

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const {
    emailId,
    password,
    loading,
    error,
    emailError,
    passwordError,
    canSubmit,
    passwordRef,
    handleEmailChange,
    handlePasswordChange,
    handleBlurEmail,
    handleBlurPassword,
    handleLogin,
  } = useAuthLogin();

  return (
    <Screen scroll>
      <View style={styles.inner}>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={emailId}
            onChangeText={handleEmailChange}
            onBlur={handleBlurEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            editable={!loading}
          />

          <Input
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={handlePasswordChange}
            onBlur={handleBlurPassword}
            error={passwordError}
            secureTextEntry
            placeholder="••••••••"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            editable={!loading}
          />

          {error ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        <Button
          title="Sign in"
          onPress={handleLogin}
          loading={loading}
          disabled={!canSubmit}
        />
        <Button
          title="Create account"
          variant="outline"
          onPress={() => navigation.navigate('Register')}
          style={styles.mt}
        />
        <Button
          title="Forgot password?"
          variant="outline"
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.mt}
        />

        <SocialLoginButtons mode="login" />

      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: spacing.md,
  },
  apiErrorBox: {
    backgroundColor: colors.unsettled,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  apiErrorText: {
    fontSize: 13,
    color: colors.danger,
    textAlign: 'center',
  },
  mt: {
    marginTop: spacing.sm,
  },
});

export default LoginScreen;
