import React from 'react'
export default function ProductList ({ products }) {
  if (!products.length) return null
  return (
    <div className='product-list-box'>
      <h3>Created Products</h3>
      <div className='product-list'>
        {products.map((p, idx) => (
          <div className='product-item' key={idx}>
            <img src={p.images[0]} alt={p.title} />
            <div className='product-item-info'>
              <strong>{p.title}</strong>
              <span>${p.price}</span>
              <span>Size: {p.size}</span>
              <span
                className='product-item-color'
                style={{ background: p.color }}
              />
              <p className='product-item-desc'>{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
