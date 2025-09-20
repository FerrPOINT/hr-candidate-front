import React from 'react';
import { render, screen } from '@testing-library/react';
import { BlockProgress } from '../BlockProgress';

describe('BlockProgress', () => {
  it('рендерит прогресс блоков', () => {
    render(<BlockProgress currentStep={2} totalSteps={5} />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('отображает прогресс', () => {
    render(<BlockProgress currentStep={3} totalSteps={10} />);
    
    // Проверяем, что есть прогресс бар
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('принимает пропсы', () => {
    render(<BlockProgress currentStep={5} totalSteps={10} />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByText('6')).toBeInTheDocument();
  });
});
