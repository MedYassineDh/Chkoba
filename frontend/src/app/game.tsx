'use client';

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function GamePage() {
  const [socket, setSocket] = useState<any>(null);
  const [gameState, setGameState] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const newSocket = io(apiUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      // Authenticate
      const token = localStorage.getItem('token') || '';
      newSocket.emit('auth:authenticate', { token }, (res: any) => {
        if (res.success) {
          console.log('Authenticated');
        } else {
          console.error('Authentication failed');
        }
      });
    });

    newSocket.on('game:start', (data: any) => {
      console.log('Game started:', data);
      setGameState(data.gameSession);
      setLoading(false);
    });

    newSocket.on('game:state-update', (data: any) => {
      setGameState(data.state);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.gameBoard}>
        <h1>Chkobba Game</h1>
        <div style={styles.info}>
          <p>Game Status: {gameState?.status}</p>
          <p>Bet: {gameState?.betAmount} DT</p>
          <p>Round: {gameState?.round}</p>
        </div>
        {/* Game board content would go here */}
        <p style={styles.placeholder}>Game board coming soon...</p>
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  gameBoard: {
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '20px',
    color: '#333',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    color: '#fff',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid #fff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  info: {
    marginBottom: '20px',
    padding: '15px',
    background: '#f5f5f5',
    borderRadius: '8px',
  },
  placeholder: {
    textAlign: 'center' as const,
    fontSize: '18px',
    opacity: 0.6,
  },
};
