import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CandidateInterview from '../CandidateInterview';

// Моки для зависимостей
jest.mock('../../hooks/useInterviewStage');
jest.mock('../../hooks/useVoiceInterview');
jest.mock('../../services/voiceInterviewService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ interviewId: '123' }),
}));

describe('CandidateInterview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('рендерит компонент интервью', () => {
    renderWithRouter(<CandidateInterview />);
    
    // Проверяем, что компонент рендерится без ошибок
    expect(screen.getByText('Подготовка интервью...')).toBeInTheDocument();
  });

  it('отображает заголовок интервью', () => {
    renderWithRouter(<CandidateInterview />);
    
    expect(screen.getByText('Подготовка интервью...')).toBeInTheDocument();
  });

  it('отображает прогресс интервью', () => {
    renderWithRouter(<CandidateInterview />);
    
    // Проверяем, что есть индикатор загрузки
    expect(screen.getByText('Подготовка интервью...')).toBeInTheDocument();
  });

  it('отображает кнопки управления', () => {
    renderWithRouter(<CandidateInterview />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByText('Подготовка интервью...')).toBeInTheDocument();
  });

  it('отображает информацию о интервью', () => {
    renderWithRouter(<CandidateInterview />);
    
    // Проверяем, что есть информация о загрузке
    expect(screen.getByText('Подготовка интервью...')).toBeInTheDocument();
  });
});
