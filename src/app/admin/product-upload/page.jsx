'use client'

import React, { useState } from 'react'
import ProductsTable from '@/components/admin/ProductsTable'
import { uploadToCloudinary } from '@/app/context/cloudinaryUpload'

export default function ProductEditor () {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [images, setImages] = useState([])
  const [price, setPrice] = useState('')
  const [size, setSize] = useState([])
  const [color, setColor] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [quantity, setQuantity] = useState('')
  const [tags, setTags] = useState('')
  const [products, setProducts] = useState([])
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload (e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await uploadToCloudinary(file)
      if (imageUrl) {
        setImages(prev => [...prev, imageUrl])
      } else {
        alert('Failed to upload image.')
      }
    } catch (err) {
      console.error(err)
      alert('Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  async function handlePublish () {
    if (
      !title ||
      !desc ||
      !price ||
      !category ||
      !brand ||
      !quantity ||
      !images.length
    ) {
      alert('Please fill in all required fields and upload at least one image.')
      return
    }

    const exists = products.find(
      p => p.name.toLowerCase() === title.toLowerCase()
    )
    if (exists) {
      alert('Product with this name already exists.')
      return
    }

    const newProduct = {
      name: title,
      description: desc,
      images,
      price: Number(price),
      sizes: Array.isArray(size) ? size : [size],
      color,
      category,
      brand,
      quantity: Number(quantity),
      tags: tags.split(',').map(t => t.trim())
    }

    try {
      console.log('Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProduct)
        }
      )

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Failed to publish product: ${errText}`)
      }

      const saved = await res.json()
      setProducts([...products, saved])
      resetForm()
      alert('✅ Product published successfully!')
    } catch (err) {
      console.error(err)
      alert('Error: ' + err.message)
    }
  }

  function resetForm () {
    setTitle('')
    setDesc('')
    setImages([])
    setPrice('')
    setSize('')
    setColor('#23272f')
    setCategory('')
    setBrand('')
    setQuantity('')
    setTags('')
  }

  return (
    <div className='product-editor-page'>
      <div className='product-editor-header'>
        <h4>Add New Product</h4>
        <div className='product-editor-actions'>
          <button className='publish-btn' onClick={handlePublish}>
            Publish Now
          </button>
        </div>
      </div>

      <div className='product-editor-main'>
        <div className='editor-left'>
          {/* Product Info */}
          <div className='editor-section'>
            <label>Product Information</label>
            <div className='input-group'>
              <input
                type='text'
                placeholder='Title'
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <textarea
                placeholder='Description'
                rows={3}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>
          </div>
          {/* Pictures */}
          <div className='editor-section'>
            <label>Pictures</label>
            <div className='editor-images'>
              {images.map((img, i) => (
                <div className='editor-thumb' key={i}>
                  <img src={img} alt='' />
                </div>
              ))}
              <div className='editor-thumb upload'>
                <label>
                  <input
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  {uploading ? 'Uploading...' : <span>+</span>}
                </label>
              </div>
            </div>
          </div>
          {/* Price & Quantity */}
          <div className='editor-section'>
            <label>Price & Stock</label>
            <div className='input-group'>
              <input
                type='number'
                min='1'
                placeholder='Price'
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
              <input
                type='number'
                min='1'
                placeholder='Quantity'
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </div>
          </div>
          {/* Category & Brand */}
          <div className='editor-section'>
            <label>Category & Brand</label>
            <div className='input-group'>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value=''>Select Category</option>
                <option value='Shirts'>Shirts</option>
                <option value='Jackets & Blousons'>Jackets & Blousons</option>
                <option value='Coats & Blazers'>Coats & Blazers</option>
                <option value='Trousers'>Trousers</option>
                <option value='Shoes'>Shoes</option>
                <option value='Accessories'>Accessories</option>
                <option value='Bags & Small Leather Goods'>
                  Bags and Small Leather Goods
                </option>
              </select>

              <input
                type='text'
                placeholder='Details '
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>
          </div>
          {/* sizes & colors */}
          <div>
            {/* ACCESSORIES — Colors + AO–E sizes */}
            {category === 'Accessories' && (
              <>
                {/* Colors */}
                <div className='editor-section'>
                  <label>Available Colors</label>

                  {(() => {
                    const defaultColors = [
                      '#fff',
                      '#000',
                      '#f00',
                      '#0f0',
                      '#00f',
                      '#ff0'
                    ]
                    const selectedColors = Array.isArray(color) ? color : []

                    const isValidHex = value =>
                      /^#([0-9A-F]{3}|[0-9A-F]{6})$/i.test(value)

                    const sanitizedSelected = selectedColors.filter(c =>
                      isValidHex(c)
                    )

                    const uniqueColors = Array.from(
                      new Set([...defaultColors, ...sanitizedSelected])
                    )

                    return (
                      <div className='colors-checkbox-group'>
                        {uniqueColors.map((option, index) => (
                          <label
                            key={`${option}-${index}`}
                            className='color-option'
                          >
                            <input
                              type='checkbox'
                              checked={sanitizedSelected.includes(option)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setColor([...sanitizedSelected, option])
                                } else {
                                  setColor(
                                    sanitizedSelected.filter(s => s !== option)
                                  )
                                }
                              }}
                            />
                            <span
                              className='color-preview'
                              style={{ backgroundColor: option }}
                            />
                            <span className='color-label'>
                              {option.toUpperCase()}
                            </span>
                          </label>
                        ))}
                      </div>
                    )
                  })()}

                  {/* Custom color picker */}
                  <div className='add-color-wrapper'>
                    <label>Add Custom Color</label>
                    <input
                      type='color'
                      onChange={e => {
                        const newColor = e.target.value.toLowerCase()
                        setColor(prev => {
                          const list = Array.isArray(prev) ? prev : []
                          return list.includes(newColor)
                            ? prev
                            : [...list, newColor]
                        })
                      }}
                    />
                  </div>
                </div>

                {/* Sizes for Accessories → AO–E */}
                <div className='editor-section'>
                  <label>Available Sizes</label>
                  <div className='sizes-checkbox-group'>
                    {['95cm', '100cm', '105cm', '110cm', '115cm', '120cm'].map(
                      option => (
                        <label key={option} className='size-option'>
                          <input
                            type='checkbox'
                            checked={
                              Array.isArray(size) && size.includes(option)
                            }
                            onChange={e => {
                              if (e.target.checked) {
                                setSize([...(size || []), option])
                              } else {
                                setSize(size.filter(s => s !== option))
                              }
                            }}
                          />
                          {option}
                        </label>
                      )
                    )}
                  </div>
                </div>
              </>
            )}
            {category === 'Shoes' && (
              <div className='editor-section'>
                <label>Available Sizes</label>
                <div className='sizes-checkbox-group'>
                  {['40', '41', '42', '43', '44', '45'].map(option => (
                    <label key={option} className='size-option'>
                      <input
                        type='checkbox'
                        checked={Array.isArray(size) && size.includes(option)}
                        onChange={e =>
                          e.target.checked
                            ? setSize([...(size || []), option])
                            : setSize(size.filter(s => s !== option))
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {category !== 'Accessories' &&
              category !== 'Shoes' &&
              category !== 'Bags & Small Leather Goods' && (
                <div className='editor-section'>
                  <label>Available Sizes</label>
                  <div className='sizes-checkbox-group'>
                    {['AO', 'A', 'B', 'C', 'D', 'E'].map(option => (
                      <label key={option} className='size-option'>
                        <input
                          type='checkbox'
                          checked={Array.isArray(size) && size.includes(option)}
                          onChange={e =>
                            e.target.checked
                              ? setSize([...(size || []), option])
                              : setSize(size.filter(s => s !== option))
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      <ProductsTable />
    </div>
  )
}
