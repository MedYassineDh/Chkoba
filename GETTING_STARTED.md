# 🎴 Getting Started with Chkobba

Welcome! Follow these steps to get your Chkobba game running.

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ (included with Node.js)
- Git ([Download](https://git-scm.com/))
- GitHub account (for deployment)

## 🚀 Quick Start (Choose One)

### Option 1: Automatic Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Then follow the instructions in the console.

### Option 2: Manual Setup

**Step 1: Install Dependencies**
```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

**Step 2: Copy Environment Files**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

**Step 3: Start Services**

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Step 4: Play**
Open [http://localhost:3000](http://localhost:3000) in your browser

---

## 🐳 Using Docker (Optional)

### Build and Run

```bash
docker-compose up --build
```

Services:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:3001](http://localhost:3001)

### Stop

```bash
docker-compose down
```

---

## 🌐 Deploy to Render.com (Free)

### Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chkobba-game.git
git push -u origin main
```

### Step 2: Deploy

1. Go to [render.com](https://render.com)
2. Sign up / Log in
3. Click "Dashboard"
4. Click "New +" → "Blueprint"
5. Connect your GitHub repository
6. Render automatically deploys using `render.yaml`

### Step 3: Get Your URLs

After deployment (10-15 minutes):
- Frontend: `https://chkobba-web.onrender.com`
- Backend: `https://chkobba-api.onrender.com`

Share the frontend URL with friends!

**Full guide:** See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)

---

## 📁 Project Structure

```
chkobba-game/
├── backend/              # Node.js server
│   ├── src/server.ts    # Complete game logic
│   └── package.json
├── frontend/             # React/Next.js app
│   ├── src/app/         # Pages and components
│   └── package.json
├── render.yaml          # Render.com config
├── docker-compose.yml   # Docker config
├── README.md            # Main guide
└── RENDER_DEPLOYMENT.md # Render guide
```

---

## 🎮 Play the Game

### Home Page
1. Select bet amount (1, 3, 5, or 10 DT)
2. Choose game mode (1v1 or 2v2)
3. Click "Play Online"

### Matchmaking
- Wait for opponent (20-30 seconds)
- Auto-match with AI if no opponent found

### Gameplay
- Play cards from your hand
- Match or capture opponent's cards
- Score points for captures
- Win rounds to win the match

---

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

---

## 🎨 Customization

### Change Colors
Edit `frontend/src/app/page.tsx` - modify the `styles` object

### Add Custom Cards
Replace images in `frontend/public/assets/cards/`

### Modify Game Rules
Edit `backend/src/server.ts` - GameEngine class

### Change Bet Amounts
Edit `backend/src/server.ts` - BettingService class

---

## 📊 Development Commands

```bash
# Development (both services)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Docker
npm run docker:build
npm run docker:up
npm run docker:down
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS/Linux: Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Windows: Find and close process using port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Can't Connect to Server
- Verify backend is running on port 3001
- Check `CORS_ORIGIN` is correct
- Check network connection

### Build Fails
- Delete `node_modules/` and `.next/` folders
- Run `npm install` again
- Check Node.js version (18+)

### Games Won't Start
- Check browser console for errors (F12)
- Verify WebSocket connection
- Check backend logs

---

## 📚 Documentation

- **[README.md](README.md)** - Complete overview
- **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** - Render.com guide
- **[backend/README.md](backend/README.md)** - Server details
- **[frontend/README.md](frontend/README.md)** - Client details

---

## 🎯 Next Steps

1. ✅ Run locally to test
2. ✅ Customize appearance (colors, assets)
3. ✅ Push to GitHub
4. ✅ Deploy to Render.com
5. ✅ Share with friends
6. ✅ Track player statistics
7. ✅ Plan tournaments

---

## 🚀 Going Live

### Before Launch
- [ ] Test gameplay thoroughly
- [ ] Verify all buttons work
- [ ] Check mobile responsiveness
- [ ] Test on different browsers
- [ ] Ensure backend is stable

### After Launch
- [ ] Monitor server logs
- [ ] Track player feedback
- [ ] Monitor performance
- [ ] Fix bugs quickly
- [ ] Plan new features

---

## 💡 Tips

### Local Testing
- Open two browser windows to simulate multiplayer
- Test with different player names
- Try different bet amounts

### Performance
- Monitor API response times
- Check WebSocket latency
- Profile frontend in DevTools

### Deployment
- Use free tier for testing
- Upgrade to paid for production
- Consider backup database
- Set up monitoring

---

## 🆘 Getting Help

### Error Messages
1. Read the error carefully
2. Check browser console (F12)
3. Check backend terminal output
4. Search the documentation

### Common Issues
- **"Cannot POST /api/auth/login"** - Backend not running
- **"WebSocket error"** - Check CORS_ORIGIN
- **"Module not found"** - Run `npm install`

### Still Stuck?
1. Check [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)
2. Review server logs
3. Verify environment variables
4. Restart services

---

## 📞 Support Resources

- **Render.com Help**: [render.com/docs](https://render.com/docs)
- **Node.js Docs**: [nodejs.org/docs](https://nodejs.org/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Socket.io Docs**: [socket.io/docs](https://socket.io/docs)

---

## 🎉 You're All Set!

You now have a complete, production-ready Chkobba game platform.

**Start playing!** 🎮

```bash
npm run dev
# Open http://localhost:3000
```

---

**Made with ❤️ for Tunisian gamers**

```
      ♠️  ♣️  ♥️  ♦️
   Chkobba Game Platform
      Ready to Play!
```
