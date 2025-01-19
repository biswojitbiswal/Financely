import React from 'react'
import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { toast } from 'react-toastify';
import { useAuth } from '../Store/Auth';
import '../App.css'


function Signup() {
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });


    const { setTokenInCookies, isLoggedInuser, refreshUser } = useAuth();
    const navigate = useNavigate()

    if (isLoggedInuser) {
        return <Navigate to="/" />
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
        try {
            const response = await fetch(`http://localhost:8000/api/finance/user/signup`, {
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
                setSignupData({ email: "", phone: "", password: "" });
                navigate("/");
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
                <div className='signin-page'>
                    <h1 className='text-primary mb-4'>Sign-Up Form</h1>
                    <Form onSubmit={handleSignupForm}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name: </Form.Label>
                            <Form.Control type="text" name='name' placeholder="Enter Your Name" required value={signupData.name} onChange={handleInputData} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" name='email' placeholder="Enter email" required value={signupData.email} onChange={handleInputData} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Mobile No.:</Form.Label>
                            <Form.Control type="number" name='phone' placeholder="Enter Mobile No." required value={signupData.phone} onChange={handleInputData} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name='password' placeholder="Password" required value={signupData.password} onChange={handleInputData} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                    <hr />
                    <Link style={{ textDecoration: "none" }} to="/signin">I have An Account! Sign in</Link>
                </div>
            </section>
        </>
    )
}

export default Signup
