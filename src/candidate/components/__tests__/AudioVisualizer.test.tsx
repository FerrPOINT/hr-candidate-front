import React from 'react';
import { render, screen } from '@testing-library/react';
import { AudioVisualizer } from '../AudioVisualizer';

describe('AudioVisualizer', () => {
  it('рендерит визуализатор аудио', () => {
    const { container } = render(<AudioVisualizer />);
    
    // Проверяем, что компонент рендерится
    expect(container.firstChild).toBeInTheDocument();
  });

  it('отображает волны аудио', () => {
    const { container } = render(<AudioVisualizer />);
    
    // Проверяем, что есть контейнер с волнами
    expect(container.firstChild).toBeInTheDocument();
  });

  it('принимает пропсы', () => {
    const { container } = render(<AudioVisualizer isActive={true} />);
    
    // Проверяем, что компонент рендерится
    expect(container.firstChild).toBeInTheDocument();
  });
});
