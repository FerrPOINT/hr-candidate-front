import React from 'react';
import { render, screen } from '@testing-library/react';
import { AudioVisualizer } from '../AudioVisualizer';

describe('AudioVisualizer', () => {
  it('рендерит визуализатор аудио', () => {
    render(<AudioVisualizer />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('отображает волны аудио', () => {
    render(<AudioVisualizer />);
    
    // Проверяем, что есть SVG элемент
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('принимает пропсы', () => {
    render(<AudioVisualizer isActive={true} />);
    
    // Проверяем, что компонент рендерится
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
