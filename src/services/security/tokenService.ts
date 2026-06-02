import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../../config/constants';

const baseOptions = {
  service: STORAGE_KEYS.AUTH_TOKEN,
};

// iOS: token is stored in Secure Enclave, inaccessible when device is locked, never backed up to iCloud.
const iosOptions =
  Platform.OS === 'ios'
    ? { accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY }
    : {};

// Android: token is encrypted using Android Keystore (software-backed AES).
const androidOptions =
  Platform.OS === 'android'
    ? { securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE }
    : {};

const tokenService = {
  save: async (token: string): Promise<void> => {
    console.log('Saving token to secure storage:', token);
    await Keychain.setGenericPassword('token', token, {
      ...baseOptions,
      ...iosOptions,
      ...androidOptions,
    });
  },

  get: async (): Promise<string | null> => {
    const credentials = await Keychain.getGenericPassword(baseOptions);
    return credentials ? credentials.password : null;
  },

  remove: async (): Promise<void> => {
    await Keychain.resetGenericPassword(baseOptions);
  },
};

export default tokenService;
