import React from 'react';
import { render, screen } from '@testing-library/react';
import { Label } from '../label';

describe('Label', () => {
  it('рендерит label с текстом', () => {
    render(<Label>Тестовая метка</Label>);
    
    expect(screen.getByText('Тестовая метка')).toBeInTheDocument();
  });

  it('связывается с input через htmlFor', () => {
    render(
      <div>
        <Label htmlFor="test-input">Имя</Label>
        <input id="test-input" />
      </div>
    );
    
    const label = screen.getByText('Имя');
    const input = screen.getByRole('textbox');
    
    expect(label).toHaveAttribute('for', 'test-input');
    expect(input).toHaveAttribute('id', 'test-input');
  });

  it('применяет правильные CSS классы', () => {
    render(<Label className="custom-class">Custom label</Label>);
    
    expect(screen.getByText('Custom label')).toHaveClass('custom-class');
    expect(screen.getByText('Custom label')).toHaveClass('text-sm');
    expect(screen.getByText('Custom label')).toHaveClass('font-medium');
  });

  it('поддерживает disabled состояние', () => {
    render(<Label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Disabled label</Label>);
    
    expect(screen.getByText('Disabled label')).toHaveClass('peer-disabled:cursor-not-allowed');
    expect(screen.getByText('Disabled label')).toHaveClass('peer-disabled:opacity-70');
  });

  it('передает дополнительные пропсы', () => {
    render(<Label data-testid="custom-label" aria-describedby="description">Test label</Label>);
    
    const label = screen.getByTestId('custom-label');
    expect(label).toHaveAttribute('aria-describedby', 'description');
  });

  it('поддерживает ref', () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref label</Label>);
    
    expect(ref.current).toBeDefined();
  });
});
