'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import SingleProductShowcase from '../../../components/products/SingleProductShowcase.jsx'
import DoubleProductShowcase from '../../../components/products/DoubleProductShowcase.jsx'

export default function Page () {
  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/products`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('❌ Error fetching products:', err))
  }, [])

  return (
    <div className='galleryGrid'>
      {products.map((product, index) => {
        const isFloating = index % 2 === 0 // even index = floating, odd index = double

        return isFloating ? (
          <SingleProductShowcase
            key={product._id}
            src={product.images[0]}
            id={product._id}
            name={product.name}
            tag={product.tags?.[0] || ''}
            description={product.description}
            price={`$${product.price}`}
          />
        ) : (
          <DoubleProductShowcase
            key={product._id}
            img1={product.images[0]}
            img2={product.images[1] || product.images[0]} // fallback in case only 1 image
            id={product._id}
            name={product.name}
            tag={product.tags?.[0] || ''}
            description={product.description}
            price={`$${product.price}`}
          />
        )
      })}
    </div>
  )
}
