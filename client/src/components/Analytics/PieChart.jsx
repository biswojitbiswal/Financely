import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { useAuth } from '../../Store/Auth';
import { Button, Spinner } from 'react-bootstrap'
import { BASE_URL } from '../../../config';
import { useRefresh } from '../../Store/RefreshContext';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

function PieChart() {
  const [timeRange, setTimeRange] = useState('monthly')
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { authorization } = useAuth();
  const {refresh} = useRefresh();

  const fetchDataPie = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/financely/transaction/expense/${timeRange}`, {
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
  }, [timeRange, refresh])

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
    <div className='bg-light p-2 gap-2 d-flex flex-column justify-content-between align-items-center' style={{ width: "33%" }}>
      <div className='d-flex justify-content-between w-100'>
        <h3 className='text-secondary'>Expense</h3>
        <div className='d-flex gap-2'>
          <Button variant='outline-primary' onClick={() => setTimeRange('weekly')} active={timeRange === 'weekly'}>Weekly</Button>
          <Button variant='outline-primary' onClick={() => setTimeRange('monthly')} active={timeRange === 'monthly'}>Monthly</Button>
          <Button variant='outline-primary' onClick={() => setTimeRange('yearly')} active={timeRange === 'yearly'}>Yearly</Button>
        </div>
        
      </div>
      <div className="w-100 h-100"  >
          {loading ? (
            <Spinner size='lg' variant='primary' />
          ) : (
            <Doughnut data={data} options={options} />
          )}
        </div>
    </div>
  )
}

export default PieChart
