import ContentPage from '@/components/FooterContent'
import React from 'react'

const ethosContent = [
  `Our products are crafted with intention, precision, and the exclusive use of exceptional natural materials. The philosophy of the house is rooted in creating enduring objects, pieces that preserve their beauty and function over time.`,
  `Each garment and accessory is designed to be treasured, cared for, and ultimately passed down, carrying its story from one generation to the next.`,
  `In alignment with this principle, certain items are offered solely through a reservation system operating on a first come, first served basis.`,
  `This approach safeguards exclusivity for our clients while allowing the house to regulate production responsibly and eliminate the waste associated with overproduction. Our supply and production processes are closely managed to ensure efficiency, minimize excess, and uphold a standard of environmental integrity throughout each stage of development.`,
  `Should a client choose to release an item, the house encourages doing so through responsible means such as certified recycling partners, charitable organizations, or other sustainable redistribution systems. Yet, even in the absence of such measures, our commitment to natural materials ensures that no item endures as waste. Every fiber, trim, and fastening is derived from nature and will, in a short time, return to it, gracefully reintegrating into the ecological cycle from which it began.`
]

export default function page () {
  return (
    <div className='content-page-header'>
      <ContentPage
        title=''
        content={ethosContent}
        footer={`©${new Date().getFullYear()} NAKACHI NDUMDI. All rights reserved.`}
      />
    </div>
  )
}
