import React from 'react'

export default function SearchSkeleton () {
  return (
    <ul className='search-skeleton'>
      {Array.from({ length: 5 }).map((_, index) => (
        <li key={index} className='skeleton-item' />
      ))}
    </ul>
  )
}
