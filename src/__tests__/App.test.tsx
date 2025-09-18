import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('рендерит 404 на корневом маршруте', () => {
    render(<App />);
    expect(screen.getByText(/404 - Страница не найдена/i)).toBeInTheDocument();
  });
}); 