import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Store/Auth';
import { BASE_URL } from '../../../config';
import ExportImport from './ExportImport';
import SortBtns from './SortBtns';
import SearchFilter from './SearchFilter';
import TransTable from './TransTable';
import { toast } from 'react-toastify';
import { useRefresh } from '../../Store/RefreshContext';


function Transaction() {
    const [transactions, setTransactions] = useState([]);
    const [sortOption, setSortOption] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");

    const { authorization } = useAuth();
    const {refresh} = useRefresh();

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
            // console.log(data);

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
    }, [sortOption, sortOrder, filterType, refresh]);

    return (
        <>
            <section className='my-2'>
                <SearchFilter handleSearch={handleSearch} handleFilterChange={handleFilterChange} searchTerm={searchTerm}  />
                
                <div className="w-100 mt-2 p-2 d-flex flex-column justify-content-center rounded-2" style={{ backgroundColor: '#f1f1f1' }}>
                    <div className="my-2 d-flex justify-content-between">
                        <SortBtns handleSort={handleSort} sortOption={sortOption} />

                        <ExportImport transactions={transactions} />
                    </div>
                    <TransTable transactions={transactions} 
                    />
                </div>
            </section>
        </>
    );
}

export default Transaction;
