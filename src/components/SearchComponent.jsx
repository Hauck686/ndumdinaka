'use client'
import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation' // ✅ for navigation
import SearchSkeleton from './SearchSkeleton'

export default function SearchComponent ({ onClose }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const cancelTokenRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (query.length > 0) {
      const fetchSuggestions = async () => {
        setLoading(true)

        if (cancelTokenRef.current) {
          cancelTokenRef.current.cancel('Cancelled due to new request')
        }
        cancelTokenRef.current = axios.CancelToken.source()

        try {
          const res = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/products/products/search?q=${encodeURIComponent(query)}`,
            { cancelToken: cancelTokenRef.current.token }
          )
          setSuggestions(res.data)
        } catch (error) {
          if (!axios.isCancel(error)) {
            console.error('Error fetching search suggestions:', error)
            setSuggestions([])
          }
        } finally {
          setLoading(false)
        }
      }

      fetchSuggestions()
    } else {
      setSuggestions([])
    }
  }, [query])

  const handleSuggestionClick = productId => {
    router.push(`/Products/id/${productId}`) // ✅ Navigate to product details page
    onClose()
  }

  return (
    <div className='search-overlay'>
      <div className='search-box'>
        <div className='search-header'>
          <input
            type='text'
            placeholder='Search...'
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className='search-suggestions'>
          {loading && <SearchSkeleton />}

          {!loading && query.length === 0 && (
            <ul>
              {/* <li>Blue JACKETS & BLOUSONS</li>
              <li>Denim jeans</li>
              <li>Cargo fl tops</li>
              <li>Women tops</li>
              <li>Men tops</li>
              <li>Nakachi Steeze</li> */}
            </ul>
          )}

          {!loading && query.length > 0 && suggestions.length === 0 && (
            <p>No results found for "{query}"</p>
          )}

          {!loading && suggestions.length > 0 && (
            <ul>
              {suggestions.map(suggestion => (
                <li
                  key={suggestion._id}
                  onClick={() => handleSuggestionClick(suggestion._id)} // ✅ pass id
                >
                  {suggestion.name}
                  {suggestion.category && (
                    <span className='category-label'>
                      {' '}
                      in {suggestion.category}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
