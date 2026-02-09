import express, { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// ============= GAME ENGINE =============
enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades',
}

enum Rank {
  ACE = 'A',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
}

interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
}

interface Player {
  id: string;
  name: string;
  hand: Card[];
  captures: Card[];
  score: number;
  team: 1 | 2;
}

interface GameState {
  id: string;
  gameType: '1v1' | '2v2';
  players: Record<string, Player>;
  tableCards: Card[];
  currentPlayerIndex: number;
  round: number;
  roundScores: Record<string, number>;
  totalScores: Record<string, number>;
  gameLog: any[];
  status: 'setup' | 'playing' | 'round_end' | 'match_end';
  winner?: string;
  deck: Card[];
  betAmount: number;
}

class ChkobbaEngine {
  private gameState: GameState;

  constructor(gameId: string, playerIds: string[], gameType: '1v1' | '2v2' = '1v1', betAmount: number = 1) {
    this.gameState = {
      id: gameId,
      gameType,
      players: {},
      tableCards: [],
      currentPlayerIndex: 0,
      round: 1,
      roundScores: {},
      totalScores: {},
      gameLog: [],
      status: 'setup',
      deck: this.createDeck(),
      betAmount,
    };

    playerIds.forEach((id, idx) => {
      this.gameState.players[id] = {
        id,
        name: `Player ${idx + 1}`,
        hand: [],
        captures: [],
        score: 0,
        team: gameType === '1v1' ? (idx === 0 ? 1 : 2) : (idx % 2 === 0 ? 1 : 2),
      };
      this.gameState.roundScores[id] = 0;
      this.gameState.totalScores[id] = 0;
    });
  }

