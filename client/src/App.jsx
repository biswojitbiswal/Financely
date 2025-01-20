import React from 'react'
import '../src/index.css'
import MyNavbar from './components/Navbar'
import Home from './components/Home'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Error from './components/Error'
import Signout from './components/Signout'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/dashboard' element={<Home />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signout' element={<Signout />} />
       
        <Route path='/*' element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
      
      
    </>
  )
}

export default App
