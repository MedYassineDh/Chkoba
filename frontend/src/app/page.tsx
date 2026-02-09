'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [balance, setBalance] = useState(100);
  const [selectedBet, setSelectedBet] = useState(1);
  const [gameType, setGameType] = useState<'1v1' | '2v2'>('1v1');
  const [loading, setLoading] = useState(false);

  const betAmounts = [1, 3, 5, 10];

  const handlePlayOnline = async () => {
    if (balance < selectedBet) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      router.push(`/game?bet=${selectedBet}&type=${gameType}`);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>🎴 Chkobba</h1>
        <p style={styles.subtitle}>Tunisian Card Game • Real Money Betting</p>

        <div style={styles.card}>
          <h2>Select Your Bet</h2>
          <div style={styles.betGrid}>
            {betAmounts.map((bet) => (
              <button
                key={bet}
                onClick={() => setSelectedBet(bet)}
                style={{
                  ...styles.betButton,
                  ...(selectedBet === bet ? styles.betButtonActive : {}),
                }}
              >
                {bet} DT
              </button>
            ))}
          </div>
          <p style={styles.info}>Balance: <strong>{balance} DT</strong></p>
          <p style={styles.info}>Win: <strong>{selectedBet * 2} DT</strong></p>
        </div>

        <div style={styles.card}>
          <h2>Game Mode</h2>
          <div style={styles.modeGrid}>
            <button
              onClick={() => setGameType('1v1')}
              style={{
                ...styles.modeButton,
                ...(gameType === '1v1' ? styles.modeButtonActive : {}),
              }}
            >
              1v1 Match
            </button>
            <button
              onClick={() => setGameType('2v2')}
              style={{
                ...styles.modeButton,
                ...(gameType === '2v2' ? styles.modeButtonActive : {}),
              }}
            >
              2v2 Team
            </button>
          </div>
        </div>

        <button
          onClick={handlePlayOnline}
          disabled={loading || balance < selectedBet}
          style={{
            ...styles.playButton,
            ...(loading || balance < selectedBet ? styles.playButtonDisabled : {}),
          }}
        >
          {loading ? 'Joining...' : 'Play Online'}
        </button>
      </div>

      <style jsx>{`
        ${Object.entries(styles)
          .map(([key, value]) => {
            if (typeof value === 'object') {
              return `.${key} { ${Object.entries(value as any)
                .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
                .join(' ')} }`;
            }
            return '';
          })
          .join('\n')}
      `}</style>
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  content: {
    maxWidth: '500px',
    width: '100%',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
  subtitle: {
    fontSize: '16px',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: '30px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    color: '#333',
  },
  betGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
    marginBottom: '15px',
  },
  betButton: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  betButtonActive: {
    background: '#667eea',
    color: '#fff',
    border: '2px solid #667eea',
  },
  modeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px',
  },
  modeButton: {
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    background: '#f5f5f5',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  modeButtonActive: {
    background: '#667eea',
    color: '#fff',
    border: '2px solid #667eea',
  },
  info: {
    margin: '5px 0',
    fontSize: '14px',
  },
  playButton: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  playButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
