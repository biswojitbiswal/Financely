import React from 'react'
import LineChart from './LineChart'
import PieChart from './PieChart'

function Analytic() {
  return (
    <div className='d-flex mt-2 gap-2 charts'>
      <LineChart />
      <PieChart />
    </div>
  )
}

export default Analytic
