# Backend Server

Node.js + Express + Socket.io game server for Chkobba.

## Setup

```bash
npm install
npm run dev
```

Server runs on port 3001

## Structure

- `server.ts` - Main Express + Socket.io server with complete game engine

### Key Components

#### Game Engine
- Complete Tunisian Chkobba rules
- Card deck management
- Player turns and move validation
- Scoring system

#### Matchmaking Service
- Player queue management
- Automatic pairing
- AI bot assignment

#### Betting Service
- Bet validation
- Payout calculation

#### AI Bot
- Strategic move selection
- 80% win probability in betting mode

## Environment Variables

```
NODE_ENV=production
PORT=3001
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

## API Endpoints

### Health Check
`GET /api/health`

### Authentication
`POST /api/auth/login`

### Game Configuration
`GET /api/config`

## WebSocket Events

### Client → Server
- `auth:authenticate` - Authenticate connection
- `queue:join` - Enter matchmaking
- `queue:cancel` - Leave queue
- `game:play-card` - Make a move

### Server → Client
- `queue:joined` - Queue entry confirmed
- `queue:status-update` - Queue status update
- `game:start` - Game begins
- `game:state-update` - Game state changed

## Deployment

### Render.com
- Runtime: Node
- Build: `npm install && npm run build`
- Start: `npm start`
- Port: 3001

### Docker
```bash
docker build -t chkobba-backend .
docker run -p 3001:3001 chkobba-backend
```

## Production Notes

- Set `JWT_SECRET` to a strong random string
- Use HTTPS in production
- Configure CORS_ORIGIN correctly
- Enable rate limiting for production
- Set LOG_LEVEL appropriately
