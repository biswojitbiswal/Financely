import React from 'react'
import './Cards.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function Cards({incomeModal, expenseModal, total, loading}) {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className='w-100 d-flex justify-content-between align-items-center gap-5'>
      <Card variant='light' border="light" className='p-1' style={{ flex: "1"}}>
      <Card.Body>
            <Card.Title className='fs-5 text-secondary'>Balance</Card.Title>
            {
              loading ? <Spinner size='sm' variant="primary" className='m-2' /> : <Card.Text className={`fs-4 fw-semibold ${total?.balance / total.income > 0.6 ? 'text-success' : total?.balance / total?.income > 0.4
                ? 'text-warning' : 'text-danger'}`}>{formatCurrency(total?.balance || 0)}</Card.Text>
            }
            <Button variant='primary' className='w-100 fs-5 fw-medium'>Reset Balance</Button>
          </Card.Body>
      </Card>
      <Card variant='light' border="light" className='p-1' style={{ flex: "1"}}>
      <Card.Body>
            <Card.Title className='fs-5 text-secondary'>Income</Card.Title>
            {
              loading ? <Spinner size='sm' variant="primary" className='m-2' /> : <Card.Text className='fs-4 text-success fw-semibold'>{formatCurrency(total?.income || 0)}</Card.Text>
            }
            <Button variant='primary' onClick={incomeModal} className='w-100 fs-5 fw-medium'>Add Income</Button>
          </Card.Body>
      </Card>
      <Card variant='light' border="light" className='p-1' style={{ flex: "1"}}>
      <Card.Body>
            <Card.Title className='fs-5 text-secondary'>Expense</Card.Title>
            {
              loading ? <Spinner size='sm' variant="primary" className='m-2' /> : <Card.Text className={`fs-4 fw-semibold ${total?.expense / total?.income < 0.4
                ? 'text-success' : total?.expense / total?.income < 0.6
                ? 'text-warning' : 'text-danger'}`}>{formatCurrency(total?.expense || 0)}</Card.Text>
            }
            <Button variant='primary' onClick={expenseModal} className='w-100 fs-5 fw-medium'>Add Expenses</Button>
          </Card.Body>
      </Card>
    </div>
  )
}

export default Cards
