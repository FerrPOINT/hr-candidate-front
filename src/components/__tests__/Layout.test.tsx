import React from 'react';
import { render, screen } from '../../test-utils';

// Простой тест для проверки что тесты работают
describe('Basic Test Suite', () => {
    it('should render a simple component', () => {
        const TestComponent = () => <div>Hello Test</div>;

        render(<TestComponent />);

        expect(screen.getByText('Hello Test')).toBeDefined();
    });

    it('should pass basic assertion', () => {
        expect(1 + 1).toBe(2);
    });

    it('should have working DOM queries', () => {
        render(<div data-testid="test-element">Test Element</div>);

        const element = screen.getByTestId('test-element');
        expect(element).toBeDefined();
        expect(element.textContent).toBe('Test Element');
    });
}); 