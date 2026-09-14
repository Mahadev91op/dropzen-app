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

const SAMPLE_LEADS_DATA = [
  { id: 1, name: 'Aarav Mehta', phone: '+91 98201 84920', address: 'B-402, Sunshine Heights, Andheri West', city: 'Mumbai', state: 'Maharashtra', pincode: '400053', amount: '₹1,699', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { id: 2, name: 'Priya Sundaram', phone: '+91 98450 71923', address: '12/A, Koramangala 4th Block', city: 'Bengaluru', state: 'Karnataka', pincode: '560034', amount: '₹2,150', payment: 'UPI Prepaid', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { id: 3, name: 'Rajesh Kulkarni', phone: '+91 94223 99182', address: 'Flat 101, Shanti Niketan, Kothrud', city: 'Pune', state: 'Maharashtra', pincode: '411038', amount: '₹1,399', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 13, 2026' },
  { id: 4, name: 'Kavita Singhal', phone: '+91 98112 34910', address: 'Villa 14, DLF Phase 2', city: 'Gurugram', state: 'Haryana', pincode: '122002', amount: '₹1,199', payment: 'Prepaid', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { id: 5, name: 'Vikas Choudhary', phone: '+91 94140 55192', address: 'Plot 88, Vaishali Nagar', city: 'Jaipur', state: 'Rajasthan', pincode: '302021', amount: '₹899', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 12, 2026' },
  { id: 6, name: 'Deepak Rawat', phone: '+91 97561 22849', address: '34, Rajpur Road', city: 'Dehradun', state: 'Uttarakhand', pincode: '248001', amount: '₹1,450', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 13, 2026' },
  { id: 7, name: 'Ananya Mukherjee', phone: '+91 98305 66719', address: '55/1, Salt Lake Sector 1', city: 'Kolkata', state: 'West Bengal', pincode: '700064', amount: '₹1,299', payment: 'UPI Prepaid', status: 'Active Buyer', date: 'Sept 13, 2026' },
  { id: 8, name: 'Suresh Reddy', phone: '+91 99890 11928', address: 'Plot 204, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', pincode: '500033', amount: '₹2,499', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 12, 2026' },
  { id: 9, name: 'Pooja Verma', phone: '+91 98720 44918', address: 'House 512, Sector 35-C', city: 'Chandigarh', state: 'Punjab', pincode: '160035', amount: '₹1,750', payment: 'COD Delivered', status: 'Active Buyer', date: 'Sept 14, 2026' },
  { id: 10, name: 'Manoj Patel', phone: '+91 98980 33819', address: 'C-302, Bodakdev Enclave', city: 'Ahmedabad', state: 'Gujarat', pincode: '380054', amount: '₹1,999', payment: 'UPI Prepaid', status: 'Active Buyer', date: 'Sept 14, 2026' },
];

const PRODUCTS_DATA = [
  {
    id: 'dropzen-hk-5000',
    title: '5,000+ Verified COD Buyers - Home & Kitchen Viral Gadgets',
    slug: 'home-kitchen-viral-gadgets',
    category: 'Home & Kitchen',
    recordsCount: 5240,
    price: 1350,
    originalPrice: 3499,
    discount: '61% OFF',
    rating: 4.9,
    reviewsCount: 184,
    badge: '🔥 Most Popular',
    deliveryTime: '5 - 10 Mins Automated',
    freshness: 'Updated Sept 2026',
    description: 'High-converting PAN-India buyers who placed and accepted COD orders for trending home improvement and kitchen utility gadgets.',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
    meeshoCost: 199,
    resellPrice: 899,
    highlightFeatures: [
      '5,240 Verified Phone & WhatsApp Active Leads',
      'Low RTO Rate (historical RTO < 11.4%)',
      'Full Details: Name, Mobile, City, State, PIN Code',
      'Average Order Spend: ₹1,200 - ₹2,800',
      'Instant Excel (.XLSX) Delivery to Orders & Email',
    ],
    sampleRows: [
      { id: 1, name: 'Aarav Mehta', phone: '+91 98201 •••••', city: 'Mumbai', state: 'Maharashtra', product: 'Wireless Car Vacuum', amount: '₹1,699', payment: 'COD Delivered', date: 'Sept 14, 2026' },
      { id: 2, name: 'Priya Sundaram', phone: '+91 98450 •••••', city: 'Bengaluru', state: 'Karnataka', product: 'Ceramic Curling Iron', amount: '₹2,150', payment: 'UPI Prepaid', date: 'Sept 14, 2026' },
      { id: 3, name: 'Rajesh Kulkarni', phone: '+91 94223 •••••', city: 'Pune', state: 'Maharashtra', product: 'Smart Sensor Trash Bin', amount: '₹1,399', payment: 'COD Delivered', date: 'Sept 13, 2026' },
      { id: 4, name: 'Kavita Singhal', phone: '+91 98112 •••••', city: 'Gurugram', state: 'Haryana', product: 'Gua Sha Facial Sculptor', amount: '₹1,199', payment: 'Prepaid', date: 'Sept 14, 2026' },
      { id: 5, name: 'Vikas Choudhary', phone: '+91 94140 •••••', city: 'Jaipur', state: 'Rajasthan', product: 'Magnetic Phone Car Mount', amount: '₹899', payment: 'COD Delivered', date: 'Sept 12, 2026' },
    ],
  },
  {
    id: 'dropzen-ht-10000',
    title: '10,000+ Premium High-Ticket E-Commerce Spenders (Pan-India)',
    slug: 'high-ticket-ecommerce-spenders',
    category: 'High-Ticket Buyers',
    recordsCount: 10480,
    price: 2499,
    originalPrice: 5999,
    discount: '58% OFF',
    rating: 5.0,
    reviewsCount: 220,
    badge: '⚡ High Margin',
    deliveryTime: '5 - 10 Mins Automated',
    freshness: 'Updated Sept 2026',
    description: 'Affluent online shoppers with basket sizes exceeding ₹2,500. Ideal for luxury watches, designer bags, high-end electronics, and lifestyle D2C brands.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    meeshoCost: 499,
    resellPrice: 1899,
    highlightFeatures: [
      '10,480 Verified Metro & Tier-1 Shoppers',
      'Average Basket Value > ₹2,500',
      'Over 94.2% Connect Rate on Mobile/WhatsApp',
      'Zero Duplicate Numbers & Verified PINs',
      'Direct Shiprocket / NimbusPost Bulk Upload Ready',
    ],
    sampleRows: [
      { id: 1, name: 'Karan Mehra', phone: '+91 98190 •••••', city: 'Delhi', state: 'Delhi', product: 'Luxury Chronograph Watch', amount: '₹2,999', payment: 'COD Delivered', date: 'Sept 14, 2026' },
      { id: 2, name: 'Simran Jolly', phone: '+91 98711 •••••', city: 'Noida', state: 'Uttar Pradesh', product: 'Leather Travel Duffel', amount: '₹3,450', payment: 'Prepaid', date: 'Sept 13, 2026' },
      { id: 3, name: 'Tarun Bansal', phone: '+91 99203 •••••', city: 'Mumbai', state: 'Maharashtra', product: 'Noise Cancelling Earbuds', amount: '₹2,899', payment: 'COD Delivered', date: 'Sept 14, 2026' },
      { id: 4, name: 'Nisha Pillai', phone: '+91 98401 •••••', city: 'Chennai', state: 'Tamil Nadu', product: 'Silk Designer Kurti Set', amount: '₹2,699', payment: 'COD Delivered', date: 'Sept 12, 2026' },
      { id: 5, name: 'Rohit Agarwal', phone: '+91 94330 •••••', city: 'Kolkata', state: 'West Bengal', product: 'Smart Air Fryer XL', amount: '₹3,899', payment: 'UPI Prepaid', date: 'Sept 14, 2026' },
    ],
  },
  {
    id: 'dropzen-fa-7500',
    title: '7,500+ Trendy Gen-Z Apparel & Ethnic Fashion Shoppers',
    slug: 'gen-z-fashion-apparel',
    category: 'Fashion & Apparel',
    recordsCount: 7620,
    price: 1650,
    originalPrice: 3999,
    discount: '59% OFF',
    rating: 4.8,
    reviewsCount: 162,
    badge: '🌟 Trending',
    deliveryTime: '5 - 10 Mins Automated',
    freshness: 'Updated Sept 2026',
    description: 'Active young online shoppers ordering streetwear oversized tees, ethnic kurtis, co-ords, sneakers, and fashion jewellery via Meesho & Instagram stores.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    meeshoCost: 249,
    resellPrice: 999,
    highlightFeatures: [
      '7,620 High-Converting Young Fashion Enthusiasts',
      'Heavy Repeat Buyers of Women & Mens Wear',
      'Ultra Low RTO (< 12.8% on Fashion Delivery)',
      'Verified PAN-India Postal Addresses',
      'Instant Excel Spreadsheet Download',
    ],
    sampleRows: [
      { id: 1, name: 'Riya Sen', phone: '+91 98311 •••••', city: 'Kolkata', state: 'West Bengal', product: 'Oversized Anime Tee', amount: '₹799', payment: 'COD Delivered', date: 'Sept 14, 2026' },
      { id: 2, name: 'Arjun Das', phone: '+91 98490 •••••', city: 'Hyderabad', state: 'Telangana', product: 'Cargo Joggers Black', amount: '₹1,299', payment: 'COD Delivered', date: 'Sept 13, 2026' },
      { id: 3, name: 'Shreya Kapoor', phone: '+91 98104 •••••', city: 'Delhi', state: 'Delhi', product: 'Floral Anarkali Suit', amount: '₹1,599', payment: 'UPI Prepaid', date: 'Sept 14, 2026' },
      { id: 4, name: 'Varun Grover', phone: '+91 98205 •••••', city: 'Mumbai', state: 'Maharashtra', product: 'Chunky Sole Sneakers', amount: '₹1,899', payment: 'COD Delivered', date: 'Sept 11, 2026' },
      { id: 5, name: 'Tanvi Joshi', phone: '+91 94220 •••••', city: 'Pune', state: 'Maharashtra', product: 'Silver Oxidised Jhumka Set', amount: '₹649', payment: 'Prepaid', date: 'Sept 13, 2026' },
    ],
  },
  {
    id: 'dropzen-el-6000',
    title: '6,000+ Smart Electronics & Wireless Tech Gadget Buyers',
    slug: 'smart-electronics-wireless-gadgets',
    category: 'Electronics & Gadgets',
    recordsCount: 6150,
    price: 1550,
    originalPrice: 3799,
    discount: '59% OFF',
    rating: 4.9,
    reviewsCount: 198,
    badge: '🚀 Fast Shipping',
    deliveryTime: '5 - 10 Mins Automated',
    freshness: 'Updated Sept 2026',
    description: 'Tech-savvy customers buying smartwatches, neckbands, mini projectors, power banks, and portable Bluetooth speakers across India.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    meeshoCost: 299,
    resellPrice: 1199,
    highlightFeatures: [
      '6,150 Genuine Gadget & Mobile Tech Shoppers',
      'Consistent Repeat Purchases of Electronics',
      'High Calling / WhatsApp Conversion Rate',
      'Real Mobile Numbers Verified on Truecaller',
      'Automatic Delivery in Microsoft Excel (.xlsx)',
    ],
    sampleRows: [
      { id: 1, name: 'Nikhil Chauhan', phone: '+91 98118 •••••', city: 'Ghaziabad', state: 'Uttar Pradesh', product: 'Wireless BT Neckband', amount: '₹899', payment: 'COD Delivered', date: 'Sept 14, 2026' },
      { id: 2, name: 'Harish Nair', phone: '+91 98470 •••••', city: 'Kochi', state: 'Kerala', product: 'Ultra Smartwatch AMOLED', amount: '₹1,999', payment: 'UPI Prepaid', date: 'Sept 14, 2026' },
      { id: 3, name: 'Gaurav Bhatia', phone: '+91 98760 •••••', city: 'Ludhiana', state: 'Punjab', product: 'Fast Dual USB Car Charger', amount: '₹599', payment: 'COD Delivered', date: 'Sept 12, 2026' },
      { id: 4, name: 'Rohan Deshmukh', phone: '+91 98901 •••••', city: 'Nagpur', state: 'Maharashtra', product: '10000mAh Magnetic Power Bank', amount: '₹1,399', payment: 'COD Delivered', date: 'Sept 13, 2026' },
      { id: 5, name: 'Divya Sharma', phone: '+91 94191 •••••', city: 'Jammu', state: 'Jammu & Kashmir', product: 'Mini RGB Bluetooth Speaker', amount: '₹799', payment: 'Prepaid', date: 'Sept 14, 2026' },
    ],
  },
  {
    id: 'dropzen-bw-8000',
    title: '8,000+ Beauty, Skincare & Ayurvedic Wellness Online Buyers',
    slug: 'beauty-skincare-wellness-buyers',
    category: 'Beauty & Wellness',
    recordsCount: 8300,
    price: 1850,
    originalPrice: 4299,
    discount: '57% OFF',
    rating: 4.9,
    reviewsCount: 245,
    badge: '🌿 High Repeat COD',
    deliveryTime: '5 - 10 Mins Automated',
    freshness: 'Updated Sept 2026',
    description: 'Prime female online shoppers interested in organic skincare, hair regrowth serums, herbal tea, beauty rollers, and personal grooming appliances.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    meeshoCost: 179,
    resellPrice: 799,
    highlightFeatures: [
      '8,300 Verified Female & Unisex Skincare Buyers',
      'Highest Repeat Purchase Ratio in E-Commerce',
      'Exceptionally Low Courier Rejections (< 9.8%)',
      'Pre-formatted Columns for 1-Click Manifest Export',
      'Instant Download in Dashboard & Email Confirmation',
    ],
    sampleRows: [
      { id: 1, name: 'Sonalika Roy', phone: '+91 98302 •••••', city: 'Kolkata', state: 'West Bengal', product: 'Vitamin C Brightening Serum', amount: '₹699', payment: 'COD Delivered', date: 'Sept 14, 2026' },
      { id: 2, name: 'Preeti Rathore', phone: '+91 94142 •••••', city: 'Udaipur', state: 'Rajasthan', product: 'Rose Quartz Facial Roller', amount: '₹899', payment: 'UPI Prepaid', date: 'Sept 14, 2026' },
      { id: 3, name: 'Megha Trivedi', phone: '+91 98250 •••••', city: 'Surat', state: 'Gujarat', product: 'Herbal Onion Hair Oil 200ml', amount: '₹549', payment: 'COD Delivered', date: 'Sept 13, 2026' },
      { id: 4, name: 'Ankita Sen', phone: '+91 98451 •••••', city: 'Mysuru', state: 'Karnataka', product: 'Ultrasonic Skin Scrubber', amount: '₹1,450', payment: 'COD Delivered', date: 'Sept 12, 2026' },
      { id: 5, name: 'Kritika Malviya', phone: '+91 98260 •••••', city: 'Indore', state: 'Madhya Pradesh', product: 'Matte Liquid Lipstick Trio', amount: '₹799', payment: 'Prepaid', date: 'Sept 14, 2026' },
    ],
  },
  {
    id: 'dropzen-car-4500',
    title: '4,500+ Automotive & Car Care Enthusiast Active Buyers',
    slug: 'automotive-car-care-enthusiasts',
    category: 'Home & Kitchen',
    recordsCount: 4590,
    price: 1250,
    originalPrice: 2999,
    discount: '58% OFF',
    rating: 4.8,
    reviewsCount: 132,
    badge: '🚗 High Conversion',
    deliveryTime: '5 - 10 Mins Automated',
    freshness: 'Updated Sept 2026',
    description: 'Vehicle owners across India who purchase car vacuum cleaners, ceramic polish spray, scratch remover kits, ambient lighting, and tire inflators.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80',
    meeshoCost: 220,
    resellPrice: 899,
    highlightFeatures: [
      '4,590 Active Car & Bike Accessories Buyers',
      'High Phone Connectivity & Quick WhatsApp Orders',
      'Low Return Rates (Historical RTO < 10.6%)',
      'Verified Metro and Tier-2 Vehicle Owners',
      'Complete Excel (.xlsx) Format Delivery',
    ],
    sampleRows: [
      { id: 1, name: 'Pradeep Yadav', phone: '+91 98114 •••••', city: 'Faridabad', state: 'Haryana', product: '12V High-Power Car Vacuum', amount: '₹1,299', payment: 'COD Delivered', date: 'Sept 14, 2026' },
      { id: 2, name: 'Mayank Sethi', phone: '+91 98202 •••••', city: 'Thane', state: 'Maharashtra', product: 'Ceramic Glass Coat Spray', amount: '₹799', payment: 'UPI Prepaid', date: 'Sept 14, 2026' },
      { id: 3, name: 'Amitabh Sinha', phone: '+91 94310 •••••', city: 'Patna', state: 'Bihar', product: 'Digital Tyre Pressure Gauge', amount: '₹649', payment: 'COD Delivered', date: 'Sept 11, 2026' },
      { id: 4, name: 'Sunil Nair', phone: '+91 98460 •••••', city: 'Thiruvananthapuram', state: 'Kerala', product: 'Solar Rotating Car Freshener', amount: '₹499', payment: 'Prepaid', date: 'Sept 13, 2026' },
      { id: 5, name: 'Manish Rawat', phone: '+91 94120 •••••', city: 'Haridwar', state: 'Uttarakhand', product: 'Car Scratch Repair Compound', amount: '₹599', payment: 'COD Delivered', date: 'Sept 12, 2026' },
    ],
  },
];

async function seedDatabase(uri, label) {
  console.log(`\n========================================`);
  console.log(`Connecting to ${label}...`);
  let conn;
  try {
    conn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 6000,
    }).asPromise();
    console.log(`✅ Connected to ${label}:`, conn.name);
  } catch (err) {
    console.warn(`⚠️ Could not connect to ${label}:`, err.message);
    return;
  }

  const db = conn.db;

  // 1. Seed Products Collection
  console.log(`[${label}] Seeding 'products' collection...`);
  for (const prod of PRODUCTS_DATA) {
    await db.collection('products').updateOne(
      { id: prod.id },
      {
        $set: {
          ...prod,
          name: prod.title,
          type: prod.category,
          entryFee: prod.price,
          customerLeads: SAMPLE_LEADS_DATA.map(l => ({ ...l, product: prod.title })),
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
  }
  const totalProds = await db.collection('products').countDocuments();
  console.log(`✅ [${label}] Products seeded! Total products: ${totalProds}`);

  // 1b. Also Seed 'cards' Collection for backwards-compatibility
  console.log(`[${label}] Syncing 'cards' collection alias...`);
  for (const prod of PRODUCTS_DATA) {
    await db.collection('cards').updateOne(
      { id: prod.id },
      {
        $set: {
          ...prod,
          name: prod.title,
          type: prod.category,
          entryFee: prod.price,
          cardType: prod.category,
          customerLeads: SAMPLE_LEADS_DATA.map(l => ({ ...l, product: prod.title })),
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );
  }
  const totalCards = await db.collection('cards').countDocuments();
  console.log(`✅ [${label}] Cards collection synced! Total cards: ${totalCards}`);

  // 2. Seed Users
  console.log(`[${label}] Seeding 'users' collection...`);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Dropzen@1234', salt);

  const demoUsers = [
    {
      username: 'mahadev_admin',
      email: 'mahadevtanti191@gmail.com',
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date('2026-08-01'),
    },
    {
      username: 'ankit_reseller',
      email: 'ankit.dropship@gmail.com',
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date('2026-08-15'),
    },
    {
      username: 'vikram_d2c',
      email: 'vikram.store@gmail.com',
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date('2026-08-20'),
    },
    {
      username: 'pooja_meesho',
      email: 'pooja.meesho@gmail.com',
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date('2026-09-01'),
    },
  ];

  const userIds = {};
  for (const u of demoUsers) {
    await db.collection('users').updateOne(
      { email: u.email },
      { $set: u },
      { upsert: true }
    );
    const doc = await db.collection('users').findOne({ email: u.email });
    userIds[u.username] = doc._id;
  }
  const totalUsers = await db.collection('users').countDocuments();
  console.log(`✅ [${label}] Users seeded! Total users: ${totalUsers}`);

  // 3. Seed Orders
  console.log(`[${label}] Seeding 'orders' collection...`);
  const hkProduct = await db.collection('products').findOne({ id: 'dropzen-hk-5000' });
  const htProduct = await db.collection('products').findOne({ id: 'dropzen-ht-10000' });
  const faProduct = await db.collection('products').findOne({ id: 'dropzen-fa-7500' });

  const demoOrders = [
    {
      userId: userIds['ankit_reseller'],
      productId: hkProduct._id,
      cardId: hkProduct._id,
      status: 'completed',
      pricePaid: 1350,
      utrNumber: '425619842091',
      senderUpiId: 'ankit@okhdfcbank',
      paymentApp: 'gpay',
      excelData: SAMPLE_LEADS_DATA.map(l => ({ ...l, product: hkProduct.title })),
      productSnapshot: {
        _id: hkProduct._id,
        title: hkProduct.title,
        category: hkProduct.category,
        price: 1350,
        recordsCount: hkProduct.recordsCount,
        image: hkProduct.image,
        badge: hkProduct.badge,
        meeshoCost: hkProduct.meeshoCost,
        resellPrice: hkProduct.resellPrice,
      },
      cardSnapshot: {
        name: hkProduct.title,
        type: hkProduct.category,
        entryFee: 1350,
      },
      createdAt: new Date('2026-09-12T10:30:00Z'),
    },
    {
      userId: userIds['vikram_d2c'],
      productId: htProduct._id,
      cardId: htProduct._id,
      status: 'completed',
      pricePaid: 2499,
      utrNumber: '425688192034',
      senderUpiId: 'vikram.d2c@ybl',
      paymentApp: 'phonepe',
      excelData: SAMPLE_LEADS_DATA.map(l => ({ ...l, product: htProduct.title })),
      productSnapshot: {
        _id: htProduct._id,
        title: htProduct.title,
        category: htProduct.category,
        price: 2499,
        recordsCount: htProduct.recordsCount,
        image: htProduct.image,
        badge: htProduct.badge,
        meeshoCost: htProduct.meeshoCost,
        resellPrice: htProduct.resellPrice,
      },
      cardSnapshot: {
        name: htProduct.title,
        type: htProduct.category,
        entryFee: 2499,
      },
      createdAt: new Date('2026-09-13T14:15:00Z'),
    },
    {
      userId: userIds['pooja_meesho'],
      productId: faProduct._id,
      cardId: faProduct._id,
      status: 'pending',
      pricePaid: 1650,
      utrNumber: '642918402914',
      senderUpiId: 'pooja.desh@paytm',
      paymentApp: 'paytm',
      excelData: SAMPLE_LEADS_DATA.map(l => ({ ...l, product: faProduct.title })),
      productSnapshot: {
        _id: faProduct._id,
        title: faProduct.title,
        category: faProduct.category,
        price: 1650,
        recordsCount: faProduct.recordsCount,
        image: faProduct.image,
        badge: faProduct.badge,
        meeshoCost: faProduct.meeshoCost,
        resellPrice: faProduct.resellPrice,
      },
      cardSnapshot: {
        name: faProduct.title,
        type: faProduct.category,
        entryFee: 1650,
      },
      createdAt: new Date('2026-09-14T08:45:00Z'),
    },
  ];

  for (const order of demoOrders) {
    await db.collection('orders').updateOne(
      { utrNumber: order.utrNumber },
      { $set: order },
      { upsert: true }
    );
  }
  const totalOrders = await db.collection('orders').countDocuments();
  console.log(`✅ [${label}] Orders seeded! Total orders: ${totalOrders}`);

  // 4. Seed Settings
  console.log(`[${label}] Seeding 'settings' collection...`);
  await db.collection('settings').updateOne(
    {},
    {
      $set: {
        telegramLink: 'https://t.me/dropzen_support',
        instagramLink: 'https://instagram.com/dropzen_official',
        announcementText: '🔥 New Sept 2026 COD Buyer Leads uploaded! Low RTO (<11%) Pan-India verified databases now live.',
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
  console.log(`✅ [${label}] Settings seeded successfully!`);

  await conn.close();
}

async function run() {
  // Seed MongoDB Atlas
  await seedDatabase(MONGODB_URI, 'MongoDB Atlas (dropzen)');

  // Seed Local MongoDB cardvault (dev server fallback target)
  await seedDatabase('mongodb://127.0.0.1:27017/cardvault', 'Local MongoDB (cardvault)');

  // Seed Local MongoDB dropzen
  await seedDatabase('mongodb://127.0.0.1:27017/dropzen', 'Local MongoDB (dropzen)');

  console.log('\n========================================');
  console.log('🎉 ALL DATABASES (Atlas & Local) SEEDED SUCCESSFULLY!');
  console.log('========================================\n');
}

run().catch((err) => {
  console.error('❌ Error during demo data seeding:', err);
  process.exit(1);
});