  private createDeck(): Card[] {
    const deck: Card[] = [];
    const suits = Object.values(Suit);
    const ranks = Object.values(Rank);

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          id: `${suit}-${rank}`,
          suit: suit as Suit,
          rank: rank as Rank,
          value: this.getCardValue(rank as Rank),
        });
      }
    }

    return this.shuffleDeck(deck);
  }

  private getCardValue(rank: Rank): number {
    const values: Record<Rank, number> = {
      [Rank.ACE]: 1,
      [Rank.TWO]: 2,
      [Rank.THREE]: 3,
      [Rank.FOUR]: 4,
      [Rank.FIVE]: 5,
      [Rank.SIX]: 6,
      [Rank.SEVEN]: 7,
      [Rank.EIGHT]: 8,
      [Rank.NINE]: 9,
      [Rank.TEN]: 10,
      [Rank.JACK]: 10,
      [Rank.QUEEN]: 10,
      [Rank.KING]: 10,
    };
    return values[rank];
  }

  private shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public dealInitialCards(): void {
    const playerIds = Object.keys(this.gameState.players);

    playerIds.forEach((id) => {
      for (let i = 0; i < 3; i++) {
        this.gameState.players[id].hand.push(this.gameState.deck.pop()!);
      }
    });

    for (let i = 0; i < 4; i++) {
      this.gameState.tableCards.push(this.gameState.deck.pop()!);
    }

    this.gameState.status = 'playing';
  }

  public playCard(playerId: string, card: Card): boolean {
    const player = this.gameState.players[playerId];
    const cardIndex = player.hand.findIndex((c) => c.id === card.id);

    if (cardIndex === -1) return false;

    player.hand.splice(cardIndex, 1);
    this.gameState.gameLog.push({
      playerId,
      timestamp: Date.now(),
      action: 'play',
      card,
    });

    return true;
  }

  public captureCards(playerId: string, card: Card, tableCaptureIds: string[]): boolean {
    const player = this.gameState.players[playerId];
    const cardIndex = player.hand.findIndex((c) => c.id === card.id);

    if (cardIndex === -1) return false;

    const capturedCards = this.gameState.tableCards.filter((tc) => tableCaptureIds.includes(tc.id));
    const sum = capturedCards.reduce((s, c) => s + c.value, 0);

    if (sum !== card.value) return false;

    player.hand.splice(cardIndex, 1);
    this.gameState.tableCards = this.gameState.tableCards.filter(
      (tc) => !tableCaptureIds.includes(tc.id),
    );
    player.captures.push(card, ...capturedCards);

    this.gameState.gameLog.push({
      playerId,
      timestamp: Date.now(),
      action: 'capture',
      card,
      capturedCards,
    });

    return true;
  }

  public declareChkobba(playerId: string, card: Card): boolean {
    if (this.gameState.tableCards.length === 0) return false;

    const player = this.gameState.players[playerId];
    const cardIndex = player.hand.findIndex((c) => c.id === card.id);

    if (cardIndex === -1) return false;

    const sum = this.gameState.tableCards.reduce((s, c) => s + c.value, 0);

    if (sum === card.value) {
      player.hand.splice(cardIndex, 1);
      player.captures.push(card, ...this.gameState.tableCards);
      this.gameState.tableCards = [];

      this.gameState.gameLog.push({
        playerId,
        timestamp: Date.now(),
        action: 'chkobba',
        card,
        capturedCards: player.captures,
      });

      return true;
    }

    return false;
  }

  public endTurn(): void {
    const playerIds = Object.keys(this.gameState.players);
    this.gameState.currentPlayerIndex = (this.gameState.currentPlayerIndex + 1) % playerIds.length;

    const allEmpty = playerIds.every((id) => this.gameState.players[id].hand.length === 0);

    if (allEmpty && this.gameState.deck.length === 0) {
      this.endRound();
    }
  }

  private endRound(): void {
    this.calculateRoundScores();
    this.gameState.status = 'round_end';

    const playerIds = Object.keys(this.gameState.players);
    const maxScore = Math.max(...playerIds.map((id) => this.gameState.totalScores[id]));

    if (maxScore >= 21 || this.gameState.round >= 3) {
      this.endMatch();
    } else {
      this.gameState.round++;
      this.gameState.status = 'setup';
      this.resetRound();
    }
  }

  private calculateRoundScores(): void {
    const playerIds = Object.keys(this.gameState.players);

    playerIds.forEach((id) => {
      const player = this.gameState.players[id];
      let roundScore = 0;

      roundScore += player.captures.length;

      const spades = ['A', '2', '3', '10'];
      player.captures.forEach((card) => {
        if (card.suit === Suit.SPADES && spades.includes(card.rank)) {
          roundScore += 1;
        }
      });

      const chkobbaMove = this.gameState.gameLog.find(
        (move) => move.playerId === id && move.action === 'chkobba',
      );
      if (chkobbaMove) {
        roundScore += 1;
      }

      this.gameState.roundScores[id] = roundScore;
      this.gameState.totalScores[id] += roundScore;
    });
  }

  private resetRound(): void {
    Object.keys(this.gameState.players).forEach((id) => {
      this.gameState.players[id].hand = [];
      this.gameState.players[id].captures = [];
    });
    this.gameState.tableCards = [];
    this.gameState.currentPlayerIndex = 0;
    this.gameState.deck = this.createDeck();
    this.dealInitialCards();
  }

  private endMatch(): void {
    const playerIds = Object.keys(this.gameState.players);
    const winner = playerIds.reduce((prev, current) =>
      this.gameState.totalScores[current] > this.gameState.totalScores[prev] ? current : prev,
    );
    this.gameState.winner = winner;
    this.gameState.status = 'match_end';
  }

  public getState(): GameState {
    return JSON.parse(JSON.stringify(this.gameState));
  }

  public getPlayerHand(playerId: string): Card[] {
    return this.gameState.players[playerId]?.hand || [];
  }

  public getTableCards(): Card[] {
    return this.gameState.tableCards;
  }

  public getCurrentPlayer(): Player | null {
    const playerIds = Object.keys(this.gameState.players);
    return this.gameState.players[playerIds[this.gameState.currentPlayerIndex]] || null;
  }

  public getScores(): Record<string, number> {
    return { ...this.gameState.totalScores };
  }

  public getWinner(): string | undefined {
    return this.gameState.winner;
  }

  public validateMove(playerId: string, card: Card): boolean {
    const player = this.gameState.players[playerId];
    if (!player) return false;
    return player.hand.findIndex((c) => c.id === card.id) !== -1;
  }
}

// ============= MATCHMAKING SERVICE =============
class MatchmakingService {
  private queues: Map<string, any[]> = new Map();
  private matches: Map<string, any> = new Map();

  public addToQueue(playerId: string, betAmount: number, gameType: '1v1' | '2v2' = '1v1') {
    const queueKey = `${betAmount}-${gameType}`;
    if (!this.queues.has(queueKey)) {
      this.queues.set(queueKey, []);
    }

    const entry = {
      id: uuidv4(),
      playerId,
      betAmount,
      gameType,
      joinedAt: Date.now(),
      expiresAt: Date.now() + 30000,
    };

    this.queues.get(queueKey)!.push(entry);
    return entry;
  }

