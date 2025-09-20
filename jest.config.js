module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30
    }
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-dnd|react-dnd-html5-backend|@react-dnd|@radix-ui|lucide-react|@testing-library|react-dnd-core|@elevenlabs|react-router-dom|react-router|@hookform|react-hook-form|framer-motion|embla-carousel|cmdk|sonner|vaul|recharts|next-themes|input-otp|jwt-decode|web-vitals|zod|zustand|class-variance-authority|clsx|tailwind-merge|date-fns|form-data|react-dom|react|axios)/)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true
    }
  },
  moduleNameMapper: {
    '^generated-src/(.*)$': '<rootDir>/tests/mocks/generated-client.ts',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '^react-dnd$': '<rootDir>/node_modules/react-dnd/dist/index.js',
    '^react-dnd-html5-backend$': '<rootDir>/node_modules/react-dnd-html5-backend/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
}; 