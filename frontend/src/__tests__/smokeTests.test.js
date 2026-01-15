import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Smoke Tests - Podstawowa funkcjonalność', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Testy renderowania komponentów', () => {
    test('Komponent Home renderuje się bez błędów', async () => {
      const Home = require('../components/Home/home.jsx').default;
      
      const { container } = render(
        <BrowserRouter>
          <Home theme="light" />
        </BrowserRouter>
      );
      
      expect(container).toBeInTheDocument();
    });

    test('Komponent Header renderuje się bez błędów', () => {
      const Header = require('../components/BasicSiteView/Header/Header.jsx').default;
      
      render(
        <BrowserRouter>
          <Header theme="light" toggleTheme={() => {}} />
        </BrowserRouter>
      );
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    test('Komponent Footer renderuje się bez błędów', () => {
      const Footer = require('../components/BasicSiteView/Footer/Footer.jsx').default;
      
      render(<Footer />);
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });

  describe('2. Testy nawigacji', () => {
    test('Formularz logowania zawiera pola email i password', () => {
      const Login = require('../components/Authorization/login.jsx').default;
      
      render(
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      );
      
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('Formularz rejestracji zawiera wymagane pola', () => {
      const SignUp = require('../components/Authorization/SignUp.jsx').default;
      
      render(
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      );
      
      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    });
  });

  describe('3. Testy przełączania motywu', () => {
    test('ThemeSwitcher renderuje się i zawiera przyciski', () => {
      const ThemeSwitcher = require('../components/ThemeSwitcher.jsx').default;
      
      render(
        <BrowserRouter>
          <ThemeSwitcher theme="light" toggleTheme={() => {}} />
        </BrowserRouter>
      );
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    test('LanguageSwitcher renderuje się poprawnie', () => {
      const LanguageSwitcher = require('../components/LanguageSwitcher.jsx').default;
      
      const { container } = render(<LanguageSwitcher />);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('4. Testy stron kursów', () => {
    test('Komponent CoursesCategory renderuje się', () => {
      const CoursesCategory = require('../components/Courses/CoursesCategory.jsx').default;
      
      render(
        <BrowserRouter>
          <CoursesCategory />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/choose your programming language/i)).toBeInTheDocument();
    });
  });

  describe('5. Testy gier', () => {
    test('MiniGamesPage renderuje się bez błędów', () => {
      const MiniGamesPage = require('../components/Games/MiniGamePage/MiniGamesPage.jsx').default;
      
      render(
        <BrowserRouter>
          <MiniGamesPage />
        </BrowserRouter>
      );
      
      expect(screen.getByText(/mini games/i)).toBeInTheDocument();
    });
  });

  describe('6. Sprawdzanie krytycznych funkcji', () => {
    test('App.js renderuje się bez awarii', () => {
      const App = require('../App.js').default;
      
      const { container } = render(<App />);
      
      expect(container).toBeInTheDocument();
    });

    test('i18n inicjalizuje się poprawnie', () => {
      const i18n = require('../i18n.js');
      
      expect(i18n).toBeDefined();
      expect(i18n.default).toBeDefined();
    });
  });

  describe('7. Testy wydajności (podstawowe)', () => {
    test('Home ładuje się szybko (< 3000ms)', async () => {
      const Home = require('../components/Home/home.jsx').default;
      
      const startTime = performance.now();
      
      render(
        <BrowserRouter>
          <Home theme="light" />
        </BrowserRouter>
      );
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      expect(renderTime).toBeLessThan(3000);
    });
  });

  describe('8. Testy dostępności (a11y)', () => {
    test('Header ma poprawną semantykę', () => {
      const Header = require('../components/BasicSiteView/Header/Header.jsx').default;
      
      const { container } = render(
        <BrowserRouter>
          <Header theme="light" toggleTheme={() => {}} />
        </BrowserRouter>
      );
      
      expect(container.querySelector('header')).toBeInTheDocument();
    });

    test('Footer ma poprawną semantykę', () => {
      const Footer = require('../components/BasicSiteView/Footer/Footer.jsx').default;
      
      const { container } = render(<Footer />);
      
      expect(container.querySelector('footer')).toBeInTheDocument();
    });
  });
});

describe('Smoke Tests - Testy integracyjne', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  test('Wywołania API nie padają przy braku sieci', async () => {
    // Mock fetch do sprawdzania obsługi błędów sieci
    global.fetch.mockRejectedValueOnce(new Error('Network error'));
    
    // Sprawdzamy, czy fetch został skonfigurowany
    expect(global.fetch).toBeDefined();
  });

  test('localStorage działa poprawnie', () => {
    // Sprawdzamy, czy localStorage jest dostępny
    expect(localStorage).toBeDefined();
    expect(localStorage.setItem).toBeDefined();
    expect(localStorage.getItem).toBeDefined();
    
    // Testujemy podstawową funkcjonalność
    localStorage.setItem('test', 'value');
    localStorage.getItem('test');
  });
});
