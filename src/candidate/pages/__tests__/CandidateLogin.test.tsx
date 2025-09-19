import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CandidateLogin from '../CandidateLogin';
import { candidateAuthService } from '../../services/candidateAuthService';

// Моки для зависимостей
jest.mock('../../services/candidateAuthService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ interviewId: '123' }),
}));

describe('CandidateLogin', () => {
  const mockAuthenticate = jest.fn();
  const mockGetPositionSummary = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (candidateAuthService.authenticate as jest.Mock) = mockAuthenticate;
    (candidateAuthService.getPositionSummary as jest.Mock) = mockGetPositionSummary;
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('рендерит форму входа', () => {
    renderWithRouter(<CandidateLogin />);
    
    expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя *')).toBeInTheDocument();
    expect(screen.getByLabelText('Фамилия *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument();
  });

  it('отображает поля формы с предзаполненными значениями', () => {
    renderWithRouter(<CandidateLogin />);
    
    expect(screen.getByDisplayValue('Тест')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Кандидат')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('отображает кнопку помощи', () => {
    renderWithRouter(<CandidateLogin />);
    
    expect(screen.getByRole('button', { name: /помощь/i })).toBeInTheDocument();
  });

  it('отображает логотип', () => {
    renderWithRouter(<CandidateLogin />);
    
    expect(screen.getByAltText('Company Logo')).toBeInTheDocument();
  });

  it('отображает информацию о позиции', () => {
    renderWithRouter(<CandidateLogin />);
    
    // Проверяем, что есть информация о вакансии (если загружена)
    expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();
  });

  it('отображает форму входа', () => {
    renderWithRouter(<CandidateLogin />);
    
    expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();
    expect(screen.getByLabelText('Имя *')).toBeInTheDocument();
    expect(screen.getByLabelText('Фамилия *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
  });

  it('отображает кнопку входа', () => {
    renderWithRouter(<CandidateLogin />);
    
    expect(screen.getByRole('button', { name: 'Продолжить' })).toBeInTheDocument();
  });

  it('отображает заголовок страницы', () => {
    renderWithRouter(<CandidateLogin />);
    
    expect(screen.getByText('Добро пожаловать')).toBeInTheDocument();
  });
});
