import React, { useState, useEffect } from 'react';
import Button from '../../shared/button/button';
import Image from 'next/legacy/image';
import Link from 'next/link'
import { Row, Col, Form, Modal } from 'react-bootstrap';
import dashboardServices from "../services/dashboardServices"
import SearchAdmin from './searchAdmin';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const IssuerDetailsDrawer = ({ modalShow, handleCloseDrawer,  onHide,issuerDetails,setIssuerDetails}) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [issuers, setIssuers] = useState([]);
    const [actionType, setActionType] = useState('');
    const [lockType, setLockType] = useState('');
    const [value, setValue] = useState('');
    const [statusDetails, setStatusDetails] = useState([]);
    const [isLocked, setIsLocked] = useState(true);  
    const [serviceId, setServiceId] = useState(null);  

   
    const handleSelectChange = (e) => {
        const selectedService = e.target.value;
        setLockType(selectedService);
       
    


        const service = statusDetails.find(s => s.serviceId === selectedService);
        if (service) {
            setIsLocked(service.status); 
        }
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

    const handleLock = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        let serviceId;
        switch (lockType) {
            case "issue":
                serviceId = 1;
                break;
            case "renew":
                serviceId = 2;
                break;
            case "revoke":
                serviceId = 3;
                break;
            case "reactivate":
                serviceId = 4;
                break;
            default:
                serviceId = null; // In case no valid option is selected
        }
    
        
    
        const requestData = {
            email: issuerDetails.email,
            status: isLocked ?  false: true,
            service: serviceId,
            credits: 0
          }
    
        try {
          // Call the updateLimit function and handle the response
          dashboardServices.updateLimit(requestData, (response) => {
            if (response.status === 'SUCCESS') {
              setError('');
              handleStatus(issuerDetails?.email)
              setIsLocked(!isLocked)
            } else {
              setError(response.message || 'An error occurred');
            }
          });
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
    };

    const handleStatus = async (email) => {
        setIsLoading(true);
    
       
        try {
          // Call the updateLimit function and handle the response
          dashboardServices.getStatus(email, (response) => {

            if (response.status === 'SUCCESS') {
              setError('');
              setMessage("Updated Successfully")
              setShow(true)

              setStatusDetails(response.data.details)
            } else {
              setError(response.message || 'An error occurred');
            }
          });
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
    };

   

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const requestData = {
            email: issuerDetails.email,
            status: true,
            service: Number(actionType),
            credits: Number(value)
          }
    
        try {
          // Call the updateLimit function and handle the response
          dashboardServices.updateLimit(requestData, (response) => {
            if (response.status === 'SUCCESS') {
              setError('');
              setMessage("Updated Successfully")
              setShow(true)
            } else {
              setError(response.message || 'An error occurred');
            }
          });
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
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
        handleClose();
    };  
    

    return (
        <Modal   show={modalShow} onHide={onHide}>
                <div  className='header d-flex align-items-center justify-content-between'>
                    <h2 className='title'>Issuer Details</h2>
                    <div className='close' onClick={onHide}>
                        <Image 
                            src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
                            width={40}
                            height={40}
                            alt='Close Drawer'
                        />
                    </div>
                </div>
                <hr />
                
                <SearchAdmin issuerDetails={issuerDetails} setIssuerDetails={setIssuerDetails} handleStatus={handleStatus} />
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
                        <div className='org-details'>
                            <h2 className='title'>Manage Credits</h2>
                            <Form onSubmit={handleUpdate}>
                                <Row className="justify-content-md-center align-items-md-center">
                                    <Col md={5} xs={12}>
                                        <Form.Group controlId="actionType" className="mb-3">
                                            <Form.Label>Select a Option <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="actionType"
                                                value={actionType}
                                                onChange={(e) => setActionType(e.target.value)}
                                                required
                                                className="custom-input"
                                            >
                                                <option value="">Select Action</option>
                                                <option value={1}>Issuance</option>
                                                <option value={2}>Reissuance</option>
                                                <option value={3}>Revocation</option>
                                                <option value={4}>Reactivation</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={5} xs={12}>
                                        <Form.Group controlId="value" className="mb-3">
                                            <Form.Label>Enter a Value <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="value"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                required
                                                className="custom-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col style={{height:"50px"}} md={2} xs={12} className="d-flex justify-content-center align-items-end">
                                        <Button  type="submit" label="Update" className="golden custom-button" />
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className='org-details'>
            <h2 className='title'>Limit Credits</h2>
            <Form onSubmit={handleLock}>
                <Row className="align-items-md-center">
                    <Col md={5} xs={12}>
                        <Form.Group controlId="lockType" className="mb-3">
                            <Form.Label>Select an Option <span className='text-danger'>*</span></Form.Label>
                            <Form.Control
                                as="select"
                                name="lockType"
                                value={lockType}
                                onChange={handleSelectChange}
                                required
                                className="custom-input"
                            >
                                <option value="">Select Action</option>
                                {statusDetails && statusDetails.map(service => (
                                    <option 
                                        key={service.serviceId} 
                                        value={service.serviceId} 
                                        style={service.status ? {} : { color: 'red' }}
                                    >
                                        {service.status ? 
                                            service.serviceId.charAt(0).toUpperCase() + service.serviceId.slice(1) : 
                                            `${service.serviceId.charAt(0).toUpperCase() + service.serviceId.slice(1)} (Locked)`}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col style={{ height: "50px" }} md={2} xs={12} className="d-flex justify-content-center align-items-end">
                        <Button  type="submit" className="golden custom-button" label={isLocked ? "Lock" : "Unlock"} />
                            
                    </Col>
                </Row>
            </Form>
        </div>
                        <div className='action'>
                            <Button 
                                label='Reject' 
                                className='warning w-25' 
                                // onClick={() => handleReject(issuerDetails.email)}
                                onClick={showModal}
                            />
                        </div>
                        {/* <p className='text-center text-success font-monospace mt-3 fs-5'>{message}</p> */}
                    </>
                )}
               
           

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
                    <Button label="Cancel" className='golden w-auto pe-4 ps-4 py-3' onClick={handleClose} />
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
            <Modal onHide={()=>{setShow(false)}} className='loader-modal text-center' show={show} centered>
                <Modal.Body className='p-5'>
                    <div className='error-icon'>
                        <Image
                            src="/icons/check-mark.svg"
                            layout='fill'
                            objectFit='contain'
                            alt='Loader'
                        />
                    </div>
                    <h3 style={{ color: '#198754' }}>{message}</h3>
                    <button className='success' onClick={()=>{setShow(false)}}>Ok</button>
                </Modal.Body>
            </Modal>
            </Modal>
    );
}

export default IssuerDetailsDrawer;
