import { Archivo_Black } from 'next/font/google'
import { apercu } from '../../public/fonts/apercu'
import RootClient from './RootClient'

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-archivo-black'
})

export const metadata = {
  title: 'NAKACHI NDUMDI',
  description:
    'NAKACHI NDUMDI was founded in 2021 by Walter Ndumdinakachi Ogbonna. Rooted in precise, refined menswear tailoring. Discover new volumes in ready-to-wear, footwear,bags and accessories. .',
  keywords: [
    'NAKACHI NDUMDI',
    'Walter Ndumdinakachi Ogbonna ',
    'refined menswear tailoring',
    'ready-to-wear outfits',
    'mens fashion',
    'womens fashion',
    'affordable fashion',
    'menswear',
    'custom jackets',
    'custom tailoring',
    'luxury shoes',
    'bespoke shoes',
    'bespoke clothing',
    'refined tailoring',
    'leather jackets',
    'men’s bag',
    'luxury bags',
    'leather pants',
    'Selvedge denim',
    'designer blazers',
    'designer bespoke',
    'luxury bespoke',
    'custom leather jacket',
    'bespoke blazer',
    'made to measure',
    'high end leather',
    'high end fashion'
  ],
  metadataBase: new URL('http://www.nakachindumdi.com'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'NAKACHI NDUMDI',
    description:
      'NAKACHI NDUMDI was founded in 2021 by Walter Ndumdinakachi Ogbonna. Rooted in precise, refined menswear tailoring. Discover new volumes in ready-to-wear, footwear,bags and accessories..',
    url: 'http://www.nakachindumdi.com',
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
      'NAKACHI NDUMDI was founded in 2021 by Walter Ndumdinakachi Ogbonna. Rooted in precise, refined menswear tailoring. Discover new volumes in ready-to-wear, footwear,bags and accessories..',
    images: ['https://i.postimg.cc/nzKWPzFJ/logo.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.png'
  }
}

export default function RootLayout ({ children }) {
  return (
    <html lang='en' className={`${apercu.variable} ${archivoBlack.variable}`}>
      <body>
        <RootClient>{children}</RootClient>
      </body>
    </html>
  )
}
