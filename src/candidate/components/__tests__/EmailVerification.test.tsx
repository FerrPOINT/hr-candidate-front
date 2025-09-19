import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmailVerification } from '../EmailVerification';

describe('EmailVerification', () => {
  it('рендерит компонент верификации email', () => {
    render(<EmailVerification />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByText('Мы отправили 6-значный код подтверждения на:')).toBeInTheDocument();
  });

  it('отображает кнопку подтверждения', () => {
    render(<EmailVerification />);
    
    expect(screen.getByRole('button', { name: 'Подтвердить код' })).toBeInTheDocument();
  });

  it('обрабатывает ввод кода', () => {
    render(<EmailVerification />);
    
    const codeInput = screen.getByPlaceholderText('123456'); // Changed to placeholder text
    fireEvent.change(codeInput, { target: { value: '123456' } });

    expect(codeInput).toHaveValue('123456');
  });

  it('отображает кнопку отправки повторно', () => {
    render(<EmailVerification />);
    
    expect(screen.getByText(/Отправить повторно/)).toBeInTheDocument();
  });

  it('отображает подсказку о проверке спама', () => {
    render(<EmailVerification />);
    
    expect(screen.getByText('Не получили код? Проверьте папку "Спам" или "Промоакции"')).toBeInTheDocument();
  });
});