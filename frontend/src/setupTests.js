import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Polyfill dla TextEncoder/TextDecoder w Jest
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock react-markdown
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));

// Mock react-syntax-highlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }) => children,
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {},
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Inicjalizacja i18n dla testów
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    resources: {
      en: {
        translation: {
          // Home
          hero_title: 'Learn coding like a game!',
          hero_subtitle: 'Daily lessons, streaks, XP points and real-world projects',
          hero_button: 'Get Started Free',
          
          // Courses
          courses_title: 'Choose Your Programming Language',
          
          // Mini Games
          minigames_title: 'Mini Games',
          minigames_subtitle: 'Practice your coding skills with fun challenges',
          
          // Footer
          footer_desc: 'Learn programming interactively',
        },
      },
    },
  });
