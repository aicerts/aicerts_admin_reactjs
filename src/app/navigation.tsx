import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // let isUserLoggedIn;
  useEffect(()=>{
    setIsUserLoggedIn(localStorage.getItem('user') !== null);
    //  isUserLoggedIn = localStorage?.getItem('user') !== null;
  },[])

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