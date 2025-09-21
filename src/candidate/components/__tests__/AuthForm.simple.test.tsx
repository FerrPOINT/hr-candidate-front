import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthForm } from '../AuthForm';

// Мокаем candidateAuthService
jest.mock('../../services/candidateAuthService', () => ({
  candidateAuthService: {
    getPositionSummary: jest.fn(),
    authenticate: jest.fn(),
  },
}));

const mockOnContinue = jest.fn();
const defaultProps = {
  onContinue: mockOnContinue,
  positionId: 123,
};

describe('AuthForm - Simple Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AuthForm {...defaultProps} />);
    expect(screen.getByText(/продолжить/i)).toBeInTheDocument();
  });

  it('shows loading state when position is loading', () => {
    render(<AuthForm {...defaultProps} />);
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();
  });

  it('renders with provided job position', () => {
    const jobPosition = {
      title: 'Backend Developer',
      department: 'Engineering',
      company: 'Tech Corp',
      type: 'Full-time',
      questionsCount: 3,
    };

    render(<AuthForm {...defaultProps} jobPosition={jobPosition} />);
    expect(screen.getByText(/backend developer/i)).toBeInTheDocument();
  });

  it('has form inputs', () => {
    render(<AuthForm {...defaultProps} />);
    expect(screen.getByPlaceholderText(/имя/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/фамилию/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('has help button', () => {
    render(<AuthForm {...defaultProps} />);
    expect(screen.getByRole('button', { name: /помощь/i })).toBeInTheDocument();
  });
});