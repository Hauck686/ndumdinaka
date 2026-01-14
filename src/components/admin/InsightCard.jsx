'use client'
import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const data = [
  { month: 'Jan', earnings: 480 },
  { month: 'Feb', earnings: 360 },
  { month: 'Mar', earnings: 340 },
  { month: 'Apr', earnings: 420 },
  { month: 'May', earnings: 300 },
  { month: 'Jun', earnings: 580 },
  { month: 'Jul', earnings: 400 },
  { month: 'Aug', earnings: 200 },
  { month: 'Sep', earnings: 310 },
  { month: 'Oct', earnings: 290 },
  { month: 'Nov', earnings: 460 },
  { month: 'Dec', earnings: 390 }
]

export default function InsightCard () {
  // Find the highest earning month for highlight
  const maxMonth = data.reduce(
    (max, item) => (item.earnings > max.earnings ? item : max),
    data[0]
  )

  return (
    <div className='chart-section'>
      <div className='chart-header'>
        <h3>Earnings</h3>
        <span>Summary</span>
      </div>
      <div className='chart-details'>
        <div>
          <span className='chart-label'>Total:</span>
          <span className='chart-value'>
            ${data.reduce((acc, cur) => acc + cur.earnings, 0)}
          </span>
        </div>
        <div>
          <span className='chart-label'>Best Month:</span>
          <span className='chart-value'>
            {maxMonth.month} (${maxMonth.earnings})
          </span>
        </div>
        <div>
          <span className='chart-label'>Average:</span>
          <span className='chart-value'>
            $
            {Math.round(
              data.reduce((acc, cur) => acc + cur.earnings, 0) / data.length
            )}
          </span>
        </div>
      </div>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray='3 3' stroke='#444' />
          <XAxis dataKey='month' stroke='#aaa' />
          <YAxis stroke='#aaa' />
          <Tooltip />
          <Bar
            dataKey='earnings'
            fill='url(#colorEarnings)'
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id='colorEarnings' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='#00ff99' stopOpacity={0.9} />
              <stop offset='95%' stopColor='#00ff99' stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
