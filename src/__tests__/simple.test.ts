// Самый простой тест для проверки что Jest работает
describe('Simple Test', () => {
    it('should pass basic assertion', () => {
        expect(1 + 1).toBe(2);
    });

    it('should work with strings', () => {
        expect('hello').toBe('hello');
    });

    it('should work with arrays', () => {
        expect([1, 2, 3]).toHaveLength(3);
    });
}); 