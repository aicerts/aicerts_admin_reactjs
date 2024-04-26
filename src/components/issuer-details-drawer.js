import React, { useState, useEffect } from 'react';
import Button from '../../shared/button/button';
import Image from 'next/legacy/image';
import Link from 'next/link'
import { Row, Col, Form, Modal } from 'react-bootstrap';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const IssuerDetailsDrawer = ({ showDrawer, handleCloseDrawer, displayMessage }) => {
    const [issuerEmail, setIssuerEmail] = useState('');
    const [issuerDetails, setIssuerDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [issuers, setIssuers] = useState([]);

    const handleChange = (e) => {
        setIssuerEmail(e.target.value);
    };

    const showModal = () => {
        setShow(true)
    }

    const handleCancel = () => {
        setShow(false)
    }

    const handleClose = () => {
        setShow(false);
        setIssuerDetails('')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const response = await fetch(`${apiUrl}/api/get-issuer-by-email`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({email:issuerEmail}),
            });
        
            if (!response.ok) {
                throw new Error('Failed to fetch issuer details');
            }
        
            const data = await response.json();
            if (data.status === 'SUCCESS') {
                setIssuerDetails(data.data);
                setError('');
            } else {
                setError(data.message);
            }
        } catch (error) {
          setError(error.message);
        } finally {
            setIsLoading(false)
        }
    };   

    const handleReject = async (email) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser && storedUser.JWTToken) {
                // Hit the API to approve the issuer with the given email
                const response = await fetch(`${apiUrl}/api/validate-issuer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer " + storedUser.JWTToken // Use the token directly here
                    },
                    body: JSON.stringify({ email, status: 2 }),
                });
    
                const data = await response.json();
    
                // Update the local state to reflect the approval status
                setShow(true)
                setMessage(data.message)
                setIssuers((prevIssuers) =>
                    prevIssuers.map((issuerDetails) =>
                    issuerDetails.email === email ? { ...issuerDetails, approved: true } : issuerDetails
                    )
                );
            }
    
        } catch (error) {
            console.error('Error approving issuer:', error);
        }
        handleCancel();
    };  
    

    return (
        <>
            <div className={`drawer-container ${showDrawer ? 'drawer-open' : ''}`}>
                <div className='header d-flex align-items-center justify-content-between'>
                    <h2 className='title'>Issuer Details</h2>
                    <div className='close' onClick={handleCloseDrawer}>
                        <Image 
                            src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
                            width={40}
                            height={40}
                            alt='Close Drawer'
                        />
                    </div>
                </div>
                <hr />
                {/* Drawer content */}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="search">
                        <div className="search d-flex">
                            <Form.Control 
                                type='text'
                                placeholder='Search User by email'
                                value={issuerEmail} 
                                onChange={handleChange}
                            />
                            <div className='submit'>
                                <Button 
                                    label={
                                        <div className='magnifier'>
                                            <Image 
                                                src="https://images.netcomlearning.com/ai-certs/icons/magnifier-white.svg"
                                                layout='fill'
                                                objectFit='contain'
                                                alt='test'                                    
                                            />
                                        </div>
                                    }
                                    className='golden'
                                    type="submit" 
                                    disabled={!issuerEmail.trim()}
                                />
                            </div>
                        </div>
                    </Form.Group>
                </Form>
                {error && <h6 className='mt-2' style={{ color: 'red' }}>{error}</h6>}
                {issuerDetails && (
                    <>
                        <div className='profile-info d-flex'>
                            <div className='pic'>
                                {issuerDetails.name &&
                                    issuerDetails.name
                                    .split(' ')
                                    .map(part => part.charAt(0))
                                    .join('')
                                    .toUpperCase()
                                }    
                            </div>
                            <div className='details'>
                                {issuerDetails.name &&
                                    <div className='name'>{issuerDetails.name}</div>
                                }
                                {issuerDetails.designation && 
                                    <div className='designation'>{issuerDetails.designation}</div>
                                }
                                <div className='contact d-flex align-items-center'>
                                    {issuerDetails.phoneNumber &&
                                        <Link href="tel:7836280835">
                                            <div className='item d-flex align-items-center'>
                                                <Image 
                                                    src="https://images.netcomlearning.com/ai-certs/icons/phone-call.svg"
                                                    width={16}
                                                    height={16}
                                                    alt='Phone'
                                                />
                                                {issuerDetails.phoneNumber}
                                            </div>
                                        </Link>
                                    }
                                    {issuerDetails.email &&
                                        <Link href="mailto:john.doe@aicerts.io">
                                            <div className='item d-flex align-items-center'>
                                                <Image 
                                                    src="https://images.netcomlearning.com/ai-certs/icons/email-darksvg.svg"
                                                    width={16}
                                                    height={16}
                                                    alt='Phone'
                                                />
                                                {issuerDetails.email}
                                            </div>
                                        </Link>
                                    }
                                </div>
                            </div>                               
                        </div>
                        <div className='org-details'>
                            <h2 className='title'>Organization Details</h2>
                            <Row>
                                {issuerDetails.organization &&
                                    <Col xs={12} md={4}>
                                        <div className='label'>Organization Name</div>
                                        <div className='info'>{issuerDetails.organization}</div>
                                    </Col>
                                }
                                {issuerDetails.organizationType &&
                                    <Col xs={12} md={4}>
                                        <div className='label'>Organization Type</div>
                                        <div className='info'>{issuerDetails.organizationType}</div>
                                    </Col>
                                }
                                {issuerDetails.industrySector &&
                                    <Col xs={12} md={4}>
                                        <div className='label'>Industry Sector</div>
                                        <div className='info'>{issuerDetails.industrySector}</div>
                                    </Col>
                                }
                                {issuerDetails.websiteLink &&
                                    <Col xs={12} md={4}>
                                        <div className='label'>Website</div>
                                        <div className='info'>
                                            <Link href={issuerDetails.websiteLink} target='_blank'>
                                                {issuerDetails.websiteLink}
                                            </Link>
                                        </div>
                                    </Col>
                                }
                                {issuerDetails.address && issuerDetails.city && issuerDetails.state && issuerDetails.country && issuerDetails.zip && (
                                    <Col xs={12} md={4}>
                                        <div className='label'>Address</div>
                                        <div className='info'>
                                            {issuerDetails.address}, {issuerDetails.city}, {issuerDetails.state}, {issuerDetails.country}, {issuerDetails.zip}                                            
                                        </div>
                                    </Col>
                                )}
                            </Row>
                        </div>
                        <div className='action'>
                            <Button 
                                label='Reject' 
                                className='warning w-25' 
                                // onClick={() => handleReject(issuerDetails.email)}
                                onClick={showModal}
                            />
                        </div>
                        <p className='text-center text-success font-monospace mt-3 fs-5'>{message}</p>
                    </>
                )}
               
            </div>

            {/* Loading Modal */}
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

            <Modal className='loader-modal' show={show} centered>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Confirm Reject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to reject <strong>{issuerDetails?.email}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button label="Cancel" className='golden w-auto pe-4 ps-4 py-3' onClick={handleCancel} />
                    {issuerDetails && (
                        <Button 
                            label={
                                <strong>Confirm</strong>
                            }
                            className='warning w-25 py-3 mt-0 rounded-4' 
                            onClick={() => {
                                handleReject(issuerDetails.email);
                            }}
                        />
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default IssuerDetailsDrawer;
