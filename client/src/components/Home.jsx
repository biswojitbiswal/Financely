import React, { useEffect, useState } from 'react'
import '../App.css'
import { useAuth } from '../Store/Auth'
import { useNavigate } from 'react-router-dom'
import Cards from './DashComponent.jsx/Cards'
import TransactionModal from './Modal/TransactionModal'
import { BASE_URL } from '../../config'
import { toast } from 'react-toastify'
import Transaction from './TransTable/Transaction'
import Analytic from './Analytics/Analytic'
import {useRefresh} from '../Store/RefreshContext'

function Home() {
  const [modalType, setModalType] = useState(null);
  const [total, setTotal] = useState({
    current: 0,
    income: 0,
    expense: 0,
  });
  const [loading, setLoading] = useState(false);

  const { isLoggedInuser, authorization } = useAuth()
  const {refresh, toggleRefresh} = useRefresh();
  const navigate = useNavigate();

  if (!isLoggedInuser) {
    navigate("/")
  }

  const openIncomeModal = () => setModalType("Income")
  const openExpenseModal = () => setModalType("Expense");

  const totalSummary = async() => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/financely/transaction/summary/`, {
        method: "GET",
        headers: {
          Authorization: authorization,
        }
      })

      const data = await response.json()
      // console.log(data);

      if(response.ok){
        setTotal(data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred. While Calculating");
      console.log(error);
    }
  }

  const handleTransaction = async(formData) => {
    console.log("Handel Transactions")
    try {
      const response = await fetch(`${BASE_URL}/api/financely/transaction/add`, {
        method: "POST",
        headers: {
          Authorization: authorization,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json();
      console.log(data);

      if(response.ok){
        toast.success("Transaction Added");
        totalSummary();
        toggleRefresh()
      } else {
        toast.error("Transaction failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error)
    }
  }



  useEffect(() => {
    totalSummary()
  }, [refresh])

  return (
    <>
      <section id="dashboard">
        <Cards incomeModal={openIncomeModal} expenseModal={openExpenseModal} loading={loading} total={total} />
        {
          modalType && 
          <TransactionModal 
          show={!!modalType}
          onClose = {() => setModalType(null)}
          type={modalType}
          handleTransaction={handleTransaction}
        />
        }
        <Analytic />
        <Transaction />
      </section>
    </>
  )
}

export default Home;
