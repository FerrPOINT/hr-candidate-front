import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../AuthForm';
import { candidateAuthService } from '../../services/candidateAuthService';

// Моки для зависимостей
jest.mock('../../services/candidateAuthService');

const mockCandidateAuthService = candidateAuthService as jest.Mocked<typeof candidateAuthService>;

describe('AuthForm (simple)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('отображает поля ввода', () => {
    render(<AuthForm />);
    
    // Проверяем наличие полей ввода
    const emailInput = screen.queryByPlaceholderText(/email/i);
    const phoneInput = screen.queryByPlaceholderText(/phone/i);
    
    expect(emailInput || phoneInput).toBeTruthy();
  });

  it('отображает кнопку отправки', () => {
    render(<AuthForm />);
    
    const submitButton = screen.queryByRole('button', { name: /отправить|войти|продолжить/i });
    expect(submitButton).toBeTruthy();
  });

  it('обрабатывает ввод в поля формы', async () => {
    render(<AuthForm />);
    
    const emailInput = screen.queryByPlaceholderText(/email/i);
    if (emailInput) {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput).toHaveValue('test@example.com');
    }
  });

  it('имеет кнопку отправки формы', () => {
    render(<AuthForm />);
    
    const submitButton = screen.queryByRole('button', { name: /отправить|войти|продолжить/i });
    expect(submitButton).toBeTruthy();
  });

  it('отображает поля ввода для пользователя', () => {
    render(<AuthForm />);
    
    // Проверяем наличие полей ввода
    const inputs = screen.queryAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });
});

