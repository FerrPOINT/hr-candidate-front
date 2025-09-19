import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Мок для candidateAuthService
const mockAuthenticate = jest.fn();

jest.mock('../../services/candidateAuthService', () => ({
  candidateAuthService: {
    authenticate: mockAuthenticate,
  },
  CandidateAuthData: jest.fn(),
}));

// Мок для useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ interviewId: '123' }),
}));

import CandidateLogin from '../../pages/CandidateLogin';

describe.skip('CandidateLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Мок для localStorage
    const mockPositionSummary = {
      id: 123,
      title: 'Software Engineer',
      department: 'Engineering',
      company: 'WMT group',
      type: 'Full-time',
      questionsCount: 6
    };
    
    // Мокаем localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'position_summary') {
            return JSON.stringify(mockPositionSummary);
          }
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
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

    // Проверяем наличие логотипа
    expect(screen.getByAltText(/wmt logo/i)).toBeInTheDocument();
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
    
    // Очищаем поля и пытаемся отправить форму
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);
    
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    
    fireEvent.click(submitButton);

    // Проверяем, что появились ошибки валидации
    await waitFor(() => {
      expect(screen.getByText(/имя обязательно для заполнения/i)).toBeInTheDocument();
      expect(screen.getByText(/фамилия обязательна для заполнения/i)).toBeInTheDocument();
      expect(screen.getByText(/email обязателен для заполнения/i)).toBeInTheDocument();
    });
  });

  it('позволяет вводить данные в поля', () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    expect(firstNameInput).toHaveValue('Иван');
    expect(lastNameInput).toHaveValue('Иванов');
    expect(emailInput).toHaveValue('ivan@example.com');
  });

  it('кнопка Продолжить активна при заполненных полях', async () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    
    // Проверяем, что кнопка активна (не disabled)
    expect(submitButton).not.toBeDisabled();
  });

  it('кнопка Продолжить отключается во время загрузки', async () => {
    mockAuthenticate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    
    // Заполняем форму и отправляем
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    fireEvent.click(submitButton);

    // Проверяем, что кнопка отключена и показывает "Вход..."
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/вход/i)).toBeInTheDocument();
    });
  });

  it('успешно отправляет форму при корректных данных', async () => {
    mockAuthenticate.mockResolvedValue({
      success: true,
      candidateId: '123',
      message: 'Требуется верификация email'
    });

    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    
    // Заполняем форму и отправляем
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    fireEvent.click(submitButton);

    // Проверяем, что authenticate был вызван с правильными данными
    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalledWith({
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123
      });
    });

    // Проверяем, что произошел переход на страницу верификации
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/candidate/verify-email?email=ivan%40example.com&interviewId=123');
    });
  });

  it('обрабатывает ошибки аутентификации', async () => {
    mockAuthenticate.mockResolvedValue({
      success: false,
      error: 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.'
    });

    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    
    // Заполняем форму и отправляем
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    fireEvent.click(submitButton);

    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText(/извините, для вас не назначено собеседование/i)).toBeInTheDocument();
    });
  });

  it('показывает информацию о вакансии', async () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Проверяем, что информация о вакансии отображается
    expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/engineering/i)).toBeInTheDocument();
    expect(screen.getByText(/wmt group/i)).toBeInTheDocument();
    expect(screen.getByText(/full-time/i)).toBeInTheDocument();
    expect(screen.getByText(/6 вопросов в интервью/i)).toBeInTheDocument();
  });

  it('кнопка Продолжить правильно отключается при отсутствии positionId', async () => {
    // Мокаем отсутствие данных в localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
    
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    
    // Кнопка должна быть отключена, так как positionId не загружен
    expect(submitButton).toBeDisabled();
  });

  it('кнопка Продолжить правильно обрабатывает состояние загрузки', async () => {
    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    
    // Заполняем форму
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    // Мокаем долгую аутентификацию
    mockAuthenticate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    fireEvent.click(submitButton);

    // Проверяем, что кнопка отключена и показывает состояние загрузки
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/вход/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /вход/i })).toBeInTheDocument();
    });
  });

  it('правильно обрабатывает успешный логин - переходит на следующую страницу', async () => {
    mockAuthenticate.mockResolvedValue({
      success: true,
      candidateId: '123',
      message: 'Требуется верификация email'
    });

    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Заполняем форму и отправляем
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    fireEvent.click(submitButton);

    // Проверяем, что authenticate был вызван с правильными данными
    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalledWith({
        firstName: 'Иван',
        lastName: 'Иванов',
        email: 'ivan@example.com',
        positionId: 123
      });
    });

    // Проверяем, что произошел переход на страницу верификации
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/candidate/verify-email?email=ivan%40example.com&interviewId=123');
    });
  });

  it('правильно обрабатывает неудачный логин - показывает ошибку красными буквами над кнопкой', async () => {
    mockAuthenticate.mockResolvedValue({
      success: false,
      error: 'Извините, для вас не назначено собеседование. Пожалуйста, обратитесь к рекрутеру.'
    });

    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Заполняем форму и отправляем
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    fireEvent.click(submitButton);

    // Проверяем, что authenticate был вызван
    await waitFor(() => {
      expect(mockAuthenticate).toHaveBeenCalled();
    });

    // Проверяем, что появилось сообщение об ошибке красными буквами над кнопкой
    await waitFor(() => {
      const errorMessage = screen.getByText(/извините, для вас не назначено собеседование/i);
      expect(errorMessage).toBeInTheDocument();
      
      // Проверяем, что ошибка находится в красном блоке
      const errorContainer = errorMessage.closest('.bg-red-50');
      expect(errorContainer).toBeInTheDocument();
      
      // Проверяем, что ошибка отображается (находится в DOM)
      expect(errorContainer).toBeInTheDocument();
    });

    // Проверяем, что НЕ произошел переход на другую страницу
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('правильно обрабатывает ошибку API - показывает сообщение об ошибке', async () => {
    mockAuthenticate.mockRejectedValue(new Error('Network error'));

    render(
      <MemoryRouter>
        <CandidateLogin />
      </MemoryRouter>
    );

    // Ждем загрузки данных о вакансии из localStorage
    await waitFor(() => {
      expect(screen.getByText(/software engineer/i)).toBeInTheDocument();
    });

    // Заполняем форму и отправляем
    const firstNameInput = screen.getByPlaceholderText(/введите ваше имя/i);
    const lastNameInput = screen.getByPlaceholderText(/введите вашу фамилию/i);
    const emailInput = screen.getByPlaceholderText(/введите ваш email/i);

    fireEvent.change(firstNameInput, { target: { value: 'Иван' } });
    fireEvent.change(lastNameInput, { target: { value: 'Иванов' } });
    fireEvent.change(emailInput, { target: { value: 'ivan@example.com' } });

    const submitButton = screen.getByRole('button', { name: /продолжить/i });
    fireEvent.click(submitButton);

    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Проверяем, что НЕ произошел переход на другую страницу
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
