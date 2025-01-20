import React from 'react'
import '../App.css'
import { useAuth } from '../Store/Auth'
import { useNavigate } from 'react-router-dom'


function Home() {
  const {isLoggedInuser} = useAuth()
  const navigate = useNavigate();

  if(!isLoggedInuser){
    navigate("/")
  }
  return (
    <>
      <section id="dashboard">
        <h1>This Is My Dashboard</h1>
      </section>
    </>
  )
}

export default Home
