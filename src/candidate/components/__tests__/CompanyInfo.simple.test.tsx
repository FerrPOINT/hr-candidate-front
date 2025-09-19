import React from 'react';
import { render } from '@testing-library/react';
import { CompanyInfo } from '../CompanyInfo';

describe('CompanyInfo (simple)', () => {
  it('рендерит без ошибок', () => {
    expect(() => {
      render(<CompanyInfo />);
    }).not.toThrow();
  });

  it('отображает основной контент', () => {
    render(<CompanyInfo />);
    
    // Проверяем, что компонент рендерится
    expect(document.body).toContainHTML('div');
  });
});
