import React from 'react'
import { Table, Spinner, Badge, Button } from 'react-bootstrap';
import EditModal from './EditModal';
import { BASE_URL } from '../../../config';
import { toast } from 'react-toastify';
import { useAuth } from '../../Store/Auth';
import { useRefresh } from '../../Store/RefreshContext';


function TransTable({ transactions }) {
    const {authorization} = useAuth();
    const {toggleRefresh} = useRefresh()
    
    const handleDelete = async(id) => {
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

            if(response.ok){
                toast.success("Transaction Deleted");
                toggleRefresh();
            }
        } catch (error) {
            console.log(error);
            toast.error("An Error Occured While Delete")
        }
    }
    

    return (
        <>
            <Table className='text-center fs-5 transaction-table'>
                <thead>
                    <tr className='fs-4'>
                        <th>SL No.</th>
                        <th>Name</th>
                        <th>Tag</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Payment Mode</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions && transactions.length > 0 ? (
                            transactions.map((item, index) => {
                                return (
                                    <tr key={item._id} className='m-2'>
                                        <td>{index + 1}</td>
                                        <td style={{minWidth: '110px'}}>{item.transName}</td>
                                        <td>{item.tag}</td>
                                        <td style={{minWidth: '130px'}}>{new Date(item.date).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                                        <td className={`${item.transType === 'Income' ? 'text-success' : 'text-danger'}`}>{item.transType === 'Income' ? `+${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `-${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                                        </td>
                                        <td><Badge className='p-2' bg={item.transType === 'Income' ? 'success' : 'danger'}>{item.transType}</Badge></td>
                                        <td><Badge className='p-2' bg="primary">{item.paymentMode}</Badge></td>
                                        <td><EditModal item={item} type={item.transType} /></td>
                                        <td><Button variant='light' onClick={() => handleDelete(item._id)} className='text-danger fs-3'><i className="fa-solid fa-trash"></i></Button></td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center text-secondary fs-3">
                                    <div><i className="fa-solid fa-file fs-1"></i></div>
                                    <p>Transactions Not Found</p>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
                
            </Table>
        </>
    )
}

export default TransTable
