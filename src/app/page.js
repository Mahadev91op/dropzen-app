'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import AuthModals from '@/components/AuthModals';
import PaymentModal from '@/components/PaymentModal';
import {
  Shield,
  Zap,
  RefreshCw,
  ShoppingBag,
  Send,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Info,
  Search,
  X,
  SlidersHorizontal,
  Star,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Eye,
  FileSpreadsheet,
  Download,
  Phone,
  MapPin,
  Flame,
  DollarSign,
  PackageCheck,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

import confetti from 'canvas-confetti';
import gsap from 'gsap';
import './page.css';

const TESTIMONIALS_DATA = [
  {
    name: 'Ankit Sharma',
    role: 'Top Meesho Reseller',
    city: 'Surat, Gujarat',
    niche: 'Home & Kitchen Gadgets',
    rating: 5,
    avatarBg: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
    quote: 'Scaling without wasting thousands on Facebook ads was a gamechanger. Purchased the 5,000 Home & Kitchen bundle, called and confirmed 240+ orders in the first 10 days. Fulfill directly as Meesho customer orders. Net margin crossed ₹1,40,000 in month one!'
  },
  {
    name: 'Vikram Solanki',
    role: 'D2C E-Commerce Brand',
    city: 'Jaipur, Rajasthan',
    niche: 'High-Ticket Spenders',
    rating: 5,
    avatarBg: 'linear-gradient(135deg, #10b981, #059669)',
    quote: 'Meta CPMs in India have skyrocketed from ₹120 to ₹380+, completely wiping out dropshipping margins with 40% RTO. Dropzen leads have a real historical delivered track record. My overall RTO dropped to just 11.2%!'
  },
  {
    name: 'Pooja Deshmukh',
    role: 'Shopify Dropshipper',
    city: 'Mumbai, Maharashtra',
    niche: 'Beauty & Skincare',
    rating: 5,
    avatarBg: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    quote: 'The Excel sheet unlocked in under 6 minutes right after submitting my UPI UTR. Clean, structured columns with customer names, phone numbers, and PIN codes. Uploaded straight into my CRM. Highly recommended for serious resellers.'
  },
  {
    name: 'Sameer Khan',
    role: 'Logistics & COD Reseller',
    city: 'Delhi NCR',
    niche: 'Electronics & Smart Tech',
    rating: 5,
    avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    quote: 'We push the Dropzen Excel sheet directly into NimbusPost and Shiprocket with 1 click. Zero ad burn, predictable cash flow, and excellent phone connect rates on WhatsApp. The best dropshipping investment I made this year.'
  }
];

const FAQS_DATA = [
  {
    q: 'How are Dropzen customer leads collected and verified?',
    a: 'Dropzen leads are aggregated from high-volume verified PAN-India e-commerce campaigns where shoppers actively placed and accepted COD deliveries for viral trending products. Every record contains real contact details, verified mobile/WhatsApp numbers, and valid PIN codes.'
  },
  {
    q: 'In what format do I receive my purchased leads?',
    a: 'You receive a clean, professionally formatted Microsoft Excel (.xlsx) file and CSV. Columns include Lead #, Customer Name, Mobile Number, Delivery Address, City, State, PIN Code, Product Interest, and Order Amount. You can open it in Excel, Google Sheets, or import directly into your CRM or courier portal.'
  },
  {
    q: 'How do I fulfill orders using these customer leads on Meesho?',
    a: 'Simply call or WhatsApp the customer to confirm their delivery address. Once confirmed, place the order on Meesho by entering the customer’s shipping address and selecting Cash on Delivery (COD) with your profit margin added. Meesho handles shipping and deposits your profit directly into your bank!'
  },
  {
    q: 'What is the expected delivery and RTO rate?',
    a: 'Because these buyers have an active history of accepting COD orders for trending gadgets and fashion, historical RTO is exceptionally low (typically 10% to 14%), compared to 40%+ on cold Facebook/Instagram ad traffic.'
  },
  {
    q: 'How does the UPI payment and verification process work?',
    a: 'When you click "Buy Leads", a dynamic QR code locks the exact fee. Scan via any UPI app (GPay, PhonePe, Paytm, BHIM), submit your 12-digit UTR reference number, and our system verifies the deposit. Your Excel spreadsheet unlocks for instant download within 5 to 10 minutes.'
  },
  {
    q: 'Can I upload these leads to courier platforms like Shiprocket or NimbusPost?',
    a: 'Yes! The Excel format adheres to standard shipping manifest headers, making bulk-upload into Shiprocket, NimbusPost, Delhivery Direct, or Pickrr seamless and automated.'
  }
];

const SAMPLE_LEADS_PREVIEW = [
  { id: 1, name: 'Aarav Mehta', phone: '+91 98201 •••••', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', product: 'Wireless Car Vacuum', amount: '₹1,699', payment: 'COD Delivered', status: 'Verified Buyer' },
  { id: 2, name: 'Priya Sundaram', phone: '+91 98450 •••••', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', product: 'Ceramic Hair Curler', amount: '₹2,150', payment: 'UPI Prepaid', status: 'Verified Buyer' },
  { id: 3, name: 'Rajesh Kulkarni', phone: '+91 94223 •••••', city: 'Pune', state: 'Maharashtra', pincode: '411001', product: 'Smart Sensor Trash Bin', amount: '₹1,399', payment: 'COD Delivered', status: 'Verified Buyer' },
  { id: 4, name: 'Kavita Singhal', phone: '+91 98112 •••••', city: 'Gurugram', state: 'Haryana', pincode: '122001', product: 'Gua Sha Facial Sculptor', amount: '₹1,199', payment: 'Prepaid', status: 'Verified Buyer' },
  { id: 5, name: 'Vikas Choudhary', phone: '+91 94140 •••••', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', product: 'Magnetic Phone Car Mount', amount: '₹899', payment: 'COD Delivered', status: 'Verified Buyer' },
  { id: 6, name: 'Ananya Mukherjee', phone: '+91 98305 •••••', city: 'Kolkata', state: 'West Bengal', pincode: '700001', product: 'Sunset Projection Lamp', amount: '₹1,299', payment: 'UPI Prepaid', status: 'Verified Buyer' },
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  // Auth Modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authType, setAuthType] = useState('signin');

  // FAQ state
  const [openFaq, setOpenFaq] = useState(0);

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [notification, setNotification] = useState(null);
  const [dynamicSettings, setDynamicSettings] = useState(null);

  // Payment Modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sample Preview Modal state
  const [previewModalProduct, setPreviewModalProduct] = useState(null);

  // ROI Calculator state
  const [dailyOrders, setDailyOrders] = useState(25);
  const [marginPerOrder, setMarginPerOrder] = useState(650);

  // Refs for animations
  const heroBadgeRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const heroStatsRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch('/api/products', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const list = data.products || data.cards || [];
        if (Array.isArray(list) && list.length > 0) {
          setProducts(list);
          try {
            sessionStorage.setItem('dropzen_products_cache', JSON.stringify(list));
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      clearTimeout(timeoutId);
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('dropzen_products_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          setLoadingProducts(false);
        }
      }
    } catch (e) {}

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

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (heroBadgeRef.current) {
        tl.fromTo(heroBadgeRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6 });
      }
      if (heroTitleRef.current) {
        tl.fromTo(heroTitleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3');
      }
      if (heroDescRef.current) {
        tl.fromTo(heroDescRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4');
      }
      if (heroButtonsRef.current) {
        tl.fromTo(heroButtonsRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.2');
      }
      if (heroStatsRef.current) {
        tl.fromTo(heroStatsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
      }
    });

    return () => ctx.revert();
  }, []);

  const handleOpenAuth = (type) => {
    setAuthType(type);
    setAuthOpen(true);
  };

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleBuyProduct = (product) => {
    if (!user) {
      showToast('Please sign in or register to purchase leads', 'warning');
      handleOpenAuth('signin');
      return;
    }
    setSelectedProduct(product);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = async (paymentData) => {
    if (!selectedProduct) return;

    try {
      const payload =
        typeof paymentData === 'string'
          ? {
              productId: selectedProduct._id,
              cardId: selectedProduct._id,
              utrNumber: paymentData,
            }
          : {
              productId: selectedProduct._id,
              cardId: selectedProduct._id,
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

        showToast('Payment submitted! Admin is verifying your order. Excel sheet will unlock in 5-10 minutes.', 'success');
        setPaymentModalOpen(false);
        setPreviewModalProduct(null);

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

  // Calculated ROI
  const monthlyProfit = dailyOrders * marginPerOrder * 30;
  const yearlyProfit = monthlyProfit * 12;

  return (
    <>
      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="landing-page-wrapper">
        {/* ========================================================
            HERO SECTION
            ======================================================== */}
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="hero-badge" ref={heroBadgeRef}>
                <Flame size={16} className="text-accent animate-pulse" />
                <span>India&apos;s #1 Meesho &amp; COD Dropshipping Leads Hub</span>
              </div>

              <h1 className="hero-title" ref={heroTitleRef}>
                Stop Burning Money on Ads. <br />
                Get <span>Pre-Verified Buyer Leads</span>
              </h1>

              <p className="hero-description" ref={heroDescRef}>
                Skip expensive Meta ad CPMs, high RTO rates, and bot clicks. Download ready-to-fulfill customer orders in structured Excel (.xlsx) spreadsheets. Call &amp; confirm or push directly to Meesho, Shiprocket, or NimbusPost with 1 click.
              </p>

              <div className="hero-buttons" ref={heroButtonsRef}>
                <a href="#trending-bundles" className="btn-primary-glow">
                  <ShoppingBag size={18} />
                  <span>Explore Trending Bundles</span>
                  <ArrowRight size={16} />
                </a>

                <a href="#excel-preview" className="btn-secondary-glass">
                  <FileSpreadsheet size={18} />
                  <span>Preview Excel Leads</span>
                </a>
              </div>

              <div className="hero-stats-strip" ref={heroStatsRef}>
                <div className="stat-box">
                  <span className="stat-number">50,000+</span>
                  <span className="stat-label">Verified Leads Delivered</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-box">
                  <span className="stat-number">89.4%</span>
                  <span className="stat-label">Delivery Success Rate</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-box">
                  <span className="stat-number">&lt; 10 Mins</span>
                  <span className="stat-label">Automated Excel Delivery</span>
                </div>
              </div>
            </div>

            {/* Hero Visual: Interactive Excel Sheet Card */}
            <div className="hero-visual-col">
              <div className="hero-excel-card">
                <div className="excel-card-header">
                  <div className="excel-title-group">
                    <div className="excel-icon-circle">
                      <FileSpreadsheet size={20} color="#10b981" />
                    </div>
                    <div>
                      <div className="excel-sheet-name">Dropzen_Viral_Home_Kitchen_Leads.xlsx</div>
                      <div className="excel-sheet-meta">5,240 Verified Records &bull; Updated Sept 2026</div>
                    </div>
                  </div>
                  <span className="excel-live-badge">
                    <span className="pulse-dot"></span> LIVE DATA
                  </span>
                </div>

                <div className="excel-mini-table">
                  <div className="mini-th-row">
                    <span>#</span>
                    <span>Name</span>
                    <span>Phone</span>
                    <span>City</span>
                    <span>Amount</span>
                    <span>Delivery</span>
                  </div>
                  <div className="mini-tr-row">
                    <span className="cell-id">1</span>
                    <span className="cell-name">Aarav Mehta</span>
                    <span className="cell-phone">+91 98201 •••••</span>
                    <span className="cell-city">Mumbai</span>
                    <span className="cell-amt">₹1,699</span>
                    <span className="cell-badge">COD Delivered</span>
                  </div>
                  <div className="mini-tr-row">
                    <span className="cell-id">2</span>
                    <span className="cell-name">Priya Sundaram</span>
                    <span className="cell-phone">+91 98450 •••••</span>
                    <span className="cell-city">Bengaluru</span>
                    <span className="cell-amt">₹2,150</span>
                    <span className="cell-badge">Verified</span>
                  </div>
                  <div className="mini-tr-row">
                    <span className="cell-id">3</span>
                    <span className="cell-name">Rajesh Kulkarni</span>
                    <span className="cell-phone">+91 94223 •••••</span>
                    <span className="cell-city">Pune</span>
                    <span className="cell-amt">₹1,399</span>
                    <span className="cell-badge">COD Delivered</span>
                  </div>
                </div>

                <div className="excel-card-footer">
                  <div className="excel-footer-pill">
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>Unmasks Full Addresses &amp; WhatsApp on Order</span>
                  </div>
                  <div className="excel-action-tag">
                    <Zap size={14} /> Instant .xlsx Download
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            TRENDING PRODUCTS & LEADS BUNDLES SECTION
            ======================================================== */}
        <section className="section-padding" id="trending-bundles">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">
                <Sparkles size={16} /> Curated High-Margin Bundles
              </span>
              <h2 className="section-title">
                Trending <span>Dropshipping Leads</span> Bundles
              </h2>
              <p className="section-desc">
                Choose your product category and download pre-qualified buyers. Each bundle includes thousands of real customers ready to buy via COD.
              </p>
            </div>

            {loadingProducts ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
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
                Loading latest trending bundles...
              </div>
            ) : (
              <div className="products-leads-grid">
                {products.slice(0, 6).map((product) => {
                  const wholesale = product.meeshoCost || 199;
                  const retail = product.resellPrice || 899;
                  const estProfit = retail - wholesale;
                  const records = product.recordsCount || 5000;

                  return (
                    <div className="product-lead-card" key={product._id}>
                      <div className="product-lead-image-wrap">
                        {product.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.image}
                            alt={product.title}
                            className="product-lead-img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="product-lead-placeholder-img">
                            <ShoppingBag size={48} color="#818cf8" />
                          </div>
                        )}
                        <div className="lead-badge-top-left">
                          <span className="badge-tag">{product.badge || '🔥 Trending'}</span>
                        </div>
                        <div className="lead-badge-top-right">
                          <span className="category-pill">{product.category}</span>
                        </div>
                      </div>

                      <div className="product-lead-body">
                        <div className="product-rating-row">
                          <div className="stars-wrap">
                            <Star size={14} fill="#f59e0b" color="#f59e0b" />
                            <span className="rating-val">{product.rating || 4.9}</span>
                            <span className="reviews-cnt">({product.reviewsCount || 150}+ reviews)</span>
                          </div>
                          <span className="freshness-tag">
                            <Clock size={12} /> {product.freshness || 'Updated Sept 2026'}
                          </span>
                        </div>

                        <h3 className="product-lead-title" title={product.title}>
                          {product.title}
                        </h3>

                        <div className="lead-meta-pill-strip">
                          <span className="records-pill">
                            <FileSpreadsheet size={13} />
                            <strong>{records.toLocaleString()}</strong> Verified Leads
                          </span>
                          <span className="delivery-pill">
                            <Zap size={13} /> {product.deliveryTime || 'Instant 5-Min Delivery'}
                          </span>
                        </div>

                        {/* Net Margin Breakdown */}
                        <div className="margin-calculator-box">
                          <div className="margin-col">
                            <span className="margin-lbl">Wholesale Cost</span>
                            <span className="margin-val">₹{wholesale}</span>
                          </div>
                          <span className="margin-divider">→</span>
                          <div className="margin-col">
                            <span className="margin-lbl">Resell Price</span>
                            <span className="margin-val">₹{retail}</span>
                          </div>
                          <span className="margin-divider">=</span>
                          <div className="margin-col highlight-margin">
                            <span className="margin-lbl">Net Profit</span>
                            <span className="margin-profit-val">+₹{estProfit} / order</span>
                          </div>
                        </div>

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

                      <div className="product-lead-footer">
                        <button
                          type="button"
                          className="btn-preview-sample"
                          onClick={() => setPreviewModalProduct(product)}
                        >
                          <Eye size={14} /> Preview Sample Leads
                        </button>

                        <div className="pricing-and-buy-row">
                          <div className="lead-pricing-block">
                            <div className="lead-price-now">₹{product.price}</div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="lead-price-strikethrough">
                                <span className="old-price">₹{product.originalPrice}</span>
                                <span className="discount-tag">{product.discount || '50% OFF'}</span>
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            className="btn-buy-leads"
                            onClick={() => handleBuyProduct(product)}
                          >
                            <span>Buy Leads</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Link href="/marketplace" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
                <span>View All Bundles in Products Hub</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            HOW IT WORKS: 4-STEP FULFILLMENT WORKFLOW
            ======================================================== */}
        <section className="section-padding bg-light">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">
                <PackageCheck size={16} /> Simple 4-Step Process
              </span>
              <h2 className="section-title">
                How to Scale Your <span>Dropshipping on Autopilot</span>
              </h2>
              <p className="section-desc">
                From purchase to customer doorstep — start fulfilling profitable orders without spending a single rupee on ad managers.
              </p>
            </div>

            <div className="workflow-grid">
              <div className="workflow-card">
                <div className="workflow-step-badge">Step 1</div>
                <div className="workflow-icon-box">
                  <ShoppingBag size={24} color="#6366f1" />
                </div>
                <h3>Pick Your Trending Niche</h3>
                <p>Select from Home &amp; Kitchen, High-Ticket Spenders, Electronics, Fashion, or Beauty bundles based on your target profit margins.</p>
              </div>

              <div className="workflow-card">
                <div className="workflow-step-badge">Step 2</div>
                <div className="workflow-icon-box">
                  <Zap size={24} color="#10b981" />
                </div>
                <h3>Instant UPI Checkout</h3>
                <p>Scan the dynamic QR code with Google Pay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR reference number for instant tracking.</p>
              </div>

              <div className="workflow-card">
                <div className="workflow-step-badge">Step 3</div>
                <div className="workflow-icon-box">
                  <FileSpreadsheet size={24} color="#0284c7" />
                </div>
                <h3>Download Clean Excel Sheet</h3>
                <p>Within 5 to 10 minutes, download your unmasked Excel (.xlsx) file containing complete buyer names, phone numbers, and addresses.</p>
              </div>

              <div className="workflow-card">
                <div className="workflow-step-badge">Step 4</div>
                <div className="workflow-icon-box">
                  <DollarSign size={24} color="#f59e0b" />
                </div>
                <h3>Call &amp; Ship via Meesho</h3>
                <p>Call or WhatsApp to confirm the order, then push directly as a Meesho customer order or dispatch through Shiprocket. Collect your net profit!</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            INTERACTIVE PROFIT & ROI CALCULATOR
            ======================================================== */}
        <section className="section-padding" id="roi-calculator">
          <div className="container">
            <div className="roi-calculator-container">
              <div className="roi-calculator-content">
                <span className="section-subtitle">
                  <DollarSign size={16} /> Reseller Profit Projection
                </span>
                <h2 className="roi-title">
                  Calculate Your <span>Monthly Net Margin</span>
                </h2>
                <p className="roi-desc">
                  See how much revenue you can generate each month fulfilling Dropzen verified leads with zero ad spend.
                </p>

                {/* Slider 1: Daily Orders */}
                <div className="roi-slider-group">
                  <div className="slider-header">
                    <label>Daily Orders Dispatched</label>
                    <span className="slider-val-badge">{dailyOrders} Orders / Day</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={dailyOrders}
                    onChange={(e) => setDailyOrders(Number(e.target.value))}
                    className="roi-range-input"
                  />
                  <div className="slider-limits">
                    <span>5 orders</span>
                    <span>50 orders</span>
                    <span>100 orders</span>
                  </div>
                </div>

                {/* Slider 2: Margin per order */}
                <div className="roi-slider-group" style={{ marginTop: '24px' }}>
                  <div className="slider-header">
                    <label>Average Net Profit Margin Per Order</label>
                    <span className="slider-val-badge">₹{marginPerOrder} / Order</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="1500"
                    step="50"
                    value={marginPerOrder}
                    onChange={(e) => setMarginPerOrder(Number(e.target.value))}
                    className="roi-range-input"
                  />
                  <div className="slider-limits">
                    <span>₹300</span>
                    <span>₹900</span>
                    <span>₹1,500</span>
                  </div>
                </div>
              </div>

              {/* Profit Display Card */}
              <div className="roi-profit-card">
                <div className="profit-stat-group">
                  <span className="profit-sub-label">Estimated Monthly Net Profit</span>
                  <div className="profit-big-number">₹{monthlyProfit.toLocaleString('en-IN')}</div>
                  <span className="profit-badge">100% Retained &bull; Zero Ad Burn</span>
                </div>

                <div className="profit-breakdown-row">
                  <div>
                    <span className="breakdown-lbl">Monthly Orders:</span>
                    <strong className="breakdown-val">{(dailyOrders * 30).toLocaleString()} Deliveries</strong>
                  </div>
                  <div>
                    <span className="breakdown-lbl">Annualized Run Rate:</span>
                    <strong className="breakdown-val">₹{yearlyProfit.toLocaleString('en-IN')} / Yr</strong>
                  </div>
                </div>

                <a href="#trending-bundles" className="btn-roi-cta">
                  <span>Get Started with Trending Leads</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            COMPARISON TABLE: DROPZEN VS META ADS
            ======================================================== */}
        <section className="section-padding bg-light">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">
                <Layers size={16} /> Smart Reselling Advantage
              </span>
              <h2 className="section-title">
                Running Meta Ads vs. <span>Dropzen Verified Leads</span>
              </h2>
              <p className="section-desc">
                Why thousands of Indian dropshippers are abandoning expensive Facebook Ads for pre-screened COD buyer spreadsheets.
              </p>
            </div>

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Metric / Feature</th>
                    <th className="th-negative">Running Facebook / Instagram Ads</th>
                    <th className="th-dropzen">Dropzen Verified Leads</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="td-feature">Cost Per Acquisition (CPA)</td>
                    <td className="td-bad">₹280 - ₹450 per unverified lead</td>
                    <td className="td-good">₹0.20 - ₹0.40 per verified lead</td>
                  </tr>
                  <tr>
                    <td className="td-feature">Return to Origin (RTO) Rate</td>
                    <td className="td-bad">35% to 50% RTO (Heavy Courier Losses)</td>
                    <td className="td-good">&lt; 12% RTO (Pre-screened Genuine Buyers)</td>
                  </tr>
                  <tr>
                    <td className="td-feature">Time to First Order</td>
                    <td className="td-bad">3 to 7 Days of Ad Testing &amp; Pixel Warming</td>
                    <td className="td-good">5 - 10 Minutes (Instant Excel Delivery)</td>
                  </tr>
                  <tr>
                    <td className="td-feature">Ad Account Bans &amp; Restrictions</td>
                    <td className="td-bad">Constant Meta Ads Manager Bans &amp; Flagged IDs</td>
                    <td className="td-good">Zero Ad Accounts Needed. 100% Safe</td>
                  </tr>
                  <tr>
                    <td className="td-feature">Data Portability</td>
                    <td className="td-bad">Locked inside Meta dashboard</td>
                    <td className="td-good">Full Excel Sheet (.xlsx) with Names &amp; Phones</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ========================================================
            REDESIGNED EXCEL LEADS WORKSTATION PREVIEW (id="excel-preview")
            ======================================================== */}
        <section className="section-padding excel-preview-section" id="excel-preview">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">
                <FileSpreadsheet size={16} /> Transparency &amp; Data Integrity
              </span>
              <h2 className="section-title">
                Interactive Preview of <span>Excel Lead Columns</span>
              </h2>
              <p className="section-desc">
                Here is the exact structure of your downloadable Excel (.xlsx) file. 100% genuine Pan-India buyers with unmasked phone numbers and full delivery addresses delivered instantly upon verification.
              </p>
            </div>

            {/* Desktop & Mobile Interactive Excel Workstation Mockup */}
            <div className="excel-mockup-card">
              {/* Window Header */}
              <div className="excel-window-header">
                <div className="excel-mac-dots">
                  <span className="dot dot-close"></span>
                  <span className="dot dot-min"></span>
                  <span className="dot dot-expand"></span>
                </div>
                <div className="excel-file-title">
                  <FileSpreadsheet size={16} className="excel-file-icon" />
                  <span>Dropzen_PanIndia_Verified_COD_Leads_Sept2026.xlsx</span>
                  <span className="excel-ext-pill">Microsoft Excel Workbook</span>
                </div>
                <div className="excel-header-actions">
                  <span className="excel-sync-pill">
                    <span className="sync-pulse"></span> Live Sept 2026 Database
                  </span>
                </div>
              </div>

              {/* Sheet Tabs Bar */}
              <div className="excel-tabs-strip">
                <div className="excel-tab-item active">
                  <FileSpreadsheet size={14} />
                  <span>Sheet1: Home &amp; Kitchen (5,240 Verified)</span>
                </div>
                <div className="excel-tab-item">
                  <Layers size={14} />
                  <span>Sheet2: High-Ticket Spenders (10,480)</span>
                </div>
                <div className="excel-tab-item">
                  <Sparkles size={14} />
                  <span>Sheet3: Fashion &amp; Beauty (7,500)</span>
                </div>
              </div>

              {/* Formula & Toolbar */}
              <div className="excel-formula-bar">
                <div className="formula-cell-box">
                  <span className="fx-label">fx</span>
                  <span className="fx-range">A1:I6 &bull; PREVIEW SAMPLE</span>
                </div>
                <div className="excel-format-info">
                  <CheckCircle2 size={14} color="var(--success)" />
                  <span>Pre-formatted for 1-Click Shiprocket, NimbusPost &amp; Meesho Upload</span>
                </div>
              </div>

              {/* Scrollable Table Grid */}
              <div className="excel-table-scroll-area">
                <table className="excel-native-table">
                  <thead>
                    {/* Excel Column Letters */}
                    <tr className="excel-letters-row">
                      <th className="cell-corner">#</th>
                      <th className="col-letter">A</th>
                      <th className="col-letter">B</th>
                      <th className="col-letter">C</th>
                      <th className="col-letter">D</th>
                      <th className="col-letter">E</th>
                      <th className="col-letter">F</th>
                      <th className="col-letter">G</th>
                      <th className="col-letter">H</th>
                      <th className="col-letter">I</th>
                    </tr>
                    {/* Actual Header Names */}
                    <tr className="excel-headers-row">
                      <th className="row-num-header"></th>
                      <th>Lead #</th>
                      <th>Customer Name</th>
                      <th>Mobile / WhatsApp</th>
                      <th>Delivery City</th>
                      <th>State</th>
                      <th>PIN Code</th>
                      <th>Ordered Product</th>
                      <th>Order Value</th>
                      <th>Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_LEADS_PREVIEW.map((row, idx) => (
                      <tr key={row.id} className="excel-data-row">
                        <td className="row-num-cell">{idx + 1}</td>
                        <td className="cell-lead-id">
                          <span className="lead-num-chip">#{row.id.toString().padStart(4, '0')}</span>
                        </td>
                        <td className="cell-customer">
                          <div className="customer-cell-wrap">
                            <span className="avatar-dot">{row.name.charAt(0)}</span>
                            <strong>{row.name}</strong>
                          </div>
                        </td>
                        <td className="cell-phone">
                          <div className="phone-cell-wrap font-mono">
                            <span>{row.phone}</span>
                            <span className="wa-verified-tag" title="WhatsApp Active">WA</span>
                          </div>
                        </td>
                        <td className="cell-city">
                          <span className="city-pill">{row.city}</span>
                        </td>
                        <td className="cell-state">{row.state}</td>
                        <td className="cell-pincode font-mono">{row.pincode}</td>
                        <td className="cell-product truncate" title={row.product}>
                          {row.product}
                        </td>
                        <td className="cell-amount font-mono">
                          <strong>{row.amount}</strong>
                        </td>
                        <td className="cell-payment">
                          <span className={`payment-status-chip ${row.payment.toLowerCase().includes('prepaid') ? 'chip-prepaid' : 'chip-cod'}`}>
                            <Check size={12} /> {row.payment}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Workstation Footer Strip */}
              <div className="excel-window-footer">
                <div className="excel-footer-pillars">
                  <div className="footer-pillar-item">
                    <span className="pillar-dot"></span>
                    <div>
                      <strong>94.2% Connect Rate</strong>
                      <p>Full unmasked mobile numbers unlock on verification</p>
                    </div>
                  </div>
                  <div className="footer-pillar-item">
                    <span className="pillar-dot"></span>
                    <div>
                      <strong>Low Return Rate</strong>
                      <p>Historical COD RTO strictly under 11.4%</p>
                    </div>
                  </div>
                  <div className="footer-pillar-item">
                    <span className="pillar-dot"></span>
                    <div>
                      <strong>Direct CSV &amp; XLSX</strong>
                      <p>Instant file download right in your buyer dashboard</p>
                    </div>
                  </div>
                </div>

                <div className="excel-cta-box">
                  <a href="#trending-bundles" className="btn-download-sample-cta">
                    <Download size={16} />
                    <span>Get Full 5,000+ Verified Excel Leads</span>
                    <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            TESTIMONIALS SECTION
            ======================================================== */}
        <section className="section-padding">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">
                <Star size={16} /> Real Reseller Success
              </span>
              <h2 className="section-title">
                Trusted by <span>3,500+ Indian Dropshippers</span>
              </h2>
              <p className="section-desc">
                Read how smart e-commerce sellers in Surat, Delhi, Mumbai, and Bangalore scale their monthly profits using Dropzen customer leads.
              </p>
            </div>

            <div className="testimonials-grid">
              {TESTIMONIALS_DATA.map((t, idx) => (
                <div className="testimonial-card" key={idx}>
                  <div className="testimonial-header">
                    <div className="testimonial-avatar" style={{ background: t.avatarBg }}>
                      {t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="testimonial-meta">
                      <h4 className="testimonial-name">{t.name}</h4>
                      <p className="testimonial-role">
                        {t.role} &bull; {t.city}
                      </p>
                    </div>
                  </div>

                  <div className="testimonial-stars">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                    ))}
                    <span className="testimonial-niche-badge">{t.niche}</span>
                  </div>

                  <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================
            FAQ SECTION
            ======================================================== */}
        <section className="section-padding bg-light" id="faq">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">
                <Info size={16} /> Answers to Common Questions
              </span>
              <h2 className="section-title">
                Frequently Asked <span>Questions</span>
              </h2>
              <p className="section-desc">
                Everything you need to know about purchasing and fulfilling Dropzen dropshipping leads.
              </p>
            </div>

            <div className="faq-accordion-wrapper">
              {FAQS_DATA.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className={`faq-card ${isOpen ? 'active' : ''}`} key={index}>
                    <button
                      type="button"
                      className="faq-question-bar"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    >
                      <span className="faq-q-text">{faq.q}</span>
                      <span className="faq-toggle-icon">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer-pane">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Sample Leads Preview Modal */}
      {previewModalProduct && (
        <div className="sample-modal-overlay" onClick={() => setPreviewModalProduct(null)}>
          <div className="sample-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="sample-modal-header">
              <div className="sample-header-info">
                <span className="sample-modal-tag">Excel (.xlsx) Preview</span>
                <h2>{previewModalProduct.title}</h2>
                <p>
                  Showing 5 sample verified customer order rows. Full unmasked mobile numbers, street addresses, and PIN codes unlock immediately upon order approval.
                </p>
              </div>
              <button
                type="button"
                className="sample-close-btn"
                onClick={() => setPreviewModalProduct(null)}
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
                  {(previewModalProduct.sampleRows && previewModalProduct.sampleRows.length > 0
                    ? previewModalProduct.sampleRows
                    : SAMPLE_LEADS_PREVIEW
                  ).map((row, idx) => (
                    <tr key={idx}>
                      <td className="col-idx">{idx + 1}</td>
                      <td className="col-name font-semibold">{row.name}</td>
                      <td className="col-phone font-mono">{row.phone}</td>
                      <td>{row.city}</td>
                      <td>{row.state}</td>
                      <td className="col-product truncate">{row.product || previewModalProduct.title}</td>
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
                  Includes <strong>{(previewModalProduct.recordsCount || 5000).toLocaleString()}+ complete rows</strong> in clean .xlsx spreadsheet format.
                </span>
              </div>
              <button
                type="button"
                className="btn-modal-buy"
                onClick={() => {
                  const prod = previewModalProduct;
                  setPreviewModalProduct(null);
                  handleBuyProduct(prod);
                }}
              >
                <span>Unlock All Leads &bull; ₹{previewModalProduct.price}</span>
                <ArrowRight size={16} />
              </button>
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
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-col">
              <div className="logo" style={{ color: '#ffffff' }}>
                <div className="logo-icon" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  <ShoppingBag size={18} fill="white" />
                </div>
                Dropzen
              </div>
              <p className="footer-brand-desc">
                India&apos;s premier marketplace for verified Meesho &amp; COD dropshipping customer order leads delivered as Excel spreadsheets.
              </p>
            </div>

            <div className="footer-links-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#trending-bundles">Trending Bundles</a></li>
                <li><Link href="/marketplace">Products Hub</Link></li>
                <li><a href="#excel-preview">Excel Sheet Preview</a></li>
                <li><Link href="/profile/orders">My Orders</Link></li>
              </ul>
            </div>

            <div className="footer-links-col">
              <h4>Support &amp; Inquiries</h4>
              <ul>
                <li><a href="https://t.me/dropzen_support" target="_blank" rel="noreferrer">Telegram Support</a></li>
                <li><a href="mailto:mahadevtanti191@gmail.com">Email Us</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">
              &copy; {new Date().getFullYear()} Dropzen Inc. All rights reserved. High-converting Meesho &amp; COD buyer leads.
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
