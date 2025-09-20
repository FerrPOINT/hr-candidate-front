// Простые моки для node/jsdom environment

// Мокаем axios сразу в начале
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    request: jest.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    defaults: {
      headers: {
        common: {}
      }
    }
  })),
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
  request: jest.fn().mockResolvedValue({ data: {} }),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  defaults: {
    headers: {
      common: {}
    }
  }
}));

// Мокаем localStorage глобально
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = String(value);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    key: jest.fn((index) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Также мокаем глобальный localStorage
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Include jest-dom matchers
require('@testing-library/jest-dom');

// Mock для React Testing Library
const { configure } = require('@testing-library/react');

configure({
  testIdAttribute: 'data-testid',
});

// Mock для React DOM
const React = require('react');

// Убеждаемся, что React доступен глобально
global.React = React;

// Mock для React Testing Library renderHook
const { renderHook, render, screen, fireEvent, waitFor } = require('@testing-library/react');
global.renderHook = renderHook;
global.render = render;
global.screen = screen;
global.fireEvent = fireEvent;
global.waitFor = waitFor;

// Mock sessionStorage for tests
if (typeof window !== 'undefined') {
  const createStorageMock = () => {
    let store = {};
    return {
      getItem: (key) => (Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null),
      setItem: (key, value) => {
        store[key] = String(value);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index) => Object.keys(store)[index] || null,
      get length() {
        return Object.keys(store).length;
      },
    };
  };

  if (!('sessionStorage' in window)) {
    Object.defineProperty(window, 'sessionStorage', {
      value: createStorageMock(),
      configurable: true,
      writable: true,
    });
  }

  // MediaRecorder mock (глобально, безопасный минимум)
  if (!('MediaRecorder' in window)) {
    Object.defineProperty(window, 'MediaRecorder', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        stop: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        requestData: jest.fn(),
        ondataavailable: null,
        onstop: null,
        mimeType: 'audio/webm',
        stream: { getTracks: () => [{ stop: jest.fn() }] },
      })),
    });
  }

  // URL.createObjectURL mock
  if (!window.URL || !window.URL.createObjectURL) {
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: jest.fn(() => 'blob:mock'),
        revokeObjectURL: jest.fn(),
      },
    });
  }

  // requestAnimationFrame mock
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb) => setTimeout(cb, 16);
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = () => {};
  }
  if (!('sessionStorage' in window)) {
    Object.defineProperty(window, 'sessionStorage', {
      value: createStorageMock(),
      configurable: true,
      writable: true,
    });
  }

  // Mock matchMedia
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }),
    });
  }

  // Mock media APIs used by audio components if needed
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: jest.fn().mockResolvedValue({}),
    };
  }

  // Mock Web Audio API
  if (!window.AudioContext) {
    window.AudioContext = jest.fn().mockImplementation(() => ({
      createMediaStreamSource: jest.fn(),
      createAnalyser: jest.fn(),
      createGain: jest.fn(),
      createOscillator: jest.fn(),
      createMediaElementSource: jest.fn(),
      resume: jest.fn(),
      suspend: jest.fn(),
      close: jest.fn(),
    }));
  }

  // Mock ResizeObserver
  if (!window.ResizeObserver) {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  }

  // Mock URL constructor for axios compatibility
  if (!window.URL) {
    window.URL = jest.fn().mockImplementation((url, base) => {
      const mockUrl = {
        href: url,
        origin: 'http://localhost',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
        toString: () => url,
      };
      return mockUrl;
    });
  }

  // Global URL mock for axios
  global.URL = window.URL;

}

// Ensure console.error does not crash tests on expected warnings
const originalError = console.error;
console.error = (...args) => {
  // Suppress specific React warnings that are expected in tests
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: useLayoutEffect does nothing on the server'))
  ) {
    return;
  }
  originalError.apply(console, args);
};

// Моки для react-dnd
jest.mock('react-dnd', () => ({
  DndProvider: ({ children }) => children,
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isOver: false }, jest.fn()],
}));

jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: jest.fn(),
})); 