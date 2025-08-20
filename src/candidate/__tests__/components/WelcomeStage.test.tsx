import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomeStage } from '../../components/interview/WelcomeStage';

describe('WelcomeStage', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('рендерит приветственный экран', () => {
    render(
      <WelcomeStage
        onNext={mockOnNext}
        onBack={mockOnBack}
        candidateName="Иван Иванов"
      />
    );

    expect(screen.getByRole('heading', { name: /добро пожаловать/i })).toBeInTheDocument();
    expect(screen.getByText(/иван иванов/i)).toBeInTheDocument();
    expect(screen.getByText(/готовы начать интервью/i)).toBeInTheDocument();
  });

  it('отображает инструкции', () => {
    render(
      <WelcomeStage
        onNext={mockOnNext}
        onBack={mockOnBack}
        candidateName="Иван Иванов"
      />
    );

    expect(screen.getByText(/голосовое интервью с ai-ассистентом/i)).toBeInTheDocument();
    expect(screen.getByText(/проверим ваш микрофон/i)).toBeInTheDocument();
    expect(screen.getByText(/зададим несколько вопросов/i)).toBeInTheDocument();
  });

  it('вызывает onNext при нажатии кнопки "Начать"', () => {
    render(
      <WelcomeStage
        onNext={mockOnNext}
        onBack={mockOnBack}
        candidateName="Иван Иванов"
      />
    );

    const startButton = screen.getByRole('button', { name: /начать/i });
    fireEvent.click(startButton);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('вызывает onBack при нажатии кнопки "Назад"', () => {
    render(
      <WelcomeStage
        onNext={mockOnNext}
        onBack={mockOnBack}
        candidateName="Иван Иванов"
      />
    );

    const backButton = screen.getByRole('button', { name: /назад/i });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('отображает правильное имя кандидата', () => {
    render(
      <WelcomeStage
        onNext={mockOnNext}
        onBack={mockOnBack}
        candidateName="Петр Петров"
      />
    );

    expect(screen.getByText(/петр петров/i)).toBeInTheDocument();
  });
});
