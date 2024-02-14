import { logout } from '@/common/auth';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import {Navbar, Button} from 'react-bootstrap';

const Navigation = () => {
let isUserLoggedIn;
  useEffect(()=>{

     isUserLoggedIn = localStorage?.getItem('user') !== null;
  },[])
  return (
    <>
      <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className='nav-logo'>
            <Link className="navbar-brand" href="/">
              <Image
                src='/logo-black.svg'
                layout='fill'
                objectFit="contain"
                alt='AI Certs logo'
              />
            </Link>
          </div>
          {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button> */}

         <div style={{flexDirection:"row", justifyContent:"flex-end"}} className="collapse navbar-collapse" id="navbarSupportedContent"> 
            <ul className="navbar-nav mr-auto">
            {isUserLoggedIn && (
          <li className="nav-item active">
            <a onClick={logout} className="nav-link" href="#">Logout</a>
          </li>
        )}
              {/* <li className="nav-item">
                <a className="nav-link" href="/varify-documents">Verify Document</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/varify-documents">Submit Document</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile-details">User Profile</a>
              </li> */}
            </ul> 
          </div> 
        </div>
      </nav>
    </>
  );
};

export default Navigation;