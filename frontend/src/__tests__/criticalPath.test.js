import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

/**
 * CRITICAL PATH SMOKE TESTS
 * Testy krytycznych ścieżek użytkownika
 */

describe('🔥 CRITICAL PATH - Podróż użytkownika', () => {
  
  test('CRITICAL: Użytkownik może otworzyć stronę główną', () => {
    const Home = require('../components/Home/home.jsx').default;
    
    const { container } = render(
      <BrowserRouter>
        <Home theme="light" />
      </BrowserRouter>
    );
    
    expect(container).toBeTruthy();
    expect(container.querySelector('.hero-title')).toBeTruthy();
  });

  test('CRITICAL: Użytkownik może przełączyć motyw', () => {
    const ThemeSwitcher = require('../components/ThemeSwitcher.jsx').default;
    
    render(
      <BrowserRouter>
        <ThemeSwitcher theme="light" toggleTheme={() => {}} />
      </BrowserRouter>
    );
    
    // Sprawdzamy, czy przyciski motywów są dostępne
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('CRITICAL: Nawigacja w Header działa', () => {
    const Header = require('../components/BasicSiteView/Header/Header.jsx').default;
    
    render(
      <BrowserRouter>
        <Header theme="light" toggleTheme={() => {}} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/codelingo/i)).toBeTruthy();
  });

  test('CRITICAL: Formularz logowania istnieje i jest dostępny', () => {
    const Login = require('../components/Authorization/login.jsx').default;
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test('CRITICAL: Kursy wyświetlają się', () => {
    const CoursesCategory = require('../components/Courses/CoursesCategory.jsx').default;
    
    render(
      <BrowserRouter>
        <CoursesCategory />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/choose your programming language/i)).toBeInTheDocument();
  });
});

describe('🚨 BLOCKER DETECTION - Krytyczne błędy', () => {
  
  test('BLOCKER CHECK: Brak krytycznych console.error przy renderze Home', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const Home = require('../components/Home/home.jsx').default;
    
    render(
      <BrowserRouter>
        <Home theme="light" />
      </BrowserRouter>
    );
    
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  test('BLOCKER CHECK: App nie pada przy uruchomieniu', () => {
    const App = require('../App.js').default;
    
    expect(() => {
      render(<App />);
    }).not.toThrow();
  });

  test('BLOCKER CHECK: i18n jest zainicjalizowany', () => {
    const i18n = require('../i18n.js');
    
    expect(i18n.default).toBeDefined();
    expect(i18n.default.language).toBeDefined();
  });
});

describe('⚡ PERFORMANCE - Podstawowe sprawdzenia', () => {
  
  test('PERF: Home renderuje się mniej niż za 1 sekundę', () => {
    const Home = require('../components/Home/home.jsx').default;
    
    const start = Date.now();
    
    render(
      <BrowserRouter>
        <Home theme="light" />
      </BrowserRouter>
    );
    
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(1000);
  });

  test('PERF: Header renderuje się natychmiast (< 100ms)', () => {
    const Header = require('../components/BasicSiteView/Header/Header.jsx').default;
    
    const start = Date.now();
    
    render(
      <BrowserRouter>
        <Header theme="light" toggleTheme={() => {}} />
      </BrowserRouter>
    );
    
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(100);
  });
});

describe('🎨 UI/UX - Podstawowa funkcjonalność', () => {
  
  test('UI: Motywy stosują się poprawnie', () => {
    const Home = require('../components/Home/home.jsx').default;
    
    const { rerender, container } = render(
      <BrowserRouter>
        <Home theme="dark" />
      </BrowserRouter>
    );
    
    expect(container.querySelector('.home-wrapper.dark')).toBeTruthy();
    
    rerender(
      <BrowserRouter>
        <Home theme="light" />
      </BrowserRouter>
    );
    
    expect(container.querySelector('.home-wrapper.light')).toBeTruthy();
  });

  test('UI: Footer jest zawsze widoczny', () => {
    const Footer = require('../components/BasicSiteView/Footer/Footer.jsx').default;
    
    const { container } = render(<Footer />);
    
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });
});

describe('🔐 SECURITY - Podstawowe sprawdzenia bezpieczeństwa', () => {
  
  test('SEC: Token nie jest przechowywany jawnie w DOM', () => {
    localStorage.setItem('token', 'test-token-12345');
    
    const Home = require('../components/Home/home.jsx').default;
    
    const { container } = render(
      <BrowserRouter>
        <Home theme="light" />
      </BrowserRouter>
    );
    
    const html = container.innerHTML;
    expect(html).not.toContain('test-token-12345');
    
    localStorage.clear();
  });
});
