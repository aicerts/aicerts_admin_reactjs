import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';
import { Nav } from 'react-bootstrap';
const Navigation = () => {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0)
  // // let isUserLoggedIn;
  // useEffect(()=>{
  //   setIsUserLoggedIn(localStorage.getItem('user') !== null);
  //   //  isUserLoggedIn = localStorage?.getItem('user') !== null;
  // },[])
  const setLogoutTimer = (token: string) => {
    interface DecodedToken {
      exp: number;
    }
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const expirationTimeUTC = (decodedToken.exp * 1000) - 60000; // Convert to milliseconds since epoch
      const timeout = expirationTimeUTC - Date.now();
      if (Date.now() >= expirationTimeUTC) {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };

   // @ts-ignore: Implicit any for children prop
   const handleClickTab = ((value) => {
    setSelectedTab(value)
  })
  
   // @ts-ignore: Implicit any for children prop
   useEffect(() => {
    // Check if the token is available in localStorage
    // @ts-ignore: Implicit any for children prop
    const userDetails = JSON.parse(localStorage?.getItem('user'));

    if (userDetails && userDetails.JWTToken) {
      // If token is available, set it in the state
      // fetchData(userDetails.email)
      setLogoutTimer(userDetails.JWTToken)
    } else {
      // If token is not available, redirect to the login page
      // router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
  
    localStorage.removeItem('user');
    
    router.push('/');
  };


  const routesWithLogoutButton = ['/dashboard', '/add-trusted-owner', '/remove-trusted-owner','/check-balance'];
  return (
    <>
      <nav className="global-header navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className='d-flex justify-content-between align-items-center w-100'>
            <div className='nav-logo'>
              <Link className="navbar-brand" href="/">
                <Image
                  src='https://images.netcomlearning.com/ai-certs/Certs365-logo.svg'
                  layout='fill'
                  objectFit="contain"
                  alt='AI Certs logo'
                />
              </Link>
            </div>  
            <Nav className="me-auto ">
                <Nav.Link 
                  onClick={() => { handleClickTab(0) }} className={`nav-item ${selectedTab === 0 ? "tab-golden" : ""}`} 
                  href="/dashboard"
                >Dashboard</Nav.Link>
                <Nav.Link onClick={() => { handleClickTab(1) }} className={`nav-item ${selectedTab === 1 ? "tab-golden" : ""}`} href="/gallery">
                    Gallery
                </Nav.Link>
                <Nav.Link onClick={() => { handleClickTab(2) }} className={`nav-item ${selectedTab === 2 ? "tab-golden" : ""}`} href="/certificates">
                  Issuance
                </Nav.Link>
                <Nav.Link onClick={() => { handleClickTab(4) }} className={`nav-item ${selectedTab === 4 ? "tab-golden" : ""}`} href="/admin">
                  Administration
                </Nav.Link>
              </Nav>      
                {routesWithLogoutButton.includes(router.pathname) && (
                  <div className='nav-logo logout'>
                    <button className="btn btn-link" onClick={handleLogout}>
                      <Image
                        src='https://images.netcomlearning.com/ai-certs/logout.svg'
                        layout='fill'
                        objectFit="contain"
                        alt='logout Icon'
                      />
                    </button>
                  </div>
                )}
            </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;