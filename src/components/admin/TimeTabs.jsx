import React from 'react'
const tabs = ['Last 24 hour', 'Last weeks', 'Last month', 'Last year']
export default function TimeTabs ({ activeTab, setActiveTab }) {
  return (
    <nav className='dashboard-tabs'>
      {tabs.map(tab => (
        <button
          key={tab}
          className={activeTab === tab ? 'active' : ''}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}
