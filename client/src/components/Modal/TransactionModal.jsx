import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import {toast} from 'react-toastify'

function TransactionModal({show, onClose, type, handleTransaction}) {
    const [formData, setFormData] = useState({
        transName: '',
        amount: '',
        date: '',
        tag: '',
        paymentMode: ''
    })

    const tags = type === 'Income'
    ? ['Salary', 'Freelancing', 'Investment', 'Bonus', 'Others'] : ['Education', 'Food', 'Health', 'Investment', 'Recharge', 'Rent', 'Transport', 'Others'];

    const handleInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = () => {
        if(!formData.transName || !formData.amount || !formData.date || !formData.tag || !formData.paymentMode){
            toast.error("All Fields Required!");
            return;
        }
        handleTransaction({...formData, type});
        setFormData({
            transName: '',
            amount: '',
            date: '',
            tag: '',
            paymentMode: ''
        })
        onClose();
    }

    
  return (
    <div>
      <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add {type}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name: </Form.Label>
                            <Form.Control type="text" placeholder="John Doe" name='transName' value={formData.transName} onChange={handleInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Amount: </Form.Label>
                            <Form.Control type="number" placeholder="1,00,000" name='amount' value={formData.amount} onChange={handleInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Date: </Form.Label>
                            <Form.Control type="date" placeholder="25-03-2001" name='date' value={formData.date} onChange={handleInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Tag: </Form.Label>
                            <Form.Select aria-label="Default select example" className='w-100' name='tag' value={formData.tag} onChange={handleInput} required>
                                <option value="">Select</option>
                                {
                                    tags.map((tag, idx) => {
                                        return <option key={idx} value={tag}>{tag}</option>
                                    })
                                }
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Payment Mode: </Form.Label>
                            <Form.Select aria-label="Default select example" name='paymentMode' value={formData.paymentMode} onChange={handleInput} className='w-100' required>
                                <option value="">Select</option>
                                <option value="Cash">Cash</option>
                                <option value="UPI">UPI</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Debit Card">Debit Card</option>
                                
                            </Form.Select>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-primary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} >
                        ADD
                    </Button>
                </Modal.Footer>
            </Modal>
    </div>
  )
}

export default TransactionModal
