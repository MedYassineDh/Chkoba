# Frontend Client

React + Next.js 14 web application for Chkobba game.

## Setup

```bash
npm install
npm run dev
```

Frontend runs on port 3000

## Structure

- `app/page.tsx` - Home page with bet selection
- `app/game.tsx` - Game board
- `app/layout.tsx` - Root layout
- `app/globals.css` - Global styles

## Pages

### Home Page (`/`)
- Bet amount selection
- Game mode selection (1v1, 2v2)
- Play Online button
- Player balance display

### Game Page (`/game`)
- Game board with cards
- Player hand
- Table cards
- Opponent info
- Score tracking

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_APP_NAME=Chkobba
```

## Key Features

✅ Responsive design (mobile-first)
✅ Real-time WebSocket updates
✅ Beautiful animations
✅ Card game UI
✅ Score tracking
✅ Bet management

## Development

```bash
npm run dev
# Opens http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Deployment

### Render.com
- Runtime: Node
- Build: `npm install && npm run build`
- Start: `npm start`
- Port: 3000
- Set `NEXT_PUBLIC_API_URL` to backend URL

### Docker
```bash
docker build -t chkobba-frontend .
docker run -p 3000:3000 chkobba-frontend
```

## Customization

### Change Colors
Edit `app/globals.css`

### Add New Pages
Create files in `app/` directory

### Modify Home Page
Edit `app/page.tsx`

## Performance

- Next.js 14 with React 18
- Built-in optimization
- Code splitting
- Image optimization
- CSS minification

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Mobile

Fully responsive on:
- iOS Safari
- Android Chrome
- Tablets
- Desktops
