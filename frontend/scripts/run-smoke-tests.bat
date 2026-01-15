@echo off
REM Skrypt do uruchamiania Smoke Tests na Windows
REM Użycie: run-smoke-tests.bat

echo =============================
echo 🔥 CODELINGO SMOKE TESTS 🔥
echo =============================
echo.

echo 📦 Sprawdzanie zależności...
if not exist "node_modules\" (
    echo ❌ node_modules nie znaleziono. Uruchamiam npm install...
    call npm install
)

echo.
echo 🧪 Uruchamianie Smoke Tests...
echo.

REM Uruchamianie głównych smoke testów
call npm test -- smokeTests.test.js --watchAll=false --verbose

set SMOKE_EXIT_CODE=%ERRORLEVEL%

echo.
echo 🔥 Uruchamianie Critical Path Tests...
echo.

call npm test -- criticalPath.test.js --watchAll=false --verbose

set CRITICAL_EXIT_CODE=%ERRORLEVEL%

echo.
echo =============================

REM Sprawdzanie wyników
if %SMOKE_EXIT_CODE%==0 if %CRITICAL_EXIT_CODE%==0 (
    echo ✅ WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!
    echo.
    echo 📊 Wyniki:
    echo   - Smoke Tests: ✅ PASS
    echo   - Critical Path: ✅ PASS
    echo.
    echo 🚀 Aplikacja gotowa do wdrożenia!
    exit /b 0
) else (
    echo ❌ NIEKTÓRE TESTY NIE PRZESZŁY!
    echo.
    echo 📊 Wyniki:
    
    if %SMOKE_EXIT_CODE% neq 0 (
        echo   - Smoke Tests: ❌ FAIL
    ) else (
        echo   - Smoke Tests: ✅ PASS
    )
    
    if %CRITICAL_EXIT_CODE% neq 0 (
        echo   - Critical Path: ❌ FAIL
    ) else (
        echo   - Critical Path: ✅ PASS
    )
    
    echo.
    echo ⚠️  NIE WDRÓŻ aplikacji przed naprawieniem błędów!
    exit /b 1
)
