import { API_BASE_URL, API_TIMEOUT, APP_ENV } from '@env';

const required = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`[Config] Missing required env variable: ${key}`);
  }
  return value;
};

export const ENV = {
  API_BASE_URL: required('API_BASE_URL', API_BASE_URL),
  API_TIMEOUT:  Number(required('API_TIMEOUT', API_TIMEOUT)),
  APP_ENV:      required('APP_ENV', APP_ENV) as 'development' | 'staging' | 'production',
  IS_DEV:       APP_ENV === 'development',
  IS_PROD:      APP_ENV === 'production',
} as const;
