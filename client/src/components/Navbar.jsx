import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../Store/Auth';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function MyNavbar() {
  const { isLoggedInuser } = useAuth();

  return (
    <>
      <Navbar className="bg-primary">
        <Container className=''>
        <Navbar.Brand href="/dashboard" className='text-white fs-2'>Financely</Navbar.Brand>
        {
          isLoggedInuser ? <Nav.Link href="/signout" className='text-white fs-4'>Sign Out</Nav.Link> : <Nav.Link href="/" className='text-white fs-4'>Sign In</Nav.Link>
        }
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
