import React from 'react'
import Form from 'react-bootstrap/Form'

function SearchFilter({handleSearch, handleFilterChange, searchTerm}) {
  return (
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
  )
}

export default SearchFilter
