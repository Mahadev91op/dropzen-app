'use client';

import React from 'react';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        padding: '24px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090d16',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          background: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '36px 24px',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 12px 0' }}>
            Application Error
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 24px 0' }}>
            {error?.message || 'A critical system error occurred. Click below to reload the application.'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              background: '#4f46e5',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
