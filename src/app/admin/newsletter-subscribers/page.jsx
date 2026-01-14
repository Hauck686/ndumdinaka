'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function NewslettersAdmin () {
  const [subs, setSubs] = useState([])

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletters`)
      .then(res => setSubs(res.data))
  }, [])

  return (
    <div className='admin'>
      <h1>Newsletter Subscribers</h1>

      <div className='table-wrapper'>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Gender</th>
              <th>Marketing</th>
              <th>Personalized</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(sub => (
              <tr key={sub._id}>
                <td data-label='Email'>{sub.email}</td>
                <td data-label='Gender'>{sub.gender}</td>
                <td data-label='Marketing'>
                  <span
                    className={`status ${sub.consentMarketing ? 'yes' : 'no'}`}
                  >
                    {sub.consentMarketing ? '✅' : '❌'}
                  </span>
                </td>
                <td data-label='Personalized'>
                  <span
                    className={`status ${
                      sub.consentPersonalized ? 'yes' : 'no'
                    }`}
                  >
                    {sub.consentPersonalized ? '✅' : '❌'}
                  </span>
                </td>
                <td data-label='Date'>
                  {new Date(sub.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
