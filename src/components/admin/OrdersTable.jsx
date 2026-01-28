'use client'
import React, { useEffect, useState } from 'react'
import { Search, Edit, X } from 'lucide-react'
import axios from 'axios'
import { useNotification } from '@/app/context/NotificationContext'

export default function OrdersTable () {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState([])
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({})
  const [search, setSearch] = useState('')
  const [bulkStatus, setBulkStatus] = useState('')
  const { //} = useNotification()

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders () {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrders(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(
    o =>
      o.userName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail?.toLowerCase().includes(search.toLowerCase())
  )

  function toggleSelect (id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function startEdit (order) {
    setEditing(order.orderId)
    setFormData({ ...order })
  }

  // ✅ Save single edit with notification
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
      fetchOrders()
    } catch (err) {
      console.error(err)
      showNotification('❌ Failed to update order.', 'error')
    }
  }

  // ✅ Bulk update with notification
  async function bulkUpdateStatus () {
    if (!bulkStatus) return
    if (!confirm(`Mark selected orders as ${bulkStatus}?`)) return
    const token = localStorage.getItem('token')
    try {
      await Promise.all(
        selected.map(orderId =>
          axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/orders/${orderId}/status`,
            { status: bulkStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      )
      fetchOrders()
      setSelected([])
      showNotification(`✅ ${selected.length} orders updated to ${bulkStatus}.`)
    } catch (err) {
      console.error(err)
      showNotification('❌ Bulk update failed.', 'error')
    }
  }

  if (loading) return <div className='loader'>Loading orders...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='orders'>
      <div className='orders__header'>
        <h2>👜 Orders</h2>
        <div className='orders__actions'>
          <div className='search'>
            <Search size={18} />
            <input
              type='text'
              placeholder='Search by user or email'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

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

          <button
            className='btn bulk'
            onClick={bulkUpdateStatus}
            disabled={!selected.length || !bulkStatus}
          >
            Apply to {selected.length} orders
          </button>
        </div>
      </div>

      <table className='orders__table'>
        <thead>
          <tr>
            <th>
              <input
                type='checkbox'
                onChange={e =>
                  setSelected(
                    e.target.checked ? filteredOrders.map(o => o.orderId) : []
                  )
                }
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <React.Fragment key={order.orderId}>
              <tr>
                <td>
                  <input
                    type='checkbox'
                    checked={selected.includes(order.orderId)}
                    onChange={() => toggleSelect(order.orderId)}
                  />
                </td>
                <td>{order.userName}</td>
                <td>{order.userEmail}</td>
                <td>${order.total}</td>
                <td>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className='actions'>
                  <button className='edit' onClick={() => startEdit(order)}>
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
              <tr className='order-items'>
                <td colSpan={7}>
                  <ul>
                    {order.items.map((item, idx) => (
                      <li key={idx} className='order-item'>
                        <img src={item.image} alt={item.name} />
                        <div>
                          <strong>{item.name}</strong>
                          <span>Qty: {item.quantity}</span>
                          <span>Size: {item.size}</span>
                          <span>${item.price}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {editing && (
        <div className='modal'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h3>Edit Order</h3>
              <button onClick={() => setEditing(null)} className='close-btn'>
                <X size={20} />
              </button>
            </div>
            <div className='modal-body'>
              <input type='text' value={formData.userName} readOnly />
              <input type='text' value={formData.userEmail} readOnly />
              <input type='text' value={formData.total} readOnly />
              <select
                value={formData.status}
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
            <div className='modal-actions'>
              <button onClick={() => setEditing(null)} className='cancel-btn'>
                Cancel
              </button>
              <button onClick={saveEdit} className='save-btn'>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
