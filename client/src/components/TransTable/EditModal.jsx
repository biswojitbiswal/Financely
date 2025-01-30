import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';
import { useAuth } from '../../Store/Auth';
import { useRefresh } from '../../Store/RefreshContext';

function EditModal({ item, type }) {
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        return date.toISOString().split("T")[0];
    };

    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    const [show, setShow] = useState(false);
    const [editData, setEditData] = useState({
        transName: item.transName || '',
        amount: item.amount || '',
        date: formatDateForInput(item.date) || '',
        tag: item.tag || '',
        paymentMode: item.paymentMode || '',
    });

    const {authorization} = useAuth();
    const {toggleRefresh} = useRefresh();

    const tags = type === 'Income'
        ? ['Salary', 'Freelancing', 'Investment', 'Bonus', 'Others']
        : ['Education', 'Food', 'Health', 'Investment', 'Recharge', 'Rent', 'Transport', 'Others'];

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    const handleEditInput = (e) => {
        setEditData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleEditSubmit = async() => {
        try {
            const response = await fetch(`${BASE_URL}/api/financely/transaction/edit/${item._id}`, {
                method: "PATCH",
                headers: {
                    Authorization: authorization,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editData)
            })
            const data = await response.json();
            // console.log(data);

            if(response.ok){
                toast.success("Transaction Updated");
                toggleRefresh()
                handleClose();
                setEditData({
                    transName: '',
                    amount: '',
                    date: '',
                    tag: '',
                    paymentMode: '',
                })
            } else {
                toast.error("Internal Backend Errors");
            }  
        } catch (error) {
            handleClose();
            console.log(error);
            toast.error("Error occured while edit!")
        }
    }


    return (
        <div>
            <Button variant='light' onClick={handleOpen} className='text-primary fs-3'>
                <i className="fa-solid fa-pen-to-square"></i>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Transaction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="text" name='transName' value={editData.transName} onChange={handleEditInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Amount:</Form.Label>
                            <Form.Control type="number" name='amount' value={editData.amount} onChange={handleEditInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Date:</Form.Label>
                            <Form.Control type="date" name='date' value={editData.date} onChange={handleEditInput} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tag:</Form.Label>
                            <Form.Select name='tag' value={editData.tag} onChange={handleEditInput} required>
                                <option value="">Select</option>
                                {tags.map((tag, idx) => (
                                    <option key={idx} value={tag}>{tag}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Payment Mode:</Form.Label>
                            <Form.Select name='paymentMode' value={editData.paymentMode} onChange={handleEditInput} required>
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
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Edit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditModal;
