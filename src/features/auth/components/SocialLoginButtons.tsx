import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';
import { useSocialAuth } from '../hooks/useSocialAuth';
import { colors }  from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import type { AuthStackParamList } from '../../../navigation/types';
import type { SocialProvider } from '../../../types/api';

type Nav = NativeStackNavigationProp<AuthStackParamList>;

type Props = {
  mode: 'login' | 'register';
};

// ── Provider icon components (inline SVG, no external assets needed) ──────────

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 48 48">
    <Path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 3.2 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.4 13.6 17.7 9.5 24 9.5z"/>
    <Path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h12.4c-.5 2.8-2.1 5.2-4.5 6.8l7 5.4c4.1-3.8 6.5-9.4 6.5-16.3z"/>
    <Path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.7-4.6l-7-5.4A23 23 0 0 0 1 24c0 3.7.9 7.2 2.5 10.3l7.2-5.7z"/>
    <Path fill="#34A853" d="M24 47c5.7 0 10.5-1.9 14-5.1l-7-5.4c-1.9 1.3-4.4 2-7 2-6.3 0-11.6-4.1-13.4-9.8l-7.2 5.7C7 42.3 14.8 47 24 47z"/>
  </Svg>
);

const FacebookIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path fill="#1877F2" d="M24 12a12 12 0 1 0-13.875 11.85v-8.385H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.465h-2.796v8.385A12 12 0 0 0 24 12z"/>
  </Svg>
);

const TwitterIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 300 300">
    <Path fill="#000" d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59H300L178.57 127.15zm-36.26 41.26-11.87-16.67L36.16 19.54h40.67l76.2 107.03 11.87 16.67 99.02 139h-40.67l-80.94-113.83z"/>
  </Svg>
);

const MicrosoftIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 21 21">
    <Rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <Rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <Rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <Rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </Svg>
);

// ── Button config ─────────────────────────────────────────────────────────────

type ProviderConfig = {
  provider:  SocialProvider;
  label:     string;
  icon:      React.ReactNode;
  borderColor: string;
};

const PROVIDERS: ProviderConfig[] = [
  { provider: 'google',   label: 'Google',    icon: <GoogleIcon />,    borderColor: '#EA4335' },
  { provider: 'facebook', label: 'Facebook',  icon: <FacebookIcon />,  borderColor: '#1877F2' },
  { provider: 'twitter',  label: 'X (Twitter)', icon: <TwitterIcon />, borderColor: '#000000' },
  { provider: 'outlook',  label: 'Microsoft', icon: <MicrosoftIcon />, borderColor: '#00A4EF' },
];

// ── Main component ────────────────────────────────────────────────────────────

const SocialLoginButtons: React.FC<Props> = ({ mode }) => {
  const navigation   = useNavigation<Nav>();
  const {
    loginWithGoogle, loginWithFacebook, loginWithTwitter, loginWithOutlook,
    isLoading, activeProvider, error,
  } = useSocialAuth();

  const handlers: Record<SocialProvider, () => void> = {
    google:   loginWithGoogle,
    facebook: loginWithFacebook,
    twitter:  loginWithTwitter,
    outlook:  loginWithOutlook,
  };

  const handlePress = (provider: SocialProvider) => {
    if (mode === 'register') {
      // Register flow: social SDK is not called here — just navigate to Login
      navigation.navigate('Login');
      return;
    }
    console.log(`Starting =====> ${provider} ${mode} flow`);
    handlers[provider]();
  };

  return (
    <View style={styles.container}>
      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Error box — mirrors apiErrorBox style from LoginScreen */}
      {error ? (
        <View style={styles.apiErrorBox}>
          <Text style={styles.apiErrorText}>{error}</Text>
        </View>
      ) : null}

      {/* Provider buttons */}
      <View style={styles.buttonsRow}>
        {PROVIDERS.map(({ provider, label, icon, borderColor }) => {
          const isActive = activeProvider === provider;
          return (
            <TouchableOpacity
              key={provider}
              style={[styles.button, { borderColor }]}
              onPress={() => handlePress(provider)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isActive ? (
                <ActivityIndicator size="small" color={borderColor} />
              ) : (
                <>
                  {icon}
                  <Text style={styles.buttonLabel}>{label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  dividerRow: {
    flexDirection:  'row',
    alignItems:     'center',
    marginBottom:   spacing.md,
  },
  dividerLine: {
    flex:            1,
    height:          1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.sm,
    fontSize:         13,
    color:            colors.textSecondary,
  },
  apiErrorBox: {
    backgroundColor: colors.unsettled,
    borderRadius:    8,
    padding:         spacing.sm,
    marginBottom:    spacing.sm,
  },
  apiErrorText: {
    fontSize:  13,
    color:     colors.danger,
    textAlign: 'center',
  },
  buttonsRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    gap:            spacing.sm,
  },
  button: {
    flex:            1,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             spacing.xs,
    height:          44,
    borderRadius:    10,
    borderWidth:     1,
    backgroundColor: colors.surface,
  },
  buttonLabel: {
    fontSize:   11,
    fontWeight: '500',
    color:      colors.text,
  },
});

export default SocialLoginButtons;
