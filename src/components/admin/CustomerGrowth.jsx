import React from 'react'
const countries = [
  { flag: '🇺🇸', name: 'United States', percent: 38, customers: 20489 },
  { flag: '🇬🇧', name: 'United Kingdom', percent: 27, customers: 14500 },
  { flag: '🇫🇷', name: 'France', percent: 20, customers: 10700 },
  { flag: '🇦🇷', name: 'Argentina', percent: 16, customers: 8500 }
]
export default function CustomerGrowth () {
  return (
    <section className='dashboard-card dashboard-customer-growth'>
      <div className='dashboard-card-header'>
        <span>Customer Growth</span>
        <select>
          <option>country</option>
        </select>
      </div>
      <div className='dashboard-card-desc'>of the week based on country</div>
      <div className='dashboard-customer-map'>
        <div className='map'>
          <span className='map-tooltip'>
            United States <br />
            <b>38%</b> <br />
            20,489 customer
          </span>
          {/* You can use a SVG map here for more realism */}
        </div>
        <div className='country-list'>
          {countries.map(c => (
            <div className='country-item' key={c.name}>
              <span className='country-flag'>{c.flag}</span>
              <span className='country-name'>{c.name}</span>
              <span className='country-percent'>{c.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
