import React from 'react'
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useAuth } from '../../Store/Auth';
import '../../App.css'
import { BASE_URL } from '../../../config';
import Google from '../Google/Google';


function Signup() {
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: '',
    });


    const { setTokenInCookies, isLoggedInuser, refreshUser } = useAuth();
    const navigate = useNavigate()

    if (isLoggedInuser) {
        return <Navigate to="/dashboard" />
    }

    const handleInputData = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value
        })
    }

    const handleSignupForm = async (e) => {
        e.preventDefault();
        // console.log(signupData)
        if(signupData.password === signupData.cpassword){
            try {
                const response = await fetch(`${BASE_URL}/api/financely/user/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(signupData)
                })
    
                const data = await response.json();
                // console.log(data);
    
                if (response.ok) {
                    toast.success("Signup Successful");
                    setTokenInCookies(data.token);
                    refreshUser();
                    setSignupData({ name: "", email: "", phone: "", password: "" });
                    navigate("/dashboard");
                } else {
                    toast.error(data.extraDetails ? data.extraDetails : data.message)
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            toast.error("Password & Confirm Password Should Be Match")
        }
    }


    return (
        <>
            <section id="form">
                <div className='signin-page bg-light'>
                    <h3 className='mb-4'>Sign Up On <span className='text-primary '>Financely</span></h3>
                    <Form onSubmit={handleSignupForm}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name: </Form.Label>
                            <Form.Control type="text" name='name' placeholder="Enter Your Name" required value={signupData.name} onChange={handleInputData} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" name='email' placeholder="Enter email" required value={signupData.email} onChange={handleInputData} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name='password' placeholder="Password" required value={signupData.password} onChange={handleInputData} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Confirm Password:</Form.Label>
                            <Form.Control type="password" name='cpassword' placeholder="Confirm Password" required value={signupData.cpassword} onChange={handleInputData} />
                        </Form.Group>
                        <Button variant="outline-primary" className='w-100 fs-5' type="submit">
                            Sign Up With Email & Password
                        </Button>
                    </Form>
                    <hr />
                    <div className='text-center'>
                        <Google />
                        <Link className='fs-5' style={{ textDecoration: "none" }} to="/">Already have An Account! Sign in</Link>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Signup
