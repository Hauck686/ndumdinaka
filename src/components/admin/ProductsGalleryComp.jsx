import React from 'react'
export default function ProductsGalleryComp ({ images, setImages }) {
  // Simulated upload handler
  const handleAddImage = e => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const fileURLs = files.map(f => URL.createObjectURL(f))
    setImages([...images, ...fileURLs])
  }
  const handleRemove = idx => {
    setImages(images.filter((_, i) => i !== idx))
  }
  return (
    <div className='form-group'>
      <label>Pictures</label>
      <div className='gallery-row'>
        {images.map((img, idx) => (
          <div className='gallery-thumb' key={idx}>
            <img src={img} alt={`Product ${idx}`} />
            <button className='remove-btn' onClick={() => handleRemove(idx)}>
              ×
            </button>
          </div>
        ))}
        <label className='gallery-upload'>
          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleAddImage}
            style={{ display: 'none' }}
          />
          <span>+</span>
        </label>
      </div>
    </div>
  )
}
