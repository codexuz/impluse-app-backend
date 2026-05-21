/**
 * Checks if a given token is a valid Expo push token.
 *
 * @param token The token string to check.
 * @returns True if the token is a valid Expo push token, false otherwise.
 */
export function isExpoPushToken(token: any): boolean {
  if (typeof token !== 'string') {
    return false;
  }

  const isExpoFormat =
    (token.startsWith('ExponentPushToken[') || token.startsWith('ExpoPushToken[')) &&
    token.endsWith(']');

  const isUuidFormat = /^[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}$/i.test(token);

  return isExpoFormat || isUuidFormat;
}
