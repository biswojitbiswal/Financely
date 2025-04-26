import React, { useState, useEffect } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { Line } from 'react-chartjs-2';
import { useAuth } from '../../Store/Auth';
import { Chart as ChartJS, CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { BASE_URL } from '../../../config';
import "chartjs-adapter-date-fns";
import { useRefresh } from '../../Store/RefreshContext';
import {useDate} from '../../Store/DateContext'


ChartJS.register(CategoryScale, LinearScale, PointElement, TimeScale, LineElement, Title, Tooltip, Legend);

function LineChart() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { authorization } = useAuth();
  const {selectedYear, selectedMonth} = useDate()
  const {refresh} = useRefresh();

  const isCurrentMonth = new Date().getMonth() === selectedMonth - 1
 

  const fetchDataAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/financely/transaction/income/${timeRange}?year=${selectedYear}&month=${selectedMonth}`, {
        method: "GET",
        headers: {
          Authorization: authorization,
        }
      });
      const data = await response.json();
      // console.log(data);

      if (response.ok) {
        setChartData(data.chartData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }

  }

  useEffect(() => {
    fetchDataAnalytics();
  }, [timeRange, refresh, selectedMonth, selectedYear]);

  const data = {
    datasets: [
      {
        label: 'Income',
        data: chartData.map(item => ({
          x: new Date(item.x),
          y: item.y,
        })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeRange === 'weekly' ? 'day' : timeRange === 'monthly' ? 'month' : 'year',
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Income",
        },
      },
    },
  };    
  
  

  return (
    <div className='bg-light p-2 line-chart'>
      <div className='d-flex justify-content-between w-100'>
        <h3 className='text-secondary'>Income</h3>
        <div className='d-flex gap-1'>
          {
            isCurrentMonth ? <Button variant='outline-primary' onClick={() => setTimeRange('weekly')} active={timeRange === 'weekly'}>Weekly</Button> : <></>

          }
          <Button variant='outline-primary' onClick={() => setTimeRange('monthly')} active={timeRange === 'monthly'}>Monthly</Button>
          <Button variant='outline-primary' onClick={() => setTimeRange('yearly')} active={timeRange === 'yearly'}>Yearly</Button>
        </div>
      </div>
      <div className='line-chart-graph'>
        {loading ? <Spinner size='lg' variant="primary" /> : chartData.length > 0 ? <Line data={data} options={options} /> : <p className='fs-3 text-secondary'>No Incomes Found</p>}
      </div>
    </div>
  )
}

export default LineChart
