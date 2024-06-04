import { CookiesExpiration } from '../types/cookie-expiration.type';

export const COOKIE_EXPIRATION: CookiesExpiration = {
  ACCESS_TOKEN: 15 * 60 * 1000,
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000,
};
