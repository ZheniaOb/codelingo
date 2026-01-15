# Smoke Tests - Końcowe Testy Codelingo

## 📋 Opis

Smoke testy (testy dymne) sprawdzają podstawową funkcjonalność aplikacji Codelingo. Testy te weryfikują:

- ✅ Renderowanie głównych komponentów
- ✅ Nawigację między stronami
- ✅ Przełączanie motywów
- ✅ Funkcjonalność kursów
- ✅ Działanie gier
- ✅ Dostępność (a11y)
- ✅ Podstawową wydajność

## 🚀 Uruchomienie testów

### 1. Instalacja zależności (jeśli potrzebne)
```bash
cd frontend
npm install
```

### 2. Uruchomienie wszystkich smoke testów
```bash
npm test smokeTests
```

### 3. Uruchomienie w trybie watch
```bash
npm test -- --watch smokeTests
```

### 4. Uruchomienie z pokryciem kodu
```bash
npm test -- --coverage smokeTests
```

### 5. Uruchomienie bez interaktywnego trybu (CI/CD)
```bash
npm test -- --watchAll=false smokeTests
```

## 📊 Struktura testów

### 1. Testy renderowania komponentów
- Home component
- Header component  
- Footer component

### 2. Testy nawigacji
- Login form
- SignUp form

### 3. Testy przełączania motywów
- ThemeSwitcher
- LanguageSwitcher

### 4. Testy stron kursów
- CoursesCategory

### 5. Testy gier
- MiniGamesPage

### 6. Krytyczne funkcje
- App.js rendering
- i18n initialization

### 7. Testy wydajności
- Szybkość ładowania Home

### 8. Testy dostępności (a11y)
- Semantyka HTML Header
- Semantyka HTML Footer

### 9. Testy integracyjne
- API calls error handling
- localStorage functionality

## 📈 Oczekiwane wyniki

Wszystkie testy powinny przejść ✅ (PASS):

```
PASS  src/smokeTests.test.js
  Smoke Tests - Podstawowa funkcjonalność
    ✓ Home komponent renderuje się bez błędów
    ✓ Header komponent renderuje się bez błędów
    ✓ Footer komponent renderuje się bez błędów
    ✓ Login forma zawiera pola email i password
    ✓ SignUp forma zawiera wymagane pola
    ...

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

## 🔧 Troubleshooting

### Problem: Testy nie działają
**Rozwiązanie:**
```bash
# Wyczyść cache
npm test -- --clearCache

# Reinstaluj zależności
rm -rf node_modules
npm install
```

### Problem: "Cannot find module"
**Rozwiązanie:**
Sprawdź czy wszystkie komponenty są poprawnie wyeksportowane:
```javascript
export default ComponentName;
```

### Problem: Testy timeout
**Rozwiązanie:**
Zwiększ timeout w teście:
```javascript
jest.setTimeout(10000);
```

## 📝 Dodawanie nowych testów

Aby dodać nowy smoke test:

```javascript
test('Opis testu', () => {
  const Component = require('./path/to/Component').default;
  
  render(<Component />);
  
  expect(screen.getByText(/expected text/i)).toBeInTheDocument();
});
```

## ✅ Checklist przed deployment

- [ ] Wszystkie smoke testy przechodzą
- [ ] Brak błędów w konsoli
- [ ] Coverage > 70%
- [ ] Testy wydajności < 3000ms
- [ ] Brak memory leaks

## 🎯 Kryteria sukcesu

| Test | Kryterium | Status |
|------|-----------|--------|
| Renderowanie | Wszystkie główne komponenty | ✅ |
| Nawigacja | Login/SignUp działają | ✅ |
| Motywy | Przełączanie motywów działa | ✅ |
| Kursy | Strona kursów ładuje się | ✅ |
| Gry | MiniGames renderuje się | ✅ |
| Wydajność | < 3000ms load time | ✅ |
| A11y | Semantyczny HTML | ✅ |
| Integration | API/localStorage | ✅ |

## 📚 Dokumentacja

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Utworzono:** 2026-01-15  
**Wersja:** 1.0  
**Autor:** Codelingo Team
