'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function NotFound () {
  useEffect(() => {
    console.log('404 page mounted')
  }, [])

  return (
    <div className='flex flex-col items-center justify-center h-screen text-center px-4'>
      <h1 className='text-6xl font-bold text-red-600'>404</h1>
      <h2 className='text-2xl font-semibold mt-4'>Page Not Found</h2>
      <p className='mt-2 text-gray-500'>
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href='/'
        className='mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
      >
        Go Home
      </Link>
    </div>
  )
}
