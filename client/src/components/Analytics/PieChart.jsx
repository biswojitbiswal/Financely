import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../Store/Auth';
import { Button, Spinner } from 'react-bootstrap'
import { BASE_URL } from '../../../config';
import { useRefresh } from '../../Store/RefreshContext';
import { useDate } from '../../Store/DateContext';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function PieChart() {
  const [timeRange, setTimeRange] = useState('monthly')
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { authorization } = useAuth();
  const {refresh} = useRefresh();
  const {selectedYear, selectedMonth} = useDate();

  const isCurrentMonth = new Date().getMonth() === selectedMonth - 1

  const fetchDataPie = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/financely/transaction/expense/${timeRange}?year=${selectedYear}&month=${selectedMonth}`, {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      });
      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setPieData(data.chartData);
        setLoading(false);

      }
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataPie();
  }, [timeRange, refresh, selectedYear, selectedMonth])

  const data = {
    labels: pieData.map(item => item.label),
    datasets: [
      {
        data: pieData.map(item => item.value),
        backgroundColor: ['#F44336', '#3F51B5', '#9C27B0', '#00BCD4', '#8BC34A', '#FF9800', '#607D8B', '#795548'],
        hoverBackgroundColor: ['#F44336', '#3F51B5', '#9C27B0', '#00BCD4', '#8BC34A', '#FF9800', '#607D8B', '#795548']
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',

      },
    },
  };


  return (
    <div className='bg-light p-2 gap-2 pie-chart'>
      <div className='pie-header w-100'>
        <h3 className='text-secondary'>Expense</h3>
        <div className='d-flex gap-1'>
          {
            isCurrentMonth ? <Button variant='outline-primary' onClick={() => setTimeRange('weekly')} active={timeRange === 'weekly'}>Weekly</Button> : <></>
          }
          <Button variant='outline-primary' onClick={() => setTimeRange('monthly')} active={timeRange === 'monthly'}>Monthly</Button>
          <Button variant='outline-primary' onClick={() => setTimeRange('yearly')} active={timeRange === 'yearly'}>Yearly</Button>
        </div>
        
      </div>
      <div className="w-100 d-flex justify-content-center align-items-center pie-chart-graph"  >
          {loading ? (
            <Spinner size='lg' variant='primary' />
          ) : (
             pieData.length > 0 ? <Doughnut data={data} options={options} /> : <p className='fs-3 text-secondary'>No Expenses Found</p>
          )}
        </div>
    </div>
  )
}

export default PieChart
