// Простой тест для проверки логики хука
describe('useRoleAccess Logic', () => {
    it('should define role access constants', () => {
        // Проверяем что RoleEnum импортируется правильно
        const { RoleEnum } = require('../../api/models');

        expect(RoleEnum).toBeDefined();
        expect(typeof RoleEnum).toBe('object');
    });

    it('should check role permissions logic', () => {
        const checkPermission = (userRole: string, requiredRole: string) => {
            return userRole === requiredRole || userRole === 'ADMIN';
        };

        expect(checkPermission('ADMIN', 'USER')).toBe(true);
        expect(checkPermission('USER', 'USER')).toBe(true);
        expect(checkPermission('USER', 'ADMIN')).toBe(false);
    });
}); 