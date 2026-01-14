import React from 'react'
const transactions = [
  {
    id: '#234342',
    item: 'Leather crop top & pant',
    date: '12 Jan',
    purchase: '$2,349',
    user: {
      name: 'Jenny Wilson',
      country: 'United States',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    detail: true
  },
  {
    id: '#25486',
    item: 'Female Tote Bag',
    date: '3 Jan',
    purchase: '$2,349',
    user: null,
    detail: true
  },
  {
    id: '#25489',
    item: 'Law Luxury Necklace',
    date: '4 Jan',
    purchase: '$2,047',
    user: null,
    detail: false
  },
  {
    id: '#25490',
    item: 'Men’s Shoes Leather',
    date: '2 Jan',
    purchase: '$1,939',
    user: null,
    detail: false
  }
]
export default function TopTransactions () {
  return (
    <section className='dashboard-card dashboard-top-transaction'>
      <div className='dashboard-card-header'>
        <span>Top Transactions</span>
        <a href='#'>View detail</a>
      </div>
      <div className='dashboard-card-desc'>
        of the week based on total purchase
      </div>
      <table className='dashboard-table'>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Item</th>
            <th>Date</th>
            <th>Purchase</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>
                {tx.user ? (
                  <div className='dashboard-table-user'>
                    <img src={tx.user.avatar} alt='' />
                    <div>
                      <span>{tx.id}</span>
                      <span>
                        {tx.user.name} <small>{tx.user.country}</small>
                      </span>
                    </div>
                  </div>
                ) : (
                  tx.id
                )}
              </td>
              <td>{tx.item}</td>
              <td>{tx.date}</td>
              <td>
                {tx.purchase}
                {tx.detail && (
                  <button className='dashboard-table-detail-btn'>
                    See detail
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
