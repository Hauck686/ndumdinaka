import ImageGalleryComponents from '../products/ImageGalleryComponents.jsx'
import React from 'react'

export default function page () {
  return (
    <div className='galleryGrid'>
      <ImageGalleryComponents src='/home_img.png' id='product-1' />
      <ImageGalleryComponents src='/home_img.png' id='product-1' />
      <ImageGalleryComponents src='/home_img.png' id='product-1' />
      <ImageGalleryComponents src='/home_img.png' id='product-1' />
      <ImageGalleryComponents src='/home_img.png' id='product-1' />
      <ImageGalleryComponents src='/home_img.png' id='product-1' />
    </div>
  )
}
