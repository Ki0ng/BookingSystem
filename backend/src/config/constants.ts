export const CACHE_TTL = {
  HOTEL_DETAILS: 900, // 15 minutes
} as const;

export const CACHE_PREFIX = {
  HOTEL: 'hotel:v2:',
} as const;

export const AUTH_CONFIG = {
  OTP_EXPIRY_MS: 10 * 60 * 1000, // 10 minutes
  RESET_PASSWORD_TOKEN_EXPIRY: '1h',
  RESET_PASSWORD_TOKEN_TYPE: 'reset-password',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 10000,
} as const;
