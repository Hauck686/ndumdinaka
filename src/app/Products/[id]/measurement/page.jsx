'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import MeasurementForm from '@/components/MeasurementForm/MeasurementForm'

const CATEGORY_TO_MEASUREMENT_TYPE = [
  { type: 'Shirts', keywords: ['shirt', 'shirts'] },
  {
    type: 'Suits',
    keywords: [
      'jacket',
      'blouson',
      'blousons',
      'coat',
      'blazer',
      'suit',
      'suits'
    ]
  },
  { type: 'Trousers', keywords: ['trouser', 'trousers', 'pants'] },
  { type: 'Dresses', keywords: ['dress', 'dresses', 'gown'] },
  { type: 'Native', keywords: ['native', 'kaftan', 'agbada', 'senator'] }
]

function mapCategoryToMeasurementType (category) {
  if (!category) return null
  const c = String(category).toLowerCase()
  for (const m of CATEGORY_TO_MEASUREMENT_TYPE) {
    if (m.keywords.some(k => c.includes(k))) return m.type
  }
  return null
}

export default function ProductMeasurementPage () {
  const { id } = useParams()
  const [initialType, setInitialType] = useState('Suits')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct () {
      try {
        if (!id) return
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/products/${id}`
        )
        const product = res.data
        // attempt to derive type from product fields
        const candidates = [
          product.category,
          product.categoryName,
          product.type,
          product.collection,
          product.label
        ]
        const candidate = candidates.find(
          c => typeof c === 'string' && c.trim()
        )
        const mapped = mapCategoryToMeasurementType(candidate)
        const valid = ['Suits', 'Shirts', 'Trousers', 'Native', 'Dresses']
        const exact =
          candidate &&
          valid.find(v => v.toLowerCase() === candidate.toLowerCase())
        setInitialType(mapped || exact || 'Suits')
      } catch (err) {
        // fallback to Suits
        setInitialType('Suits')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading)
    return <div style={{ padding: 24 }}>Loading measurement step…</div>

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {' '}
      <MeasurementForm productId={id} initialType={initialType} />
    </div>
  )
}
