import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function Footer() {
  return (
    <>
      <footer id='footer-page' style={{backgroundColor:'#e9ecef'}}>
      <div className="footer-social-links">
            <Link
              href="https://www.instagram.com"
              target="_blank"
              className="home_social-icon"
            >
              <i className="fa-brands fa-instagram"></i>
            </Link>

            <Link
              href="https://www.facebook.com"
              target="_blank"
              className="home_social-icon"
            >
              <i className="fa-brands fa-facebook"></i>
            </Link>

            <Link
              href="https://www.twitter.com"
              target="_blank"
              className="home_social-icon"
            >
              <i className="fa-brands fa-x-twitter"></i>
            </Link>
          </div>
          <p>&copy; 2024 Location/Address. All Rights Reserved.</p>
          <p>Designed & Developed By <strong className='text-primary'>Biswojit</strong></p>
      </footer>
    </>
  )
}

export default Footer
