import * as Keychain from 'react-native-keychain';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from '../../config/constants';

// iOS: WHEN_UNLOCKED_THIS_DEVICE_ONLY — not backed up to iCloud, inaccessible when locked.
// Android: SECURE_SOFTWARE — Android Keystore-backed AES encryption.
const baseOptions = {
  service: STORAGE_KEYS.AUTH_TOKEN,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

const androidSecurityLevel =
  Platform.OS === 'android'
    ? { securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE }
    : {};

const tokenService = {
  save: async (token: string): Promise<void> => {
    await Keychain.setGenericPassword('token', token, {
      ...baseOptions,
      ...androidSecurityLevel,
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
