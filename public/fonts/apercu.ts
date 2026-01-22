import localFont from 'next/font/local'

export const apercu = localFont({
  src: [
    {
      path: './apercu_regular_pro.otf',
      weight: '400',
      style: 'normal'
    },
    {
      path: './apercu_medium_pro.otf',
      weight: '500',
      style: 'normal'
    },
    {
      path: './apercu_bold_pro.otf',
      weight: '700',
      style: 'normal'
    },
    {
      path: './apercu_regular_italic_pro.otf',
      weight: '400',
      style: 'italic'
    }
  ],
  variable: '--font-apercu',
  display: 'swap'
})
