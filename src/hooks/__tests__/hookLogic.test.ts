// Тесты логики хуков без React rendering
describe('Hook Logic Tests', () => {
    describe('useDebounce logic', () => {
        const debounce = (func: Function, delay: number) => {
            let timeoutId: NodeJS.Timeout;
            return (...args: any[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(null, args), delay);
            };
        };

        it('should delay function execution', (done) => {
            let callCount = 0;
            const debouncedFunc = debounce(() => callCount++, 100);

            debouncedFunc();
            debouncedFunc();
            debouncedFunc();

            expect(callCount).toBe(0);

            setTimeout(() => {
                expect(callCount).toBe(1);
                done();
            }, 150);
        });
    });

    describe('usePagination logic', () => {
        const calculatePagination = (currentPage: number, totalItems: number, pageSize: number) => {
            const totalPages = Math.ceil(totalItems / pageSize);
            const hasNext = currentPage < totalPages;
            const hasPrev = currentPage > 1;
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalItems);

            return {
                totalPages,
                hasNext,
                hasPrev,
                startIndex,
                endIndex,
                currentPage
            };
        };

        it('should calculate pagination correctly', () => {
            const result = calculatePagination(2, 100, 10);

            expect(result.totalPages).toBe(10);
            expect(result.hasNext).toBe(true);
            expect(result.hasPrev).toBe(true);
            expect(result.startIndex).toBe(10);
            expect(result.endIndex).toBe(20);
            expect(result.currentPage).toBe(2);
        });

        it('should handle edge cases', () => {
            const firstPage = calculatePagination(1, 100, 10);
            expect(firstPage.hasPrev).toBe(false);
            expect(firstPage.hasNext).toBe(true);

            const lastPage = calculatePagination(10, 100, 10);
            expect(lastPage.hasPrev).toBe(true);
            expect(lastPage.hasNext).toBe(false);
        });
    });

    describe('useValidation logic', () => {
        type ValidationRule = {
            required?: boolean;
            minLength?: number;
            maxLength?: number;
            pattern?: RegExp;
        };

        const validateField = (value: string, rules: ValidationRule): string[] => {
            const errors: string[] = [];

            if (rules.required && !value.trim()) {
                errors.push('Поле обязательно для заполнения');
            }

            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`Минимальная длина: ${rules.minLength}`);
            }

            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`Максимальная длина: ${rules.maxLength}`);
            }

            if (rules.pattern && !rules.pattern.test(value)) {
                errors.push('Неверный формат');
            }

            return errors;
        };

        it('should validate required fields', () => {
            const errors = validateField('', { required: true });
            expect(errors).toContain('Поле обязательно для заполнения');
        });

        it('should validate length constraints', () => {
            const shortErrors = validateField('ab', { minLength: 5 });
            expect(shortErrors).toContain('Минимальная длина: 5');

            const longErrors = validateField('very long text', { maxLength: 5 });
            expect(longErrors).toContain('Максимальная длина: 5');
        });

        it('should validate patterns', () => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const errors = validateField('invalid-email', { pattern: emailPattern });
            expect(errors).toContain('Неверный формат');
        });

        it('should pass all validations', () => {
            const errors = validateField('test@example.com', {
                required: true,
                minLength: 5,
                maxLength: 50,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            });
            expect(errors).toHaveLength(0);
        });
    });
}); 