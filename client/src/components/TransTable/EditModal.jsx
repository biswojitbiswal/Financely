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

    // const formatDateForDisplay = (dateString) => {
    //     if (!dateString) return "";
    //     const date = new Date(dateString);
    //     if (isNaN(date)) return "";
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const year = date.getFullYear();
    //     return `${day}-${month}-${year}`;
    // };

    const [show, setShow] = useState(false);
    const [editData, setEditData] = useState({
        transName: item.transName || '',
        amount: item.amount || '',
        date: formatDateForInput(item.date) || '',
        tag: item.tag || '',
        paymentMode: item.paymentMode || '',
        isRecurring: item.isRecurring || false,
        // Only set frequency, startDate, and endDate if it's a recurring transaction
        frequency: item.isRecurring ? (item.frequency || '') : '',
        startDate: item.isRecurring ? (item.startDate ? formatDateForInput(item.startDate) : '') : '',
        endDate: item.isRecurring ? (item.endDate ? formatDateForInput(item.endDate) : '') : '',
    });

    const { authorization } = useAuth();
    const { toggleRefresh } = useRefresh();

    const tags = type === 'Income'
        ? ['Salary', 'Freelancing', 'Investment', 'Bonus', 'Others']
        : ['Education', 'Food', 'Health', 'Investment', 'Recharge', 'Rent', 'Transport', 'Others'];

    // Define frequencies and display names
    const frequencies = ['DAILY', 'WEEKLY', 'MONTHLY', 'QUATERLY', 'HALF_YEARLY', 'YEARLY'];

    const frequencyDisplayNames = {
        'DAILY': 'Daily',
        'WEEKLY': 'Weekly',
        'MONTHLY': 'Monthly',
        'QUATERLY': 'Quarterly',
        'HALF_YEARLY': 'Half-Yearly',
        'YEARLY': 'Yearly'
    };

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    const handleEditInput = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditSubmit = async () => {
        // console.log("Edit Data:", editData);
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

            if (response.ok) {
                toast.success("Transaction Updated");
                toggleRefresh();
                handleClose();
            } else {
                toast.error("Internal Backend Errors");
            }
        } catch (error) {
            handleClose();
            console.log(error);
            toast.error("Error occured while edit!")
        } finally{
            toggleRefresh()
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

                        {/* For recurring transactions, show frequency and date range */}
                        {editData.isRecurring && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Frequency:</Form.Label>
                                    <Form.Select
                                        name='frequency'
                                        value={editData.frequency}
                                        onChange={handleEditInput}
                                        required
                                    >
                                        <option value="">Select Frequency</option>
                                        {frequencies.map((freq, idx) => (
                                            <option key={idx} value={freq}>{frequencyDisplayNames[freq]}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name='startDate'
                                        value={editData.startDate}
                                        onChange={handleEditInput}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date:</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name='endDate'
                                        value={editData.endDate}
                                        onChange={handleEditInput}
                                    />
                                </Form.Group>
                            </>
                        )}
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