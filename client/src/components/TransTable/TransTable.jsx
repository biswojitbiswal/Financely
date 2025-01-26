import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Store/Auth';
import { BASE_URL } from '../../../config';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Badge from 'react-bootstrap/Badge';

function TransTable() {
    const [transactions, setTransactions] = useState([]);
    const [sortOption, setSortOption] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");

    const { authorization } = useAuth();

    let timeoutId;

    const getAllTransaction = async (sortBy, sortOrder, search, filter) => {
        try {
            const response = await fetch(`${BASE_URL}/api/financely/transaction/get?sortBy=${sortBy}&sortOrder=${sortOrder}&search=${search}&filter=${filter}`, {
                method: "GET",
                headers: {
                    Authorization: authorization,
                }
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setTransactions(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSort = (option) => {
        const newSortOrder = sortOption === option && sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle between 'asc' and 'desc'
        setSortOption(option);
        setSortOrder(newSortOrder);
        getAllTransaction(option, newSortOrder, searchTerm, filterType);
    }

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            getAllTransaction(sortOption, sortOrder, value, filterType);
        }, 1000);
    }

    const handleFilterChange = (e) => {
        const filter = e.target.value
        setFilterType(filter);
        getAllTransaction(sortOption, sortOrder, searchTerm, filter)
    }

    useEffect(() => {
        getAllTransaction(sortOption, sortOrder, searchTerm, filterType);
    }, [sortOption, sortOrder, filterType]);

    return (
        <>
            <section className='my-2'>
                <div className="d-flex gap-2">
                    <Form.Control
                        type="text"
                        id="inputSearch"
                        aria-describedby="searchBlock"
                        placeholder='Search Here'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Form.Select aria-label="Default select example" onChange={handleFilterChange} className='w-25'>
                        <option value="">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </Form.Select>
                    

                </div>
                <div className="w-100 mt-2 p-2 d-flex flex-column justify-content-center rounded-2" style={{ backgroundColor: '#f1f1f1' }}>
                    <div className="my-2 d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" onClick={() => handleSort('createdAt')} active={sortOption === 'createdAt'}>
                                No Sort
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleSort('date')} active={sortOption === 'date'}>
                                Sort by Date
                            </Button>
                            <Button variant="outline-primary" onClick={() => handleSort('amount')} active={sortOption === 'amount'}>
                                Sort by Amount
                            </Button>
                        </div>
                        <div className='d-flex gap-2'>
                            <Button variant='primary'>Import</Button>
                            <Button variant='primary'>Export</Button>
                        </div>
                    </div>
                    <Table responsive="sm" className='text-center fs-5'>
                        <thead>
                            <tr className='fs-4'>
                                <th>SL No.</th>
                                <th>Name</th>
                                <th>Tag</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Type</th>
                                <th>Payment Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                transactions && transactions.length > 0 ? (
                                    transactions.map((item, index) => {
                                        return (
                                            <tr key={item._id}>
                                                <td>{index + 1}</td>
                                                <td>{item.transName}</td>
                                                <td>{item.tag}</td>
                                                <td>{new Date(item.date).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                                                <td className={`${item.transType === 'Income' ? 'text-success' : 'text-danger'}`}>{item.transType === 'Income' ? `+${item.amount.toLocaleString()}` : `-${item.amount.toLocaleString()}`}</td>
                                                <td><Badge className='p-2' bg={item.transType === 'Income' ? 'success' : 'danger'}>{item.transType}</Badge></td>
                                                <td><Badge className='p-2' bg="primary">{item.paymentMode}</Badge></td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">
                                            <Spinner animation="border" className='mt-2' variant="primary" />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </section>
        </>
    );
}

export default TransTable;
