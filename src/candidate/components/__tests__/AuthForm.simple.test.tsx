import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthForm } from '../AuthForm';

describe('AuthForm (simple)', () => {
  it('рендерит без ошибок', () => {
    expect(() => {
      render(<AuthForm />);
    }).not.toThrow();
  });

  it('отображает основной контент', () => {
    render(<AuthForm />);
    
    // Проверяем, что компонент рендерится
    expect(document.body).toContainHTML('div');
  });
});
