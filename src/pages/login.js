import Image from 'next/image';
import Button from '../../shared/button/button';
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import Link from 'next/link';
import CopyrightNotice from '../app/CopyrightNotice';
import { useRouter } from 'next/router';

const Login = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Check if user and JWT token are present in localStorage
        // @ts-ignore: Implicit any for e prop
        const user = JSON.parse(localStorage.getItem('user'));        
    
        if (user && user?.JWTToken) {
          // Redirect to /dashboard if both user and JWT token are present
          router.push('/dashboard');
        }
      }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });   
// @ts-ignore: Implicit any for e prop
    const handleEmailChange = (e) => {
        const { value } = e.target;
        setLoginStatus(''); // Clear login status when email changes
        setFormData((prevData) => ({ ...prevData, email: value }));
    };    

    // @ts-ignore: Implicit any for e prop
    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setLoginStatus(''); // Clear login status when password changes
        if (value.length < 8) {
            setPasswordError('Password should be minimum 8 characters');
        } else {
            setPasswordError('');
        }
        setFormData((prevData) => ({ ...prevData, password: value }));
    };

    const login = async () => {
        try {
            setIsLoading(true);
          const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
          const response = await fetch(`${apiUrl}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',            
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          });

          const responseData = await response.json();
    
          if (response.status === 200) {
            // Successful login, handle accordingly (redirect or show a success message)
            if (responseData.status === 'FAILED') {
                // Display error message for failed login
                setLoginStatus('FAILED');
                setLoginError(responseData.message || 'An error occurred during login');
                setShow(true);
            } else if (responseData.status === 'SUCCESS') {
                // Successful login, redirect to /verify-documents
                setLoginStatus('SUCCESS');
                setLoginSuccess(responseData.message);
                setShow(true);
                localStorage.setItem('user',JSON.stringify(responseData?.data))
                router.push('/dashboard');
                
            }
          } else if (response.status === 400) {
            // Invalid input or empty credentials
            setLoginError('Invalid input or empty credentials');
            setShow(true);
          } else if (response.status === 401) {
            // Invalid credentials entered
            setLoginError('Invalid credentials entered');
            setShow(true);
          } else {
            // An error occurred during login
            setLoginError('An error occurred during login');
            setShow(true);
          }
        } catch (error) {
          console.error('Error during login:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // @ts-ignore: Implicit any for e prop
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            setLoginError('Please enter valid login credentials');
            setShow(true);
            return;
        }
    
        if (passwordError) {
            console.error('Login failed: Password is too short');
            setShow(true);
            return;
        }
    
        await login();
    };


    return (
        <>
            <Row className="justify-content-md-center mt-5">
                <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 8 }} className='login-container'>
                    <div className='golden-border-left'></div>
                    <Card className='login input-elements'>
                        <h2 className='title text-center'>Admin Login</h2>
                        <p className='sub-text text-center'>Login using your credentials.</p>
                        <Form className='login-form' onSubmit={handleSubmit}>
                            <Form.Group controlId="email" className='mb-3'>
                                <Form.Label>
                                    <Image
                                        src="/icons/user-icon.svg"
                                        width={16}
                                        height={20}
                                        alt='User Name'
                                    />
                                    Email address
                                </Form.Label>
                                <Form.Control
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="password">
                                <Form.Label>
                                    <Image
                                        src="/icons/lock-icon.svg"
                                        width={20}
                                        height={20}
                                        alt='Password'
                                    />
                                    Password
                                </Form.Label>
                                <Form.Control type="password"
                                    required
                                    value={formData.password}
                                    onChange={handlePasswordChange}
                                />
                                {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                            </Form.Group>
                            <div className='d-flex justify-content-between align-items-center'>
                                <Button label="Login" className="golden" />
                                <Link className="forgot-password-text" href="/reset-passwords">Reset Password?</Link>
                            </div>
                        </Form>
                    </Card>
                    <div className='golden-border-right'></div>
                </Col>
                <Col md={{ span: 12 }}>
                    <div className='copy-right text-center'>
                        <CopyrightNotice />
                    </div>
                </Col>
            </Row>

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
                    {loginError !== '' ? (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/close.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: 'red' }}>{loginError}</h3>
                            <button className='warning' onClick={handleClose}>Ok</button>
                        </>
                    ): (
                        <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/check-mark.svg"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Loader'
                                />
                            </div>
                            <h3 style={{ color: '#198754' }}>{loginSuccess}</h3>
                            <button className='success' onClick={handleClose}>Ok</button>
                        </>
                    )}


                </Modal.Body>
            </Modal>
        </>
    );
}

export default Login;
