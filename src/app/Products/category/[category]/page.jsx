'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import ProductCard from '@/components/products/ProductCard'
import SkeletonProductCard from '@/components/SkeletonProductCard'
import NewsletterComp from '@/components/NewsletterComp'

export default function CategoryPage () {
  const { category } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!category) return

    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Decode the URL param back into a readable category string
        const formattedCategory = decodeURIComponent(category)

        const res = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/products/products/categories?category=${encodeURIComponent(
            formattedCategory
          )}`
        )
        setProducts(res.data)
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  const renderContent = () => {
    if (loading) {
      return (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonProductCard key={index} />
          ))}
        </>
      )
    }

    if (products.length === 0) {
      return (
        <div style={{ height: '50vh', alignItems: 'center' }}>
          <p>No products found in {decodeURIComponent(category)}</p>
        </div>
      )
    }

    return products.map(product => (
      <ProductCard
        key={product._id}
        id={product._id}
        img1={product.images[0]}
        quantity={product.quantity}
        title={product.name}
        price={`$${product.price}`}
      />
    ))
  }

  return (
    <div>
      <div className='galleryGrid-two'>{renderContent()}</div>
      <div>
        <NewsletterComp />
      </div>
    </div>
  )
}
