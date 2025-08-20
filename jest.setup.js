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