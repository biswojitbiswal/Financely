import React from 'react'
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import '../../App.css'
import { BASE_URL } from '../../../config';
import Google from '../Google/Google';

function Signin() {
  const [signinData, setSignInData] = useState({
    email: "",
    password: "",
  })

  const {setTokenInCookies, isLoggedInuser, refreshUser } = useAuth()
  const navigate = useNavigate();

  if(isLoggedInuser){
    return <Navigate to="/dashboard" />
  }

  const handleInput = (e) => {
    setSignInData({
      ...signinData,
      [e.target.name]: e.target.value
    })
  }

  const handleSigninForm = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/financely/user/signin`, {
        method: "POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signinData)
      })
  
      const data = await response.json();
      // console.log(data);
  
      if(response.ok){
        toast.success("Signin Successful");
        setTokenInCookies(data.token);
        refreshUser();
        setSignInData({email: "", password: ""});
        navigate("/dashboard");
      } else {
        toast.error(data.extraDetails ? data.extraDetails : data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <section id="form">
      <div className="signin-page bg-light">
        <h3 className='mb-4'>Sign In On <span className='text-primary'>Financely</span></h3>
        <Form onSubmit={handleSigninForm}>
          <Form.Group className="mb-3" id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name='email' placeholder="Enter email" value={signinData.email} onChange={handleInput} required />
          </Form.Group>

          <Form.Group className="mb-3" id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' placeholder="Password" value={signinData.password} onChange={handleInput} required />
          </Form.Group>
          <Button variant="primary" className='w-100 fs-5' type="submit">
            Sign In With Email & Password
          </Button>
        </Form>
        <hr/>
        <div className='text-center'>
        <Google />
        <Link className='fs-5' style={{textDecoration: "none"}} to="/signup">Don't have an Account! Sign Up</Link>
        </div>
      </div>
      </section>
    </>
  )
}

export default Signin
