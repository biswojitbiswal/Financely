import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap'
import './Profile.css'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';
import { useAuth } from '../../Store/Auth';

function PasswordReset() {
    const [show, setShow] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const {authorization} = useAuth();

    const handleResetPassword = async() => {
        if(newPassword === confirmPassword){
            const passwords = {
                oldPassword,
                newPassword,
            };

            try {
                const response = await fetch(`${BASE_URL}/api/financely/user/reset-password`, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: authorization,
                    },
                    body: JSON.stringify(passwords)
                })

                const data = await response.json();
                console.log(data);

                if(response.ok){
                    toast.success("Password updated successfully!");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    handleClose();
                } else {
                    toast.error(data.message || "Failed to update password");
                }
            } catch (error) {
                console.log(error)
                toast.error(error.message || "Something went wrong. Please try again.");
                handleClose();
            }
        } else {
            toast.error("New Password & Confirm Password Must Be Same")
        }
    }
    return (
        <div className='password-reset'>
            <Button onClick={handleShow} className='w-100 fs-4'>Reset Password</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Example@123" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Example@123" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Example@123" />
                        </Form.Group>
                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleResetPassword}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>


    )
}

export default PasswordReset
