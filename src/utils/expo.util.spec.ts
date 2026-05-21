import { isExpoPushToken } from './expo.util.js';

describe('isExpoPushToken', () => {
  it('should return true for valid Expo push tokens', () => {
    expect(isExpoPushToken('ExponentPushToken[1234567890abcdefghij]')).toBe(true);
    expect(isExpoPushToken('ExpoPushToken[1234567890abcdefghij]')).toBe(true);
  });

  it('should return true for valid legacy UUID push tokens', () => {
    expect(isExpoPushToken('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(isExpoPushToken('F39B8F8F-8C3C-4C9D-9F0F-3A1B4C5D6E7F')).toBe(true);
  });

  it('should return false for invalid Expo push tokens', () => {
    expect(isExpoPushToken('ExponentPushToken[invalid')).toBe(false);
    expect(isExpoPushToken('ExpoPushToken[invalid')).toBe(false);
    expect(isExpoPushToken('fcm_token_1234567890')).toBe(false);
    expect(isExpoPushToken('')).toBe(false);
    expect(isExpoPushToken('random-string')).toBe(false);
  });

  it('should return false for non-string inputs', () => {
    expect(isExpoPushToken(undefined)).toBe(false);
    expect(isExpoPushToken(null)).toBe(false);
    expect(isExpoPushToken(123)).toBe(false);
    expect(isExpoPushToken({})).toBe(false);
  });
});
