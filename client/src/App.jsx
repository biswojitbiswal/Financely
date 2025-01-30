import React from 'react'
import '../src/index.css'
import MyNavbar from './components/Navbar/Navbar'
import Home from './components/Home/Home'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
import Error from './components/Error/Error'
import Signout from './components/Signout/Signout'
import Footer from './components/Footer/Footer'
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
