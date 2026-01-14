'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function CookiesAdmin () {
  const [cookies, setCookies] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookies`)
      .then(res => setCookies(res.data))
  }, [])

  return (
    <div className='admin'>
      <h1>Cookie Consents</h1>

      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>IP</th>
              <th>Accepted</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {cookies.map(c => (
              <tr key={c._id}>
                <td data-label='IP'>{c.ip}</td>
                <td data-label='Accepted'>
                  <span className={`status ${c.accepted ? 'yes' : 'no'}`}>
                    {c.accepted ? '✅' : '❌'}
                  </span>
                </td>
                <td data-label='Date'>
                  {new Date(c.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
