import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import PwaRegister from '@/components/PwaRegister';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://dropzen.in';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dropzen - India's #1 Verified Dropshipping Leads & COD Buyer Database",
    template: '%s | Dropzen'
  },
  description: 'Buy 100% verified COD customer order leads for viral Meesho, Shopify & Indiamart products. Unmasked WhatsApp numbers, active addresses, low RTO (<11%). Instant Excel (.xlsx) dashboard download.',
  keywords: [
    'meesho dropshipping leads',
    'cod buyer leads india',
    'dropshipping customer database',
    'verified ecommerce buyer data',
    'meesho reselling leads',
    'viral products dropshipping excel',
    'low rto buyer leads',
    'bulk leads excel india',
    'dropshipping leads portal',
    'indiamart dropshipping leads'
  ],
  authors: [{ name: 'Dropzen India', url: siteUrl }],
  creator: 'Dropzen Network',
  publisher: 'Dropzen Leads Tech',
  applicationName: 'Dropzen',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg?v=2', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=2', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico?v=2', sizes: 'any' }
    ],
    shortcut: '/favicon.ico?v=2',
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dropzen'
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Dropzen',
    title: "Dropzen - Verified E-Commerce Dropshipping Leads & High-Converting COD Buyer Data",
    description: 'Scale your Meesho & Shopify store to ₹10L/month with pre-verified Pan-India COD customer order leads. Instant Excel (.xlsx) download.',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'Dropzen Verified Leads'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dropzen - Verified E-Commerce Dropshipping Leads & COD Buyer Data",
    description: 'Instant Excel (.xlsx) downloads of 100% verified COD buyer leads for viral dropshipping products across India.',
    images: ['/icon.svg'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  // Schema.org Structured Data (JSON-LD)
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dropzen',
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: "India's premier marketplace for verified e-commerce dropshipping leads, COD buyer order databases, and viral product analytics.",
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi']
    }
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dropzen',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/marketplace?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const jsonLdDataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Dropzen Pan-India Verified COD Dropshipping Buyer Leads Database',
    description: 'Authentic customer order records for high-converting e-commerce categories including Home & Kitchen, Health & Beauty, and Viral Gadgets.',
    url: `${siteUrl}/marketplace`,
    license: `${siteUrl}`,
    isAccessibleForFree: false,
    creator: {
      '@type': 'Organization',
      name: 'Dropzen'
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          id="ld-dataset"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }}
        />
        <AuthProvider>
          <PwaRegister />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