  public removeFromQueue(playerId: string, betAmount: number, gameType: '1v1' | '2v2'): boolean {
    const queueKey = `${betAmount}-${gameType}`;
    const queue = this.queues.get(queueKey);

    if (!queue) return false;

    const index = queue.findIndex((entry) => entry.playerId === playerId);
    if (index !== -1) {
      queue.splice(index, 1);
      if (queue.length === 0) {
        this.queues.delete(queueKey);
      }
      return true;
    }

    return false;
  }

  public findMatch(betAmount: number, gameType: '1v1' | '2v2') {
    const queueKey = `${betAmount}-${gameType}`;
    const queue = this.queues.get(queueKey) || [];

    const now = Date.now();
    const waitingEntries = queue.filter((entry) => now - entry.joinedAt >= 20000);

    if (gameType === '1v1' && waitingEntries.length >= 2) {
      return this.createMatch([waitingEntries[0], waitingEntries[1]], betAmount, gameType, false);
    } else if (gameType === '2v2' && waitingEntries.length >= 4) {
      return this.createMatch(
        [waitingEntries[0], waitingEntries[1], waitingEntries[2], waitingEntries[3]],
        betAmount,
        gameType,
        false,
      );
    }

    const expiredEntries = queue.filter((entry) => now >= entry.expiresAt);
    if (expiredEntries.length > 0) {
      const entry = expiredEntries[0];
      return this.createMatch([entry], betAmount, gameType, true);
    }

    return null;
  }

  private createMatch(entries: any[], betAmount: number, gameType: '1v1' | '2v2', hasBot: boolean) {
    const matchId = uuidv4();
    const playerIds = entries.map((e) => e.playerId);
    let botId: string | undefined;

    if (hasBot) {
      botId = `bot-${uuidv4().slice(0, 8)}`;
      playerIds.push(botId);
    }

    const match = {
      matchId,
      playerIds,
      betAmount,
      gameType,
      hasBot,
      botId,
      createdAt: Date.now(),
    };

    this.matches.set(matchId, match);

    const queueKey = `${betAmount}-${gameType}`;
    const queue = this.queues.get(queueKey);
    if (queue) {
      entries.forEach((entry) => {
        const idx = queue.findIndex((e) => e.id === entry.id);
        if (idx !== -1) queue.splice(idx, 1);
      });
      if (queue.length === 0) this.queues.delete(queueKey);
    }

    return match;
  }

  public getQueueSize(betAmount: number, gameType: '1v1' | '2v2'): number {
    const queueKey = `${betAmount}-${gameType}`;
    return (this.queues.get(queueKey) || []).length;
  }

  public getMatch(matchId: string) {
    return this.matches.get(matchId);
  }

  public completeMatch(matchId: string) {
    this.matches.delete(matchId);
  }
}

// ============= BETTING SERVICE =============
class BettingService {
  private validBetAmounts = [1, 3, 5, 10];

  public isValidBetAmount(amount: number): boolean {
    return this.validBetAmounts.includes(amount);
  }

  public getValidBetAmounts(): number[] {
    return [...this.validBetAmounts];
  }

  public calculatePayout(betAmount: number, outcome: 'win' | 'loss'): number {
    if (outcome === 'win') {
      return betAmount * 2;
    }
    return 0;
  }
}

// ============= AI BOT =============
class AIBot {
  private botId: string;
  private shouldWin: boolean;

  constructor(botId: string, isBetting = false) {
    this.botId = botId;
    this.shouldWin = isBetting && Math.random() < 0.8;
  }

  public getNextMove(engine: ChkobbaEngine): any {
    const hand = engine.getPlayerHand(this.botId);
    const tableCards = engine.getTableCards();

    if (hand.length === 0) return null;

    const randomCard = hand[Math.floor(Math.random() * hand.length)];
    return {
      card: randomCard,
      tableCaptureIds: [],
      type: 'play',
    };
  }
}

// ============= EXPRESS & SOCKET.IO SETUP =============
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ============= MIDDLEWARE =============
app.use(helmet());
app.use(compression());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= GLOBAL STATE =============
const gameEngine = new Map<string, ChkobbaEngine>();
const matchmakingService = new MatchmakingService();
const bettingService = new BettingService();
const userSockets = new Map<string, string[]>();
const socketUsers = new Map<string, string>();

// ============= REST API =============
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userId = uuidv4();
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

  res.json({
    success: true,
    token,
    user: {
      id: userId,
      email,
      username: 'Player_' + userId.slice(0, 8),
      balance: 100,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
    },
  });
});

