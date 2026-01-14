import React from 'react'
const featuredItems = [
  {
    name: 'Nimbus Recliner',
    price: '$2,500',
    type: 'Monthly Subscription',
    img: '/home_img.png'
  },
  {
    name: 'Vertex Meeting Table',
    price: '$2,500',
    type: 'Monthly Subscription',
    img: '/home_img.png'
  },
  {
    name: 'ZETA Chair',
    price: '$1,800',
    type: 'Monthly Subscription',
    img: '/home_img.png'
  },
  {
    name: 'Orbit Basic Table',
    price: '$1,800',
    type: 'Monthly Subscription',
    img: '/home_img.png'
  },
  {
    name: 'Elysium Chair',
    price: '$1,200',
    type: 'Monthly Subscription',
    img: '/home_img.png'
  }
]

export default function FeaturedItems () {
  return (
    <div>
      <div className='featured-section'>
        <div className='featured-header'>
          <h3>Featured Items</h3>
          <a href='#'>View All</a>
        </div>
        <ul className='featured-list'>
          {featuredItems.map((item, idx) => (
            <li key={idx} className='featured-item'>
              <img src={item.img} alt={item.name} />
              <div className='info'>
                <h4>{item.name}</h4>
                <p>Radiant Skin</p>
              </div>
              <div className='price'>
                <span>Starting at {item.price}</span>
                <small>{item.type}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
