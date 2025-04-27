import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';
import { useAuth } from '../../Store/Auth';
import EditModal from '../TransTable/EditModal';
import { Button } from 'react-bootstrap';
import { useRefresh } from '../../Store/RefreshContext';
import { RotateCw, Tag, Calendar, Clock, PauseCircle, PlayCircle } from 'lucide-react'
import './Recurring.css';

function Recurring() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [isActive, setIsActive] = useState(false);

    const { authorization } = useAuth();
    const { toggleRefresh } = useRefresh()
    

    const getAllRecurringTransactions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/financely/transaction/recurring`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authorization
                }
            });

            const data = await response.json();
            console.log('Recurring transactions:', data);

            if (response.ok) {
                setTransactions(data);
            } else {
                toast.error('Failed to fetch transactions. Please try again later.');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Error fetching transactions. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAllRecurringTransactions();
    }, []);

    const handleStatus = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/financely/transaction/recurring/${id}/toggle-status`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authorization,
                },
            });
    
            const data = await response.json();
            console.log(data);
    
            if (response.ok) {
                toast.success(data.message || "Status updated successfully");
                getAllRecurringTransactions(); // Refresh the list to show updated status
            } else {
                toast.error(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error("An error occurred while updating status");
        }
    }

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to Delete");

        if (!confirmDelete) return;

        try {
            const response = await fetch(`${BASE_URL}/api/financely/transaction/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: authorization,
                },
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.success("Transaction Deleted");
                getAllRecurringTransactions();
            }
        } catch (error) {
            console.log(error);
            toast.error("An Error Occured While Delete")
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount, type) => {
        const formattedAmount = amount.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR'
        });
        return type === 'Income' ? (
            <span className="recurring-amount-income">+{formattedAmount}</span>
        ) : (
            <span className="recurring-amount-expense">-{formattedAmount}</span>
        );
    };

    const getFrequencyBadge = (frequency) => {
        const badgeClass = {
            DAILY: 'recurring-badge-daily',
            WEEKLY: 'recurring-badge-weekly',
            MONTHLY: 'recurring-badge-monthly',
            QUARTERLY: 'recurring-badge-quarterly',
            HALF_YEARLY: 'recurring-badge-half-yearly',
            YEARLY: 'recurring-badge-yearly'
        };

        return (
            <span className={`badge recurring-badge ${badgeClass[frequency] || 'bg-secondary'}`}>
                {frequency.replace('_', ' ')}
            </span>
        );
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="badge recurring-badge recurring-badge-active">
                <PlayCircle size={12} /> Active
            </span>
        ) : (
            <span className="badge recurring-badge recurring-badge-inactive">
                <PauseCircle size={12} /> Inactive
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="recurring-loader-container">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }



    return (
        <div className="container-fluid">
            <div className="recurring-table-wrapper">
                <div className="recurring-page-header">
                    <h2 className="recurring-header-title">
                        <RotateCw className="recurring-header-icon" size={24} />
                        Recurring Transactions
                    </h2>
                </div>

                <div className="table-responsive px-2">
                    <table className="table table-hover mb-0 recurring-table">
                        <thead className="table-light">
                            <tr>
                                <th scope="col" className="text-uppercase text-muted">
                                    Transaction
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Amount
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Frequency
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Start Date
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    End Date
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Last Generated
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Status
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Actions
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Edit
                                </th>
                                <th scope="col" className="text-uppercase text-muted">
                                    Delete
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td>
                                        <div className="recurring-transaction-name">
                                            <div className="recurring-transaction-title">
                                                <span>{transaction.transName}</span>
                                                <span title="Recurring Transaction">
                                                    <RotateCw className="recurring-icon" size={14} />
                                                </span>
                                            </div>
                                            <div className="recurring-tag-row">
                                                <Tag size={12} />
                                                {transaction.tag}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {formatAmount(transaction.amount, transaction.transType)}
                                    </td>
                                    <td>
                                        {getFrequencyBadge(transaction.frequency)}
                                    </td>
                                    <td>
                                        <div className="recurring-date-group">
                                            <Calendar size={14} />
                                            {formatDate(transaction.startDate)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="recurring-date-group">
                                            <Calendar size={14} />
                                            {formatDate(transaction.endDate)}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="recurring-date-group">
                                            <Clock size={14} />
                                            {formatDate(transaction.lastGeneratedDate)}
                                        </div>
                                    </td>
                                    <td>
                                        {getStatusBadge(transaction.isActive)}
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => handleStatus( transaction._id)}
                                            variant='light'
                                            className='text-danger fs-2 pt-0'
                                            title={transaction.isActive ? 'Pause' : 'Resume'}
                                        >
                                            {transaction.isActive ? <i className="fa-solid fa-pause text-primary"></i> : <i className="fa-solid fa-play text-danger"></i>}
                                        </Button>
                                    </td>
                                    <td><EditModal item={transaction} type={transaction.transType} /></td>

                                    <td><Button variant='light' onClick={() => handleDelete(transaction._id)} className='text-danger fs-3'><i className="fa-solid fa-trash"></i></Button></td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transactions.length === 0 && (
                    <div className="recurring-no-data">
                        No recurring transactions found
                    </div>
                )}
            </div>
        </div>
    );
}

export default Recurring