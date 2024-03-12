import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Modal } from 'react-bootstrap';
import CopyrightNotice from '../app/CopyrightNotice';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const RemoveTrustedOwner = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(null);
    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Check if the token is available in localStorage
        const storedUser = JSON.parse(localStorage?.getItem('user'));
    
        if (storedUser && storedUser?.JWTToken) {
          // If token is available, set it in the state
          setToken(storedUser?.JWTToken);
        } else {
          // If token is not available, redirect to the login page
          router.push('/');
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          setIsLoading(true);
          const response = await fetch(`${apiUrl}/api/remove-trusted-owner`, {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address }),
          });
      
          const responseData = await response.json();

        if (response.ok) {
            // Successful signup, handle accordingly (redirect or show a success message)
            setMessage(responseData?.message || 'Success');
            setError('');
        } else {
            // Handle signup error (show error message or redirect to an error page)
            setMessage(responseData?.message || 'Failed')
            setError(responseData.error || 'An error occurred while fetching balance');
        }
        
        setShow(true);

        //   setMessage(responseData?.message || 'there is an issue');
        } catch (error) {
            setMessage(error.message || 'An error occurred while fetching balance');
            setShow(true)
        } finally {
          setIsLoading(false);
        }
      };

      useEffect(() => {
        console.log("Test response: ", message);
      }, [message]);

    return (
        <div className='login-page'>
            <div className='container'>
                <Row className="justify-content-md-center">
                    <Col xs={{ span: 12 }} md={{ span: 10 }} lg={{ span: 8 }} className='login-container mt-5'>
                        <div className='golden-border-left'></div>
                        <Card className='login input-elements'>
                            <h2 className='title text-center'>Remove Trusted Owner</h2>
                            <p className='sub-text text-center'></p>
                            <Form className='login-form' onSubmit={handleSubmit}>
                                <Form.Group controlId="text" className='mb-3'>
                                    <Form.Label>
                                    Insert Address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </Form.Group>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <Button label="Submit" className="golden" />
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
}

export default RemoveTrustedOwner;
