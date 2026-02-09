<<<<<<< HEAD
# Chkoba
=======
# 🎴 Chkobba - Tunisian Card Game Platform

Production-ready multiplayer card game with real-money betting, AI opponents, and instant Render.com deployment.

## ⚡ Quick Start

### 1. Clone & Setup Locally (Optional)
```bash
# Install dependencies
npm install --prefix backend
npm install --prefix frontend

# Create environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# Run locally
npm --prefix backend run dev
npm --prefix frontend run dev
```

### 2. Deploy to Render.com (Recommended)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chkobba-game.git
git push -u origin main
```

#### Step 2: Create Render Services

**Option A: Use render.yaml (Recommended)**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select the repo and main branch
5. Render will automatically deploy both services using render.yaml

**Option B: Manual Setup**

**Backend Service:**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `chkobba-api`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Port**: 3001
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
   - `JWT_SECRET`: (auto-generated, leave blank for Render to generate)
   - `CORS_ORIGIN`: (you'll set this after frontend is deployed)
6. Click "Create Web Service"

**Frontend Service:**
1. Click "New +" → "Web Service"
2. Connect your GitHub repository again
3. Configure:
   - **Name**: `chkobba-web`
   - **Runtime**: Node
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm start`
   - **Port**: 3000
4. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: (use your backend URL, e.g., `https://chkobba-api.onrender.com`)
   - `NEXT_PUBLIC_WS_URL`: (use your backend URL for WebSocket)
5. Click "Create Web Service"

#### Step 3: Update Backend CORS

After frontend is deployed:
1. Go to Backend Service
2. Update `CORS_ORIGIN` to your frontend URL (e.g., `https://chkobba-web.onrender.com`)
3. Redeploy backend

---

## 📁 Project Structure

```
chkobba-game/
├── backend/
│   ├── src/
│   │   └── server.ts          # Complete game server
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx       # Home page
│   │       ├── game.tsx       # Game page
│   │       ├── layout.tsx
│   │       └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── Dockerfile
│   ├── .env.local.example
│   └── README.md
├── render.yaml                 # Render deployment config
├── .gitignore
└── README.md
```

---

## 🎮 Features Included

### Game Logic ✅
- Complete Tunisian Chkobba rules
- Card validation and capture mechanics
- Chkobba (sweep) detection
- Score calculation
- Round-based gameplay

### Multiplayer ✅
- Real-time WebSocket communication
- 1v1 head-to-head matches
- 2v2 team-based play
- Server-authoritative game state
- Player synchronization

### Betting System ✅
- Virtual currency (Tunisian Dinar)
- Flexible bet amounts (1, 3, 5, 10 DT)
- Winner-take-all payouts
- Transaction logging

### Matchmaking ✅
- Smart queue by bet amount
- 20-second player matching
- 30-second AI assignment
- Queue position tracking

### AI Opponent ✅
- Three difficulty levels
- Strategic move selection
- 80% fair win probability
- Realistic delays

### Security ✅
- JWT authentication
- Server-side validation
- Rate limiting
- Audit logging

---

## 🔧 Technology Stack

### Backend
- Node.js + Express.js
- Socket.io for real-time communication
- TypeScript for type safety
- JWT for authentication

### Frontend
- React 18 + Next.js 14
- TypeScript
- Socket.io client
- Framer Motion for animations

### Infrastructure
- Docker for containerization
- Render.com for hosting
- GitHub for version control

---

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret-key
CORS_ORIGIN=https://your-frontend.onrender.com
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_WS_URL=https://your-backend.onrender.com
```

---

## 🚀 Deployment Commands

### Local Development
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Docker Build
```bash
# Backend
docker build -t chkobba-backend backend/

# Frontend
docker build -t chkobba-frontend frontend/

# Run with docker-compose
docker-compose up
```

---

## 🎨 Customization

### Change Card Graphics
Replace PNG files in `frontend/public/assets/cards/`

### Change Colors
Edit `frontend/src/app/globals.css`

### Change Game Rules
Edit `backend/src/server.ts` game engine section

### Change Bet Amounts
Edit `backend/src/server.ts` BettingService class

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Configuration
- `GET /api/config` - Game configuration
- `GET /api/health` - Server health check

### WebSocket Events
- `auth:authenticate` - Socket authentication
- `queue:join` - Join matchmaking queue
- `queue:cancel` - Leave queue
- `game:play-card` - Play a card
- `game:state-update` - Receive game state update

---

## 🔐 Security

✅ JWT authentication
✅ Server-side move validation
✅ Rate limiting
✅ CORS protection
✅ Input validation
✅ Environment variable protection

---

## 📈 Monitoring

On Render.com, you can monitor:
- Build logs
- Runtime logs
- CPU & Memory usage
- Network metrics

Check the "Logs" tab in your service dashboard.

---

## 🐛 Troubleshooting

### Build Failed
- Check that `node_modules` is in `.gitignore`
- Ensure `package.json` has correct build scripts
- Verify TypeScript compilation

### Connection Issues
- Verify `CORS_ORIGIN` in backend
- Check WebSocket URL in frontend
- Ensure both services are running

### Deployment Issues
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure GitHub repository is public or properly connected

---

## 📚 Documentation

- [Backend README](backend/README.md) - Server implementation details
- [Frontend README](frontend/README.md) - Client implementation details
- [Game Rules](docs/RULES.md) - Chkobba rules
- [API Documentation](docs/API.md) - Complete API reference

---

## 🎯 Next Steps

1. ✅ Clone this repository
2. ✅ Push to GitHub
3. ✅ Deploy to Render.com
4. ✅ Customize as needed
5. ✅ Launch and enjoy!

---

## 📞 Support

For questions or issues:
1. Check the logs in Render dashboard
2. Review error messages
3. Verify environment variables
4. Check GitHub Actions for build errors

---

## 📄 License

MIT - Free to use for personal and commercial projects

---

## 🎉 Ready to Deploy?

```bash
git push origin main
# Visit render.com to see your deployment
```

Your Chkobba game will be live in minutes! 🚀

---

**Made with ❤️ for Tunisian gamers worldwide**

```
      ♠️  ♣️  ♥️  ♦️
   Chkobba Game Platform
   Instant Render.com Deployment
```
>>>>>>> 89d8fab (Chkobba Game)
