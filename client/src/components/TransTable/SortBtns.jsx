import React from 'react'
import { Button } from 'react-bootstrap'

function SortBtns({handleSort, sortOption}) {
    
    return (
        <div className="d-flex gap-2 mb-2">
            <Button variant="outline-primary" onClick={() => handleSort('createdAt')} active={sortOption === 'createdAt'}>
                No Sort
            </Button>
            <Button variant="outline-primary" onClick={() => handleSort('date')} active={sortOption === 'date'}>
                Sort By Date
            </Button>
            <Button variant="outline-primary" onClick={() => handleSort('amount')} active={sortOption === 'amount'}>
                Sort By Amount
            </Button>
        </div>
    )
}

export default SortBtns
