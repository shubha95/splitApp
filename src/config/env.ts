import {
  API_BASE_URL,
  API_TIMEOUT,
  APP_ENV,
  GOOGLE_WEB_CLIENT_ID,
  TWITTER_CLIENT_ID,
  TWITTER_REDIRECT_URL,
  MICROSOFT_CLIENT_ID,
} from '@env';

const required = (key: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`[Config] Missing required env variable: ${key}`);
  }
  return value;
};

export const ENV = {
  API_BASE_URL:         required('API_BASE_URL',         API_BASE_URL),
  API_TIMEOUT:          Number(required('API_TIMEOUT',   API_TIMEOUT)),
  APP_ENV:              required('APP_ENV',              APP_ENV) as 'development' | 'staging' | 'production',
  IS_DEV:               APP_ENV === 'development',
  IS_PROD:              APP_ENV === 'production',
  GOOGLE_WEB_CLIENT_ID: required('GOOGLE_WEB_CLIENT_ID', GOOGLE_WEB_CLIENT_ID),
  TWITTER_CLIENT_ID:    required('TWITTER_CLIENT_ID',    TWITTER_CLIENT_ID),
  TWITTER_REDIRECT_URL: required('TWITTER_REDIRECT_URL', TWITTER_REDIRECT_URL),
  MICROSOFT_CLIENT_ID:  required('MICROSOFT_CLIENT_ID',  MICROSOFT_CLIENT_ID),
} as const;
