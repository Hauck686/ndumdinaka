'use client'
import React, { useState, useEffect } from 'react'

export default function ImageSection ({
  images = [], // array of { src, width, height }
  interval = 3000 // default 3 seconds
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length)
      }, interval)
      return () => clearInterval(timer)
    }
  }, [images, interval])

  return (
    <div className='image-section'>
      {images.map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={`Image ${index + 1}`}
          style={{
            width: img.width || '100%',
            height: img.height || '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}
        />
      ))}
    </div>
  )
}
