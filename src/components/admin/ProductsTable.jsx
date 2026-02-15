'use client'
import React, { useEffect, useState } from 'react'
import {
  Search,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import axios from 'axios'

export default function ProductsTable () {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState([]) // selected ids (can span pages)
  const [editing, setEditing] = useState(null) // id being edited
  const [formData, setFormData] = useState({})
  const [search, setSearch] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const pageSizeOptions = [10, 25, 50, 100]

  useEffect(() => {
    fetchProducts()
  }, [])

  // Reset to first page when search or pageSize changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search, pageSize])

  async function fetchProducts () {
    setLoading(true)
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/products`
      )
      setProducts(Array.isArray(res.data) ? res.data : res.data.items || [])
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Filter by search (client-side)
  const filteredProducts = products.filter(p =>
    String(p.name || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Clamp currentPage
  if (currentPage > totalPages) setCurrentPage(totalPages)

  const startIdx = (currentPage - 1) * pageSize
  const endIdx = startIdx + pageSize
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx)

  // Select toggle for single id
  function toggleSelect (id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Toggle select all on current page
  function toggleSelectPage (checked) {
    const pageIds = paginatedProducts.map(p => p._id)
    if (checked) {
      // add page ids (avoid duplicates)
      setSelected(prev => Array.from(new Set([...prev, ...pageIds])))
    } else {
      setSelected(prev => prev.filter(id => !pageIds.includes(id)))
    }
  }

  // Start editing
  function startEdit (product) {
    setEditing(product._id)
    setFormData({ ...product })
  }

  // Save edit
  async function saveEdit () {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${editing}`,
        formData
      )
      setEditing(null)
      await fetchProducts()
    } catch (err) {
      alert('❌ Update failed')
    }
  }

  // Delete
  async function deleteProduct (id) {
    if (!confirm('Delete this product?')) return
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`
      )
      setProducts(prev => prev.filter(p => p._id !== id))
      setSelected(prev => prev.filter(s => s !== id))
    } catch (err) {
      alert('❌ Delete failed')
    }
  }

  // Bulk delete
  async function bulkDelete () {
    if (!selected.length) return
    if (!confirm(`Delete ${selected.length} selected products?`)) return
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/bulk-delete`,
        { ids: selected }
      )
      setProducts(prev => prev.filter(p => !selected.includes(p._id)))
      setSelected([])
    } catch (err) {
      alert('❌ Bulk delete failed')
    }
  }

  // Pagination navigation helpers
  function goToPage (n) {
    const page = Math.min(Math.max(1, n), totalPages)
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderPageNumbers () {
    const windowSize = 5
    const pages = []
    let start = Math.max(1, currentPage - Math.floor(windowSize / 2))
    let end = Math.min(totalPages, start + windowSize - 1)
    if (end - start < windowSize - 1) {
      start = Math.max(1, end - windowSize + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('left-ellipsis')
    }

    for (let i = start; i <= end; i++) pages.push(i)

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('right-ellipsis')
      pages.push(totalPages)
    }

    return pages.map((p, idx) => {
      if (p === 'left-ellipsis' || p === 'right-ellipsis') {
        return (
          <button key={`e-${idx}`} className='page-ellipsis' disabled>
            ...
          </button>
        )
      }
      return (
        <button
          key={p}
          className={`page-btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => goToPage(p)}
        >
          {p}
        </button>
      )
    })
  }

  if (loading) return <div>Loading products...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='products'>
      {/* Header */}
      <div className='products__header'>
        <h2>Products</h2>
        <div className='products__actions'>
          <div className='search'>
            <Search size={18} />
            <input
              type='text'
              placeholder='Search'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className='pagination-controls'>
            <label>
              Show
              <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
              >
                {pageSizeOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              /page
            </label>

            <div className='page-nav'>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                title='Previous'
              >
                <ChevronLeft size={16} />
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                title='Next'
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              className='btn bulk'
              onClick={bulkDelete}
              disabled={!selected.length}
            >
              Bulk Delete ({selected.length})
            </button>
          </div>
        </div>
      </div>

      {/* TABLE WRAPPER WITH SCROLL */}
      <div className='table-wrapper'>
        {/* Table */}
        <table className='products__table'>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  onChange={e => toggleSelectPage(e.target.checked)}
                  checked={
                    paginatedProducts.length > 0 &&
                    paginatedProducts.every(p => selected.includes(p._id))
                  }
                />
              </th>
              <th>Product Name/SKU</th>
              <th>Created At</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Available Quantity</th>
              <th>Status</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 20 }}>
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map(p => (
                <tr key={p._id}>
                  <td>
                    <input
                      type='checkbox'
                      checked={selected.includes(p._id)}
                      onChange={() => toggleSelect(p._id)}
                    />
                  </td>
                  <td className='product-info'>
                    <img
                      src={p.images?.[0] || '/products/default.png'}
                      alt={p.name}
                    />
                    <div>
                      <strong>{p.name}</strong>
                      <span>{String(p._id).slice(-6).toUpperCase()}</span>
                    </div>
                  </td>
                  <td>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td>
                    {p.brand
                      ? p.brand.slice(0, 45) +
                        (p.brand.length > 45 ? '...' : '')
                      : '—'}
                  </td>
                  <td>{p.category || '—'}</td>
                  <td>
                    {p.quantity !== undefined
                      ? Number(p.quantity).toLocaleString()
                      : '—'}
                  </td>
                  <td>
                    <span
                      className={`status ${
                        p.quantity > 0 ? 'active' : 'inactive'
                      }`}
                    >
                      {p.quantity > 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='price'>${p.price}</td>
                  <td className='actions'>
                    <button className='edit' onClick={() => startEdit(p)}>
                      <Edit size={16} />
                    </button>
                    <button
                      className='delete'
                      onClick={() => deleteProduct(p._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination footer summary */}
      <div className='pagination-footer'>
        <div>
          Showing {startIdx + 1}–{Math.min(endIdx, totalItems)} of {totalItems}{' '}
          products
        </div>
        <div>
          Page {currentPage} / {totalPages}
        </div>
      </div>

      {/* Modal Edit */}
      {editing && (
        <div className='modal'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Edit Product</h3>
              <button onClick={() => setEditing(null)} className='close-btn'>
                <X size={20} />
              </button>
            </div>

            <div className='modal-body'>
              <input
                type='text'
                value={formData.name || ''}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder='Product Name'
              />
              <input
                type='number'
                value={formData.price || ''}
                onChange={e =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder='Price'
              />
              <input
                type='number'
                value={formData.quantity || ''}
                onChange={e =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder='Quantity'
              />
              <input
                type='text'
                value={formData.brand || ''}
                onChange={e =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                placeholder='Brand'
              />
              <input
                type='text'
                value={formData.category || ''}
                onChange={e =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder='Category'
              />
            </div>

            <div className='modal-actions'>
              <button onClick={() => setEditing(null)} className='cancel-btn'>
                Cancel
              </button>
              <button onClick={saveEdit} className='save-btn'>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
