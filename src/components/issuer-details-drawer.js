import React, { useState } from 'react';
import Button from '../../shared/button/button';
import Image from 'next/legacy/image';
import Link from 'next/link'
import { Row, Col, Form, Modal } from 'react-bootstrap';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_admin;

const IssuerDetailsDrawer = ({ showDrawer, handleCloseDrawer }) => {
    const [issuerEmail, setIssuerEmail] = useState('');
    const [issuerDetails, setIssuerDetails] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    const handleChange = (e) => {
        setIssuerEmail(e.target.value);
    };

    const handleClose = () => {
        setShow(false);
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
                    </>
                )}
                <div className='action'>
                    <Button label='Reject' className='warning w-25' />
                </div>
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
        </>
    );
}

export default IssuerDetailsDrawer;
