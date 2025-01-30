import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import {GoogleAuthProvider, signInWithPopup, getAuth} from '@firebase/auth'
import {app} from '../../Firebase.js'
import { useAuth } from '../../Store/Auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config';

function Google() {
    const [userData, setUserData] = useState({name : "", email: ""})

    const { setTokenInCookies, setUser } = useAuth();
    const navigate = useNavigate();

    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user) {
                toast.error("Google authentication failed.");
                return;
            }

            setUserData({
                name: user.displayName,
                email: user.email
            })

            await handleUserData(user.displayName, user.email, user.phoneNumber);
            
        } catch (error) {
            console.log(error);
            toast.error('An error occurred. Please try again later.', error);
        }
    }

    const handleUserData = async(name, email) => {
        try {
            const response = await fetch(`${BASE_URL}/api/financely/user/google`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email})
            })
    
            const data = await response.json();
            console.log(data);
            if(response.ok){
                toast.success('Sign In Successful')
                setTokenInCookies(data.token);
                setUser(data.user);
                navigate("/")
            }
        } catch (error) {
            console.log(error);
            toast.error('An error occurred. Please try again later.');
        }
    }
  return (
    <>
        <Button onClick={handleGoogleClick} variant="outline-primary" className='d-flex my-2 w-100 fs-5 align-items-center justify-content-center border-primary'>
           CONTINUE WITH GOOGLE
        </Button>
        
    </>
  )
}

export default Google
