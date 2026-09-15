import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main style={{
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
        maxWidth: '480px',
        width: '100%',
        background: 'var(--bg-secondary, #0f172a)',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
        borderRadius: '20px',
        padding: '40px 28px',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(79, 70, 229, 0.12)',
          color: '#818cf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          <ShoppingBag size={32} />
        </div>

        <h1 style={{
          fontSize: '3rem',
          fontWeight: 900,
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          marginBottom: '10px'
        }}>
          Page Not Found
        </h2>

        <p style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
          lineHeight: 1.6,
          marginBottom: '28px'
        }}>
          The page or leads catalog bundle you are searching for does not exist or has been relocated.
        </p>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
            }}
          >
            <Home size={16} /> Website Home
          </Link>

          <Link
            href="/marketplace"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Explore Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
