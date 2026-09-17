'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard as CardIcon,
  Users,
  Sliders,
  LogOut,
  RefreshCw,
  Lock,
  Shield,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChevronRight,
  Info,
  DollarSign,
  AlertCircle,
  Loader2,
  Send,
  SlidersHorizontal,
  Megaphone,
  Globe,
  Copy,
  Check,
  Eye,
  FileImage,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Layers,
  Activity,
  Bell,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './page.css';

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  // Auth Modal state (for nav actions)
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState('signin');

  // Active Dashboard Tab ('dashboard' | 'orders' | 'cards' | 'users' | 'settings')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Search & Filter states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [cardSearch, setCardSearch] = useState('');
  const [cardFilter, setCardFilter] = useState('all');
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  // Chart interactivity states
  const [hoveredSalesPoint, setHoveredSalesPoint] = useState(null);
  const [hoveredBrand, setHoveredBrand] = useState(null);
  const [chartMetric, setChartMetric] = useState('revenue'); // 'revenue' | 'orders'
  const [ordersError, setOrdersError] = useState(null);

  // Data states
  const [stats, setStats] = useState({
    totalSales: 0,
    totalUsers: 0,
    customerUsers: 0,
    adminUsers: 0,
    totalCards: 0,
    totalStockUnits: 0,
    lowStockCount: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    failedOrders: 0,
    averageOrderValue: 0,
    approvalRate: 100
  });
  const [orders, setOrders] = useState([]);
  const [cards, setCards] = useState([]);
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    announcementText: 'Welcome to Dropzen! Verified Pan-India Dropshipping Leads & COD Buyer Data.',
    announcementActive: true,
    maintenanceMode: false,
    globalDiscount: 0,
    upiId: 'mahadevtanti191@okaxis',
    usdToInrRate: 83
  });

  const [loadingData, setLoadingData] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Modals state
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardModalType, setCardModalType] = useState('add'); // 'add' | 'edit'
  const [selectedCard, setSelectedCard] = useState(null);

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bankVerified, setBankVerified] = useState(false);

  // UTR Copy State
  const [copiedUtr, setCopiedUtr] = useState('');

  // Payment Screenshot Proof Lightbox Modal
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [proofOrder, setProofOrder] = useState(null);

  // Order Rejection Modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectOrder, setRejectOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('Payment not credited to bank account');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Product & Bundle Form State
  const [cardForm, setCardForm] = useState({
    title: '',
    category: 'Home & Kitchen',
    price: 999,
    originalPrice: 2499,
    recordsCount: 5000,
    minQuantity: 1,
    meeshoCost: 199,
    resellPrice: 899,
    badge: '🔥 Trending',
    image: '',
    deliveryTime: '5 - 10 Mins Automated',
    description: '',
    name: '',
    type: 'Home & Kitchen',
    entryFee: 999,
    qty: 5000,
    gradientStart: '#1e3c72',
    gradientEnd: '#2a5298'
  });

  // Verify Form State (released details)
  const [verifyForm, setVerifyForm] = useState({
    number: '',
    expiry: '',
    cvv: '',
    cardHolder: '',
    dob: '',
    atmPin: ''
  });

  // Direct Product Image Upload States
  const productImageInputRef = useRef(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleProductImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file (JPG, PNG, WEBP)', 'warning');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast('Image file size too large (max 15MB)', 'warning');
      return;
    }

    setImageUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // High quality web resize: max 1000px
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setCardForm(prev => ({ ...prev, image: optimizedDataUrl }));
        setImageUploading(false);
        showToast('Product image uploaded and optimized successfully!', 'success');
      };

      img.onerror = () => {
        setImageUploading(false);
        showToast('Failed to process image file', 'error');
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setImageUploading(false);
      showToast('Error reading image file', 'error');
    };

    reader.readAsDataURL(file);
  };

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const prevAdminOrdersCountRef = useRef(null);

  // Native PWA App Badging API Helper (Free on Android/Desktop/iOS PWA)
  const updateAppIconBadge = useCallback((count) => {
    if (typeof navigator !== 'undefined') {
      if (count > 0 && 'setAppBadge' in navigator) {
        navigator.setAppBadge(count).catch(() => {});
      } else if (count === 0 && 'clearAppBadge' in navigator) {
        navigator.clearAppBadge().catch(() => {});
      }
    }
  }, []);

  // Web Audio Synthesized Payment Bell Chime
  const playPaymentChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Tone 1: High Bell Note
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.38);

      // Tone 2: Shimmer Sparkle
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now + 0.1); // D6
      gain2.gain.setValueAtTime(0.28, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.48);
    } catch (e) {}
  }, []);

  // One-click notification permission request & test
  const handleToggleNotifications = async () => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window)) {
      showToast('Push notifications not supported on this browser', 'warning');
      return;
    }

    if (Notification.permission === 'granted') {
      playPaymentChime();
      updateAppIconBadge(stats.pendingOrders || 1);
      showToast('✅ Payment alerts & app badge active!', 'success');
      setNotificationsEnabled(true);
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        playPaymentChime();
        updateAppIconBadge(stats.pendingOrders || 1);
        showToast('✅ Free payment alerts & app badge enabled!', 'success');
        setNotificationsEnabled(true);
      } else {
        showToast('Notification permission was dismissed', 'warning');
        setNotificationsEnabled(false);
      }
    } catch (e) {
      showToast('Unable to request notification permission', 'error');
    }
  };

  const loadDashboardData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoadingData(true);
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('cv_token') : null;
      const authHeaders = {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const [ordersRes, cardsRes, usersRes, settingsRes] = await Promise.all([
        fetch('/api/admin/orders', { headers: authHeaders, credentials: 'include', cache: 'no-store' }),
        fetch('/api/cards', { headers: authHeaders, credentials: 'include', cache: 'no-store' }), 
        fetch('/api/admin/users', { headers: authHeaders, credentials: 'include', cache: 'no-store' }),
        fetch('/api/settings', { headers: authHeaders, credentials: 'include', cache: 'no-store' })
      ]);

      let fetchedOrders = [];
      let fetchedCards = [];
      let fetchedUsers = [];

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.success && Array.isArray(ordersData.orders)) {
          fetchedOrders = ordersData.orders;
          setOrders(fetchedOrders);
          setOrdersError(null);
        }
      } else {
        const errData = await ordersRes.json().catch(() => ({}));
        const errMsg = errData.error || `Server error (${ordersRes.status}) fetching orders`;
        console.error('Failed to load orders:', ordersRes.status, errMsg);
        setOrdersError(errMsg);
        if (!isSilent) showToast(errMsg, 'error');
      }

      if (cardsRes.ok) {
        const cardsData = await cardsRes.json();
        if (cardsData.success && Array.isArray(cardsData.cards)) {
          fetchedCards = cardsData.cards;
          setCards(fetchedCards);
        }
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData.success && Array.isArray(usersData.users)) {
          fetchedUsers = usersData.users;
          setUsers(fetchedUsers);
        }
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.settings) {
          setSettings(settingsData.settings);
        }
      }

      // Calculate 100% real live operational and financial metrics
      const completedOrdersList = fetchedOrders.filter(o => o.status === 'completed');
      const pendingOrdersCount = fetchedOrders.filter(o => o.status === 'pending').length;
      const failedOrdersCount = fetchedOrders.filter(o => o.status === 'failed').length;
      const totalOrdersCount = fetchedOrders.length;
      const totalSales = completedOrdersList.reduce((acc, curr) => acc + (curr.pricePaid || 0), 0);
      const averageOrderValue = completedOrdersList.length > 0 ? Math.round(totalSales / completedOrdersList.length) : 0;
      const approvalRate = totalOrdersCount > 0 ? Math.round((completedOrdersList.length / totalOrdersCount) * 100) : 100;

      const totalStockUnits = fetchedCards.reduce((acc, c) => acc + (Number(c.qty) || 0), 0);
      const lowStockCount = fetchedCards.filter(c => Number(c.qty) < 10).length;
      const adminUsersCount = fetchedUsers.filter(u => u.isAdmin).length;
      const customerUsersCount = fetchedUsers.filter(u => !u.isAdmin).length;

      // Update native PWA icon badge with pending payment requests
      updateAppIconBadge(pendingOrdersCount);

      setStats({
        totalSales,
        totalUsers: fetchedUsers.length,
        customerUsers: customerUsersCount,
        adminUsers: adminUsersCount,
        totalCards: fetchedCards.length,
        totalStockUnits,
        lowStockCount,
        totalOrders: totalOrdersCount,
        completedOrders: completedOrdersList.length,
        pendingOrders: pendingOrdersCount,
        failedOrders: failedOrdersCount,
        averageOrderValue,
        approvalRate
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (!isSilent) showToast('Failed to load dashboard metrics', 'error');
    } finally {
      if (!isSilent) setLoadingData(false);
    }
  }, [showToast, updateAppIconBadge]);

  // Initial dashboard load
  useEffect(() => {
    if (user && user.isAdmin) {
      loadDashboardData(false);
    }
  }, [user, loadDashboardData]);

  // Auto-sync polling every 12 seconds in Admin Panel
  useEffect(() => {
    if (!user || !user.isAdmin) return;

    const intervalId = setInterval(async () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('cv_token') : null;
          const authHeaders = {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          };
          const res = await fetch('/api/admin/orders', { headers: authHeaders, credentials: 'include', cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.orders)) {
              setOrdersError(null);
              const freshOrders = data.orders;
              const pendingCount = freshOrders.filter((o) => o.status === 'pending').length;
              
              if (prevAdminOrdersCountRef.current !== null && pendingCount > prevAdminOrdersCountRef.current) {
                const diff = pendingCount - prevAdminOrdersCountRef.current;
                showToast(`🔔 ${diff} new payment verification request${diff > 1 ? 's' : ''} received!`, 'warning');
                
                // Play pleasant payment chime
                playPaymentChime();

                // Trigger browser push notification if enabled
                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                  try {
                    new Notification('Dropzen Alert: New Payment Received!', {
                      body: `🔔 ${diff} new order payment waiting for verification.`,
                      icon: '/icon.svg',
                      badge: '/icon.svg'
                    });
                  } catch (e) {}
                }
              }

              prevAdminOrdersCountRef.current = pendingCount;
              updateAppIconBadge(pendingCount);
              setOrders(freshOrders);
              
              const freshCompleted = freshOrders.filter((o) => o.status === 'completed');
              const freshTotalSales = freshCompleted.reduce((acc, curr) => acc + (curr.pricePaid || 0), 0);
              const freshAov = freshCompleted.length > 0 ? Math.round(freshTotalSales / freshCompleted.length) : 0;
              const freshApprovalRate = freshOrders.length > 0 ? Math.round((freshCompleted.length / freshOrders.length) * 100) : 100;

              setStats((prev) => ({
                ...prev,
                pendingOrders: pendingCount,
                completedOrders: freshCompleted.length,
                failedOrders: freshOrders.filter((o) => o.status === 'failed').length,
                totalOrders: freshOrders.length,
                totalSales: freshTotalSales,
                averageOrderValue: freshAov,
                approvalRate: freshApprovalRate
              }));
            }
          }
        } catch (e) {
          console.error('Auto-sync poll error:', e);
        }
      }
    }, 12000);

    return () => clearInterval(intervalId);
  }, [user, showToast, playPaymentChime, updateAppIconBadge]);



  // --- Settings Handlers ---
  const handleSettingsChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Site settings updated dynamically!');
        setSettings(data.settings);
      } else {
        showToast(data.error || 'Failed to update settings', 'error');
      }
    } catch (err) {
      showToast('Network error updating settings', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  // --- Orders Handlers ---
  const handleCopyUtr = (utr, e) => {
    if (e) e.stopPropagation();
    if (!utr) return;
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    showToast('UTR copied to clipboard!');
    setTimeout(() => setCopiedUtr(''), 2000);
  };

  const handleOpenProof = (order, e) => {
    if (e) e.stopPropagation();
    setProofOrder(order);
    setProofModalOpen(true);
  };

  const handleOpenVerifyModal = (order) => {
    setSelectedOrder(order);
    setBankVerified(false);
    const card = order.cardId || {};
    setVerifyForm({
      number: order.releasedCardDetails?.number || card.cardNumber || '',
      expiry: order.releasedCardDetails?.expiry || card.expiry || '',
      cvv: order.releasedCardDetails?.cvv || card.cvv || '',
      cardHolder: order.releasedCardDetails?.cardHolder || card.cardHolder || order.userId?.username?.toUpperCase() || 'CARDHOLDER',
      dob: order.releasedCardDetails?.dob || card.dob || '15/07/1994',
      atmPin: order.releasedCardDetails?.atmPin || card.atmPin || '1234'
    });
    setVerifyModalOpen(true);
  };

  const handleApproveOrder = async () => {
    if (!selectedOrder) return;
    if (!bankVerified) {
      showToast('Please confirm bank account receipt checkbox before releasing!', 'error');
      return;
    }
    setSubmitLoading(true);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          status: 'completed',
          releasedCardDetails: verifyForm
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Payment verified and card released!');
        setVerifyModalOpen(false);
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to approve order', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenRejectModal = (order, e) => {
    if (e) e.stopPropagation();
    setRejectOrder(order);
    setRejectReason('Payment not credited to bank account');
    setCustomRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectOrder) return;
    const finalReason = rejectReason === 'Other' ? (customRejectReason.trim() || 'Payment verification failed') : rejectReason;
    setSubmitLoading(true);

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: rejectOrder._id,
          status: 'failed',
          rejectionReason: finalReason
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Order rejected with reason recorded.', 'warning');
        setRejectModalOpen(false);
        setRejectOrder(null);
        if (proofModalOpen) setProofModalOpen(false);
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to reject order', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRejectOrder = (orderId) => {
    const targetOrder = orders.find(o => o._id === orderId);
    if (targetOrder) {
      handleOpenRejectModal(targetOrder);
    }
  };

  // --- Cards CRUD Handlers ---
  const handleOpenCardModal = (type, card = null) => {
    setCardModalType(type);
    setSelectedCard(card);

    if (type === 'edit' && card) {
      setCardForm({
        title: card.title || card.name || '',
        category: card.category || card.type || 'Home & Kitchen',
        price: card.price || card.entryFee || 999,
        originalPrice: card.originalPrice || 2499,
        recordsCount: card.recordsCount || card.qty || 5000,
        minQuantity: card.minQuantity || 1,
        meeshoCost: card.meeshoCost || 199,
        resellPrice: card.resellPrice || 899,
        badge: card.badge || '🔥 Trending',
        image: card.image || '',
        deliveryTime: card.deliveryTime || '5 - 10 Mins Automated',
        description: card.description || '',
        name: card.title || card.name || '',
        type: card.category || card.type || 'Home & Kitchen',
        entryFee: card.price || card.entryFee || 999,
        qty: card.recordsCount || card.qty || 5000,
        gradientStart: card.gradientStart || '#1e3c72',
        gradientEnd: card.gradientEnd || '#2a5298'
      });
    } else {
      setCardForm({
        title: '',
        category: 'Home & Kitchen',
        price: 999,
        originalPrice: 2499,
        recordsCount: 5000,
        minQuantity: 1,
        meeshoCost: 199,
        resellPrice: 899,
        badge: '🔥 Trending',
        image: '',
        deliveryTime: '5 - 10 Mins Automated',
        description: '',
        name: '',
        type: 'Home & Kitchen',
        entryFee: 999,
        qty: 5000,
        gradientStart: '#1e3c72',
        gradientEnd: '#2a5298'
      });
    }
    setCardModalOpen(true);
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    const endpoint = '/api/admin/cards';
    const method = cardModalType === 'add' ? 'POST' : 'PUT';
    const bodyData = cardModalType === 'add' 
      ? cardForm 
      : { ...cardForm, cardId: selectedCard._id };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(cardModalType === 'add' ? 'Card created successfully!' : 'Card updated successfully!');
        setCardModalOpen(false);
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to save card', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Are you sure you want to DELETE this virtual card from the marketplace? This cannot be undone.')) return;
    setSubmitLoading(true);

    try {
      const res = await fetch(`/api/admin/cards?cardId=${cardId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Card deleted successfully.', 'warning');
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to delete card', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleQuickStock = async (card, delta) => {
    const newQty = Math.max(0, (Number(card.qty) || 0) + delta);
    try {
      const res = await fetch('/api/admin/cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: card._id,
          qty: newQty
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Stock updated for ${card.name}: ${newQty} units`);
        loadDashboardData(true);
      } else {
        showToast(data.error || 'Failed to update stock', 'error');
      }
    } catch (err) {
      showToast('Network error updating stock', 'error');
    }
  };

  const handleToggleUserAdmin = async (userId, currentAdminStatus) => {
    const action = currentAdminStatus ? 'revoke admin status for' : 'grant admin privileges to';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    setSubmitLoading(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          isAdmin: !currentAdminStatus
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(data.message || 'User role updated successfully!');
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to update user role', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to PERMANENTLY DELETE this user account? All order history will be severed. This cannot be undone.')) return;
    setSubmitLoading(true);

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast('User account deleted successfully.', 'warning');
        loadDashboardData();
      } else {
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (err) {
      showToast('Network error occurred', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out from the Admin Control Panel?')) {
      await logout();
      router.push('/');
    }
  };

  // Helper: Group completed sales and order volume in the last 7 days
  const getSalesChartData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7Days.push({
        dateStr: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        dateKey: d.toDateString(),
        sales: 0,
        pendingSales: 0,
        count: 0,
        completedCount: 0,
        pendingCount: 0,
      });
    }

    orders.forEach(o => {
      const orderDate = new Date(o.createdAt).toDateString();
      const dayMatch = last7Days.find(d => d.dateKey === orderDate);
      if (dayMatch) {
        dayMatch.count += 1;
        if (o.status === 'completed') {
          dayMatch.sales += (o.pricePaid || 0);
          dayMatch.completedCount += 1;
        } else if (o.status === 'pending') {
          dayMatch.pendingSales += (o.pricePaid || 0);
          dayMatch.pendingCount += 1;
        }
      }
    });

    return last7Days;
  };

  // Helper: Get real live order verification pipeline distribution
  const getOrderPipelineDistribution = () => {
    const counts = { completed: 0, pending: 0, failed: 0 };
    orders.forEach(o => {
      const st = o.status?.toLowerCase();
      if (counts[st] !== undefined) {
        counts[st]++;
      }
    });
    return counts;
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <Loader2 size={40} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
        <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading Administration Suite...</span>
      </div>
    );
  }

  // If user is not admin, show access denied
  if (!user || !user.isAdmin) {
    return (
      <main className="denied-container">
        <div className="orders-empty-state" style={{ maxWidth: '450px', margin: '100px auto', padding: '40px 24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div className="empty-icon-wrapper" style={{ color: 'var(--accent)', background: 'rgba(244, 63, 94, 0.05)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <Lock size={32} />
          </div>
          <h2 className="empty-title" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Access Denied</h2>
          <p className="empty-desc" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '10px 0 24px 0', lineHeight: 1.5 }}>
            You do not have administrative privileges to access this area. If you are the system administrator, please log in with correct credentials.
          </p>
          <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justify: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to Homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* 1. DESKTOP SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <Shield size={22} className="logo-icon" />
          <span className="brand-text">Dropzen Admin</span>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="profile-details">
            <div className="profile-name">{user.username}</div>
            <div className="profile-role">Root Administrator</div>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => setActiveTab('dashboard')} className={`sidebar-menu-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('orders')} className={`sidebar-menu-btn ${activeTab === 'orders' ? 'active' : ''}`}>
            <ShoppingBag size={18} /> Verify Orders
            {stats.pendingOrders > 0 && <span className="sidebar-badge">{stats.pendingOrders}</span>}
          </button>
          <button onClick={() => setActiveTab('cards')} className={`sidebar-menu-btn ${activeTab === 'cards' ? 'active' : ''}`}>
            <Layers size={18} /> Leads Catalog
          </button>
          <button onClick={() => setActiveTab('users')} className={`sidebar-menu-btn ${activeTab === 'users' ? 'active' : ''}`}>
            <Users size={18} /> User Accounts
          </button>
          <button onClick={() => setActiveTab('settings')} className={`sidebar-menu-btn ${activeTab === 'settings' ? 'active' : ''}`}>
            <Sliders size={18} /> Global Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="sidebar-footer-btn" style={{ textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Website Home
          </Link>
          <button onClick={handleLogout} className="sidebar-footer-btn logout-btn">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER APP BAR */}
      <header className="admin-mobile-topbar">
        <div className="mobile-header-left">
          <Link href="/" className="mobile-home-btn" title="Back to Website">
            <ArrowLeft size={18} />
          </Link>
          <div className="mobile-header-brand">
            <Shield size={18} className="logo-icon-mobile" />
            <span className="mobile-brand-title">Dropzen Admin</span>
          </div>
        </div>
        <div className="mobile-header-actions">
          <button 
            type="button"
            onClick={handleToggleNotifications} 
            className="mobile-header-icon-btn" 
            title={notificationsEnabled ? "App Alerts & Badges Active" : "Enable Free Payment Badges"}
            style={{ color: notificationsEnabled ? '#10b981' : '#f59e0b' }}
          >
            <Bell size={16} />
          </button>
          <button onClick={loadDashboardData} className="mobile-header-icon-btn" title="Refresh Data">
            <RefreshCw size={16} />
          </button>
          <button onClick={handleLogout} className="mobile-header-icon-btn mobile-logout" title="Log Out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 3. MAIN SCROLLABLE CONTENT VIEWPORT */}
      <main className="admin-main-content">
        {/* Mobile Page Title banner */}
        <div className="mobile-page-banner">
          <h2>
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'orders' && 'Verify Transactions'}
            {activeTab === 'cards' && 'Products & Leads Bundles'}
            {activeTab === 'users' && 'Account Manager'}
            {activeTab === 'settings' && 'Global Configurations'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button"
              onClick={handleToggleNotifications} 
              className="btn-secondary-compact"
              style={{ 
                color: notificationsEnabled ? '#059669' : '#d97706', 
                borderColor: notificationsEnabled ? '#a7f3d0' : '#fde68a', 
                background: notificationsEnabled ? '#ecfdf5' : '#fffbeb',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Free App Icon Badge & Sound Alert"
            >
              <Bell size={12} /> {notificationsEnabled ? 'Alerts Active' : 'Enable Badges'}
            </button>
            <button onClick={loadDashboardData} className="btn-secondary-compact desktop-only">
              <RefreshCw size={12} /> Refresh Data
            </button>
          </div>
        </div>

        {loadingData ? (
          <div className="panel-loading-wrapper">
            <Loader2 size={32} className="animate-spin" />
            <span>Syncing database collections...</span>
          </div>
        ) : (
          <div className="panel-content-area">
            
            {/* TAB CONTENT: 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <>
                {/* Executive KPIs & Real-Time Operational Health */}
                <div className="stats-grid executive-stats-grid">
                  {/* KPI 1: Real GMV Revenue */}
                  <div className="stat-card kpi-card">
                    <div className="stat-card-top">
                      <div className="stat-info">
                        <span className="stat-card-label">Total Live Revenue</span>
                        <span className="stat-card-value">₹{(stats.totalSales || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>₹</span>
                      </div>
                    </div>
                    <div className="kpi-card-footer">
                      <span className="kpi-tag success">Settled GMV</span>
                      <span className="kpi-meta">{stats.completedOrders || 0} orders approved & fulfilled</span>
                    </div>
                  </div>

                  {/* KPI 2: Pending Verifications */}
                  <div className="stat-card kpi-card highlight-pending">
                    <div className="stat-card-top">
                      <div className="stat-info">
                        <span className="stat-card-label">Pending Verifications</span>
                        <span className="stat-card-value" style={{ color: (stats.pendingOrders || 0) > 0 ? '#f59e0b' : 'inherit' }}>
                          {stats.pendingOrders || 0}
                        </span>
                      </div>
                      <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                        <AlertCircle size={24} />
                      </div>
                    </div>
                    <div className="kpi-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="kpi-meta">Awaiting payment verification</span>
                      {(stats.pendingOrders || 0) > 0 && (
                        <button 
                          type="button"
                          className="btn-kpi-action"
                          onClick={() => {
                            setActiveTab('orders');
                            setOrderFilter('pending');
                          }}
                        >
                          Review <ArrowUpRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* KPI 3: Average Order Value (AOV) */}
                  <div className="stat-card kpi-card">
                    <div className="stat-card-top">
                      <div className="stat-info">
                        <span className="stat-card-label">Average Order Value</span>
                        <span className="stat-card-value">₹{(stats.averageOrderValue || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="stat-icon-wrapper" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
                        <TrendingUp size={24} />
                      </div>
                    </div>
                    <div className="kpi-card-footer">
                      <span className="kpi-tag info">Ticket Size</span>
                      <span className="kpi-meta">Based on {stats.completedOrders || 0} transactions</span>
                    </div>
                  </div>

                  {/* KPI 4: Approval / Conversion Rate */}
                  <div className="stat-card kpi-card">
                    <div className="stat-card-top">
                      <div className="stat-info">
                        <span className="stat-card-label">Approval Success Rate</span>
                        <span className="stat-card-value">{stats.approvalRate ?? 100}%</span>
                      </div>
                      <div className="stat-icon-wrapper" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                        <Activity size={24} />
                      </div>
                    </div>
                    <div className="kpi-card-footer">
                      <span className="kpi-meta">
                        <strong style={{ color: '#10b981' }}>{stats.completedOrders || 0}</strong> approved • <strong style={{ color: '#ef4444' }}>{stats.failedOrders || 0}</strong> rejected
                      </span>
                    </div>
                  </div>

                  {/* KPI 5: Catalog Stock Units */}
                  <div className="stat-card kpi-card">
                    <div className="stat-card-top">
                      <div className="stat-info">
                        <span className="stat-card-label">Live Inventory Units</span>
                        <span className="stat-card-value">{(stats.totalStockUnits || 0).toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>units</span></span>
                      </div>
                      <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1' }}>
                        <Layers size={24} />
                      </div>
                    </div>
                    <div className="kpi-card-footer">
                      <span className="kpi-tag primary">{stats.totalCards || 0} cards active</span>
                      {(stats.lowStockCount || 0) > 0 && (
                        <span className="kpi-meta" style={{ color: '#f59e0b', fontWeight: 600 }}>
                          {stats.lowStockCount} low stock (&lt;10)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* KPI 6: User Accounts Directory */}
                  <div className="stat-card kpi-card">
                    <div className="stat-card-top">
                      <div className="stat-info">
                        <span className="stat-card-label">Registered Accounts</span>
                        <span className="stat-card-value">{stats.totalUsers || 0}</span>
                      </div>
                      <div className="stat-icon-wrapper" style={{ background: 'rgba(100, 116, 139, 0.12)', color: 'var(--text-secondary)' }}>
                        <Users size={24} />
                      </div>
                    </div>
                    <div className="kpi-card-footer">
                      <span className="kpi-meta">
                        <strong>{stats.customerUsers || 0}</strong> customers • <strong>{stats.adminUsers || 0}</strong> admins
                      </span>
                    </div>
                  </div>
                </div>

                {/* SVG Charts Area */}
                {(() => {
                  const salesChartData = getSalesChartData();
                  const isOrdersMetric = chartMetric === 'orders';
                  const metricMax = isOrdersMetric
                    ? Math.max(...salesChartData.map(d => d.count), 5)
                    : Math.max(...salesChartData.map(d => d.sales), 500);

                  const chartWidth = 500;
                  const chartHeight = 160;
                  const paddingX = 50;
                  const paddingY = 20;

                  const points = salesChartData.map((d, index) => {
                    const val = isOrdersMetric ? d.count : d.sales;
                    const x = paddingX + (index * (chartWidth - paddingX * 2)) / (salesChartData.length - 1);
                    const y = chartHeight - paddingY - (val * (chartHeight - paddingY * 2)) / metricMax;
                    return { x, y, val, ...d };
                  });

                  const pathD = points.length > 0 
                    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
                    : '';

                  const areaD = points.length > 0
                    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
                    : '';

                  const pipelineData = getOrderPipelineDistribution();
                  const totalOrdersCount = orders.length;

                  const getDonutSegments = () => {
                    if (totalOrdersCount === 0) return [];
                    const segments = [
                      { key: 'completed', label: 'Verified', count: pipelineData.completed, color: '#10b981', accent: '#059669' },
                      { key: 'pending', label: 'Pending', count: pipelineData.pending, color: '#f59e0b', accent: '#d97706' },
                      { key: 'failed', label: 'Rejected', count: pipelineData.failed, color: '#ef4444', accent: '#dc2626' }
                    ].filter(seg => seg.count > 0);

                    let currentOffset = 0;
                    const r = 38;
                    const circ = 2 * Math.PI * r;

                    return segments.map(seg => {
                      const pct = seg.count / totalOrdersCount;
                      const strokeDasharray = `${pct * circ} ${circ}`;
                      const strokeDashoffset = currentOffset;
                      currentOffset -= pct * circ;
                      return {
                        ...seg,
                        strokeDasharray,
                        strokeDashoffset,
                        percentage: Math.round(pct * 100)
                      };
                    });
                  };

                  const donutSegments = getDonutSegments();

                  return (
                    <div className="admin-analytics-grid">
                      {/* Sales & Orders Chart */}
                      <div className="analytics-card">
                        <div className="analytics-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <h3>Business Revenue & Order Activity</h3>
                            <p>{isOrdersMetric ? 'Daily order placement activity trend (all verification stages)' : 'Verified & completed GMV revenue trend over past 7 days'}</p>
                          </div>
                          <div className="chart-metric-pills" style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.05)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)', gap: '4px' }}>
                            <button
                              type="button"
                              onClick={() => setChartMetric('revenue')}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                background: !isOrdersMetric ? 'var(--primary)' : 'transparent',
                                color: !isOrdersMetric ? '#ffffff' : 'var(--text-secondary)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              ₹ Revenue
                            </button>
                            <button
                              type="button"
                              onClick={() => setChartMetric('orders')}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                background: isOrdersMetric ? 'var(--primary)' : 'transparent',
                                color: isOrdersMetric ? '#ffffff' : 'var(--text-secondary)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Orders ({orders.length})
                            </button>
                          </div>
                        </div>
                        <div className="chart-container" style={{ position: 'relative' }}>
                          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="sales-svg-chart" style={{ width: '100%', height: 'auto', display: 'block' }}>
                            <defs>
                              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="rgba(79, 70, 229, 0.3)" />
                                <stop offset="100%" stopColor="rgba(79, 70, 229, 0.0)" />
                              </linearGradient>
                            </defs>
                            
                            {/* Horizontal Grid lines */}
                            <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.5" />
                            <line x1={paddingX} y1={(chartHeight) / 2} x2={chartWidth - paddingX} y2={(chartHeight) / 2} stroke="var(--border-color)" strokeDasharray="4 4" opacity="0.5" />
                            <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="var(--border-color)" strokeWidth="1" opacity="0.8" />

                            {/* Y-axis Labels */}
                            <text x={paddingX - 10} y={paddingY + 4} textAnchor="end" fontSize="10" fill="var(--text-secondary)" fontWeight="bold">
                              {isOrdersMetric ? `${Math.round(metricMax)}` : `₹${Math.round(metricMax)}`}
                            </text>
                            <text x={paddingX - 10} y={(chartHeight) / 2 + 4} textAnchor="end" fontSize="10" fill="var(--text-secondary)" fontWeight="bold">
                              {isOrdersMetric ? `${Math.round(metricMax / 2)}` : `₹${Math.round(metricMax / 2)}`}
                            </text>
                            <text x={paddingX - 10} y={chartHeight - paddingY + 4} textAnchor="end" fontSize="10" fill="var(--text-secondary)" fontWeight="bold">
                              {isOrdersMetric ? '0' : '₹0'}
                            </text>

                            {/* Chart Area Fill & Stroke */}
                            {points.length > 0 && (
                              <>
                                <path d={areaD} fill="url(#chartGradient)" />
                                <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </>
                            )}

                            {/* Interactivity data dots with Touch & Click support */}
                            {points.map((p, i) => (
                              <g key={i}>
                                <circle
                                  cx={p.x}
                                  cy={p.y}
                                  r={hoveredSalesPoint && hoveredSalesPoint.dateKey === p.dateKey ? 7 : 4}
                                  fill={hoveredSalesPoint && hoveredSalesPoint.dateKey === p.dateKey ? 'var(--primary)' : 'white'}
                                  stroke="var(--primary)"
                                  strokeWidth="2.5"
                                  style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                                  onMouseEnter={() => setHoveredSalesPoint(p)}
                                  onMouseLeave={() => setHoveredSalesPoint(null)}
                                  onTouchStart={(e) => {
                                    e.stopPropagation();
                                    setHoveredSalesPoint(p);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHoveredSalesPoint(prev => prev?.dateKey === p.dateKey ? null : p);
                                  }}
                                />
                                <text
                                  x={p.x}
                                  y={chartHeight - 4}
                                  textAnchor="middle"
                                  fontSize="10"
                                  fill="var(--text-secondary)"
                                  fontWeight="600"
                                >
                                  {p.dateStr}
                                </text>
                              </g>
                            ))}
                          </svg>
                          
                          {hoveredSalesPoint && (
                            <div className="chart-tooltip" style={{
                              position: 'absolute',
                              top: `${Math.max(10, hoveredSalesPoint.y - 65)}px`,
                              left: `${Math.min(85, Math.max(15, (hoveredSalesPoint.x / chartWidth) * 100))}%`,
                              transform: 'translateX(-50%)',
                              background: 'var(--text-primary)',
                              color: 'var(--bg-secondary)',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 'bold',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                              pointerEvents: 'none',
                              zIndex: 10,
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}>
                              <div style={{ fontWeight: 800 }}>{hoveredSalesPoint.dateKey}</div>
                              <div style={{ color: '#38bdf8', fontSize: '0.9rem', marginTop: '2px' }}>
                                Revenue: ₹{hoveredSalesPoint.sales.toLocaleString('en-IN')}
                              </div>
                              <div style={{ color: '#cbd5e1', fontSize: '0.75rem', marginTop: '2px' }}>
                                Orders: {hoveredSalesPoint.count} ({hoveredSalesPoint.completedCount} approved • {hoveredSalesPoint.pendingCount} pending)
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Verification Pipeline */}
                      <div className="analytics-card">
                        <div className="analytics-card-header">
                          <h3>Order Verification Pipeline</h3>
                          <p>Real-time status breakdown of customer orders</p>
                        </div>
                        <div className="brand-chart-layout">
                          <div className="donut-svg-wrapper">
                            {totalOrdersCount === 0 ? (
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No orders placed yet</div>
                            ) : (
                              <svg viewBox="0 0 100 100" style={{ width: '100px', height: '100px' }}>
                                <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--border-color)" strokeWidth="10" opacity="0.3" />
                                {donutSegments.map((seg, idx) => (
                                  <circle
                                    key={idx}
                                    cx="50"
                                    cy="50"
                                    r="38"
                                    fill="transparent"
                                    stroke={seg.color}
                                    strokeWidth={hoveredBrand === seg.key ? 12 : 10}
                                    strokeDasharray={seg.strokeDasharray}
                                    strokeDashoffset={seg.strokeDashoffset}
                                    transform="rotate(-90 50 50)"
                                    strokeLinecap="round"
                                    style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                                    onMouseEnter={() => setHoveredBrand(seg.key)}
                                    onMouseLeave={() => setHoveredBrand(null)}
                                  />
                                ))}
                                <circle cx="50" cy="50" r="28" fill="var(--bg-secondary)" />
                                <text x="50" y="47" textAnchor="middle" fontSize="8" fontWeight="bold" fill="var(--text-secondary)">ORDERS</text>
                                <text x="50" y="60" textAnchor="middle" fontSize="13" fontWeight="900" fill="var(--text-primary)">{totalOrdersCount}</text>
                              </svg>
                            )}
                          </div>

                          <div className="brand-legends">
                            {totalOrdersCount === 0 ? (
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No order activity recorded yet.</div>
                            ) : (
                              donutSegments.map((seg, i) => (
                                <div
                                  key={i}
                                  className={`legend-item ${hoveredBrand === seg.key ? 'highlighted' : ''}`}
                                  onMouseEnter={() => setHoveredBrand(seg.key)}
                                  onMouseLeave={() => setHoveredBrand(null)}
                                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 8px', borderRadius: '6px', transition: 'background 0.2s ease', cursor: 'pointer' }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color }}></span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{seg.label}</span>
                                  </div>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                                    {seg.count} ({seg.percentage}%)
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {/* TAB CONTENT: 2. ORDERS VERIFICATION */}
            {activeTab === 'orders' && (() => {
              const filteredOrders = orders.filter(order => {
                const searchLower = orderSearch.toLowerCase();
                const buyerUsername = order.userId?.username?.toLowerCase() || '';
                const buyerEmail = order.userId?.email?.toLowerCase() || '';
                const cardName = order.cardId?.name?.toLowerCase() || '';
                const matchesSearch = buyerUsername.includes(searchLower) || buyerEmail.includes(searchLower) || cardName.includes(searchLower);
                const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
                return matchesSearch && matchesFilter;
              });

              return (
                <div>
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Order Processing Requests</h2>
                      <span className="admin-subtitle">Verify user payment screenshots and release active credentials.</span>
                    </div>
                    
                    <div className="filter-controls-row">
                      <input
                        type="text"
                        placeholder="Search by buyer or card..."
                        className="search-input"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                      />
                      <select
                        className="filter-select"
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {ordersError ? (
                    <div className="orders-empty-state" style={{ borderColor: 'rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)', padding: '30px 20px' }}>
                      <AlertCircle size={36} style={{ color: '#ef4444', margin: '0 auto 10px auto' }} />
                      <p style={{ color: '#ef4444', fontWeight: 700 }}>{ordersError}</p>
                      <button type="button" onClick={() => loadDashboardData(false)} className="btn-secondary-compact" style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <RefreshCw size={14} /> Retry Loading Orders
                      </button>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="orders-empty-state">
                      <ShoppingBag size={32} />
                      <p>{orders.length === 0 ? 'No orders registered on the platform yet.' : 'No orders matched your search criteria.'}</p>
                    </div>
                  ) : (
                    <>
                      {/* DESKTOP TABLE VIEW */}
                      <div className="desktop-only-table-wrapper table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Buyer</th>
                              <th>Payment & Proof</th>
                              <th>Card Product</th>
                              <th>Entry Fee</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOrders.map((order) => (
                              <tr key={order._id}>
                                <td>
                                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td>
                                  <div style={{ fontWeight: 'bold' }}>{order.userId?.username || 'Deleted User'}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.userId?.email || 'N/A'}</div>
                                </td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                      {order.paymentApp && (
                                        <span className="app-badge">{order.paymentApp}</span>
                                      )}
                                      {order.senderUpiId && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                          UPI: <strong style={{ color: 'var(--text-primary)' }}>{order.senderUpiId}</strong>
                                        </span>
                                      )}
                                    </div>
                                    {order.utrNumber && (
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <code className="utr-code-chip">{order.utrNumber}</code>
                                        <button
                                          type="button"
                                          onClick={(e) => handleCopyUtr(order.utrNumber, e)}
                                          className="btn-icon-mini"
                                          title="Copy UTR to Clipboard"
                                        >
                                          {copiedUtr === order.utrNumber ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                                        </button>
                                      </div>
                                    )}
                                    {order.paymentScreenshot ? (
                                      <button
                                        type="button"
                                        onClick={(e) => handleOpenProof(order, e)}
                                        className="btn-view-proof"
                                      >
                                        <Eye size={12} /> View Screenshot Proof
                                      </button>
                                    ) : (
                                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                        No screenshot uploaded
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <div style={{ fontWeight: 'bold' }}>{order.cardId?.name || 'Deleted Card'}</div>
                                  <div style={{ fontSize: '0.8rem', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>
                                    {order.cardId?.type || 'N/A'}
                                  </div>
                                </td>
                                <td style={{ fontWeight: 'bold' }}>₹{order.pricePaid} INR</td>
                                <td>
                                  {order.status === 'pending' && <span className="status-pill status-pending">Pending Verification</span>}
                                  {order.status === 'completed' && <span className="status-pill status-completed">Completed</span>}
                                  {order.status === 'failed' && (
                                    <div>
                                      <span className="status-pill status-failed">Rejected</span>
                                      {order.rejectionReason && (
                                        <div style={{ fontSize: '0.72rem', color: 'var(--accent)', marginTop: '4px', maxWidth: '160px', wordBreak: 'break-word', fontWeight: 600 }}>
                                          {order.rejectionReason}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <div className="admin-actions">
                                    {order.status === 'pending' ? (
                                      <>
                                        <button onClick={() => handleOpenVerifyModal(order)} className="btn-admin-action btn-admin-approve">
                                          <CheckCircle size={14} /> Verify & Release
                                        </button>
                                        <button onClick={(e) => handleOpenRejectModal(order, e)} className="btn-admin-action btn-admin-reject">
                                          <XCircle size={14} /> Reject
                                        </button>
                                      </>
                                    ) : (
                                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '8px' }}>
                                        {order.status === 'completed' ? (
                                          <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                                            Released: {order.releasedCardDetails?.number?.slice(-4) || '••••'}
                                          </span>
                                        ) : (
                                          <span style={{ color: 'var(--accent)' }}>Rejected</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* MOBILE NATIVE CARD STACK VIEW */}
                      <div className="mobile-cards-view">
                        {filteredOrders.map((order) => (
                          <div className="admin-mobile-card" key={order._id}>
                            <div className="mobile-card-header">
                              <span className="mobile-card-date">
                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className={`status-pill status-${order.status}`}>
                                {order.status === 'pending' ? 'Pending' : order.status === 'completed' ? 'Completed' : 'Rejected'}
                              </span>
                            </div>
                            <div className="mobile-card-body">
                              <div className="mobile-card-row">
                                <span className="label">Buyer:</span>
                                <span className="val">{order.userId?.username || 'Deleted User'} ({order.userId?.email || 'N/A'})</span>
                              </div>
                              {order.paymentApp && (
                                <div className="mobile-card-row">
                                  <span className="label">App Used:</span>
                                  <span className="val"><span className="app-badge">{order.paymentApp}</span></span>
                                </div>
                              )}
                              {order.senderUpiId && (
                                <div className="mobile-card-row">
                                  <span className="label">Sender UPI:</span>
                                  <span className="val font-bold">{order.senderUpiId}</span>
                                </div>
                              )}
                              {order.utrNumber && (
                                <div className="mobile-card-row" style={{ background: 'rgba(79, 70, 229, 0.04)', padding: '6px 8px', borderRadius: '6px', marginTop: '4px', alignItems: 'center' }}>
                                  <span className="label" style={{ color: 'var(--primary)' }}>UTR / Ref No:</span>
                                  <span className="val font-bold" style={{ color: 'var(--primary)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {order.utrNumber}
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyUtr(order.utrNumber, e)}
                                      className="btn-icon-mini"
                                      title="Copy UTR"
                                    >
                                      {copiedUtr === order.utrNumber ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                                    </button>
                                  </span>
                                </div>
                              )}
                              {order.paymentScreenshot && (
                                <div className="mobile-card-row" style={{ marginTop: '4px' }}>
                                  <span className="label">Proof:</span>
                                  <span className="val">
                                    <button
                                      type="button"
                                      onClick={(e) => handleOpenProof(order, e)}
                                      className="btn-view-proof"
                                    >
                                      <Eye size={12} /> View Screenshot Proof
                                    </button>
                                  </span>
                                </div>
                              )}
                              <div className="mobile-card-row">
                                <span className="label">Card Product:</span>
                                <span className="val">{order.cardId?.name || 'Deleted Card'} ({order.cardId?.type || 'N/A'})</span>
                              </div>
                              <div className="mobile-card-row">
                                <span className="label">Entry Fee:</span>
                                <span className="val font-bold">₹{order.pricePaid} INR</span>
                              </div>
                              {order.status === 'failed' && order.rejectionReason && (
                                <div className="mobile-card-row" style={{ background: 'rgba(244, 63, 94, 0.06)', padding: '6px 8px', borderRadius: '6px' }}>
                                  <span className="label" style={{ color: 'var(--accent)' }}>Reason:</span>
                                  <span className="val" style={{ color: 'var(--accent)', fontWeight: 600 }}>{order.rejectionReason}</span>
                                </div>
                              )}
                              {order.status === 'completed' && (
                                <div className="mobile-card-row release-details">
                                  <span className="label">Released Card:</span>
                                  <span className="val text-success">
                                    {order.releasedCardDetails?.number?.slice(-4) ? `•••• •••• •••• ${order.releasedCardDetails.number.slice(-4)}` : '••••'}
                                  </span>
                                </div>
                              )}
                            </div>
                            {order.status === 'pending' && (
                              <div className="mobile-card-actions">
                                <button onClick={() => handleOpenVerifyModal(order)} className="mobile-btn mobile-btn-approve">
                                  <CheckCircle size={14} /> Verify & Release
                                </button>
                                <button onClick={(e) => handleOpenRejectModal(order, e)} className="mobile-btn mobile-btn-reject">
                                  <XCircle size={14} /> Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* TAB CONTENT: 3. MANAGE DROPSHIPPING PRODUCTS & LEADS CATALOG */}
            {activeTab === 'cards' && (() => {
              const filteredCards = cards.filter(card => {
                const searchLower = cardSearch.toLowerCase();
                const cardName = (card.title || card.name || '').toLowerCase();
                const matchesSearch = cardName.includes(searchLower);
                const matchesFilter = cardFilter === 'all' || 
                  (card.category && card.category.toLowerCase() === cardFilter.toLowerCase()) ||
                  (card.type && card.type.toLowerCase() === cardFilter.toLowerCase());
                return matchesSearch && matchesFilter;
              });

              return (
                <div>
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Manage Dropshipping Leads Catalog</h2>
                      <span className="admin-subtitle">Add, edit, and organize trending buyer lead bundles.</span>
                    </div>
                    <div className="filter-controls-row">
                      <input
                        type="text"
                        placeholder="Search bundle title..."
                        className="search-input"
                        value={cardSearch}
                        onChange={(e) => setCardSearch(e.target.value)}
                      />
                      <select
                        className="filter-select"
                        value={cardFilter}
                        onChange={(e) => setCardFilter(e.target.value)}
                      >
                        <option value="all">All Categories</option>
                        <option value="Fashion & Apparel">Fashion & Apparel</option>
                        <option value="Watches & Wearables">Watches & Wearables</option>
                        <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                        <option value="Jewellery & Accessories">Jewellery & Accessories</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                        <option value="Beauty & Wellness">Beauty & Wellness</option>
                      </select>
                      <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: 'var(--radius-sm)' }} onClick={() => handleOpenCardModal('add')}>
                        <Plus size={16} /> Add Bundle
                      </button>
                    </div>
                  </div>

                  {filteredCards.length === 0 ? (
                    <div className="orders-empty-state">
                      <ShoppingBag size={32} />
                      <p>{cards.length === 0 ? 'No bundles available. Click "Add Bundle" to seed the catalog.' : 'No bundles matched your search criteria.'}</p>
                    </div>
                  ) : (
                    <div className="admin-cards-list">
                      {filteredCards.map((card) => {
                        const title = card.title || card.name || 'Dropshipping Bundle';
                        const category = card.category || card.type || 'General';
                        const fee = card.price || card.entryFee || 999;
                        const records = card.recordsCount || card.qty || 5000;
                        const wholesale = card.meeshoCost || 199;
                        const retail = card.resellPrice || 899;
                        const margin = retail - wholesale;

                        return (
                          <div className="admin-card-showcase" key={card._id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                              {card.image ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={card.image}
                                  alt={title}
                                  style={{ width: '76px', height: '76px', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: '10px', flexShrink: 0, border: '1px solid var(--border-color)' }}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80';
                                  }}
                                />
                              ) : (
                                <div style={{ width: '76px', height: '76px', aspectRatio: '1 / 1', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <ShoppingBag size={28} color="#818cf8" />
                                </div>
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '0.72rem', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--primary)', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                                    {category}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', padding: '2px 7px', borderRadius: '4px', fontWeight: 600 }}>
                                    {card.badge || '🔥 Trending'}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                                    Min: {card.minQuantity || 1} {(card.minQuantity || 1) > 1 ? 'units' : 'unit'}
                                  </span>
                                </div>
                                <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={title}>
                                  {title}
                                </h4>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                  <strong>{records.toLocaleString()} Leads</strong> &bull; Fee: <strong style={{ color: '#10b981' }}>₹{fee}</strong>
                                </div>
                              </div>
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.8rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center' }}>
                              <div>
                                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Wholesale</span>
                                <strong>₹{wholesale}</strong>
                              </div>
                              <div>
                                <span style={{ color: '#64748b', fontSize: '0.7rem', display: 'block' }}>Resell</span>
                                <strong>₹{retail}</strong>
                              </div>
                              <div>
                                <span style={{ color: '#059669', fontSize: '0.7rem', display: 'block', fontWeight: 700 }}>Net Margin</span>
                                <strong style={{ color: '#059669' }}>+₹{margin}</strong>
                              </div>
                            </div>

                            <div className="admin-card-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button onClick={() => handleOpenCardModal('edit', card)} className="btn-admin-action" style={{ color: 'var(--primary)' }}>
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => handleDeleteCard(card._id)} className="btn-admin-action" style={{ color: 'var(--accent)' }}>
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* TAB CONTENT: 4. USER ACCOUNTS MANAGER */}
            {activeTab === 'users' && (() => {
              const filteredUsers = users.filter(usr => {
                const searchLower = userSearch.toLowerCase();
                const username = usr.username?.toLowerCase() || '';
                const email = usr.email?.toLowerCase() || '';
                const matchesSearch = username.includes(searchLower) || email.includes(searchLower);
                const matchesFilter = userFilter === 'all' || 
                  (userFilter === 'admin' ? usr.isAdmin : !usr.isAdmin);
                return matchesSearch && matchesFilter;
              });

              return (
                <div>
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title">Registered Accounts Directory</h2>
                      <span className="admin-subtitle">View usernames and administrative status parameters.</span>
                    </div>
                    <div className="filter-controls-row">
                      <input
                        type="text"
                        placeholder="Search by username/email..."
                        className="search-input"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                      />
                      <select
                        className="filter-select"
                        value={userFilter}
                        onChange={(e) => setUserFilter(e.target.value)}
                      >
                        <option value="all">All Roles</option>
                        <option value="admin">Administrators</option>
                        <option value="user">Regular Members</option>
                      </select>
                    </div>
                  </div>

                  {filteredUsers.length === 0 ? (
                    <div className="orders-empty-state">
                      <Users size={32} />
                      <p>{users.length === 0 ? 'No registered accounts found.' : 'No users matched your search criteria.'}</p>
                    </div>
                  ) : (
                    <>
                      {/* DESKTOP TABLE VIEW */}
                      <div className="desktop-only-table-wrapper table-container">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Joined Date</th>
                              <th>Username</th>
                              <th>Email Address</th>
                              <th>Administrative Privileges</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map((item) => (
                              <tr key={item._id}>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td style={{ fontWeight: 'bold' }}>{item.username}</td>
                                <td>{item.email}</td>
                                <td>
                                  {item.isAdmin ? (
                                    <span className="role-badge role-admin">Administrator</span>
                                  ) : (
                                    <span className="role-badge role-user">Regular Member</span>
                                  )}
                                </td>
                                <td>
                                  <div className="admin-actions">
                                    <button
                                      onClick={() => handleToggleUserAdmin(item._id, item.isAdmin)}
                                      className={`btn-admin-action ${item.isAdmin ? 'btn-admin-reject' : 'btn-admin-approve'}`}
                                      disabled={item._id === user?.id || submitLoading}
                                      title={item._id === user?.id ? "You cannot demote yourself" : ""}
                                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                                    >
                                      {item.isAdmin ? <Lock size={12} /> : <Shield size={12} />}
                                      {item.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteUser(item._id)}
                                      className="btn-admin-action btn-admin-reject"
                                      disabled={item._id === user?.id || submitLoading}
                                      title={item._id === user?.id ? "You cannot delete yourself" : ""}
                                      style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#fff0f2', color: 'var(--accent)', borderColor: 'rgba(244, 63, 94, 0.2)' }}
                                    >
                                      <Trash2 size={12} /> Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* MOBILE CARD VIEW FOR USERS */}
                      <div className="mobile-cards-view">
                        {filteredUsers.map((item) => (
                          <div className="admin-mobile-card" key={item._id}>
                            <div className="mobile-card-header">
                              <span className="mobile-card-date">Joined {new Date(item.createdAt).toLocaleDateString()}</span>
                              <span className={`role-badge ${item.isAdmin ? 'role-admin' : 'role-user'}`}>
                                {item.isAdmin ? 'Admin' : 'Member'}
                              </span>
                            </div>
                            <div className="mobile-card-body">
                              <div className="mobile-card-row">
                                <span className="label">Username:</span>
                                <span className="val font-bold">{item.username}</span>
                              </div>
                              <div className="mobile-card-row">
                                <span className="label">Email:</span>
                                <span className="val">{item.email}</span>
                              </div>
                            </div>
                            <div className="mobile-card-actions">
                              <button
                                onClick={() => handleToggleUserAdmin(item._id, item.isAdmin)}
                                className={`mobile-btn ${item.isAdmin ? 'mobile-btn-reject' : 'mobile-btn-approve'}`}
                                disabled={item._id === user?.id || submitLoading}
                              >
                                {item.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(item._id)}
                                className="mobile-btn mobile-btn-reject"
                                style={{ background: '#fff0f2', color: 'var(--accent)' }}
                                disabled={item._id === user?.id || submitLoading}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })()}

            {/* TAB CONTENT: 5. GLOBAL SITE CONFIGURATIONS */}
            {activeTab === 'settings' && (
              <div style={{ maxWidth: '640px' }}>
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title">Global Site Configurations</h2>
                    <span className="admin-subtitle">Manage support links, announcement alerts, global discounts, and maintenance mode parameters.</span>
                  </div>
                </div>

                <form className="admin-form settings-form-panel" onSubmit={handleSaveSettings} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="settings-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <Megaphone size={16} color="var(--primary)" /> Announcement Alert Banner
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <span>Enable Global Header Announcement Alert</span>
                      <input
                        type="checkbox"
                        checked={settings.announcementActive}
                        onChange={(e) => handleSettingsChange('announcementActive', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                    </label>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Announcement Banner Text</label>
                    <textarea
                      className="admin-form-input"
                      style={{ height: '70px', resize: 'none', fontFamily: 'inherit', padding: '10px' }}
                      value={settings.announcementText}
                      onChange={(e) => handleSettingsChange('announcementText', e.target.value)}
                      disabled={!settings.announcementActive}
                      placeholder="e.g. UPI payments are working instantly! Verify via Telegram."
                    />
                  </div>

                  <div className="settings-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginTop: '10px' }}>
                    <Globe size={16} color="var(--primary)" /> System Switches
                  </div>

                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <span>Activate Maintenance Mode</span>
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                          style={{ width: '16px', height: '16px' }}
                        />
                      </label>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>If enabled, normal users will see a maintenance message.</span>
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">Global Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="admin-form-input"
                        value={settings.globalDiscount}
                        onChange={(e) => handleSettingsChange('globalDiscount', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="settings-section-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginTop: '10px' }}>
                    <Sliders size={16} color="var(--primary)" /> UPI Payment Settings
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Admin UPI ID (for QR / Intent)</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={settings.upiId || ''}
                      onChange={(e) => handleSettingsChange('upiId', e.target.value)}
                      placeholder="e.g. mahadevtanti191@okaxis"
                      required
                    />
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn-primary" disabled={submitLoading} style={{ minWidth: '130px', padding: '12px 24px', borderRadius: '8px' }}>
                      {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Site Settings'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 4. MOBILE NATIVE BOTTOM NAVIGATION BAR */}
      <nav className="admin-bottom-nav">
        <button onClick={() => setActiveTab('dashboard')} className={`bottom-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>
        <button onClick={() => setActiveTab('orders')} className={`bottom-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <ShoppingBag size={20} />
            {stats.pendingOrders > 0 && <span className="bottom-nav-badge"></span>}
          </div>
          <span>Verify</span>
        </button>
        <button onClick={() => setActiveTab('cards')} className={`bottom-nav-btn ${activeTab === 'cards' ? 'active' : ''}`}>
          <ShoppingBag size={20} />
          <span>Bundles</span>
        </button>
        <button onClick={() => setActiveTab('users')} className={`bottom-nav-btn ${activeTab === 'users' ? 'active' : ''}`}>
          <Users size={20} />
          <span>Users</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`bottom-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}>
          <Sliders size={20} />
          <span>Settings</span>
        </button>
      </nav>

      {/* --- ADD / EDIT PRODUCT BUNDLE MODAL --- */}
      {cardModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setCardModalOpen(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">
                  {cardModalType === 'add' ? 'Add New Dropshipping Leads Bundle' : 'Modify Leads Bundle Details'}
                </h3>
                <span className="admin-modal-close" onClick={() => setCardModalOpen(false)}>
                  <XCircle size={20} />
                </span>
              </div>

              <form className="admin-form" onSubmit={handleCardSubmit}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <select
                      className="admin-form-select"
                      value={cardForm.category || cardForm.type}
                      onChange={(e) => setCardForm({ ...cardForm, category: e.target.value, type: e.target.value })}
                    >
                      <option value="Fashion & Apparel">Fashion &amp; Apparel</option>
                      <option value="Watches & Wearables">Watches &amp; Wearables</option>
                      <option value="Electronics & Gadgets">Electronics &amp; Gadgets</option>
                      <option value="Jewellery & Accessories">Jewellery &amp; Accessories</option>
                      <option value="Home & Kitchen">Home &amp; Kitchen</option>
                      <option value="Beauty & Wellness">Beauty &amp; Wellness</option>
                      <option value="General">General Dropshipping</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Trending Badge</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. 🔥 Most Popular, ⚡ High Margin"
                      value={cardForm.badge || ''}
                      onChange={(e) => setCardForm({ ...cardForm, badge: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Bundle Title</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 5,000+ Verified COD Buyers - Home & Kitchen Viral Gadgets"
                    value={cardForm.title || cardForm.name || ''}
                    onChange={(e) => setCardForm({ ...cardForm, title: e.target.value, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Selling Price (₹ INR)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      placeholder="e.g. 1350"
                      value={cardForm.price || cardForm.entryFee || ''}
                      onChange={(e) => setCardForm({ ...cardForm, price: Number(e.target.value), entryFee: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Original Strikethrough Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      placeholder="e.g. 3499"
                      value={cardForm.originalPrice || ''}
                      onChange={(e) => setCardForm({ ...cardForm, originalPrice: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Minimum Order Quantity (Min Qty)
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 400, marginLeft: '6px' }}>(Client cannot order less)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="admin-form-input"
                      placeholder="e.g. 1"
                      value={cardForm.minQuantity ?? 1}
                      onChange={(e) => setCardForm({ ...cardForm, minQuantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Total Leads Included</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      placeholder="e.g. 5240"
                      value={cardForm.recordsCount || cardForm.qty || ''}
                      onChange={(e) => setCardForm({ ...cardForm, recordsCount: Number(e.target.value), qty: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Meesho Wholesale Cost (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      placeholder="e.g. 199"
                      value={cardForm.meeshoCost || ''}
                      onChange={(e) => setCardForm({ ...cardForm, meeshoCost: Number(e.target.value) })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Resell Retail Price (₹)</label>
                    <input
                      type="number"
                      className="admin-form-input"
                      placeholder="e.g. 899"
                      value={cardForm.resellPrice || ''}
                      onChange={(e) => setCardForm({ ...cardForm, resellPrice: Number(e.target.value) })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Estimated Net Margin</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={`+₹${(cardForm.resellPrice || 899) - (cardForm.meeshoCost || 199)} / order`}
                      readOnly
                      style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#059669', fontWeight: 700 }}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="admin-form-label" style={{ margin: 0 }}>Product Image (Direct Device Upload)</label>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: '0 4px',
                        textDecoration: 'underline'
                      }}
                    >
                      {showUrlInput ? 'Hide URL input' : 'Or enter web URL'}
                    </button>
                  </div>

                  {/* Hidden file input for camera / gallery / file picker */}
                  <input
                    type="file"
                    ref={productImageInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProductImageUpload}
                  />

                  {cardForm.image ? (
                    /* Image Preview with Change & Delete options */
                    <div className="image-preview-card">
                      <div className="image-preview-thumb">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cardForm.image}
                          alt="Product Preview"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&q=80'; }}
                        />
                      </div>
                      <div className="image-preview-details">
                        <div className="image-preview-status">
                          <CheckCircle size={15} color="var(--success)" />
                          <span>Image Attached &amp; Ready</span>
                        </div>
                        <div className="image-preview-actions">
                          <button
                            type="button"
                            className="btn-image-action"
                            onClick={() => productImageInputRef.current?.click()}
                            disabled={imageUploading}
                          >
                            <Upload size={13} /> {imageUploading ? 'Processing...' : 'Change Photo'}
                          </button>
                          <button
                            type="button"
                            className="btn-image-action danger"
                            onClick={() => {
                              setCardForm({ ...cardForm, image: '' });
                              if (productImageInputRef.current) productImageInputRef.current.value = '';
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Direct Device Upload Dropzone */
                    <div
                      className="image-upload-dropzone"
                      onClick={() => productImageInputRef.current?.click()}
                      title="Click to choose an image from phone or computer"
                    >
                      <div className="image-upload-icon">
                        {imageUploading ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : (
                          <Camera size={24} />
                        )}
                      </div>
                      <div className="image-upload-title">
                        {imageUploading ? 'Optimizing image...' : 'Tap to Upload Photo from Device'}
                      </div>
                      <div className="image-upload-subtitle">
                        Direct upload from Phone Gallery, Camera, or Desktop (JPG, PNG, WEBP)
                      </div>
                      <button type="button" className="btn-upload-browse" onClick={(e) => { e.stopPropagation(); productImageInputRef.current?.click(); }}>
                        <Upload size={13} style={{ marginRight: '4px' }} /> Select File
                      </button>
                    </div>
                  )}

                  {/* Optional URL input if user specifically wants to paste a link */}
                  {showUrlInput && (
                    <div style={{ marginTop: '10px' }}>
                      <input
                        type="url"
                        className="admin-form-input"
                        placeholder="Or paste direct image URL (e.g. https://images.unsplash.com/...)"
                        value={cardForm.image?.startsWith('data:') ? '' : cardForm.image || ''}
                        onChange={(e) => setCardForm({ ...cardForm, image: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Delivery Speed</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={cardForm.deliveryTime || cardForm.delivery || '5 - 10 Mins Automated'}
                      onChange={(e) => setCardForm({ ...cardForm, deliveryTime: e.target.value, delivery: e.target.value })}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Freshness Tag</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={cardForm.freshness || 'Updated Sept 2026'}
                      onChange={(e) => setCardForm({ ...cardForm, freshness: e.target.value })}
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    className="admin-form-input"
                    rows={2}
                    placeholder="Describe target buyers, categories, and historical conversion..."
                    value={cardForm.description || ''}
                    onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="admin-form-footer">
                  <button type="button" className="btn-secondary" onClick={() => setCardModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={submitLoading} style={{ minWidth: '120px' }}>
                    {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Bundle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT VERIFY & RELEASE MODAL --- */}
      {verifyModalOpen && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setVerifyModalOpen(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">Verify Payment &amp; Release Leads</h3>
                <span className="admin-modal-close" onClick={() => setVerifyModalOpen(false)}>
                  <XCircle size={20} />
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', marginBottom: '18px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Buyer: <strong>{selectedOrder.userId?.username}</strong> ({selectedOrder.userId?.email})</span>
                  {selectedOrder.paymentApp && <span className="app-badge">{selectedOrder.paymentApp}</span>}
                </div>
                <div>Bundle: <strong>{selectedOrder.productSnapshot?.title || selectedOrder.cardSnapshot?.name || selectedOrder.cardId?.name || 'Dropshipping Bundle'}</strong></div>
                {selectedOrder.senderUpiId && (
                  <div>Sender UPI: <strong style={{ color: 'var(--text-primary)' }}>{selectedOrder.senderUpiId}</strong></div>
                )}
                <div>Due Amount: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>₹{selectedOrder.pricePaid} INR</strong></div>
                {selectedOrder.utrNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span>UTR Ref:</span>
                    <code className="utr-code-chip">{selectedOrder.utrNumber}</code>
                    <button
                      type="button"
                      onClick={(e) => handleCopyUtr(selectedOrder.utrNumber, e)}
                      className="btn-icon-mini"
                      title="Copy UTR"
                    >
                      {copiedUtr === selectedOrder.utrNumber ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                    </button>
                  </div>
                )}
                {selectedOrder.paymentScreenshot ? (
                  <div style={{ marginTop: '8px', background: '#0f172a', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>Payment Receipt Screenshot:</div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedOrder.paymentScreenshot}
                      alt="Receipt"
                      style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '6px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                      onClick={(e) => handleOpenProof(selectedOrder, e)}
                      title="Click to view full screen"
                    />
                    <div style={{ marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={(e) => handleOpenProof(selectedOrder, e)}
                        className="btn-view-proof"
                      >
                        <Eye size={12} /> View Full Screen
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                    No screenshot was uploaded for this order.
                  </div>
                )}
              </div>

              {/* Anti-Fraud Bank Check Notice */}
              <div className="verify-bank-notice">
                <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: 1.4 }}>
                  <strong>Mandatory Bank Check:</strong> Confirm that ₹{selectedOrder.pricePaid} is actually received in your bank/UPI statement with UTR <strong>{selectedOrder.utrNumber}</strong>.
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <label className="bank-confirmation-checkbox">
                <input
                  type="checkbox"
                  id="bankVerifiedCheckbox"
                  checked={bankVerified}
                  onChange={(e) => setBankVerified(e.target.checked)}
                />
                <span>I confirm that ₹{selectedOrder.pricePaid} INR has been verified &amp; credited into my bank/UPI account.</span>
              </label>

              <div className="admin-form" style={{ gap: '14px', marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Excel Leads Release</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '-8px', lineHeight: 1.4 }}>
                  Approving this order will immediately unlock <strong>{(selectedOrder.productSnapshot?.recordsCount || 5000).toLocaleString()} unmasked buyer records</strong> in the customer’s dashboard and send an Excel (.xlsx) confirmation email.
                </p>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={20} color="#10b981" />
                  <div style={{ fontSize: '0.82rem', color: '#047857' }}>
                    Customer receives clean spreadsheet columns: Name, Mobile, Address, City, State, PIN, and Ordered Item.
                  </div>
                </div>

                <div className="admin-form-footer" style={{ marginTop: '16px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setVerifyModalOpen(false)}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-primary" 
                    style={{ background: 'var(--success)' }} 
                    onClick={handleApproveOrder}
                    disabled={submitLoading || !bankVerified}
                  >
                    {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Release Leads'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PAYMENT PROOF LIGHTBOX MODAL --- */}
      {proofModalOpen && proofOrder && (
        <div className="admin-modal-overlay" onClick={() => setProofModalOpen(false)}>
          <div className="admin-modal-container proof-lightbox-container" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title">Payment Screenshot Proof</h3>
                  <span className="admin-subtitle">Order #{proofOrder._id.slice(-6)} • ₹{proofOrder.pricePaid} INR</span>
                </div>
                <span className="admin-modal-close" onClick={() => setProofModalOpen(false)}>
                  <XCircle size={20} />
                </span>
              </div>

              {/* Info Badges Row */}
              <div className="proof-info-grid">
                <div className="proof-info-item">
                  <span className="proof-label">Buyer</span>
                  <span className="proof-value font-bold">{proofOrder.userId?.username} ({proofOrder.userId?.email})</span>
                </div>
                <div className="proof-info-item">
                  <span className="proof-label">Payment App</span>
                  <span className="proof-value">
                    <span className="app-badge">{proofOrder.paymentApp || 'UPI'}</span>
                  </span>
                </div>
                <div className="proof-info-item">
                  <span className="proof-label">Sender UPI / Phone</span>
                  <span className="proof-value font-bold">{proofOrder.senderUpiId || 'Not provided'}</span>
                </div>
                <div className="proof-info-item">
                  <span className="proof-label">Submitted UTR</span>
                  <span className="proof-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <code className="utr-code-chip">{proofOrder.utrNumber}</code>
                    <button
                      type="button"
                      onClick={(e) => handleCopyUtr(proofOrder.utrNumber, e)}
                      className="btn-icon-mini"
                      title="Copy UTR"
                    >
                      {copiedUtr === proofOrder.utrNumber ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                    </button>
                  </span>
                </div>
              </div>

              {/* Screenshot Image Viewer */}
              <div className="proof-image-wrapper">
                {proofOrder.paymentScreenshot ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={proofOrder.paymentScreenshot}
                    alt="Payment Receipt Proof"
                    className="proof-lightbox-image"
                  />
                ) : (
                  <div className="no-proof-placeholder">
                    <FileImage size={48} color="var(--text-secondary)" />
                    <p>No payment screenshot was uploaded for this order.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="admin-form-footer" style={{ marginTop: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" className="btn-secondary" onClick={() => setProofModalOpen(false)}>
                  Close
                </button>
                {proofOrder.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-admin-action btn-admin-reject"
                      onClick={(e) => {
                        setProofModalOpen(false);
                        handleOpenRejectModal(proofOrder, e);
                      }}
                    >
                      <XCircle size={14} /> Reject Payment
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ background: 'var(--success)' }}
                      onClick={() => {
                        setProofModalOpen(false);
                        handleOpenVerifyModal(proofOrder);
                      }}
                    >
                      <CheckCircle size={14} /> Proceed to Release
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ORDER REJECTION MODAL --- */}
      {rejectModalOpen && rejectOrder && (
        <div className="admin-modal-overlay" onClick={() => setRejectModalOpen(false)}>
          <div className="admin-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <div>
                  <h3 className="admin-modal-title" style={{ color: 'var(--accent)' }}>Reject Payment Request</h3>
                  <span className="admin-subtitle">Order #{rejectOrder._id.slice(-6)} • ₹{rejectOrder.pricePaid} INR</span>
                </div>
                <span className="admin-modal-close" onClick={() => setRejectModalOpen(false)}>
                  <XCircle size={20} />
                </span>
              </div>

              <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <div>Buyer: <strong>{rejectOrder.userId?.username}</strong></div>
                <div>UTR: <code style={{ fontWeight: 'bold' }}>{rejectOrder.utrNumber}</code></div>
                <div style={{ marginTop: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  Please select a reason for rejecting this payment. The reason will be displayed to the buyer in their order history so they can retry with genuine payment details.
                </div>
              </div>

              <div className="admin-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Rejection Reason</label>
                  <select
                    className="admin-form-select"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  >
                    <option value="Payment not credited to bank account">Payment not credited to bank account</option>
                    <option value="Invalid / Fake UTR number">Invalid / Fake UTR number</option>
                    <option value="Payment screenshot is blurred or unreadable">Payment screenshot is blurred or unreadable</option>
                    <option value="Amount received does not match order entry fee">Amount received does not match order entry fee</option>
                    <option value="Duplicate UTR number submitted">Duplicate UTR number submitted</option>
                    <option value="Other">Other (Type custom reason)</option>
                  </select>
                </div>

                {rejectReason === 'Other' && (
                  <div className="admin-form-group">
                    <label className="admin-form-label">Custom Reason for Buyer</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Explain why payment was rejected..."
                      value={customRejectReason}
                      onChange={(e) => setCustomRejectReason(e.target.value)}
                      maxLength={150}
                      required
                    />
                  </div>
                )}

                <div className="admin-form-footer" style={{ marginTop: '16px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setRejectModalOpen(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ background: 'var(--accent)' }}
                    onClick={handleConfirmReject}
                    disabled={submitLoading || (rejectReason === 'Other' && !customRejectReason.trim())}
                  >
                    {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Rejection'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE BOTTOM APP BAR NAVIGATION */}
      <nav className="admin-mobile-bottom-nav">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`admin-bottom-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`admin-bottom-tab ${activeTab === 'orders' ? 'active' : ''}`}
        >
          <div className="tab-icon-wrap">
            <ShoppingBag size={20} />
            {stats.pendingOrders > 0 && (
              <span className="tab-pending-badge">{stats.pendingOrders}</span>
            )}
          </div>
          <span>Orders</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cards')}
          className={`admin-bottom-tab ${activeTab === 'cards' ? 'active' : ''}`}
        >
          <Layers size={20} />
          <span>Catalog</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`admin-bottom-tab ${activeTab === 'users' ? 'active' : ''}`}
        >
          <Users size={20} />
          <span>Users</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`admin-bottom-tab ${activeTab === 'settings' ? 'active' : ''}`}
        >
          <Sliders size={20} />
          <span>Settings</span>
        </button>
      </nav>

      {/* Toast popup */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 3000,
          background: toast.type === 'error' ? 'var(--accent)' : toast.type === 'warning' ? 'var(--warning)' : 'var(--success)',
          color: 'white',
          padding: '14px 24px',
          borderRadius: '12px',
          fontWeight: '700',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'admin-fade-in 0.3s ease'
        }}>
          <Info size={18} />
          {toast.message}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
