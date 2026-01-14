import React from 'react'

export default function ImageGalleryComponents ({ src, id }) {
  return (
    <section className='showcase'>
      {/* Image + floating details */}
      <div className='imageWrapper'>
        <img src={src} alt={id} />
      </div>
    </section>
  )
}
