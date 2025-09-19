import React from 'react';
import { render, screen } from '@testing-library/react';
import { BlockProgress } from '../BlockProgress';

describe('BlockProgress', () => {
  it('рендерит прогресс блоков', () => {
    render(<BlockProgress />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('отображает прогресс', () => {
    render(<BlockProgress progress={50} />);
    
    // Проверяем, что есть прогресс бар
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('принимает пропсы', () => {
    render(<BlockProgress total={10} current={5} />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
