import React, { useState } from 'react'
const colors = ['#23272f', '#e7e7fa', '#dbd5f4', '#c9fbc1']
const sizes = ['S', 'M', 'L']

export default function ProductPreview ({
  title,
  desc,
  images,
  price,
  size,
  setSize,
  color,
  setColor
}) {
  const [imgIdx, setImgIdx] = useState(0)
  return (
    <div className='product-preview-card'>
      <div className='preview-image-area'>
        {images.length ? (
          <img src={images[imgIdx]} alt={title} />
        ) : (
          <div className='preview-image-placeholder'>No Image</div>
        )}
        {images.length > 1 && (
          <div className='preview-image-dots'>
            {images.map((_, i) => (
              <button
                key={i}
                className={imgIdx === i ? 'active' : ''}
                onClick={() => setImgIdx(i)}
              />
            ))}
          </div>
        )}
      </div>
      <div className='preview-title-price'>
        <h3>{title}</h3>
        <span className='preview-price'>${price || '0'}</span>
      </div>
      <div className='preview-size-color'>
        <div className='preview-size'>
          Size:
          {sizes.map(s => (
            <button
              key={s}
              className={size === s ? 'active' : ''}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <div className='preview-color'>
          Color:
          {colors.map(c => (
            <button
              key={c}
              className={color === c ? 'active' : ''}
              style={{ background: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>
      <button className='preview-cart-btn'>Add To Cart</button>
      <div className='preview-desc'>{desc}</div>
    </div>
  )
}
