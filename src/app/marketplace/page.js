'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import AuthModals from '@/components/AuthModals';
import PaymentModal from '@/components/PaymentModal';
import {
  Shield,
  ShoppingBag,
  Sparkles,
  Search,
  X,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Eye,
  Star,
  Zap,
  Phone,
  MapPin,
  Check,
  AlertCircle,
  Minus,
  Plus,
  Maximize2
} from 'lucide-react';

import confetti from 'canvas-confetti';
import './page.css';

const CATEGORIES = [
  { id: 'all', label: 'All Bundles' },
  { id: 'Fashion & Apparel', label: 'Fashion & Apparel' },
  { id: 'Watches & Wearables', label: 'Watches & Wearables' },
  { id: 'Electronics & Gadgets', label: 'Electronics & Gadgets' },
  { id: 'Jewellery & Accessories', label: 'Jewellery & Accessories' },
  { id: 'Home & Kitchen', label: 'Home & Kitchen' },
  { id: 'Beauty & Wellness', label: 'Beauty & Wellness' },
];

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Auth Modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState('signin');

  // Products state
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('all');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [dynamicSettings, setDynamicSettings] = useState(null);

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sample Preview Modal state
  const [previewProduct, setPreviewProduct] = useState(null);

  // Image Zoom Lightbox state
  const [zoomedImage, setZoomedImage] = useState(null);

  // Product Quantities state: { [productId]: quantity }
  const [quantities, setQuantities] = useState({});

  // Close zoomed image on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setZoomedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getProductQuantity = (productId, minQty = 1) => {
    const effectiveMin = Math.max(1, Number(minQty) || 1);
    const current = quantities[productId];
    if (current === undefined || current === null) return effectiveMin;
    return Math.max(effectiveMin, current);
  };

  const handleQuantityChange = (productId, newQty, minQty = 1) => {
    const effectiveMin = Math.max(1, Number(minQty) || 1);
    const safeQty = Math.max(effectiveMin, Number(newQty) || effectiveMin);
    setQuantities((prev) => ({ ...prev, [productId]: safeQty }));
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products', {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const list = data.products || data.cards || [];
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDynamicSettings(data.settings);
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));

    fetchProducts();
  }, [fetchProducts]);

  const handleOpenAuth = (type) => {
    setAuthType(type);
    setAuthOpen(true);
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBuyProduct = (product, qty) => {
    if (!user) {
      showToast('Please sign in or create an account to purchase leads', 'warning');
      handleOpenAuth('signin');
      return;
    }
    const minQty = Math.max(1, product.minQuantity || 1);
    const selectedQty = Math.max(minQty, Number(qty) || getProductQuantity(product._id, minQty));
    setSelectedProduct({
      ...product,
      selectedQuantity: selectedQty,
      totalPrice: (product.price || 999) * selectedQty,
    });
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (paymentData) => {
    if (!selectedProduct) return;

    const qty = selectedProduct.selectedQuantity || selectedProduct.minQuantity || 1;
    const totalAmount = selectedProduct.totalPrice || (selectedProduct.price || 999) * qty;

    try {
      const payload =
        typeof paymentData === 'string'
          ? {
              productId: selectedProduct._id,
              cardId: selectedProduct._id,
              quantity: qty,
              pricePaid: totalAmount,
              utrNumber: paymentData,
            }
          : {
              productId: selectedProduct._id,
              cardId: selectedProduct._id,
              quantity: qty,
              pricePaid: totalAmount,
              ...paymentData,
            };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });

        showToast('Payment submitted! Admin is verifying and your Excel sheet will unlock shortly.', 'success');
        setPaymentModalOpen(false);
        setPreviewProduct(null);

        setTimeout(() => {
          router.push('/profile/orders');
        }, 1800);
      } else {
        throw new Error(data.error || 'Failed to place order');
      }
    } catch (error) {
      throw new Error(error.message || 'Network error occurred');
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (product.title && product.title.toLowerCase().includes(q)) ||
        (product.category && product.category.toLowerCase().includes(q)) ||
        (product.description && product.description.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'records') return (b.recordsCount || 0) - (a.recordsCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0; // Default
    });

  const totalLeadsAvailable = products.reduce((acc, p) => acc + (p.recordsCount || 5000), 0);

  return (
    <>
      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="marketplace-page-wrapper">
        {/* Marketplace Hero Section */}
        <section className="marketplace-hero-section">
          <div className="container">
            <div className="marketplace-breadcrumb">
              <a href="/" className="back-link">
                <ArrowLeft size={16} /> Back to Home
              </a>
              <span className="live-status-pill">
                <span className="live-pulse"></span>
                <span>{totalLeadsAvailable.toLocaleString()}+ Pre-Verified Buyer Leads Online</span>
              </span>
            </div>

            <div className="marketplace-header-content">
              <span className="marketplace-badge">
                <Sparkles size={16} /> High-Converting Dropshipping Leads
              </span>
              <h1 className="marketplace-main-title">
                Products &amp; Leads <span>Marketplace</span>
              </h1>
              <p className="marketplace-description">
                Browse pre-verified PAN-India COD customer orders who bought viral trending products. Download clean Excel (.xlsx) spreadsheets instantly with 1-click verification for Meesho, Shopify &amp; COD reselling.
              </p>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="marketplace-catalog-section">
          <div className="container">
            {/* Search & Sort Toolbar */}
            <div className="market-toolbar">
              <div className="market-search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  className="market-search-input"
                  placeholder="Search leads by niche, product, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div className="market-sort-box">
                <SlidersHorizontal size={16} />
                <select
                  className="market-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="all">Sort: Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="records">Highest Records</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="market-tabs">
              {CATEGORIES.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? products.length
                    : products.filter(
                        (p) => p.category && p.category.toLowerCase() === cat.id.toLowerCase()
                      ).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  >
                    {cat.label} <span className="tab-count-badge">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                <div
                  className="loading-spinner"
                  style={{
                    border: '4px solid rgba(99, 102, 241, 0.1)',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    borderLeftColor: 'var(--primary)',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px auto',
                  }}
                ></div>
                Loading verified dropshipping leads catalog...
              </div>
            ) : (
              <div className="products-leads-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const wholesale = product.meeshoCost || 199;
                    const retail = product.resellPrice || 899;
                    const estProfit = retail - wholesale;
                    const records = product.recordsCount || 5000;
                    const minQty = Math.max(1, product.minQuantity || 1);
                    const currentQty = getProductQuantity(product._id, minQty);
                    const totalPrice = (product.price || 999) * currentQty;
                    const originalTotalPrice = product.originalPrice ? product.originalPrice * currentQty : null;

                    return (
                      <div className="product-lead-card" key={product._id}>
                        {/* Image Header with Badges & Click to Zoom */}
                        <div 
                          className="product-lead-image-wrap"
                          onClick={() => setZoomedImage({
                            url: product.image || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1200&q=85',
                            title: product.title,
                            badge: product.badge,
                            category: product.category,
                          })}
                          title="Click to zoom image"
                        >
                          {product.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={product.image}
                              alt={product.title}
                              className="product-lead-img"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80';
                              }}
                            />
                          ) : (
                            <div className="product-lead-placeholder-img">
                              <ShoppingBag size={48} color="#818cf8" />
                            </div>
                          )}
                          <div className="image-zoom-overlay">
                            <div className="zoom-badge">
                              <Maximize2 size={13} />
                              <span>Click to View</span>
                            </div>
                          </div>
                          <div className="lead-badge-top-left">
                            <span className="badge-tag">{product.badge || '🔥 Trending'}</span>
                          </div>
                          <div className="lead-badge-top-right">
                            <span className="category-pill">{product.category}</span>
                          </div>
                        </div>

                        {/* Body Details */}
                        <div className="product-lead-body">
                          <div className="product-rating-row">
                            <div className="stars-wrap">
                              <Star size={14} fill="#f59e0b" color="#f59e0b" />
                              <span className="rating-val">{product.rating || 4.9}</span>
                              <span className="reviews-cnt">({product.reviewsCount || 150}+ ratings)</span>
                            </div>
                            <span className="freshness-tag">
                              <Clock size={12} /> {product.freshness || 'Updated Sept 2026'}
                            </span>
                          </div>

                          <h3 className="product-lead-title" title={product.title}>
                            {product.title}
                          </h3>

                          {product.description && (
                            <p className="product-lead-desc">{product.description}</p>
                          )}

                          {/* Records Count & Delivery Meta */}
                          <div className="lead-meta-pill-strip">
                            <span className="records-pill">
                              <FileSpreadsheet size={13} />
                              <strong>{records.toLocaleString()}</strong> Verified Leads
                            </span>
                            <span className="delivery-pill">
                              <Zap size={13} /> {product.deliveryTime || 'Instant 5-Min Delivery'}
                            </span>
                          </div>

                          {/* Resell Margin Breakdown */}
                          <div className="margin-calculator-box">
                            <div className="margin-col">
                              <span className="margin-lbl">Meesho Wholesale</span>
                              <span className="margin-val">₹{wholesale}</span>
                            </div>
                            <span className="margin-divider">→</span>
                            <div className="margin-col">
                              <span className="margin-lbl">Resell Price</span>
                              <span className="margin-val">₹{retail}</span>
                            </div>
                            <span className="margin-divider">=</span>
                            <div className="margin-col highlight-margin">
                              <span className="margin-lbl">Net Profit / Order</span>
                              <span className="margin-profit-val">+₹{estProfit}</span>
                            </div>
                          </div>

                          {/* Highlight Features */}
                          <ul className="lead-features-list">
                            {(product.highlightFeatures && product.highlightFeatures.length > 0
                              ? product.highlightFeatures.slice(0, 3)
                              : [
                                  '100% Verified Indian Mobile & WhatsApp Numbers',
                                  'Pre-Qualified COD Buyers (Low RTO < 11.4%)',
                                  'Clean Excel (.xlsx) Download with Customer Names & PINs',
                                ]
                            ).map((feat, idx) => (
                              <li key={idx}>
                                <CheckCircle2 size={13} className="check-icon" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="product-lead-footer">
                          <button
                            type="button"
                            className="btn-preview-sample"
                            onClick={() => setPreviewProduct(product)}
                            title="Preview sample Excel leads for this product"
                          >
                            <Eye size={14} /> Preview Sample Leads
                          </button>

                          {/* Quantity Selector */}
                          <div className="card-qty-selector-wrap">
                            <div className="card-qty-label-group">
                              <span className="card-qty-label">Quantity</span>
                              <span className="card-min-qty-hint">
                                Min: <strong>{minQty}</strong> {minQty > 1 ? 'units' : 'unit'}
                              </span>
                            </div>
                            <div className="card-qty-control">
                              <button
                                type="button"
                                className="qty-btn qty-btn-minus"
                                disabled={currentQty <= minQty}
                                onClick={() => handleQuantityChange(product._id, currentQty - 1, minQty)}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                min={minQty}
                                value={currentQty}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  handleQuantityChange(product._id, isNaN(val) ? minQty : Math.max(minQty, val), minQty);
                                }}
                                className="qty-number-input"
                                aria-label="Quantity"
                              />
                              <button
                                type="button"
                                className="qty-btn qty-btn-plus"
                                onClick={() => handleQuantityChange(product._id, currentQty + 1, minQty)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          <div className="pricing-and-buy-row">
                            <div className="lead-pricing-block">
                              <div className="lead-price-now">₹{totalPrice.toLocaleString()}</div>
                              <div className="lead-unit-calc">
                                ₹{product.price} × {currentQty} {currentQty > 1 ? 'units' : 'unit'}
                              </div>
                              {originalTotalPrice && originalTotalPrice > totalPrice && (
                                <div className="lead-price-strikethrough">
                                  <span className="old-price">₹{originalTotalPrice.toLocaleString()}</span>
                                  <span className="discount-tag">{product.discount || '50% OFF'}</span>
                                </div>
                              )}
                            </div>

                            <button
                              type="button"
                              className="btn-buy-leads"
                              onClick={() => handleBuyProduct(product, currentQty)}
                            >
                              <span>Buy {currentQty > 1 ? `(${currentQty})` : ''}</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="market-empty-search">
                    <ShoppingBag size={40} />
                    <h3>{products.length === 0 ? 'Loading Leads Bundles' : 'No Bundles Found'}</h3>
                    <p>
                      {products.length === 0
                        ? 'Connecting to database or refreshing catalog. Please wait or tap retry.'
                        : `No dropshipping leads matched "${searchQuery}". Try a different search term or category.`}
                    </p>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        if (products.length === 0) {
                          fetchProducts();
                        } else {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }
                      }}
                      style={{ marginTop: '12px' }}
                    >
                      {products.length === 0 ? 'Retry Loading' : 'Reset Filters'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Buyer Protection / Trust Strip */}
        <section className="trust-guarantee-section">
          <div className="container trust-grid">
            <div className="trust-card">
              <div className="trust-icon-box">
                <FileSpreadsheet size={24} color="#818cf8" />
              </div>
              <div>
                <h4>Structured Excel (.xlsx) Delivery</h4>
                <p>Clean spreadsheet formatted with Customer Name, Phone, Delivery Address, PIN, and Ordered Item.</p>
              </div>
            </div>
            <div className="trust-card">
              <div className="trust-icon-box">
                <TrendingUp size={24} color="#34d399" />
              </div>
              <div>
                <h4>Lowest RTO Delivery Rate</h4>
                <p>Pre-screened genuine buyers with historical delivered status. Zero fake or bot phone numbers.</p>
              </div>
            </div>
            <div className="trust-card">
              <div className="trust-icon-box">
                <Shield size={24} color="#38bdf8" />
              </div>
              <div>
                <h4>5-10 Min Verification</h4>
                <p>Instant UPI automated order tracking. Download your file directly from your profile dashboard.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Sample Leads Preview Modal */}
      {previewProduct && (
        <div className="sample-modal-overlay" onClick={() => setPreviewProduct(null)}>
          <div className="sample-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sample-modal-header">
              <div className="sample-header-info">
                <span className="sample-modal-tag">Excel (.xlsx) Preview</span>
                <h2>{previewProduct.title}</h2>
                <p>
                  Showing 5 sample verified customer order rows. Full unmasked mobile numbers, street addresses, and PIN codes unlock immediately upon order approval.
                </p>
              </div>
              <button
                type="button"
                className="sample-close-btn"
                onClick={() => setPreviewProduct(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="sample-table-wrapper">
              <table className="sample-excel-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer Name</th>
                    <th>Mobile / WhatsApp</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Product</th>
                    <th>Order Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewProduct.sampleRows && previewProduct.sampleRows.length > 0
                    ? previewProduct.sampleRows
                    : [
                        { id: 1, name: 'Aarav Mehta', phone: '+91 98201 •••••', city: 'Mumbai', state: 'Maharashtra', product: previewProduct.title, amount: '₹1,699', payment: 'COD Delivered' },
                        { id: 2, name: 'Priya Sundaram', phone: '+91 98450 •••••', city: 'Bengaluru', state: 'Karnataka', product: previewProduct.title, amount: '₹2,150', payment: 'UPI Prepaid' },
                        { id: 3, name: 'Rajesh Kulkarni', phone: '+91 94223 •••••', city: 'Pune', state: 'Maharashtra', product: previewProduct.title, amount: '₹1,399', payment: 'COD Delivered' },
                        { id: 4, name: 'Kavita Singhal', phone: '+91 98112 •••••', city: 'Gurugram', state: 'Haryana', product: previewProduct.title, amount: '₹1,199', payment: 'Prepaid' },
                        { id: 5, name: 'Vikas Choudhary', phone: '+91 94140 •••••', city: 'Jaipur', state: 'Rajasthan', product: previewProduct.title, amount: '₹899', payment: 'COD Delivered' },
                      ]
                  ).map((row, idx) => (
                    <tr key={idx}>
                      <td className="col-idx">{idx + 1}</td>
                      <td className="col-name font-semibold">{row.name}</td>
                      <td className="col-phone font-mono">{row.phone}</td>
                      <td>{row.city}</td>
                      <td>{row.state}</td>
                      <td className="col-product truncate">{row.product || previewProduct.title}</td>
                      <td className="col-amount">{row.amount || '₹1,499'}</td>
                      <td>
                        <span className="badge-delivered">{row.payment || 'COD Delivered'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sample-modal-footer">
              <div className="sample-footer-summary">
                <FileSpreadsheet size={18} className="text-primary" />
                <span>
                  Includes <strong>{(previewProduct.recordsCount || 5000).toLocaleString()}+ complete rows</strong> in clean .xlsx spreadsheet format.
                </span>
              </div>
              <button
                type="button"
                className="btn-modal-buy"
                onClick={() => {
                  const prod = previewProduct;
                  setPreviewProduct(null);
                  handleBuyProduct(prod);
                }}
              >
                <span>Unlock All Leads &bull; ₹{previewProduct.price}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Zoom Modal */}
      {zoomedImage && (
        <div className="image-lightbox-overlay" onClick={() => setZoomedImage(null)}>
          <div className="image-lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="image-lightbox-close"
              onClick={() => setZoomedImage(null)}
              aria-label="Close image preview"
            >
              <X size={20} />
            </button>
            <div className="image-lightbox-img-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomedImage.url}
                alt={zoomedImage.title || 'Product Full Image'}
                className="image-lightbox-img"
              />
            </div>
            <div className="image-lightbox-caption">
              <div className="lightbox-caption-left">
                <h3>{zoomedImage.title}</h3>
                {zoomedImage.category && <span className="category-pill">{zoomedImage.category}</span>}
              </div>
              {zoomedImage.badge && <span className="badge-tag">{zoomedImage.badge}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        card={selectedProduct}
        upiId={dynamicSettings?.upiId || 'mahadevtanti191@okaxis'}
        usdToInrRate={dynamicSettings?.usdToInrRate || 83}
        onSubmit={handleConfirmPayment}
      />

      {/* Auth Modals */}
      <AuthModals
        isOpen={authOpen}
        type={authType}
        onClose={() => setAuthOpen(false)}
        onToggleType={setAuthType}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div className={`global-toast-banner ${notification.type}`}>
          <div className="toast-inner">
            <Check size={16} />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer" style={{ marginTop: '60px' }}>
        <div className="container">
          <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
            <span className="footer-copy">
              &copy; {new Date().getFullYear()} Dropzen Inc. All rights reserved. High-converting Meesho &amp; COD dropshipping leads.
            </span>
            <div className="footer-badges">
              <div className="badge-item">
                <Shield size={14} /> 100% Pan-India Verified Leads
              </div>
              <div className="badge-item">
                <Check size={14} /> Instant Excel (.xlsx) Download
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
