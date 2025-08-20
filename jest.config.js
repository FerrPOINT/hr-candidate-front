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
  collectCoverage: false,
  transformIgnorePatterns: [
    '/node_modules/(?!(react-dnd|react-dnd-html5-backend|@react-dnd|@radix-ui|lucide-react|@testing-library|react-dnd-core)/)'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-dnd$': '<rootDir>/node_modules/react-dnd/dist/index.js',
    '^react-dnd-html5-backend$': '<rootDir>/node_modules/react-dnd-html5-backend/dist/index.js',
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
      },
    },
  },
}; 