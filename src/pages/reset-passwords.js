import React, { useState } from 'react';
import Image from 'next/legacy/image';
import { Container, Form, Row, Col, Modal } from 'react-bootstrap';
import Button from '../../shared/button/button';
import eyeIcon from '../../public/icons/eye.svg';
import eyeSlashIcon from '../../public/icons/eye-slash.svg';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
        
  const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
  };

  const handleClose = () => {
      setShow(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    try {
      setIsLoading(true)
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
    window.location.href = '/';
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }

    // Check if both email and password fields are not empty
    setFormValid(email.trim() !== '' && password.trim() !== '');
  };

  return (
    <>
      <div className='page-bg'>
        <div className='position-relative h-100'>
          <div className="forgot-password">
            <div className='vertical-center'>
              <Container>
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
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group controlId="password" className='mt-4'>
                          <Form.Label>Enter New Password</Form.Label>
                          <div className="password-input position-relative">
                            <Form.Control
                              type={passwordVisible ? 'text' : 'password'}
                              name="password"
                              value={password}
                              onChange={handleInputChange}
                            />
                            <div className='eye-icon position-absolute'>
                                <Image
                                    src={passwordVisible ? eyeSlashIcon : eyeIcon}
                                    width={20}
                                    height={20}
                                    alt={passwordVisible ? 'Hide password' : 'Show password'}
                                    onClick={togglePasswordVisibility}
                                    className="password-toggle"
                                />
                            </div>
                          </div>
                        </Form.Group>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            type="submit" // Specify the type as "submit"
                            label="Reset Password"
                            className="golden w-100"
                            disabled={!formValid}
                          />
                        </div>
                          <div className='d-flex justify-content-between align-items-center'>
                              <Button label="Login" onClick={loginPage} className="outlined w-100" />
                          </div>
                      </Form>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
          <div className='page-footer-bg'></div>
        </div>
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
                              src="/icons/invalid-password.gif"
                              layout='fill'
                              objectFit='contain'
                              alt='Loader'
                          />
                      </div>
                      <h3 className='text' style={{ color: 'red' }}>{message}</h3>
                      <button className='warning' onClick={handleClose}>Ok</button>
                  </>
              ) : (                
                  <>
                      <div className='error-icon'>
                          <Image
                              src="/icons/success.gif"
                              layout='fill'
                              objectFit='contain'
                              alt='Loader'
                          />
                      </div>
                      <h3 className='text' style={{ color: '#CFA935' }}>{message}</h3>
                      <button className='success' onClick={handleClose}>Ok</button>
                  </>
              )}
          </Modal.Body>
      </Modal>
    </>
  );
};

export default ResetPassword;
