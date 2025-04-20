import React, { useState } from 'react';
import { useAuth } from '../../Store/Auth';
import { useDate } from '../../Store/DateContext';
import { Navbar, Button, Container, Nav, Modal, Form } from 'react-bootstrap';

function MyNavbar() {
  const [show, setShow] = useState(false);

  const { isLoggedInuser, authorization, user } = useAuth();
  const {selectedYear, selectedMonth, setselectedMonth, setSelectedYear} = useDate();

  const handleClose = (e) => setShow(false);
  const handleShow = (e) => setShow(true);

  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearAndMonth = async () => {
    // console.log(selectedYear, selectedMonth)
    handleClose();
  }

  return (
    <>
      <Navbar className="bg-primary">
        <Container className=''>
          <Navbar.Brand href="/dashboard" className='text-white fs-2'>Financely</Navbar.Brand>

          <ul className='d-flex gap-4 list-unstyled mb-0'>
            <li><Button variant='white' onClick={handleShow} className='text-white fs-4 btn-outline-primary'><i className="fa-solid fa-calendar-days"></i></Button></li>
            <li className='d-flex justify-content-center align-items-center'>
              {
                isLoggedInuser ? <Nav.Link href="/signout" className='text-white fs-4'>Sign Out</Nav.Link> : <Nav.Link href="/" className='text-white fs-4'>Sign In</Nav.Link>
              }
            </li>
          </ul>

          {
            show ? <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Select Time</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year:</label>
                  <Form.Select aria-label="Default select example" value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
                    <option>Select Year</option>
                    {
                      years.map((year, index) => {
                        return <option key={index} value={year}>{year}</option>
                      })
                    }
                  </Form.Select>

                  <label className="block text-sm font-medium text-gray-700">Month:</label>
                  <Form.Select aria-label="Default select example" value={selectedMonth} onChange={(e) => setselectedMonth(parseInt(e.target.value))}>
                    <option>Select Month</option>
                    {
                      months.map((month, index) => {
                        return <option key={index} value={index + 1}>{month}</option>
                      })
                    }
                  </Form.Select>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleYearAndMonth}>
                  Browse
                </Button>
              </Modal.Footer>
            </Modal> : ""
          }


        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
