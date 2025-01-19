import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../Store/Auth';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';

function MyNavbar() {
  const expandValue = ['sm', 'md', 'lg', 'xl', 'xxl'][3];

  const { isLoggedInuser, user } = useAuth();

  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffCanvas(false);
  const handleShowOffCanvas = () => setShowOffCanvas(true);

  

  return (
    <>
      <Navbar
        key={expandValue}
        expand={expandValue}
        className="p-2"
        style={{ backgroundColor: 'hsl(210, 56%, 93%)' }}
      >
        <Container fluid>
          <Navbar.Brand className="fs-1 text-primary d-flex justify-content-center align-items-center">
            <Link to="/" style={{textDecoration: "none", marginRight: "1rem"}}>{user ? user.name: 'Guest'}</Link>
          </Navbar.Brand>
          
          <Navbar.Toggle
            className={`text-primary border-primary`}
            onClick={handleShowOffCanvas}
            aria-controls={`offcanvasNavbar-expand-${expandValue}`}
          >
            <i className="fa-solid fa-bars"></i>
          </Navbar.Toggle>
          <Navbar.Offcanvas
            show={showOffCanvas}
            onHide={handleCloseOffCanvas}
            id={`offcanvasNavbar-expand-${expandValue}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expandValue}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title
                id={`offcanvasNavbarLabel-expand-${expandValue}`}
                className="text-primary fs-2"
              >
                {user ? user.name: 'Guest'};
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav
                className="justify-content-end flex-grow-1 pe-3"
                variant="underline"
                defaultActiveKey="/"
              >
                <Nav.Item>
                  <Nav.Link
                    as={NavLink}
                    to="/"
                    eventKey="link-1"
                    className="me-3 fs-4 text-primary"
                    onClick={handleCloseOffCanvas}
                  >
                    Home
                  </Nav.Link>
                </Nav.Item>


                {isLoggedInuser ? (
                  <Nav.Item>
                    <Nav.Link
                      as={NavLink}
                      to="/signout"
                      eventKey="link-2"
                      className="me-3 fs-4 text-primary"
                      onClick={handleCloseOffCanvas}
                    >
                      Signout
                    </Nav.Link>
                  </Nav.Item>
                ) : (
                  <>
                    <Nav.Item>
                      <Nav.Link
                        as={NavLink}
                        to="/signin"
                        eventKey="link-3"
                        className="me-3 fs-4 text-primary"
                        onClick={handleCloseOffCanvas}
                      >
                        Signin
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        as={NavLink}
                        to="/signup"
                        eventKey="link-4"
                        className="me-3 fs-4 text-primary"
                        onClick={handleCloseOffCanvas}
                      >
                        Signup
                      </Nav.Link>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
