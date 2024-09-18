import Image from 'next/legacy/image';
import Button from '../../shared/button/button';
import React, { useState, useEffect } from 'react';
import { Form, Modal, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/router';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AddTrustedOwnerModal = ({ show, handleClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage?.getItem('user'));
        if (storedUser && storedUser?.JWTToken) {
            setToken(storedUser?.JWTToken);
        } else {
            router.push('/');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null); // Reset any previous errors
        setMessage(''); // Clear any previous messages
        try {
            const response = await fetch(`${apiUrl}/api/add-trusted-owner`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            const responseData = await response.json();

            if (response.ok) {
                setMessage(responseData?.message || 'Success');
                setError(null);
            } else {
                setMessage(responseData?.message || 'Failed');
                setError(responseData.error || 'An error occurred while processing your request.');
            }
        } catch (error) {
            setMessage(error.message || 'An error occurred while processing your request.');
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseTab=(()=>{
        setError("")
        setIsLoading(false)
        setMessage("")
handleClose()
    })

    const handleBack=(()=>{
        setError("")
        setIsLoading(false)
        setMessage("")
        setAddress("")
    })

    return (
        <Modal show={show} onHide={handleCloseTab} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Trusted Owner</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            { !message && (
                    <Form className='login-form' onSubmit={handleSubmit}>
                        <Form.Group controlId="address" className='mb-3'>
                            <Form.Label>Insert Address</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Form.Group>
                        <div className='d-flex justify-content-center align-items-center'>
                            <button className="global-button golden" type="submit" disabled={!address.trim() || isLoading}>
                                {isLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" role="status" className="me-2" />
                                        Loading...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </Form>
                )}


                {!isLoading && message && (
                    <div className='text-center'>
                        {error ? (
                            <>
                                <div className='error-icon'>
                                    <Image
                                        src="/icons/close.svg"
                                        layout='fill'
                                        objectFit='contain'
                                        alt='Error'
                                    />
                                </div>
                                <h3 style={{ color: 'red' }}>{message}</h3>
                            </>
                        ) : (
                            <>
                                <div className='success-icon'>
                                    <Image
                                        src="/icons/success.gif"
                                        layout='fill'
                                        objectFit='contain'
                                        alt='Success'
                                    />
                                </div>
                                <h3 style={{ color: '#CFA935' }}>{message}</h3>
                            </>
                        )}
                        <button className='global-button golden mt-3' onClick={handleBack}>
                            Ok
                        </button>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default AddTrustedOwnerModal;
