import React from 'react'

export default function SkeletonProductCard () {
  return (
    <div className='card skeleton-card'>
      <div className='imageWrapper skeleton-image'></div>
      <div className='info'>
        <div className='skeleton-line skeleton-title'></div>
        <div className='skeleton-line skeleton-price'></div>
      </div>
    </div>
  )
}
