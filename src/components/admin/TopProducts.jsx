import React from 'react'
const products = [
  {
    name: 'Denim Jacket with White Feathers',
    sold: '240+',
    img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=128&q=80'
  },
  {
    name: 'T-shirt Navy',
    sold: '220+',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&w=128&q=80'
  },
  {
    name: 'Sweatshirt',
    sold: '180+',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=128&q=80'
  }
]
export default function TopProducts () {
  return (
    <section className='dashboard-card dashboard-top-product'>
      <div className='dashboard-card-header'>
        <span>Top Product</span>
        <a href='#'>View more</a>
      </div>
      <div className='dashboard-card-desc'>
        top 3 of the week based on total sold
      </div>
      <div className='dashboard-product-list'>
        {products.map(p => (
          <div key={p.name} className='dashboard-product-item'>
            <img src={p.img} alt={p.name} />
            <div>
              <span>{p.name}</span>
              <span>{p.sold}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
