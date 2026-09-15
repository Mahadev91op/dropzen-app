const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://mahadevtanti191_db_user:Tqyz7kpMdYQ68uJQ@cluster0.arcmqtz.mongodb.net/dropzen?retryWrites=true&w=majority';

// Realistic Indian COD Buyer Leads
const SAMPLE_BUYERS = [
  { name: 'Pooja Sharma', phone: '+91 98112 40912', address: 'Flat 302, Sai Kripa Enclave, Sector 14', city: 'Gurugram', state: 'Haryana', pincode: '122001', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { name: 'Aarav Mehta', phone: '+91 98201 84920', address: 'B-402, Sunshine Heights, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { name: 'Kavita Sundaram', phone: '+91 98450 71923', address: '12/A, Koramangala 4th Block', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', payment: 'UPI Prepaid', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { name: 'Rajesh Kulkarni', phone: '+91 94223 99182', address: 'Flat 101, Shanti Niketan, Kothrud', city: 'Pune', state: 'Maharashtra', pincode: '411038', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 13, 2026' },
  { name: 'Neha Singhania', phone: '+91 98305 66719', address: '55/1, Salt Lake Sector 1', city: 'Kolkata', state: 'West Bengal', pincode: '700064', payment: 'UPI Prepaid', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { name: 'Vikas Choudhary', phone: '+91 94140 55192', address: 'Plot 88, Vaishali Nagar', city: 'Jaipur', state: 'Rajasthan', pincode: '302021', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 13, 2026' },
  { name: 'Deepak Rawat', phone: '+91 97561 22849', address: '34, Rajpur Road', city: 'Dehradun', state: 'Uttarakhand', pincode: '248001', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 13, 2026' },
  { name: 'Suresh Reddy', phone: '+91 99890 11928', address: 'Plot 204, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 12, 2026' },
  { name: 'Ananya Verma', phone: '+91 98720 44918', address: 'House 512, Sector 35-C', city: 'Chandigarh', state: 'Punjab', pincode: '160035', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { name: 'Manoj Patel', phone: '+91 98980 33819', address: 'C-302, Bodakdev Enclave', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054', payment: 'UPI Prepaid', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { name: 'Ritu Agarwal', phone: '+91 94330 91823', address: '88, Southern Avenue', city: 'Kolkata', state: 'West Bengal', pincode: '700029', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 13, 2026' },
  { name: 'Gaurav Bhatia', phone: '+91 98760 12948', address: 'B-12, Model Town', city: 'Ludhiana', state: 'Punjab', pincode: '141002', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 12, 2026' },
];

// 26 Realistic Meesho-centric Trending Dropshipping Products (All Under/Around ₹1,000)
const MEESHO_PRODUCTS = [
  // --- Category: Fashion & Apparel (Kurtis, Sarees, T-Shirts, Trackpants, Nightwear) ---
  {
    id: 'meesho-kurti-anarkali-set',
    title: 'Cotton Printed Anarkali Kurti & Pant Set with Dupatta',
    slug: 'cotton-anarkali-kurti-pant-set',
    category: 'Fashion & Apparel',
    recordsCount: 8420,
    price: 499,
    originalPrice: 1299,
    discount: '61% OFF',
    rating: 4.9,
    reviewsCount: 312,
    badge: '🔥 #1 Meesho Bestseller',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'High-demand Indian female ethnic wear buyers looking for daily and festive printed cotton Anarkali kurti suits with pant & dupatta.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    meeshoCost: 189,
    resellPrice: 599,
    highlightFeatures: [
      '8,420 Verified Women Ethnic Shoppers (PAN-India)',
      'High Repeat Buying for Kurtis & Suit Sets',
      'Historical RTO < 10.8% on COD Deliveries',
      'Accurate Mobile Numbers Verified on Truecaller',
      'Instant Excel (.XLSX) File with Complete Delivery Addresses',
    ],
  },
  {
    id: 'meesho-saree-georgette-embroidery',
    title: 'Georgette Embroidered Floral Saree with Designer Blouse',
    slug: 'georgette-embroidered-floral-saree',
    category: 'Fashion & Apparel',
    recordsCount: 9150,
    price: 549,
    originalPrice: 1499,
    discount: '63% OFF',
    rating: 4.8,
    reviewsCount: 245,
    badge: '✨ Trending Saree',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Verified women buyers for lightweight festive georgette sarees with zari embroidery border and matching designer blouse piece.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80',
    meeshoCost: 210,
    resellPrice: 699,
    highlightFeatures: [
      '9,150 Pre-Qualified COD Buyers for Traditional Sarees',
      'Top Festive & Wedding Season Orders across Tier-2/Tier-3',
      'Low Return Rate (< 9.5% historical RTO)',
      'Verified WhatsApp & Calling Mobile Numbers',
      'Pre-formatted Columns for Shiprocket & Delhivery Bulk Upload',
    ],
  },
  {
    id: 'meesho-men-oversized-tshirt',
    title: "Men's Oversized Heavy-Cotton Streetwear Graphic T-Shirt",
    slug: 'mens-oversized-graphic-cotton-tshirt',
    category: 'Fashion & Apparel',
    recordsCount: 11200,
    price: 349,
    originalPrice: 899,
    discount: '61% OFF',
    rating: 4.9,
    reviewsCount: 380,
    badge: '⚡ Gen-Z Viral',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Gen-Z and college students pan-India buying 220 GSM heavy-cotton oversized fit printed streetwear anime and typographic tees.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    meeshoCost: 129,
    resellPrice: 449,
    highlightFeatures: [
      '11,200 High-Engagement Young Male Shoppers',
      'Massive Conversion on Instagram Reels Ads & Meesho',
      'Average COD Accept Rate > 89.2%',
      'Full Customer Info: Name, Phone, City, PIN Code',
      'Direct Microsoft Excel (.xlsx) Download in Dashboard',
    ],
  },
  {
    id: 'meesho-women-rayon-kurti',
    title: "Women's Pure Rayon Daily Wear Straight Kurti (Pack of 1)",
    slug: 'womens-rayon-printed-straight-kurti',
    category: 'Fashion & Apparel',
    recordsCount: 12800,
    price: 299,
    originalPrice: 799,
    discount: '62% OFF',
    rating: 4.8,
    reviewsCount: 420,
    badge: '💰 High Volume',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Affordable daily wear office and college straight fit Rayon kurtis with 3/4 sleeves and gold foil prints. High volume turnover.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
    meeshoCost: 99,
    resellPrice: 399,
    highlightFeatures: [
      '12,800 Verified Daily Wear Shoppers Across India',
      'Ultra Low Price Point = Highest COD Delivery Success',
      'Zero Duplicate Numbers & Filtered PIN Codes',
      'Historical Courier Return Rate < 8.7%',
      'Instant Download & Email Notification',
    ],
  },
  {
    id: 'meesho-men-lycra-trackpants',
    title: "Men's 4-Way Stretch Cotton Lycra Gym & Casual Track Pants",
    slug: 'mens-cotton-lycra-casual-track-pants',
    category: 'Fashion & Apparel',
    recordsCount: 7850,
    price: 399,
    originalPrice: 999,
    discount: '60% OFF',
    rating: 4.7,
    reviewsCount: 195,
    badge: '🏃 Gym & Casual',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Active men online shoppers purchasing comfortable stretchable jogger track pants with zippered utility pockets.',
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
    meeshoCost: 149,
    resellPrice: 499,
    highlightFeatures: [
      '7,850 Active Male Fitness & Casual Wear Buyers',
      'High Repeat Ordering of Multiple Color Variants',
      'Low RTO Rate on COD Deliveries (< 11.2%)',
      'Complete Verified Residential Addresses',
      'Formatted for 1-Click Courier Manifest Generation',
    ],
  },
  {
    id: 'meesho-women-nightsuit-set',
    title: "Women's Soft Satin Printed Shirt & Pajama Night Suit Set",
    slug: 'womens-soft-satin-night-suit-set',
    category: 'Fashion & Apparel',
    recordsCount: 6940,
    price: 449,
    originalPrice: 1199,
    discount: '62% OFF',
    rating: 4.9,
    reviewsCount: 230,
    badge: '🌙 Nightwear Pick',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Trending comfy nightwear and loungewear pajama sets in floral and solid pastel prints with button-down front.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    meeshoCost: 169,
    resellPrice: 599,
    highlightFeatures: [
      '6,940 Verified Female Nightwear & Lounge Buyers',
      'Very High WhatsApp Connect & Order Confirmation Rate',
      'Lowest Delivery Rejections in Apparel Category (< 9.1%)',
      'PAN-India Tier-1, Tier-2, and Tier-3 Coverage',
      'Instant Excel Download Link in User Account',
    ],
  },

  // --- Category: Watches & Wearables (Smartwatches, Magnetic mesh, Sports watches) ---
  {
    id: 'meesho-t800-ultra-smartwatch',
    title: 'T800 Ultra Bluetooth Calling Smartwatch with HD Touch Display',
    slug: 't800-ultra-bluetooth-calling-smartwatch',
    category: 'Watches & Wearables',
    recordsCount: 14350,
    price: 699,
    originalPrice: 1999,
    discount: '65% OFF',
    rating: 4.9,
    reviewsCount: 520,
    badge: '🔥 #1 Meesho Hit',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Meesho #1 bestselling smartwatch model featuring Bluetooth calling, fitness tracker, magnetic charger, and multiple watch faces.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    meeshoCost: 249,
    resellPrice: 899,
    highlightFeatures: [
      '14,350 Verified Gadget Buyers for Smartwatches',
      'Massive Profit Margins (₹600+ Net Margin Per Order)',
      'High COD Order Acceptance Pan-India (> 88.5%)',
      'Mobile Numbers Verified on WhatsApp Business',
      'Pre-formatted Excel Ready for Instant Dispatch',
    ],
  },
  {
    id: 'meesho-women-rose-gold-mesh-watch',
    title: "Women's Starry Dial Rose Gold Magnetic Mesh Strap Watch",
    slug: 'womens-rose-gold-magnetic-mesh-watch',
    category: 'Watches & Wearables',
    recordsCount: 9870,
    price: 349,
    originalPrice: 899,
    discount: '61% OFF',
    rating: 4.8,
    reviewsCount: 310,
    badge: '✨ Viral Magnet Watch',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Extremely popular starry sky dial magnetic clasp women quartz wristwatch. Proven viral conversion on Instagram & Meesho.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
    meeshoCost: 119,
    resellPrice: 449,
    highlightFeatures: [
      '9,870 Verified Female Watch & Fashion Shoppers',
      'Top Gifting Item with Low COD Return History (< 10.4%)',
      'Real Phone Numbers Tested for Active WhatsApp',
      'Includes Full Residential PIN and City Data',
      'Instant Spreadsheet Download (.xlsx)',
    ],
  },
  {
    id: 'meesho-men-matte-black-watch',
    title: "Men's Classic Matte Black Stainless Steel Analog Quartz Watch",
    slug: 'mens-matte-black-stainless-steel-watch',
    category: 'Watches & Wearables',
    recordsCount: 8620,
    price: 399,
    originalPrice: 999,
    discount: '60% OFF',
    rating: 4.8,
    reviewsCount: 275,
    badge: '💼 Gentleman Pick',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Sleek all-black metallic chain business quartz watch with date display, water resistance, and luxury designer aesthetic.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    meeshoCost: 139,
    resellPrice: 499,
    highlightFeatures: [
      '8,620 High-Converting Male Lifestyle Buyers',
      'Excellent Resell Margins for Social Commerce Stores',
      'Low Courier Non-Delivery Ratio (< 10.2%)',
      'PAN-India Metro and Tier-2 City Reach',
      'Instant Download in Orders Tab and Email Confirmation',
    ],
  },
  {
    id: 'meesho-unisex-digital-sports-watch',
    title: 'Unisex Waterproof Digital Military Sports LED Watch',
    slug: 'unisex-waterproof-digital-military-watch',
    category: 'Watches & Wearables',
    recordsCount: 7410,
    price: 299,
    originalPrice: 799,
    discount: '62% OFF',
    rating: 4.7,
    reviewsCount: 180,
    badge: '⚡ Tough Rugged',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Rugged shockproof multi-function digital sports watch with EL backlight, stopwatch, alarm, and durable silicone strap.',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80',
    meeshoCost: 89,
    resellPrice: 399,
    highlightFeatures: [
      '7,410 Pre-Qualified Sports & Outdoor Buyers',
      'Budget-Friendly Price Ensures Fast COD Clearance',
      'Historical Delivery Rate Exceeds 90.1%',
      'Verified PAN-India Postal Addresses',
      'Instant Excel Delivery to Customer Dashboard',
    ],
  },

  // --- Category: Electronics & Gadgets (Earphones, Neckband, Ring light, Cables, Gaming) ---
  {
    id: 'meesho-pro6-tws-earbuds',
    title: 'Pro 6 Wireless TWS Bluetooth Earbuds with Digital LED Display',
    slug: 'pro-6-wireless-tws-bluetooth-earbuds',
    category: 'Electronics & Gadgets',
    recordsCount: 16500,
    price: 449,
    originalPrice: 1299,
    discount: '65% OFF',
    rating: 4.9,
    reviewsCount: 640,
    badge: '🎧 Top Earbuds',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'True Wireless Stereo earbuds with touch sensor controls, deep bass diaphragm, Type-C charging, and pocket LED battery box.',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    meeshoCost: 149,
    resellPrice: 599,
    highlightFeatures: [
      '16,500 Active Mobile Gadget Shoppers (Pan-India)',
      '#1 Selling Consumer Tech Accessory on Meesho',
      'Super Low COD Rejection Rate (< 9.8%)',
      'Verified Phone Numbers Ready for Tele-Calling & WhatsApp Bot',
      'Instant .XLSX Download with Clean Postal Data',
    ],
  },
  {
    id: 'meesho-magnetic-wireless-neckband',
    title: 'In-Ear Heavy Bass Magnetic Wireless Neckband (30H Playtime)',
    slug: 'magnetic-heavy-bass-wireless-neckband',
    category: 'Electronics & Gadgets',
    recordsCount: 11840,
    price: 399,
    originalPrice: 999,
    discount: '60% OFF',
    rating: 4.8,
    reviewsCount: 390,
    badge: '⚡ 30H Playtime',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Flexible silicone neckband with magnetic latch earbuds, built-in mic, fast charging, and 30-hour continuous music playback.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    meeshoCost: 135,
    resellPrice: 499,
    highlightFeatures: [
      '11,840 Active Audio Gear Buyers in India',
      'High Repeat Purchase Ratio for Audio Tech',
      'Historical RTO < 10.5% on Fast COD Shipments',
      'Full Contact Details with Valid PIN Codes',
      'Pre-formatted for Automatic 1-Click Courier Manifest Export',
    ],
  },
  {
    id: 'meesho-selfie-ring-light-tripod',
    title: '10-Inch LED Selfie Ring Light with 7-Foot Adjustable Metal Tripod',
    slug: '10-inch-led-selfie-ring-light-tripod',
    category: 'Electronics & Gadgets',
    recordsCount: 9200,
    price: 599,
    originalPrice: 1599,
    discount: '62% OFF',
    rating: 4.9,
    reviewsCount: 290,
    badge: '📹 Creator Viral',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Essential creator equipment for Instagram reels, YouTube shorts, and makeup videos with 3 color light modes and 10 brightness levels.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    meeshoCost: 219,
    resellPrice: 799,
    highlightFeatures: [
      '9,200 Content Creators & Aspiring Influencer Buyers',
      'High Ticket Order Values with Great Resell Margins',
      'Courier Accept Rate > 88.9%',
      'Clean Formatted Excel Spreadsheet',
      'Instant Download to User Orders Section',
    ],
  },
  {
    id: 'meesho-3in1-fast-charging-cable',
    title: '3-in-1 Fast Charging Nylon Braided Cable (Type-C / Lightning / Micro)',
    slug: '3-in-1-fast-charging-braided-cable',
    category: 'Electronics & Gadgets',
    recordsCount: 13400,
    price: 249,
    originalPrice: 599,
    discount: '58% OFF',
    rating: 4.8,
    reviewsCount: 340,
    badge: '🔌 Universal Essential',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Tangle-free 1.2m reinforced nylon braided 3-in-1 multi-charging cable suitable for Android, iPhone, and legacy USB devices.',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
    meeshoCost: 65,
    resellPrice: 349,
    highlightFeatures: [
      '13,400 Verified Indian Mobile Phone Users',
      'Pocket-Friendly Pricing Yields Record-Low Returns (< 7.9%)',
      'Verified Active Calling Numbers across All Telecom Circles',
      'Complete Address & Postal PIN Directory',
      'Instant Automated Excel File Delivery',
    ],
  },
  {
    id: 'meesho-gaming-trigger-cooling-fan',
    title: 'Mobile Gaming Trigger Controller with Silent RGB Cooling Radiator',
    slug: 'mobile-gaming-trigger-cooling-fan',
    category: 'Electronics & Gadgets',
    recordsCount: 7120,
    price: 349,
    originalPrice: 899,
    discount: '61% OFF',
    rating: 4.7,
    reviewsCount: 175,
    badge: '🎮 Gamer Hot Pick',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'BGMI and Free Fire mobile gamers purchasing clip-on cooling fans with ergonomic physical capacitive triggers for lag-free gaming.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    meeshoCost: 110,
    resellPrice: 449,
    highlightFeatures: [
      '7,120 Dedicated Mobile Esports & Gaming Enthusiasts',
      'High Passion Niche with Impressive Repeat Buys',
      'Low RTO Rate on COD Shipments (< 11.0%)',
      'Accurate Mobile Numbers Tested on Truecaller',
      'Instant Excel Download Link in Account',
    ],
  },

  // --- Category: Jewellery & Accessories (Choker, Mangalsutra, Earrings, Bangles) ---
  {
    id: 'meesho-silver-oxidised-choker-set',
    title: 'Silver Oxidised Floral Choker Necklace with Matching Jhumka Earrings',
    slug: 'silver-oxidised-choker-jhumka-set',
    category: 'Jewellery & Accessories',
    recordsCount: 10750,
    price: 299,
    originalPrice: 799,
    discount: '62% OFF',
    rating: 4.9,
    reviewsCount: 410,
    badge: '👑 #1 Jewellery Hit',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Boho ethnic handcrafted German silver finish oxidised jewellery set. Top selling accessory for festive and college outfits on Meesho.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    meeshoCost: 85,
    resellPrice: 399,
    highlightFeatures: [
      '10,750 Verified Female Jewellery Shoppers in India',
      'Top Bestseller for Festive, Garba, and College Wear',
      'Exceptionally Low RTO (< 8.4% on COD Delivery)',
      'Verified Phone Numbers Ready for WhatsApp Marketing',
      'Instant Excel Spreadsheet Download',
    ],
  },
  {
    id: 'meesho-gold-plated-mangalsutra',
    title: '1 Gram Micro Gold Plated Traditional Mangalsutra with Pendant Chain',
    slug: '1-gram-gold-plated-traditional-mangalsutra',
    category: 'Jewellery & Accessories',
    recordsCount: 8300,
    price: 349,
    originalPrice: 899,
    discount: '61% OFF',
    rating: 4.8,
    reviewsCount: 280,
    badge: '💛 Gold Polish Pick',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'High-shine daily wear brass gold plated black beaded mangalsutra necklace with anti-tarnish micro coating.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    meeshoCost: 95,
    resellPrice: 449,
    highlightFeatures: [
      '8,300 Verified Married & Festive Women Shoppers',
      'High Emotional Buying with Near-Zero Delivery Cancellations',
      'Historical Delivery Rate Exceeds 92.4%',
      'Complete Postal Addresses with PIN Code Verification',
      '1-Click Export to All Popular Indian Logistics Platforms',
    ],
  },
  {
    id: 'meesho-korean-butterfly-earrings',
    title: 'Korean Minimalist Butterfly Drop Pearl Dangle Earrings Set',
    slug: 'korean-butterfly-pearl-drop-earrings',
    category: 'Jewellery & Accessories',
    recordsCount: 9640,
    price: 229,
    originalPrice: 599,
    discount: '62% OFF',
    rating: 4.9,
    reviewsCount: 350,
    badge: '🦋 Korean Aesthetic',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Viral Korean style lightweight zircon butterfly stud and dangle earrings trending across college girls and teen shoppers.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
    meeshoCost: 55,
    resellPrice: 299,
    highlightFeatures: [
      '9,640 Gen-Z & College Female Buyers',
      'Low Cost Impulse Purchase Item with Immediate COD Acceptance',
      'RTO Rate < 8.1% on Standard Courier Deliveries',
      'Verified PAN-India Phone & Address Data',
      'Instant Download in User Dashboard',
    ],
  },
  {
    id: 'meesho-brass-meenakari-bangles',
    title: 'Brass Gold Plated Traditional Meenakari Kada Bangles (Set of 4)',
    slug: 'brass-gold-plated-meenakari-bangles-set',
    category: 'Jewellery & Accessories',
    recordsCount: 6450,
    price: 449,
    originalPrice: 1199,
    discount: '62% OFF',
    rating: 4.8,
    reviewsCount: 190,
    badge: '✨ Bridal Festive',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Handcrafted royal Meenakari enamel and studded stone bridal kada bangles in standard 2.4, 2.6, and 2.8 wrist sizes.',
    image: 'https://images.unsplash.com/photo-1611591475819-79b8b4a7b989?w=800&q=80',
    meeshoCost: 140,
    resellPrice: 599,
    highlightFeatures: [
      '6,450 Verified Ethnic & Wedding Accessories Shoppers',
      'High Value B2C Re-orders during Festive Seasons',
      'Courier Rejection History < 9.7%',
      'Complete Details: Customer Name, Mobile, City, PIN',
      'Instant Excel Spreadsheets via Cloud Download',
    ],
  },

  // --- Category: Home & Kitchen (Mini Kitchen Gadgets) ---
  {
    id: 'meesho-mini-electric-chopper',
    title: 'Rechargeable Electric Mini Garlic & Vegetable Food Chopper (250ml)',
    slug: 'rechargeable-electric-mini-garlic-vegetable-chopper',
    category: 'Home & Kitchen',
    recordsCount: 12300,
    price: 399,
    originalPrice: 999,
    discount: '60% OFF',
    rating: 4.9,
    reviewsCount: 460,
    badge: '🔥 Kitchen #1 Seller',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'USB rechargeable 3-blade stainless steel mini wireless food processor for chopping garlic, ginger, onions, chilies, and herbs.',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
    meeshoCost: 135,
    resellPrice: 499,
    highlightFeatures: [
      '12,300 Home & Kitchen Utility Gadget Buyers',
      'Top-Performing Product on Meta Ads & Meesho Marketplace',
      'Historic COD Delivery Clearance > 91.2%',
      '100% Genuine Mobile Numbers Verified with OTP/WhatsApp',
      'Instant Spreadsheet Download in Microsoft Excel Format',
    ],
  },
  {
    id: 'meesho-portable-usb-juicer-blender',
    title: '6-Blade Portable Electric USB Smoothie & Juice Blender Bottle (380ml)',
    slug: 'portable-electric-usb-smoothie-juicer-blender',
    category: 'Home & Kitchen',
    recordsCount: 8920,
    price: 549,
    originalPrice: 1399,
    discount: '61% OFF',
    rating: 4.8,
    reviewsCount: 315,
    badge: '🥤 Viral Gadget',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Compact travel-friendly 380ml personal blender bottle for fresh fruit smoothies, protein shakes, and baby food on the go.',
    image: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800&q=80',
    meeshoCost: 185,
    resellPrice: 699,
    highlightFeatures: [
      '8,920 Fitness & Health Conscious Urban Consumers',
      'Viral Hit on Social Media with 3X Resell Margins',
      'Low RTO Rate (< 10.1% on Pan-India Delivery)',
      'Accurate Contact Records with Full Street Addresses',
      'Instant Download Access from Profile Orders Page',
    ],
  },
  {
    id: 'meesho-automatic-water-bottle-pump',
    title: 'Automatic Wireless Electric Water Bottle Pump Dispenser',
    slug: 'automatic-wireless-electric-water-bottle-pump',
    category: 'Home & Kitchen',
    recordsCount: 11100,
    price: 349,
    originalPrice: 849,
    discount: '59% OFF',
    rating: 4.8,
    reviewsCount: 375,
    badge: '💧 Household Essential',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'One-touch automatic water dispensing pump for standard 20-litre water cans with USB charging and food grade silicone tube.',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=800&q=80',
    meeshoCost: 110,
    resellPrice: 449,
    highlightFeatures: [
      '11,100 Verified Household Buyers across Metro and Tier-2 Cities',
      'Utility Need Drives Extremely Low Order Cancellations',
      'Courier Delivery Success Rate > 90.6%',
      'Complete Demographic & Postal Details Included',
      'Pre-formatted for Instant Shiprocket Batch Upload',
    ],
  },
  {
    id: 'meesho-7egg-electric-boiler',
    title: '7-Egg Instant Electric Boiler & Steamer with Auto Shut-Off',
    slug: '7-egg-instant-electric-boiler-steamer',
    category: 'Home & Kitchen',
    recordsCount: 6800,
    price: 429,
    originalPrice: 999,
    discount: '57% OFF',
    rating: 4.7,
    reviewsCount: 165,
    badge: '🍳 Breakfast Quick',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Quick 10-minute egg cooker with soft, medium, and hard boiled settings plus measuring water cup and overheating protection.',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800&q=80',
    meeshoCost: 145,
    resellPrice: 549,
    highlightFeatures: [
      '6,800 Active Bachelors & Modern Homemakers Leads',
      'High Utility Niche with Low Price Resistance',
      'Historical RTO < 10.9% on COD',
      'Clean Formatted Postal Addresses and PIN Codes',
      'Direct Download in Dashboard and Registered Email',
    ],
  },
  {
    id: 'meesho-kitchen-sink-faucet-aerator',
    title: '360° Rotatable Kitchen Sink Faucet Splash-Proof Aerator Extender',
    slug: '360-rotatable-kitchen-sink-faucet-aerator',
    category: 'Home & Kitchen',
    recordsCount: 7950,
    price: 249,
    originalPrice: 599,
    discount: '58% OFF',
    rating: 4.7,
    reviewsCount: 198,
    badge: '🚰 Water Saver',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Flexible dual-spray water saver nozzle attachment for kitchen sinks with 3 water pressure modes and anti-splash filter.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    meeshoCost: 65,
    resellPrice: 349,
    highlightFeatures: [
      '7,950 Home Improvement and Kitchen Enthusiasts',
      'Sub-₹300 Price Bracket Delivers Peak COD Acceptance',
      'Verified Truecaller Phone Numbers Pan-India',
      'Zero Data Duplication',
      'Instant Download (.xlsx)',
    ],
  },

  // --- Category: Beauty & Wellness (Hair straightener brush, Trimmer, Jade roller) ---
  {
    id: 'meesho-hair-straightener-brush',
    title: '2-in-1 Ceramic Ionic Electric Hair Straightener Comb & Styler Brush',
    slug: '2-in-1-electric-hair-straightener-comb-brush',
    category: 'Beauty & Wellness',
    recordsCount: 10400,
    price: 599,
    originalPrice: 1499,
    discount: '60% OFF',
    rating: 4.9,
    reviewsCount: 395,
    badge: '💇 Instant Styler',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Instant 30-second heating PTC anti-scald hair straightening heated comb brush with adjustable temperature for smooth frizz-free hair.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    meeshoCost: 199,
    resellPrice: 749,
    highlightFeatures: [
      '10,400 Verified Female Personal Care Shoppers',
      '#1 Viral Women Grooming Appliance on Meesho & Reels',
      'Historical Delivery Rate > 89.8%',
      'Complete Residential Delivery Addresses Included',
      'Instant Excel File Download Available 24/7',
    ],
  },
  {
    id: 'meesho-vintage-t9-trimmer',
    title: "Vintage T9 Professional Cordless Hair & Beard Trimmer (USB Rechargeable)",
    slug: 'vintage-t9-cordless-hair-beard-trimmer',
    category: 'Beauty & Wellness',
    recordsCount: 13200,
    price: 449,
    originalPrice: 1199,
    discount: '62% OFF',
    rating: 4.9,
    reviewsCount: 480,
    badge: '💈 #1 Mens Grooming',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Heavy metal carved body Buddha/Dragon head zero-gapped close cutting T-blade hair clipper with 4 guide combs.',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80',
    meeshoCost: 145,
    resellPrice: 599,
    highlightFeatures: [
      '13,200 Verified Male Grooming Buyers Pan-India',
      'All-Time Highest Volume Dropshipping Winner',
      'COD Delivery Success Rate > 90.4%',
      'Filtered for Low RTO and Active WhatsApp Contacts',
      'Instant Automated Excel File Delivery',
    ],
  },
  {
    id: 'meesho-jade-roller-gua-sha',
    title: '100% Natural Himalayan Jade Stone Face Roller & Gua Sha Massage Tool',
    slug: 'natural-jade-stone-face-roller-gua-sha-set',
    category: 'Beauty & Wellness',
    recordsCount: 8750,
    price: 299,
    originalPrice: 799,
    discount: '62% OFF',
    rating: 4.8,
    reviewsCount: 310,
    badge: '🌿 Skincare Viral',
    deliveryTime: 'Instant 5-Min Delivery',
    freshness: 'Updated Sept 2026',
    description: 'Original jade facial contouring roller and scraping board for lymphatic drainage, reducing puffiness, and glowing skincare.',
    image: 'https://images.unsplash.com/photo-1512290900672-1f557297e06a?w=800&q=80',
    meeshoCost: 85,
    resellPrice: 399,
    highlightFeatures: [
      '8,750 Verified Skincare & Ayurvedic Wellness Buyers',
      'Ultra Low Delivery Returns (< 8.6% Historical RTO)',
      'High WhatsApp Conversion for Skincare Offers',
      '100% Valid Indian Mobile Numbers & PIN Codes',
      'Instant Download to User Orders Section',
    ],
  },
];

async function seedDatabase(uri, label) {
  console.log(`\n========================================`);
  console.log(`Connecting to ${label}...`);
  let conn;
  try {
    conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 8000,
    }).asPromise();
    console.log(`✅ Connected to ${label}:`, conn.name);
  } catch (err) {
    console.warn(`⚠️ Could not connect to ${label}:`, err.message);
    return;
  }

  const db = conn.db;

  // 1. CLEAR OLD PRODUCTS & CARDS COMPLETELY
  console.log(`[${label}] Cleaning up old mismatched products and cards...`);
  await db.collection('products').deleteMany({});
  await db.collection('cards').deleteMany({});
  console.log(`✅ [${label}] Old products and cards purged.`);

  // 2. INSERT 26 NEW MEESHO PRODUCTS & CARDS
  console.log(`[${label}] Inserting 26 trending Meesho products...`);
  for (const prod of MEESHO_PRODUCTS) {
    const leads = SAMPLE_BUYERS.map((b, idx) => ({
      id: idx + 1,
      name: b.name,
      phone: b.phone,
      address: b.address,
      city: b.city,
      state: b.state,
      pincode: b.pincode,
      product: prod.title,
      amount: `₹${prod.resellPrice}`,
      payment: b.payment,
      status: b.status,
      date: b.date,
    }));

    const sampleRows = leads.slice(0, 5).map(l => ({
      id: l.id,
      name: l.name,
      phone: l.phone.slice(0, 9) + ' •••••',
      city: l.city,
      state: l.state,
      pincode: l.pincode,
      product: prod.title,
      amount: l.amount,
      payment: l.payment,
      date: l.date,
    }));

    const docToInsert = {
      ...prod,
      name: prod.title,
      type: prod.category,
      entryFee: prod.price,
      cardType: prod.category,
      customerLeads: leads,
      sampleRows: sampleRows,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('products').insertOne({ ...docToInsert });
    await db.collection('cards').insertOne({ ...docToInsert });
  }

  const totalProds = await db.collection('products').countDocuments();
  const totalCards = await db.collection('cards').countDocuments();
  console.log(`✅ [${label}] Seeded ${totalProds} products and ${totalCards} cards!`);

  // 3. PURGE DUMMY USER ACCOUNTS - KEEP ONLY ROOT ADMIN & TEST CUSTOMER
  console.log(`[${label}] Cleaning up user accounts...`);
  const salt = await bcrypt.genSalt(10);
  const adminHashedPassword = await bcrypt.hash('Dropzen@1234', salt);
  const testHashedPassword = await bcrypt.hash('Test@1234', salt);

  // Upsert Root Admin
  await db.collection('users').updateOne(
    { email: 'mahadevtanti191@gmail.com' },
    {
      $set: {
        username: 'mahadev_admin',
        email: 'mahadevtanti191@gmail.com',
        isAdmin: true,
        password: adminHashedPassword,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date('2026-08-01'),
      }
    },
    { upsert: true }
  );

  // Upsert Test Customer
  await db.collection('users').updateOne(
    { email: 'test@gmail.com' },
    {
      $set: {
        username: 'test',
        email: 'test@gmail.com',
        isAdmin: false,
        password: testHashedPassword,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date('2026-09-01'),
      }
    },
    { upsert: true }
  );

  // Delete all users EXCEPT mahadevtanti191@gmail.com and test@gmail.com
  const deleteUsersResult = await db.collection('users').deleteMany({
    email: { $nin: ['mahadevtanti191@gmail.com', 'test@gmail.com'] }
  });
  console.log(`✅ [${label}] Deleted ${deleteUsersResult.deletedCount} dummy demo user accounts.`);

  const remainingUsers = await db.collection('users').find({}, { projection: { username: 1, email: 1, isAdmin: 1 } }).toArray();
  console.log(`✅ [${label}] Remaining users (${remainingUsers.length}):`, remainingUsers);

  const testUserDoc = await db.collection('users').findOne({ email: 'test@gmail.com' });
  const testUserId = testUserDoc ? testUserDoc._id : null;

  // 4. CLEAN & RE-LINK ORDERS TO TEST USER WITH REAL MEESHO PRODUCTS
  console.log(`[${label}] Synchronizing orders for demo and verification...`);
  await db.collection('orders').deleteMany({}); // reset orders cleanly

  const kurtiProd = await db.collection('products').findOne({ id: 'meesho-kurti-anarkali-set' });
  const t800Prod = await db.collection('products').findOne({ id: 'meesho-t800-ultra-smartwatch' });
  const earbudsProd = await db.collection('products').findOne({ id: 'meesho-pro6-tws-earbuds' });
  const chopperProd = await db.collection('products').findOne({ id: 'meesho-mini-electric-chopper' });

  if (testUserId && kurtiProd && t800Prod && earbudsProd && chopperProd) {
    const demoOrders = [
      {
        userId: testUserId,
        productId: t800Prod._id,
        cardId: t800Prod._id,
        status: 'completed',
        pricePaid: t800Prod.price,
        utrNumber: '425619842091',
        senderUpiId: 'test@okaxis',
        paymentApp: 'gpay',
        excelData: t800Prod.customerLeads,
        productSnapshot: {
          _id: t800Prod._id,
          title: t800Prod.title,
          category: t800Prod.category,
          price: t800Prod.price,
          recordsCount: t800Prod.recordsCount,
          image: t800Prod.image,
          badge: t800Prod.badge,
          meeshoCost: t800Prod.meeshoCost,
          resellPrice: t800Prod.resellPrice,
        },
        cardSnapshot: {
          name: t800Prod.title,
          type: t800Prod.category,
          entryFee: t800Prod.price,
        },
        createdAt: new Date('2026-09-13T10:30:00Z'),
      },
      {
        userId: testUserId,
        productId: kurtiProd._id,
        cardId: kurtiProd._id,
        status: 'completed',
        pricePaid: kurtiProd.price,
        utrNumber: '425688192034',
        senderUpiId: 'test@paytm',
        paymentApp: 'paytm',
        excelData: kurtiProd.customerLeads,
        productSnapshot: {
          _id: kurtiProd._id,
          title: kurtiProd.title,
          category: kurtiProd.category,
          price: kurtiProd.price,
          recordsCount: kurtiProd.recordsCount,
          image: kurtiProd.image,
          badge: kurtiProd.badge,
          meeshoCost: kurtiProd.meeshoCost,
          resellPrice: kurtiProd.resellPrice,
        },
        cardSnapshot: {
          name: kurtiProd.title,
          type: kurtiProd.category,
          entryFee: kurtiProd.price,
        },
        createdAt: new Date('2026-09-14T14:15:00Z'),
      },
      {
        userId: testUserId,
        productId: earbudsProd._id,
        cardId: earbudsProd._id,
        status: 'pending',
        pricePaid: earbudsProd.price,
        utrNumber: '642918402914',
        senderUpiId: 'test@ybl',
        paymentApp: 'phonepe',
        excelData: earbudsProd.customerLeads,
        productSnapshot: {
          _id: earbudsProd._id,
          title: earbudsProd.title,
          category: earbudsProd.category,
          price: earbudsProd.price,
          recordsCount: earbudsProd.recordsCount,
          image: earbudsProd.image,
          badge: earbudsProd.badge,
          meeshoCost: earbudsProd.meeshoCost,
          resellPrice: earbudsProd.resellPrice,
        },
        cardSnapshot: {
          name: earbudsProd.title,
          type: earbudsProd.category,
          entryFee: earbudsProd.price,
        },
        createdAt: new Date('2026-09-15T08:45:00Z'),
      },
      {
        userId: testUserId,
        productId: chopperProd._id,
        cardId: chopperProd._id,
        status: 'pending',
        pricePaid: chopperProd.price,
        utrNumber: '891023458921',
        senderUpiId: 'test@upi',
        paymentApp: 'phonepe',
        excelData: chopperProd.customerLeads,
        productSnapshot: {
          _id: chopperProd._id,
          title: chopperProd.title,
          category: chopperProd.category,
          price: chopperProd.price,
          recordsCount: chopperProd.recordsCount,
          image: chopperProd.image,
          badge: chopperProd.badge,
          meeshoCost: chopperProd.meeshoCost,
          resellPrice: chopperProd.resellPrice,
        },
        cardSnapshot: {
          name: chopperProd.title,
          type: chopperProd.category,
          entryFee: chopperProd.price,
        },
        createdAt: new Date('2026-09-15T11:20:00Z'),
      },
    ];

    await db.collection('orders').insertMany(demoOrders);
    const totalOrders = await db.collection('orders').countDocuments();
    console.log(`✅ [${label}] Seeded ${totalOrders} clean orders linked to test customer!`);
  }

  // 5. UPDATE SETTINGS
  console.log(`[${label}] Updating settings...`);
  await db.collection('settings').updateOne(
    {},
    {
      $set: {
        telegramLink: 'https://t.me/dropzen_support',
        instagramLink: 'https://instagram.com/dropzen_official',
        announcementText: '🔥 26+ Fresh Meesho COD Dropshipping Buyer Leads uploaded! Saree, Kurtis, Smartwatches, Earbuds & Kitchen gadgets live.',
        announcementActive: true,
        maintenanceMode: false,
        globalDiscount: 0,
        upiId: 'mahadevtanti191@okaxis',
        usdToInrRate: 83,
        updatedAt: new Date(),
      }
    },
    { upsert: true }
  );
  console.log(`✅ [${label}] Settings updated successfully!`);

  await conn.close();
}

async function run() {
  // 1. Seed MongoDB Atlas
  await seedDatabase(MONGODB_URI, 'MongoDB Atlas (dropzen)');

  // 2. Seed Local MongoDB if available
  try {
    await seedDatabase('mongodb://127.0.0.1:27017/dropzen', 'Local MongoDB (dropzen)');
  } catch (e) {}

  try {
    await seedDatabase('mongodb://127.0.0.1:27017/cardvault', 'Local MongoDB (cardvault)');
  } catch (e) {}

  console.log('\n========================================');
  console.log('🎉 ALL MEESHO DATA SUCCESSFULLY SEEDED & DUMMY ACCOUNTS PURGED!');
  console.log('========================================\n');
}

run().catch((err) => {
  console.error('❌ Error during Meesho seeding:', err);
  process.exit(1);
});
