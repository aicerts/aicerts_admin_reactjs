import React, { useState } from 'react';
import Image from 'next/image';
import { Form, Row, Col, Modal } from 'react-bootstrap';
import Button from '../../../shared/button/button';
import Link from 'next/link'

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
      setShow(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      setIsLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const response = await fetch(`${apiUrl}/api/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200 && data.status === 'SUCCESS') {
        setMessage(data.message);
        setError('');
        // Add any additional logic after successful password reset (e.g., redirect)
      } else if (response.status === 400) {
        setMessage(data.message);
         setError(data.message || 'An error occurred while fetching balance');
      } else {
        setMessage(data.message);
         setError(data.error || 'An error occurred while fetching balance');
      }
      setShow(true);
    } catch (error) {
      console.error('Error during password reset:', error);
    } finally {
      setIsLoading(false)
    }
  };

  const loginPage = () => {
    window.location.href = '/admin/';
  }

  return (
    <div className="forgot-password">
      <div className="container-fluid">
        <Row>
          <Col md={{ span: 7 }} className="d-none d-md-block">
            <div className="badge-banner">
              <Image
                src="/backgrounds/forgot-pass-bg.svg"
                layout="fill"
                objectFit="contain"
                alt="Badge image"
              />
            </div>
          </Col>
          <Col xs={{ span: 12 }} md={{ span: 5 }}>
            <h1 className="title">Reset Password</h1>
            <Form className="input-elements" onSubmit={handleResetPassword}>
              <Form.Group controlId="email">
                <Form.Label>Enter Your Registered Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password" className='mt-4'>
                <Form.Label>Enter New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  type="submit" // Specify the type as "submit"
                  label="Reset Password"
                  className="golden"
                />
              </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <Button label="Login" onClick={loginPage} className="outlined" />
                </div>
            </Form>
            {/* {message && (
                <p className={`mt-3 text-center ${message.status === 'SUCCESS' ? 'text-success' : 'text-danger'}`}>
                    {message}
                </p>
            )} */}
          </Col>
        </Row>
      </div>

       {/* Loading Modal for API call */}
       <Modal className='loader-modal' show={isLoading} centered>
          <Modal.Body>
              <div className='certificate-loader'>
                  <Image
                      src="/backgrounds/login-loading.gif"
                      layout='fill'
                      objectFit='contain'
                      alt='Loader'
                  />
              </div>
          </Modal.Body>
      </Modal>

      <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
          <Modal.Body className='p-5'>               
              {error !== '' ? (               
                  <>
                      <div className='error-icon'>
                          <Image
                              src="/icons/close.svg"
                              layout='fill'
                              objectFit='contain'
                              alt='Loader'
                          />
                      </div>
                      <h3 style={{ color: 'red' }}>{message}</h3>
                      <button className='warning' onClick={handleClose}>Ok</button>
                  </>
              ) : (                
                  <>
                      <div className='error-icon'>
                          <Image
                              src="/icons/check-mark.svg"
                              layout='fill'
                              objectFit='contain'
                              alt='Loader'
                          />
                      </div>
                      <h3 style={{ color: '#198754' }}>{message}</h3>
                      <button className='success' onClick={handleClose}>Ok</button>
                  </>
              )}
          </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResetPassword;
