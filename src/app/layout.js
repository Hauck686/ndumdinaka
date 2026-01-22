import { apercu } from '../../public/fonts/apercu'
import RootClient from './RootClient'

export const metadata = {
  title: 'NAKACHI NDUMDI',
  description:
    'NAKACHI NDUMDI offers premium fashion, custom designs, ready-to-wear outfits and fast nationwide delivery in .',
  keywords: [
    'NAKACHI NDUMDI',
    'online fashion store ',
    'custom clothing',
    'ready-to-wear outfits',
    'mens fashion',
    'womens fashion',
    'affordable fashion '
  ],
  metadataBase: new URL('https://nakachi.netlify.app'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'NAKACHI NDUMDI',
    description:
      'NAKACHI NDUMDI offers premium fashion, custom designs, ready-to-wear outfits and fast nationwide delivery in.',
    url: 'https://nakachi.netlify.app',
    siteName: 'NAKACHI NDUMDI',
    images: [
      {
        url: 'https://i.postimg.cc/nzKWPzFJ/logo.png',
        width: 1200,
        height: 630,
        alt: 'NAKACHI NDUMDI Logo'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NAKACHI NDUMDI',
    description:
      'NAKACHI NDUMDI offers premium fashion, custom designs, ready-to-wear outfits and fast nationwide delivery in.',
    images: ['https://i.postimg.cc/nzKWPzFJ/logo.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png'
  }
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en' className={apercu.variable}>
      <body>
        <RootClient>{children}</RootClient>
      </body>
    </html>
  )
}
