// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Мок для Web Audio API
Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    state: 'inactive',
  })),
});

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    mediaDevices: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [{ stop: jest.fn() }],
      }),
    },
  },
});

// Мок для URL.createObjectURL
Object.defineProperty(window, 'URL', {
  writable: true,
  value: {
    createObjectURL: jest.fn(() => 'mock-audio-url'),
    revokeObjectURL: jest.fn(),
  },
});

// Мок для HTMLAudioElement
Object.defineProperty(window, 'HTMLAudioElement', {
  writable: true,
  value: class MockAudio {
    constructor() {
      this.src = '';
      this.currentTime = 0;
      this.duration = 0;
      this.paused = true;
      this.volume = 1;
      this.play = jest.fn().mockResolvedValue(undefined);
      this.pause = jest.fn();
      this.load = jest.fn();
      this.addEventListener = jest.fn();
      this.removeEventListener = jest.fn();
    }
  },
});

// Мок для localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Мок для sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});
