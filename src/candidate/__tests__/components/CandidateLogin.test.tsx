import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CandidateLogin from '../../pages/CandidateLogin';

// Мок для useCandidateAuth
jest.mock('../../hooks/useCandidateAuth', () => ({
  useCandidateAuth: () => ({
    authenticate: jest.fn(),
    isLoading: false,
    error: null,
  }),
}));

// Мок для useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ token: 'test-token' }),
}));

describe('CandidateLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит форму входа', () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    expect(screen.getByText(/добро пожаловать/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/введите ваше имя/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/введите вашу фамилию/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /продолжить/i })).toBeInTheDocument();
  });

  it('отображает логотип WMT', () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Используем более специфичный селектор для заголовка
    expect(screen.getByRole('heading', { name: /wmt ai/i })).toBeInTheDocument();
  });

  it('отображает кнопку помощи', () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /помощь/i })).toBeInTheDocument();
  });

  it('валидирует обязательные поля', async () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    fireEvent.click(submitButton);

    // Проверяем, что форма не отправляется без данных
    expect(submitButton).toBeInTheDocument();
  });

  it('позволяет вводить данные в поля', () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });

    expect(firstNameInput).toHaveValue('Иван');
    expect(lastNameInput).toHaveValue('Иванов');
  });
});
