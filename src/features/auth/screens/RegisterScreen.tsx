import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RegisterScreenProps } from '../../../navigation/types';
import { Button, Input, Screen } from '../../../components/ui';
import { colors }  from '../../../theme/colors';
import { rfs, rms, rSpacing } from '../../../theme/device';
import { useAuthRegister } from '../hooks/useAuthRegister';
import SocialLoginButtons from '../components/SocialLoginButtons';

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text style={styles.eyeText}>{visible ? '🙈' : '👁'}</Text>
);

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const {
    userName, emailId, password, confirmPassword, address,
    showPassword, showConfirmPassword,
    loading, error,
    userNameError, emailError, passwordError, confirmPasswordError, addressError,
    canSubmit,
    emailRef, passwordRef, confirmPasswordRef, addressRef,
    setShowPassword, setShowConfirmPassword,
    handleUserNameChange, handleEmailChange, handlePasswordChange,
    handleConfirmPasswordChange, handleAddressChange,
    handleBlurUserName, handleBlurEmail, handleBlurPassword,
    handleBlurConfirmPassword, handleBlurAddress,
    handleRegister,
  } = useAuthRegister();

  return (
    <Screen scroll>
      <View style={styles.inner}>

        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join ExpenseSplit today</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            value={userName}
            onChangeText={handleUserNameChange}
            onBlur={handleBlurUserName}
            error={userNameError}
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="John Doe"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
            editable={!loading}
          />

          <Input
            ref={emailRef}
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
            secureTextEntry={!showPassword}
            placeholder="••••••••"
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            editable={!loading}
            rightElement={
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            }
          />

          <Input
            ref={confirmPasswordRef}
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            onBlur={handleBlurConfirmPassword}
            error={confirmPasswordError}
            secureTextEntry={!showConfirmPassword}
            placeholder="••••••••"
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
            editable={!loading}
            rightElement={
              <TouchableOpacity onPress={() => setShowConfirmPassword(v => !v)} hitSlop={8}>
                <EyeIcon visible={showConfirmPassword} />
              </TouchableOpacity>
            }
          />

          <Input
            ref={addressRef}
            label="Address"
            value={address}
            onChangeText={handleAddressChange}
            onBlur={handleBlurAddress}
            error={addressError}
            autoCapitalize="sentences"
            placeholder="Mumbai, India"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
            editable={!loading}
          />

          {error ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiErrorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        <Button
          title="Create account"
          onPress={handleRegister}
          loading={loading}
          disabled={!canSubmit}
        />
        <Button
          title="Already have an account? Sign in"
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          style={styles.mt}
        />

        <SocialLoginButtons mode="register" />

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
    marginBottom: rSpacing.xl,
  },
  title: {
    fontSize:     rfs(28),
    fontWeight:   '700',
    color:        colors.text,
    marginBottom: rSpacing.xs,
  },
  subtitle: {
    fontSize: rfs(16),
    color:    colors.textSecondary,
  },
  form: {
    marginBottom: rSpacing.md,
  },
  apiErrorBox: {
    backgroundColor: colors.unsettled,
    borderRadius:    rms(8),
    padding:         rSpacing.sm,
    marginBottom:    rSpacing.sm,
  },
  apiErrorText: {
    fontSize:   rfs(13),
    color:      colors.danger,
    textAlign:  'center',
  },
  mt: {
    marginTop: rSpacing.sm,
  },
  eyeText: {
    fontSize: rfs(18),
  },
});

export default RegisterScreen;
