#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════╗"
echo "║   Chkobba Game - Quick Start Setup     ║"
echo "╚════════════════════════════════════════╝"
echo -e "${NC}"

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# Install Backend
echo ""
echo -e "${BLUE}Installing Backend...${NC}"
cd backend
cp .env.example .env
npm install
cd ..

# Install Frontend
echo ""
echo -e "${BLUE}Installing Frontend...${NC}"
cd frontend
cp .env.local.example .env.local
npm install
cd ..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗"
echo "║    Setup Complete! Ready to Start      ║"
echo "╚════════════════════════════════════════╝${NC}"
echo ""
echo "To start development servers:"
echo ""
echo -e "${BLUE}Terminal 1 (Backend):${NC}"
echo "  cd backend && npm run dev"
echo ""
echo -e "${BLUE}Terminal 2 (Frontend):${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo -e "${BLUE}Then open:${NC} http://localhost:3000"
echo ""
echo -e "${GREEN}Ready to play! 🎮${NC}"
