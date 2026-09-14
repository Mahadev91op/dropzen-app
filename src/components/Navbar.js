'use client';
 
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, User, ShoppingBag, LogOut, Send, Shield, HelpCircle, Home, CreditCard as CardIcon, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import './Navbar.css';
 
export default function Navbar({ onOpenAuth }) {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dynamicSettings, setDynamicSettings] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Outside click & tap listener to auto-close profile dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  // Close dropdown whenever route changes
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    if (pathname.startsWith('/profile') || pathname.startsWith('/admin')) {
      router.push('/');
    }
  };
 
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
 
  useEffect(() => {
    fetch(`/api/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDynamicSettings(data.settings);
        }
      })
      .catch(err => console.error('Error fetching settings in navbar:', err));
  }, [pathname]);
 
  const hasAnnouncement = dynamicSettings?.announcementActive && dynamicSettings?.announcementText;
  
  useEffect(() => {
    if (hasAnnouncement) {
      document.body.classList.add('has-announcement-active');
    } else {
      document.body.classList.remove('has-announcement-active');
    }
    return () => {
      document.body.classList.remove('has-announcement-active');
    };
  }, [hasAnnouncement]);
 
  const handleNavClick = (e, sectionId) => {
    if (pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push(`/#${sectionId}`);
    }
  };
 
  return (
    <>
      {hasAnnouncement && (
        <div className="announcement-banner">
          <div className="container announcement-content">
            <span className="announcement-badge">Notice</span>
            <span className="announcement-message">{dynamicSettings.announcementText}</span>
          </div>
        </div>
      )}
      <nav className={`navbar-container glass ${isScrolled ? 'navbar-scrolled' : ''} ${hasAnnouncement ? 'has-announcement' : ''}`}>
        <div className="container navbar-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <ShoppingBag size={18} fill="white" />
            </div>
            Dropzen
          </Link>
 
          {/* Center Navigation Links */}
          <div className="nav-links">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link href="/marketplace" className={`nav-link ${pathname === '/marketplace' ? 'active' : ''}`}>
              Products Hub
            </Link>
            <a
              href="#excel-preview"
              onClick={(e) => handleNavClick(e, 'excel-preview')}
              className="nav-link"
            >
              Excel Preview
            </a>
            <a
              href="#roi-calculator"
              onClick={(e) => handleNavClick(e, 'roi-calculator')}
              className="nav-link"
            >
              ROI Calculator
            </a>
          </div>
 
          {/* Right Authentication / Profile Actions */}
          <div className="nav-actions">
            {mounted && user ? (
              <div className="nav-dropdown" ref={dropdownRef}>
                <button 
                  type="button"
                  className={`profile-trigger ${dropdownOpen ? 'open' : ''}`}
                  onClick={() => setDropdownOpen(prev => !prev)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="profile-avatar">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="profile-name">{user.username}</span>
                  <ChevronDown 
                    size={14} 
                    className="profile-chevron"
                    style={{ 
                      transform: dropdownOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.2s ease' 
                    }} 
                  />
                </button>
                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                  <div className="dropdown-user-header">
                    <div className="dropdown-user-name">{user.username}</div>
                    <div className="dropdown-user-email">{user.email || 'Verified Member'}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    href="/profile/orders" 
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <ShoppingBag size={16} />
                    My Orders &amp; Leads
                  </Link>
                  {user.isAdmin && (
                    <Link 
                      href="/admin" 
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Shield size={16} color="var(--primary)" />
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button 
                    type="button" 
                    onClick={handleLogout} 
                    className="dropdown-item dropdown-logout-btn"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button className="btn-signin" onClick={() => onOpenAuth('signin')}>
                  Sign In
                </button>
                <button className="btn-signup" onClick={() => onOpenAuth('signup')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
 
      {/* Mobile Bottom Tab Bar */}
      <div className="mobile-bottom-nav">
        <Link href="/" className={`bottom-tab-item ${pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>
        <Link 
          href="/marketplace" 
          className={`bottom-tab-item ${pathname === '/marketplace' ? 'active' : ''}`}
        >
          <ShoppingBag size={20} />
          <span>Products</span>
        </Link>
        
        {mounted && user ? (
          <>
            <Link 
              href="/profile/orders" 
              className={`bottom-tab-item ${pathname.startsWith('/profile') ? 'active' : ''}`}
            >
              <FileSpreadsheet size={20} />
              <span>My Leads</span>
            </Link>
            {user.isAdmin && (
              <Link 
                href="/admin" 
                className={`bottom-tab-item ${pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                <Shield size={20} />
                <span>Admin</span>
              </Link>
            )}
            <button 
              type="button" 
              onClick={handleLogout} 
              className="bottom-tab-item tab-logout-btn"
              title="Log Out of your account"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <a 
              href="#excel-preview" 
              onClick={(e) => handleNavClick(e, 'excel-preview')} 
              className="bottom-tab-item"
            >
              <FileSpreadsheet size={20} />
              <span>Preview</span>
            </a>
            <button 
              type="button" 
              onClick={() => onOpenAuth('signin')} 
              className="bottom-tab-item"
            >
              <User size={20} />
              <span>Sign In</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}
