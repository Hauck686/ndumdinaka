import Link from 'next/link'
import React from 'react'

export default function ProductCard ({
  img1,
  img2,
  title,
  price,
  id,
  quantity
}) {
  return (
    <div className='productCard'>
      <div className='imageWrapper'>
        {/* RESERVE OVERLAY */}
        {quantity === 0 && <div className='reserve-overlay'>Reserved</div>}

        <Link href={`/Products/id/${id}`} className='card'>
          <img src={img1} alt={title} className='img' />
        </Link>
      </div>

      <div className='info'>
        <p>{title}</p>
        <span>{price}</span>
      </div>
    </div>
  )
}
