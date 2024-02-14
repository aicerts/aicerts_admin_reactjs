// 'use client'
import React, { createContext, useContext, useState } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Create the context
const MyContext = createContext(null);

// Create a custom hook for using the context
const useMyContext = () => {

  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyContext.Provider');
  }
  return context;
};

// Create the provider component
const MyContextProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response: ', response.status, response.statusText);
      const responseData = await response.json();

      console.log('Response Data:', responseData);

      if (response.ok) {
        if (responseData.status === 'success') {
          setLoggedIn(true);
        } else {
          console.error('Login failed:', responseData.message || 'An error occurred during login');
        }
      } else {
        console.error('Login failed:', responseData.message || 'An error occurred during login');
      }

      return response;
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  

  const logout = () => {
    // Add logic here to communicate with your backend for logout, if needed
    setLoggedIn(false);
  };

  return (
    <MyContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, useMyContext, MyContextProvider };
