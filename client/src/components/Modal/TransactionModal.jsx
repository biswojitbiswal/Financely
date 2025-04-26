import React, { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify'
import { useDate } from '../../Store/DateContext';

function TransactionModal({ show, onClose, type, handleTransaction }) {
    const [formData, setFormData] = useState({
        transName: '',
        amount: '',
        date: '',
        tag: '',
        paymentMode: '',
        isRecurring: false,
        frequency: '',
        startDate: '',
        endDate: ''
    })

    const { selectedMonth, selectedYear } = useDate();

    useEffect(() => {
        if (show && selectedYear && selectedMonth) {
            let day = 1;
            const currentDate = new Date();

            if (selectedYear === currentDate.getFullYear() && selectedMonth === currentDate.getMonth() + 1) {
                day = currentDate.getDate();
            }

            const month = selectedMonth.toString().padStart(2, '0');
            const dayStr = day.toString().padStart(2, '0');
            const dateStr = `${selectedYear}-${month}-${dayStr}`;

            setFormData(prevState => ({
                ...prevState,
                date: dateStr,
                startDate: dateStr // Set start date same as transaction date
            }));
        }
    }, [show, selectedYear, selectedMonth]);

    const tags = type === 'Income'
        ? ['Salary', 'Freelancing', 'Investment', 'Bonus', 'Others'] : ['Education', 'Food', 'Health', 'Investment', 'Recharge', 'Rent', 'Transport', 'Bill', 'Others'];

    const frequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUATERLY', 'HALF_YEARLY', 'YEARLY'];

    const frequencyDisplayNames = {
        'DAILY': 'Daily',
        'WEEKLY': 'Weekly',
        'MONTHLY': 'Monthly',
        'QUATERLY': 'Quarterly',
        'HALF_YEARLY': 'Half-Yearly',
        'YEARLY': 'Yearly'
    };

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData({
            ...formData,
            [name]: newValue
        })
    }

    const handleSubmit = () => {
        if (!formData.transName || !formData.amount || !formData.date || !formData.tag || !formData.paymentMode) {
            toast.error("All Fields Required!");
            return;
        }

        // Check recurring fields if isRecurring is true
        if (formData.isRecurring && (!formData.frequency || !formData.startDate || !formData.endDate)) {
            toast.error("All recurring transaction fields are required!");
            return;
        }

        handleTransaction({ ...formData, type });
        setFormData({
            transName: '',
            amount: '',
            date: '',
            tag: '',
            paymentMode: '',
            isRecurring: false,
            frequency: '',
            startDate: '',
            endDate: ''
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

                        <Form.Group className="mb-4" controlId="recurring-switch">
                            <Form.Check
                                type="switch"
                                id="recurring-switch"
                                label="Is this a recurring transaction?"
                                name="isRecurring"
                                checked={formData.isRecurring}
                                onChange={handleInput}
                            />
                        </Form.Group>

                        {formData.isRecurring && (
                            <>
                                <Form.Group className="mb-3" controlId="frequency-select">
                                    <Form.Label>Frequency: </Form.Label>
                                    <Form.Select
                                        aria-label="Frequency select"
                                        className='w-100'
                                        name='frequency'
                                        value={formData.frequency}
                                        onChange={handleInput}
                                        required={formData.isRecurring}
                                    >
                                        <option value="">Select Frequency</option>
                                        {
                                            frequencies.map((freq, idx) => {
                                                return <option key={idx} value={freq}>{frequencyDisplayNames[freq]}</option>
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="start-date">
                                    <Form.Label>Start Date: </Form.Label>
                                    <Form.Control
                                        type="date"
                                        name='startDate'
                                        value={formData.startDate}
                                        onChange={handleInput}
                                        required={formData.isRecurring}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="end-date">
                                    <Form.Label>End Date: </Form.Label>
                                    <Form.Control
                                        type="date"
                                        name='endDate'
                                        value={formData.endDate}
                                        onChange={handleInput}
                                        required={formData.isRecurring}
                                    />
                                </Form.Group>
                            </>
                        )}

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