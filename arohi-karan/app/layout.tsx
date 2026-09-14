import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-jost',
})

// Plain JS string with a real ampersand. Never write &amp; here: Next escapes
// for transport and the DOM renders the single character.
const TITLE = 'Arohi & Karan · 2 February 2027 · Jaipur'
const DESCRIPTION =
  'Two days of celebration at The Raj Palace, Jaipur, this February. Kindly reply by 15 December 2026.'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://arohi-and-karan.example'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    siteName: TITLE,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: '#FBF6EC',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {/* The arch, defined once. objectBoundingBox units so it scales with
            whatever element references it. Never animate this path. */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
          <defs>
            <clipPath id="arch" clipPathUnits="objectBoundingBox">
              <path
                d="M0,1 L0,0.45
                   C0.00,0.36 0.05,0.32 0.11,0.34
                   C0.07,0.25 0.13,0.17 0.22,0.17
                   C0.19,0.09 0.32,0.02 0.50,0.00
                   C0.68,0.02 0.81,0.09 0.78,0.17
                   C0.87,0.17 0.93,0.25 0.89,0.34
                   C0.95,0.32 1.00,0.36 1.00,0.45
                   L1,1 Z"
              />
            </clipPath>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  )
}
