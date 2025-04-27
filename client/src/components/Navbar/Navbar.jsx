import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../Store/Auth';
import { useDate } from '../../Store/DateContext';
import { Navbar, Button, Container, Nav, Modal, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { 
  EllipsisVertical, 
  Home, 
  User, 
  FileText, 
  BarChart, 
  Bell, 
  Settings, 
  LogOut ,
  Timer
} from 'lucide-react';

function MyNavbar() {
  const [show, setShow] = useState(false);
  const [eclipse, setEclipse] = useState(false);
  const menuRef = useRef(null);

  const { isLoggedInuser, authorization, user } = useAuth();
  const {selectedYear, selectedMonth, setselectedMonth, setSelectedYear} = useDate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEclipseShow = () => {
    setEclipse(!eclipse);
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setEclipse(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleYearAndMonth = async () => {
    // console.log(selectedYear, selectedMonth)
    handleClose();
  };

  const menuItems = [
    { name: 'Home', href: '/dashboard', icon: <Home size={20} /> },
    {name: 'Recurring', href: '/recurring', icon: <Timer size={20} />},
    { name: 'Profile', href: '/profile', icon: <User size={20} /> },
    // { name: 'Reports', href: '/reports', icon: <FileText size={20} /> },
    // { name: 'Analytics', href: '/analytics', icon: <BarChart size={20} /> },
    // { name: 'Notifications', href: '/notifications', icon: <Bell size={20} /> },
    // { name: 'Settings', href: '/settings', icon: <Settings size={20} /> },
    { 
      name: isLoggedInuser ? 'Sign Out' : 'Sign In', 
      href: isLoggedInuser ? '/signout' : '/', 
      icon: <LogOut size={20} /> 
    },
  ];

  return (
    <>
      <Navbar className="bg-primary fixed-top">
        <Container className=''>
          <Navbar.Brand href="/dashboard" className='text-white fs-2'>Financely</Navbar.Brand>

          <ul className='d-flex gap-4 list-unstyled mb-0'>
            <li>
              <Button 
                variant='white' 
                onClick={handleShow} 
                className='text-white fs-4 btn-outline-primary'
              >
                <i className="fa-solid fa-calendar-days"></i>
              </Button>
            </li>
            <li className='d-flex justify-content-center align-items-center position-relative' ref={menuRef}>
              <div 
                onClick={handleEclipseShow} 
                className="cursor-pointer d-flex align-items-center justify-content-center" 
                style={{ cursor: 'pointer' }}
              >
                <EllipsisVertical size={30} className='text-white' />
              </div>
              
              {eclipse && (
                <div className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow-lg" style={{ 
                  top: '40px', 
                  width: '220px', 
                  zIndex: 1000,
                  right: 0
                }}>
                  {menuItems.map((item, index) => (
                    <NavLink 
                      key={index} 
                      to={item?.href} 
                      className={({ isActive }) => 
                        `d-flex align-items-center px-4 py-2 text-decoration-none ${isActive ? 'active' : 'text-dark'}`
                      }
                      onClick={() => setEclipse(false)}
                    >
                      <span className="me-2 text-primary">{item?.icon}</span>
                      {item?.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year:</label>
            <Form.Select 
              aria-label="Default select example" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              <option>Select Year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </Form.Select>

            <label className="block text-sm font-medium text-gray-700 mt-3">Month:</label>
            <Form.Select 
              aria-label="Default select example" 
              value={selectedMonth} 
              onChange={(e) => setselectedMonth(parseInt(e.target.value))}
            >
              <option>Select Month</option>
              {months.map((month, index) => (
                <option key={index} value={index + 1}>{month}</option>
              ))}
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
      </Modal>
    </>
  );
}

export default MyNavbar;