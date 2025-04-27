import React from 'react'
import './Cards.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { BASE_URL } from '../../../config'
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { useDate } from '../../Store/DateContext';
import { useRefresh } from '../../Store/RefreshContext';


function Cards({ incomeModal, expenseModal, total, loading }) {

  const { authorization, setIsLoading } = useAuth();
  const { selectedYear, selectedMonth } = useDate();
  const { toggleRefresh } = useRefresh()


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleResetBalance = async () => {
    const isConfirmed = confirm("Are You Sure, You Want To Reset Your Balance For This Month? This Action Can't Be Undone.");

    if (!isConfirmed) {
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/financely/transaction/reset?year=${selectedYear}&month=${selectedMonth}`, {
        method: "DELETE",
        headers: {
          Authorization: authorization
        }
      })
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        toast.success("Balance Reset Successful");
        toggleRefresh();
      } else {
        toast.error(data.message || "Failed to reset balance");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || "Something went wrong");
    }
  }

  function generateDebitCardNumber() {
    let cardNumber = '';
    for (let i = 0; i < 16; i++) {
      cardNumber += Math.floor(Math.random() * 10).toString();
    }  

    const formattedNumber = cardNumber.match(/.{1,4}/g).join(' ');
    
    return formattedNumber;
  }

  return (
    <div className='w-100 summary-card'>
      <Card variant='light' border="light" className='p-1 summ-card' style={{
        flex: "1", height: '180px',
        background: 'linear-gradient(90deg,rgba(5, 5, 255, 1) 0%, rgba(13, 110, 253, 1) 100%)'
      }}>
        <Card.Body>
          <Card.Title className='fs-5 text-white balance-card'>
            <p className='card-number'>{generateDebitCardNumber() || `9853 3747 5884 5756`}</p>
            <p className='expiry-date'>{`${(new Date().getMonth() + 1).toString().padStart(2, '0')}/${new Date().getFullYear().toString().slice(-2)}`}</p>

          </Card.Title>
          {
            loading ? <Spinner size='sm' variant="primary" className='m-2' /> : <Card.Text className={`fs-4 fw-semibold ${total?.balance / total.income > 0.6 ? 'text-white' : total?.balance / total?.income > 0.4
              ? 'text-warning' : 'text-danger'}`}>{formatCurrency(total?.balance || 0)}</Card.Text>
          }
          <Button variant='light' onClick={handleResetBalance} className='w-100 fw-medium text-primary summ-btn'>Reset Balance</Button>
        </Card.Body>
      </Card>
      <Card variant='light' border="light" className='p-1 summ-card' style={{ flex: "1", height: '180px', }}>
        <Card.Body>
          <Card.Title className='fs-5 text-secondary'>Income</Card.Title>
          {
            loading ? <Spinner size='sm' variant="primary" className='m-2' /> : <Card.Text className='fs-4 text-success fw-semibold'>{formatCurrency(total?.income || 0)}</Card.Text>
          }
          <Button variant='primary' onClick={incomeModal} className='w-100 summ-btn fw-medium'>Add Income</Button>
        </Card.Body>
      </Card>
      <Card variant='light' border="light" className='p-1 summ-card' style={{ flex: "1", height: '180px', }}>
        <Card.Body>
          <Card.Title className='fs-5 text-secondary'>Expense</Card.Title>
          {
            loading ? <Spinner size='sm' variant="primary" className='m-2' /> : <Card.Text className={`fs-4 fw-semibold ${total?.expense / total?.income < 0.4
              ? 'text-success' : total?.expense / total?.income < 0.6
                ? 'text-warning' : 'text-danger'}`}>{formatCurrency(total?.expense || 0)}</Card.Text>
          }
          <Button variant='primary' onClick={expenseModal} className='w-100 summ-btn fw-medium'>Add Expenses</Button>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Cards
