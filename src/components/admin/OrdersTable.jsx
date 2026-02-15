'use client'
import React, { useEffect, useState } from 'react'
import { Search, Edit, X, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import axios from 'axios'
import { useNotification } from '@/app/context/NotificationContext'

export default function OrdersTable () {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState([])
  const [editing, setEditing] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [expandedRows, setExpandedRows] = useState({})
  const [formData, setFormData] = useState({})
  const [search, setSearch] = useState('')
  const [bulkStatus, setBulkStatus] = useState('')
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchAllOrders()
  }, [])

  // ✅ Fetch ALL orders from admin endpoint
  async function fetchAllOrders () {
    const token = localStorage.getItem('token')
    setLoading(true)
    setError(null)

    try {
      let res
      try {
        res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        if (err.response?.status === 404) {
          res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/orders`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        } else {
          throw err
        }
      }

      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data.orders || []

      if (!Array.isArray(ordersData)) {
        throw new Error('Invalid response format')
      }

      setOrders(ordersData)
      console.log(`✅ Loaded ${ordersData.length} orders`)
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err)
      setError(
        err.response?.data?.message || err.message || 'Failed to load orders'
      )
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ Filter orders
  const filteredOrders = orders.filter(o => {
    const searchLower = search.toLowerCase()
    return (
      o.userName?.toLowerCase().includes(searchLower) ||
      o.userEmail?.toLowerCase().includes(searchLower) ||
      o.orderId?.toLowerCase().includes(searchLower)
    )
  })

  // ✅ Toggle row expansion
  function toggleRowExpansion (orderId) {
    setExpandedRows(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  // ✅ Toggle single order selection
  function toggleSelect (id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // ✅ Toggle select all
  function toggleSelectAll (checked) {
    if (checked) {
      setSelected(filteredOrders.map(o => o.orderId))
    } else {
      setSelected([])
    }
  }

  // ✅ Start editing
  function startEdit (order) {
    setEditing(order.orderId)
    setFormData({ ...order })
  }

  // ✅ View full order details
  function viewOrderDetails (order) {
    setViewing(order)
  }

  // ✅ Save edit
  async function saveEdit () {
    const token = localStorage.getItem('token')
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/orders/${editing}/status`,
        { status: formData.status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEditing(null)
      showNotification('✅ Order updated successfully!', 'success')
      fetchAllOrders()
    } catch (err) {
      console.error('❌ Update failed:', err)
      showNotification(
        err.response?.data?.message || '❌ Failed to update order',
        'error'
      )
    }
  }

  // ✅ Bulk update status
  async function bulkUpdateStatus () {
    if (!bulkStatus) {
      showNotification('⚠️ Please select a status', 'error')
      return
    }
    if (!selected.length) {
      showNotification('⚠️ Please select orders', 'error')
      return
    }

    if (!confirm(`Update ${selected.length} order(s) to ${bulkStatus}?`)) return

    const token = localStorage.getItem('token')
    setLoading(true)

    try {
      const updatePromises = selected.map(orderId =>
        axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/orders/${orderId}/status`,
          { status: bulkStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )

      await Promise.all(updatePromises)

      showNotification(
        `✅ ${selected.length} order(s) updated to ${bulkStatus}!`,
        'success'
      )
      setSelected([])
      setBulkStatus('')
      await fetchAllOrders()
    } catch (err) {
      console.error('❌ Bulk update failed:', err)
      showNotification(
        err.response?.data?.message || '❌ Failed to update orders',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className='orders'>
        <div className='loader'>⏳ Loading all orders...</div>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className='orders'>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div
            style={{
              color: '#e60023',
              marginBottom: '1rem',
              fontSize: '1.1rem'
            }}
          >
            ❌ {error}
          </div>
          <button
            onClick={fetchAllOrders}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'linear-gradient(135deg, #d4af37, #c19e35)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='orders'>
      {/* Header */}
      <div className='orders__header'>
        <h2>
          📦 All Orders
          <span
            style={{
              fontSize: '0.85rem',
              marginLeft: '0.5rem',
              color: '#8a8a8a'
            }}
          >
            ({filteredOrders.length}/{orders.length})
          </span>
        </h2>
        <div className='orders__actions'>
          {/* Search */}
          <div className='search'>
            <Search size={18} />
            <input
              type='text'
              placeholder='Search user, email, or order ID'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Status Select */}
          <select
            value={bulkStatus}
            onChange={e => setBulkStatus(e.target.value)}
            className='bulk-select'
          >
            <option value=''>-- Select Status --</option>
            <option value='pending'>Pending</option>
            <option value='paid'>Paid</option>
            <option value='shipped'>Shipped</option>
            <option value='delivered'>Delivered</option>
            <option value='cancelled'>Cancelled</option>
          </select>

          {/* Bulk Apply Button */}
          <button
            className='btn bulk'
            onClick={bulkUpdateStatus}
            disabled={!selected.length || !bulkStatus || loading}
          >
            Apply ({selected.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <table className='orders__table'>
        <thead>
          <tr>
            <th></th>
            <th>
              <input
                type='checkbox'
                onChange={e => toggleSelectAll(e.target.checked)}
                checked={
                  selected.length === filteredOrders.length &&
                  filteredOrders.length > 0
                }
              />
            </th>
            <th>User</th>
            <th>Email</th>
            <th>Total</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ color: '#8a8a8a' }}>
                  {orders.length === 0
                    ? '📭 No orders in the system'
                    : `📭 No orders found for "${search}"`}
                </div>
              </td>
            </tr>
          ) : (
            filteredOrders.map(order => (
              <React.Fragment key={order.orderId}>
                {/* Main Order Row */}
                <tr className={expandedRows[order.orderId] ? 'expanded' : ''}>
                  <td className='expand-btn'>
                    <button
                      onClick={() => toggleRowExpansion(order.orderId)}
                      title='View details'
                    >
                      {expandedRows[order.orderId] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </td>
                  <td>
                    <input
                      type='checkbox'
                      checked={selected.includes(order.orderId)}
                      onChange={() => toggleSelect(order.orderId)}
                    />
                  </td>
                  <td>{order.userName || 'Unknown User'}</td>
                  <td>{order.userEmail || 'N/A'}</td>
                  <td style={{ fontWeight: '600' }}>
                    ${order.total?.toFixed(2) || '0.00'}
                  </td>
                  <td>
                    <span className={`status ${order.status || 'pending'}`}>
                      {order.status || 'pending'}
                    </span>
                  </td>
                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className='actions'>
                    <button
                      className='view'
                      onClick={() => viewOrderDetails(order)}
                      title='View full details'
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className='edit'
                      onClick={() => startEdit(order)}
                      title='Edit order status'
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>

                {/* Expanded Details Row */}
                {expandedRows[order.orderId] && (
                  <tr className='details-row'>
                    <td colSpan={8}>
                      <div className='order-details-inline'>
                        {/* Items */}
                        <div className='details-section'>
                          <h4>📦 Order Items</h4>
                          <div className='items-grid'>
                            {order.items?.map((item, idx) => (
                              <div key={idx} className='item-card'>
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    onError={e =>
                                      (e.target.style.display = 'none')
                                    }
                                  />
                                )}
                                <div className='item-info'>
                                  <strong>{item.name}</strong>
                                  {item.quantity && (
                                    <span>Qty: {item.quantity}</span>
                                  )}
                                  {item.size && <span>Size: {item.size}</span>}
                                  {item.price && (
                                    <span className='price'>
                                      ${item.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        {order.shippingAddress && (
                          <div className='details-section'>
                            <h4>📍 Shipping Address</h4>
                            <div className='address-card'>
                              <p>
                                <strong>
                                  {order.shippingAddress.fullName}
                                </strong>
                              </p>
                              <p>{order.shippingAddress.addressLine1}</p>
                              {order.shippingAddress.addressLine2 && (
                                <p>{order.shippingAddress.addressLine2}</p>
                              )}
                              <p>
                                {order.shippingAddress.city},{' '}
                                {order.shippingAddress.state}{' '}
                                {order.shippingAddress.zip}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                              <p className='contact'>
                                📧 {order.shippingAddress.email}
                              </p>
                              <p className='contact'>
                                📱 {order.shippingAddress.phone}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Order Summary */}
                        <div className='details-section'>
                          <h4>📋 Order Summary</h4>
                          <div className='summary-grid'>
                            <div className='summary-item'>
                              <span className='label'>Order ID:</span>
                              <span className='value'>
                                {order.orderId?.slice(-8).toUpperCase()}
                              </span>
                            </div>
                            <div className='summary-item'>
                              <span className='label'>Payment Method:</span>
                              <span className='value'>
                                {order.paymentMethod || 'N/A'}
                              </span>
                            </div>
                            <div className='summary-item'>
                              <span className='label'>Status:</span>
                              <span className={`status ${order.status}`}>
                                {order.status}
                              </span>
                            </div>
                            <div className='summary-item'>
                              <span className='label'>Total Amount:</span>
                              <span className='value price'>
                                ${order.total?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div className='modal'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Edit Order #{editing.slice(-8).toUpperCase()}</h3>
              <button onClick={() => setEditing(null)} className='close-btn'>
                <X size={20} />
              </button>
            </div>

            <div className='modal-body'>
              <div>
                <label>Customer Name</label>
                <input
                  type='text'
                  value={formData.userName || ''}
                  readOnly
                  style={{ background: '#f5f3ef' }}
                />
              </div>

              <div>
                <label>Email Address</label>
                <input
                  type='text'
                  value={formData.userEmail || ''}
                  readOnly
                  style={{ background: '#f5f3ef' }}
                />
              </div>

              <div>
                <label>Order Total</label>
                <input
                  type='text'
                  value={`$${formData.total?.toFixed(2) || '0.00'}`}
                  readOnly
                  style={{ background: '#f5f3ef' }}
                />
              </div>

              <div>
                <label>Order Status</label>
                <select
                  value={formData.status || 'pending'}
                  onChange={e =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value='pending'>Pending</option>
                  <option value='paid'>Paid</option>
                  <option value='shipped'>Shipped</option>
                  <option value='delivered'>Delivered</option>
                  <option value='cancelled'>Cancelled</option>
                </select>
              </div>
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

      {/* Full Order Details Modal */}
      {viewing && (
        <div className='modal modal-details'>
          <div className='modal-content-large'>
            <div className='modal-header'>
              <h3>Order Details #{viewing.orderId?.slice(-8).toUpperCase()}</h3>
              <button onClick={() => setViewing(null)} className='close-btn'>
                <X size={20} />
              </button>
            </div>

            <div className='modal-details-body'>
              {/* Customer Info */}
              <div className='detail-section'>
                <h4>👤 Customer Information</h4>
                <div className='info-grid'>
                  <div className='info-row'>
                    <span className='label'>Name:</span>
                    <span className='value'>{viewing.userName}</span>
                  </div>
                  <div className='info-row'>
                    <span className='label'>Email:</span>
                    <span className='value'>{viewing.userEmail}</span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className='detail-section'>
                <h4>📋 Order Information</h4>
                <div className='info-grid'>
                  <div className='info-row'>
                    <span className='label'>Order ID:</span>
                    <span className='value'>{viewing.orderId}</span>
                  </div>
                  <div className='info-row'>
                    <span className='label'>Status:</span>
                    <span className={`status ${viewing.status}`}>
                      {viewing.status}
                    </span>
                  </div>
                  <div className='info-row'>
                    <span className='label'>Created Date:</span>
                    <span className='value'>
                      {new Date(viewing.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className='info-row'>
                    <span className='label'>Payment Method:</span>
                    <span className='value'>
                      {viewing.paymentMethod || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className='detail-section'>
                <h4>📦 Items</h4>
                <div className='items-list'>
                  {viewing.items?.map((item, idx) => (
                    <div key={idx} className='item-detail'>
                      {item.image && <img src={item.image} alt={item.name} />}
                      <div className='item-detail-info'>
                        <strong>{item.name}</strong>
                        <div className='item-specs'>
                          <span>Price: ${item.price?.toFixed(2)}</span>
                          <span>Quantity: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                        <div className='item-total'>
                          Subtotal: ${(item.price * item.quantity)?.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {viewing.shippingAddress && (
                <div className='detail-section'>
                  <h4>📍 Shipping Address</h4>
                  <div className='address-detail'>
                    <p className='address-name'>
                      {viewing.shippingAddress.fullName}
                    </p>
                    <p>{viewing.shippingAddress.addressLine1}</p>
                    {viewing.shippingAddress.addressLine2 && (
                      <p>{viewing.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {viewing.shippingAddress.city},{' '}
                      {viewing.shippingAddress.state}{' '}
                      {viewing.shippingAddress.zip}
                    </p>
                    <p>{viewing.shippingAddress.country}</p>
                    <div className='contact-info'>
                      <p>📧 {viewing.shippingAddress.email}</p>
                      <p>📱 {viewing.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className='detail-section summary-section'>
                <h4>💰 Order Summary</h4>
                <div className='summary-detail'>
                  <div className='summary-row'>
                    <span>Subtotal:</span>
                    <span>${viewing.total?.toFixed(2)}</span>
                  </div>
                  <div className='summary-row highlight'>
                    <span>Total Amount:</span>
                    <span>${viewing.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='modal-footer'>
              <button
                onClick={() => setViewing(null)}
                className='close-full-btn'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
