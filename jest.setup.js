// Простые моки для node/jsdom environment

// Include jest-dom matchers
try {
  require('@testing-library/jest-dom');
} catch (e) {
  // ignore if not installed
}

// Mock localStorage/sessionStorage for tests
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

  if (!('localStorage' in window)) {
    Object.defineProperty(window, 'localStorage', {
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

  // Mock axios to avoid URL constructor issues
  jest.mock('axios', () => ({
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      }
    })),
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() }
    }
  }));
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