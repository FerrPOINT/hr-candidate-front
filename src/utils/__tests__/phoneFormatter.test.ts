import { formatPhoneNumber, cleanPhoneNumber, validatePhoneNumber } from '../phoneFormatter';

describe('Phone Formatter', () => {
    describe('formatPhoneNumber', () => {
        it('should format phone number correctly', () => {
            // Тестируем реальную логику форматирования
            expect(formatPhoneNumber('1234567890')).toBe('+7 (123) 456-78-90');
            expect(formatPhoneNumber('123456789')).toBe('+7 (123) 456-78-9');
            expect(formatPhoneNumber('123')).toBe('+7 (123');
            expect(formatPhoneNumber('')).toBe('');
        });
    });

    describe('cleanPhoneNumber', () => {
        it('should clean phone number', () => {
            expect(cleanPhoneNumber('(123) 456-7890')).toBe('1234567890');
            expect(cleanPhoneNumber('+7 (123) 456-78-90')).toBe('71234567890');
            expect(cleanPhoneNumber('123-456-7890')).toBe('1234567890');
        });
    });

    describe('validatePhoneNumber', () => {
        it('should validate phone numbers', () => {
            expect(validatePhoneNumber('1234567890')).toBe(true);
            expect(validatePhoneNumber('123')).toBe(false);
            expect(validatePhoneNumber('12345678901234567890')).toBe(false);
            expect(validatePhoneNumber('')).toBe(false);
        });
    });
}); 