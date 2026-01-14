import React from 'react'
const data = [
  { day: 'Sun', website: 600, ecommerce: 400 },
  { day: 'Mon', website: 800, ecommerce: 500 },
  { day: 'Tue', website: 900, ecommerce: 600 },
  { day: 'Wed', website: 700, ecommerce: 700 },
  { day: 'Thu', website: 850, ecommerce: 750 },
  { day: 'Fri', website: 1000, ecommerce: 800 },
  { day: 'Sat', website: 950, ecommerce: 850 }
]
export default function RevenueGrowth () {
  return (
    <section className='dashboard-card dashboard-revenue-growth'>
      <div className='dashboard-card-header'>
        <span>
          Revenue Growth <small>(USD)</small>
        </span>
        <a href='#'>View detail</a>
      </div>
      <div className='dashboard-card-desc'>
        of the week on website and compared with e-commerce
      </div>
      <div className='dashboard-bar-chart'>
        {data.map((d, idx) => (
          <div key={d.day} className='bar-group'>
            <div className='bar-label'>{d.day}</div>
            <div className='bar-bar-wrap'>
              <div
                className='bar-website'
                style={{ height: d.website / 10 + '%' }}
              />
              <div
                className='bar-ecommerce'
                style={{ height: d.ecommerce / 10 + '%' }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className='dashboard-bar-legend'>
        <span className='color-website'>Website</span>
        <span className='color-ecommerce'>E-commerce</span>
      </div>
    </section>
  )
}