app.get('/api/config', (req: Request, res: Response) => {
  res.json({
    validBetAmounts: bettingService.getValidBetAmounts(),
    queueWaitTime: 20,
    queueMaxWait: 30,
  });
});

// ============= SOCKET.IO =============
io.on('connection', (socket: Socket) => {
  console.log(`[Socket] New connection: ${socket.id}`);

  let userId: string | null = null;

  socket.on('auth:authenticate', (data: { token: string }, callback: Function) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;

      if (!userSockets.has(userId)) {
        userSockets.set(userId, []);
      }
      userSockets.get(userId)!.push(socket.id);
      socketUsers.set(socket.id, userId);

      callback({ success: true });
    } catch (err) {
      callback({ success: false, error: 'Authentication failed' });
    }
  });

  socket.on('queue:join', (data: any, callback: Function) => {
    if (!userId) return callback({ error: 'Not authenticated' });

    const { betAmount, gameType } = data;
    if (!bettingService.isValidBetAmount(betAmount)) {
      return callback({ error: 'Invalid bet amount' });
    }

    const queueEntry = matchmakingService.addToQueue(userId, betAmount, gameType);
    socket.join(`queue-${betAmount}-${gameType}`);
    socket.emit('queue:joined', { queueEntry, status: 'waiting' });
    callback({ success: true, queueEntry });

    io.to(`queue-${betAmount}-${gameType}`).emit('queue:status-update', {
      queueSize: matchmakingService.getQueueSize(betAmount, gameType),
    });

    setTimeout(() => {
      const match = matchmakingService.findMatch(betAmount, gameType);
      if (match) {
        const engine = new ChkobbaEngine(
          match.matchId,
          match.playerIds.filter((id: string) => !id.startsWith('bot-')),
          gameType,
          betAmount,
        );
        engine.dealInitialCards();
        gameEngine.set(match.matchId, engine);

        const gameSession = {
          matchId: match.matchId,
          gameType,
          playerIds: match.playerIds,
          status: 'playing',
          round: 1,
          tableCards: engine.getTableCards(),
          scores: {},
          betAmount,
          createdAt: Date.now(),
        };

        match.playerIds.forEach((id: string) => {
          gameSession.scores[id] = 0;
        });

        match.playerIds.forEach((playerId: string) => {
          if (!playerId.startsWith('bot-')) {
            const sockets = userSockets.get(playerId) || [];
            sockets.forEach((socketId) => {
              io.to(socketId).emit('game:start', { match, gameSession });
            });
          }
        });
      }
    }, 100);
  });

  socket.on('queue:cancel', (data: any, callback: Function) => {
    if (!userId) return;
    const success = matchmakingService.removeFromQueue(userId, data.betAmount, data.gameType);
    socket.leave(`queue-${data.betAmount}-${data.gameType}`);
    callback({ success });
  });

  socket.on('game:play-card', (data: any, callback: Function) => {
    if (!userId) return;

    const engine = gameEngine.get(data.matchId);
    if (!engine) return callback({ error: 'Match not found' });

    try {
      const currentPlayer = engine.getCurrentPlayer();
      if (currentPlayer?.id !== userId) {
        return callback({ error: 'Not your turn' });
      }

      if (!engine.validateMove(userId, data.card)) {
        return callback({ error: 'Invalid move' });
      }

      let moveSuccess = false;
      if (data.moveType === 'play') {
        moveSuccess = engine.playCard(userId, data.card);
      } else if (data.moveType === 'capture') {
        moveSuccess = engine.captureCards(userId, data.card, data.tableCaptureIds || []);
      } else if (data.moveType === 'chkobba') {
        moveSuccess = engine.declareChkobba(userId, data.card);
      }

      if (!moveSuccess) {
        return callback({ error: 'Move failed' });
      }

      const state = engine.getState();
      io.to(data.matchId).emit('game:state-update', { state });
      engine.endTurn();

      callback({ success: true });
    } catch (error) {
      console.error('Move error:', error);
      callback({ error: 'Move processing failed' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    if (userId) {
      const sockets = userSockets.get(userId) || [];
      const idx = sockets.indexOf(socket.id);
      if (idx !== -1) sockets.splice(idx, 1);
      socketUsers.delete(socket.id);
    }
  });
});

// ============= START SERVER =============
httpServer.listen(PORT, () => {
  console.log(`[Server] Started on port ${PORT}`);
  console.log(`[Server] CORS origin: ${CORS_ORIGIN}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, httpServer, io };
