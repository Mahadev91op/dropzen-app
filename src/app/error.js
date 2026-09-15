'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled application error caught by ErrorBoundary:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-primary, #090d16)',
      color: 'var(--text-primary, #f8fafc)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'var(--bg-secondary, #0f172a)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        borderRadius: '20px',
        padding: '36px 28px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.12)',
          color: '#f43f5e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <AlertTriangle size={32} />
        </div>

        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          marginBottom: '10px',
          color: '#f8fafc'
        }}>
          Something went wrong
        </h2>

        <p style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
          lineHeight: 1.6,
          marginBottom: '28px'
        }}>
          {error?.message || 'An unexpected glitch occurred while rendering this page. Our live data connection is active and your session is safe.'}
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
              transition: 'transform 0.15s ease'
            }}
          >
            <RefreshCw size={16} /> Try Again
          </button>

          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              textDecoration: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Home size={16} /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
