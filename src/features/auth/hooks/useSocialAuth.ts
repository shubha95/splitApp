import { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { authorize } from 'react-native-app-auth';
import PublicClientApplication from 'react-native-msal';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { socialLoginThunk, clearError } from '../store/authSlice';
import { ENV } from '../../../config/env';
import type { SocialProvider } from '../../../types/api';

// Values come from src/.env — replace the TODO_ placeholders there with real credentials

const MSAL_CONFIG = {
  auth: {
    clientId:  ENV.MICROSOFT_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
  },
};

const TWITTER_CONFIG = {
  issuer:               'https://twitter.com',
  clientId:             ENV.TWITTER_CLIENT_ID,
  redirectUrl:          ENV.TWITTER_REDIRECT_URL,
  scopes:               ['tweet.read', 'users.read', 'offline.access'],
  serviceConfiguration: {
    authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
    tokenEndpoint:         'https://api.twitter.com/2/oauth2/token',
    revocationEndpoint:    'https://api.twitter.com/2/oauth2/revoke',
  },
  usePKCE: true,
};

// ─────────────────────────────────────────────────────────────────────────────

export const useSocialAuth = () => {
  const dispatch = useAppDispatch();
  const { error: reduxError } = useAppSelector(s => s.auth);

  // Track which provider is in-flight so the UI can show a spinner on that button only
  const [activeProvider, setActiveProvider] = useState<SocialProvider | null>(null);
  const [error, setError]                   = useState<string | null>(null);

  const isLoading = activeProvider !== null;

  // Configure once on mount — must not be called on every sign-in attempt
  useEffect(() => {
    GoogleSignin.configure({ webClientId: ENV.GOOGLE_WEB_CLIENT_ID });
  }, []);

  const clearErrors = () => {
    setError(null);
    if (reduxError) dispatch(clearError());
  };

  const runSocialLogin = async (
    provider: SocialProvider,
    getProviderToken: () => Promise<string>,
  ) => {
    console.log(`Initiating ${provider} login flow`);
    clearErrors();
    setActiveProvider(provider);
    try {
      const providerToken = await getProviderToken();
      console.log(`Received token from ${provider}:`, providerToken);
      await dispatch(socialLoginThunk({ provider, token: providerToken })).unwrap();
      // isSignedIn = true → RootNavigator automatically switches to AppNavigator
    } catch (err: unknown) {
      console.error(`Error during ${provider} login:`, err);
      let message = err instanceof Error ? err.message : 'Social login failed';
      if (typeof message === 'string' && message.includes('DEVELOPER_ERROR')) {
        message =
          'Google Sign-In is not configured correctly. ' +
          'Ensure the SHA-1 fingerprint and package name are registered in Google Cloud Console ' +
          'and that google-services.json is present in android/app/.';
      }
      setError(message);
    } finally {
      setActiveProvider(null);
    }
  };

  const loginWithGoogle = () =>
    runSocialLogin('google', async () => {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { data } = await GoogleSignin.signIn();
      if (!data?.idToken) throw new Error('Google sign-in did not return a token');
      return data.idToken;
    });

  const loginWithFacebook = () =>
    runSocialLogin('facebook', async () => {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      if (result.isCancelled) throw new Error('Facebook login was cancelled');
      const tokenData = await AccessToken.getCurrentAccessToken();
      if (!tokenData?.accessToken) throw new Error('Facebook did not return an access token');
      return tokenData.accessToken;
    });

  const loginWithTwitter = () =>
    runSocialLogin('twitter', async () => {
      const authState = await authorize(TWITTER_CONFIG);
      if (!authState.accessToken) throw new Error('Twitter did not return an access token');
      return authState.accessToken;
    });

  const loginWithOutlook = () =>
    runSocialLogin('outlook', async () => {
      const pca = new PublicClientApplication(MSAL_CONFIG);
      await pca.init();
      const result = await pca.acquireToken({ scopes: ['User.Read'] });
      if (!result?.accessToken) throw new Error('Microsoft did not return an access token');
      return result.accessToken;
    });

  return {
    loginWithGoogle,
    loginWithFacebook,
    loginWithTwitter,
    loginWithOutlook,
    isLoading,
    activeProvider,
    error,
  };
};
