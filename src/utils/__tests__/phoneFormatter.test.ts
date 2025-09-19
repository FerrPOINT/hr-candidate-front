import { formatPhoneNumber, validatePhoneNumber, cleanPhoneNumber } from '../phoneFormatter';

describe('phoneFormatter', () => {
  describe('formatPhoneNumber', () => {
    it('форматирует пустую строку', () => {
      expect(formatPhoneNumber('')).toBe('');
    });

    it('форматирует короткие номера', () => {
      expect(formatPhoneNumber('7')).toBe('+7 (7');
      expect(formatPhoneNumber('79')).toBe('+7 (79');
      expect(formatPhoneNumber('791')).toBe('+7 (791');
    });

    it('форматирует номера средней длины', () => {
      expect(formatPhoneNumber('7912')).toBe('+7 (791) 2');
      expect(formatPhoneNumber('79123')).toBe('+7 (791) 23');
      expect(formatPhoneNumber('791234')).toBe('+7 (791) 234');
    });

    it('форматирует номера до 8 цифр', () => {
      expect(formatPhoneNumber('7912345')).toBe('+7 (791) 234-5');
      expect(formatPhoneNumber('79123456')).toBe('+7 (791) 234-56');
    });

    it('форматирует полные номера', () => {
      expect(formatPhoneNumber('7912345678')).toBe('+7 (791) 234-56-78');
      expect(formatPhoneNumber('79123456789')).toBe('+7 (791) 234-56-78');
    });

    it('очищает номер от нецифровых символов', () => {
      expect(formatPhoneNumber('+7 (912) 345-67-89')).toBe('+7 (791) 234-56-78');
      expect(formatPhoneNumber('7-912-345-67-89')).toBe('+7 (791) 234-56-78');
      expect(formatPhoneNumber('7 912 345 67 89')).toBe('+7 (791) 234-56-78');
    });

    it('обрабатывает некорректный ввод', () => {
      expect(formatPhoneNumber('abc')).toBe('');
      expect(formatPhoneNumber('123abc456')).toBe('+7 (123) 456');
    });
  });

  describe('validatePhoneNumber', () => {
    it('принимает корректные номера', () => {
      expect(validatePhoneNumber('79123456789')).toBe(true);
      expect(validatePhoneNumber('+79123456789')).toBe(true);
      expect(validatePhoneNumber('1234567890')).toBe(true);
      expect(validatePhoneNumber('+1234567890123')).toBe(true);
    });

    it('принимает номера с пробелами и дефисами', () => {
      expect(validatePhoneNumber('+7 912 345 67 89')).toBe(true);
      expect(validatePhoneNumber('7-912-345-67-89')).toBe(true);
      expect(validatePhoneNumber('+7 (912) 345-67-89')).toBe(true);
    });

    it('отклоняет некорректные номера', () => {
      expect(validatePhoneNumber('abc')).toBe(false);
      expect(validatePhoneNumber('')).toBe(false);
      expect(validatePhoneNumber('123')).toBe(false); // слишком короткий
      expect(validatePhoneNumber('1234567890123456')).toBe(false); // слишком длинный
    });

    it('отклоняет номера с недопустимыми символами', () => {
      expect(validatePhoneNumber('791234567ab')).toBe(false);
      expect(validatePhoneNumber('7912345678@')).toBe(false);
    });
  });

  describe('cleanPhoneNumber', () => {
    it('удаляет все нецифровые символы', () => {
      expect(cleanPhoneNumber('+7 (912) 345-67-89')).toBe('79123456789');
      expect(cleanPhoneNumber('7-912-345-67-89')).toBe('79123456789');
      expect(cleanPhoneNumber('7 912 345 67 89')).toBe('79123456789');
    });

    it('обрабатывает пустую строку', () => {
      expect(cleanPhoneNumber('')).toBe('');
    });

    it('обрабатывает строки только с нецифровыми символами', () => {
      expect(cleanPhoneNumber('abc')).toBe('');
      expect(cleanPhoneNumber('+-() ')).toBe('');
    });

    it('сохраняет только цифры', () => {
      expect(cleanPhoneNumber('abc123def456ghi')).toBe('123456');
    });
  });
});