#!/bin/bash

# Skrypt do uruchamiania Smoke Tests
# Usage: ./run-smoke-tests.sh

echo "🔥 CODELINGO SMOKE TESTS 🔥"
echo "=============================="
echo ""

# Kolory dla wyjścia
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Sprawdzanie zależności...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules nie znaleziono. Uruchamiam npm install...${NC}"
    npm install
fi

echo ""
echo -e "${YELLOW}🧪 Uruchamianie Smoke Tests...${NC}"
echo ""

# Uruchamianie głównych smoke testów
npm test -- smokeTests.test.js --watchAll=false --verbose

SMOKE_EXIT_CODE=$?

echo ""

# Uruchamianie testów krytycznych
echo -e "${YELLOW}🔥 Uruchamianie Critical Path Tests...${NC}"
echo ""

npm test -- criticalPath.test.js --watchAll=false --verbose

CRITICAL_EXIT_CODE=$?

echo ""
echo "=============================="

# Sprawdzanie wyników
if [ $SMOKE_EXIT_CODE -eq 0 ] && [ $CRITICAL_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ WSZYSTKIE TESTY PRZESZŁY POMYŚLNIE!${NC}"
    echo ""
    echo "📊 Wyniki:"
    echo "  - Smoke Tests: ✅ PASS"
    echo "  - Critical Path: ✅ PASS"
    echo ""
    echo -e "${GREEN}🚀 Aplikacja gotowa do wdrożenia!${NC}"
    exit 0
else
    echo -e "${RED}❌ NIEKTÓRE TESTY NIE PRZESZŁY!${NC}"
    echo ""
    echo "📊 Wyniki:"
    
    if [ $SMOKE_EXIT_CODE -ne 0 ]; then
        echo -e "  - Smoke Tests: ${RED}❌ FAIL${NC}"
    else
        echo "  - Smoke Tests: ✅ PASS"
    fi
    
    if [ $CRITICAL_EXIT_CODE -ne 0 ]; then
        echo -e "  - Critical Path: ${RED}❌ FAIL${NC}"
    else
        echo "  - Critical Path: ✅ PASS"
    fi
    
    echo ""
    echo -e "${RED}⚠️  NIE WDRÓŻ aplikacji przed naprawieniem błędów!${NC}"
    exit 1
fi
