import React, { useState, useEffect } from 'react';
import Button from '../../shared/button/button';
import Image from 'next/legacy/image';
import Link from 'next/link'
import { Row, Col, Form, Modal } from 'react-bootstrap';
import dashboardServices from "../services/dashboardServices"
import SearchAdmin from './searchAdmin';
import AlertModal from './alertModal';
import Loading from './loading';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const IssuerDetailsDrawer = ({ modalShow,setModalShow, handleCloseDrawer,  onHide,issuerDetails,setIssuerDetails, fetchData}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [actionType, setActionType] = useState('');
    const [lockType, setLockType] = useState('');
    const [value, setValue] = useState('');
    const [statusDetails, setStatusDetails] = useState([]);
    const [isLocked, setIsLocked] = useState(true);  
    const [serviceId, setServiceId] = useState(null);  
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [certInfo, setCertInfo] = useState(null);
    const [showButton, setShowButton] = useState(true);

   
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
        setErrorMessage("")
        setSuccessMessage("")
    };

    const getLabel = (serviceId) => {
        switch (serviceId.toLowerCase()) {
          case 'issue':
            return 'Issuance';
          case 'reactivate':
            return 'Reactivation';
          case 'renew':
            return 'ReIssuance';
          case 'revoke':
            return 'Revocation';
            
          default:
            return serviceId.charAt(0).toUpperCase() + serviceId.slice(1);
        }
      };

    useEffect(()=>{
        if(issuerDetails?.email ){
            handleStatus(issuerDetails?.email)
        }
    },[issuerDetails])

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
              setSuccessMessage('Successfully Updated');
              setShow(true);
              handleStatus(issuerDetails?.email)
              setIsLocked(!isLocked)
            } else {
              setErrorMessage(response.message || 'Please try after some time1');
              setShow(true);

            }
          });
        } catch (error) {
          setErrorMessage(error.message);
          setShow(true);

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
              setStatusDetails(response.data.details)
            }
          });
        } catch (error) {
          setErrorMessage(error.message);
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
        
              setSuccessMessage("Updated Successfully")
              setShow(true)
          fetchData();

            } else {
              setErrorMessage(response?.error?.message || 'Please try after some time');
              setShow(true);

            }
          });
        } catch (error) {
          setErrorMessage(error.message);
          setShow(true);

        } finally {
          setIsLoading(false);
        }
    };

   

    

    const handleIssuer = async (email, status) => {
        setLoading(true);
        setErrorMessage(''); // Clear previous error messages
        setSuccessMessage(''); // Clear previous success messages
    
        try {
          const storedUser = JSON.parse(localStorage.getItem('user'));
          if (!storedUser || !storedUser.JWTToken) {
            throw new Error('User is not authenticated. Please log in again.');
          }
    
          // Make the API call
          const response = await fetch(`${apiUrl}/api/validate-issuer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storedUser.JWTToken}`,
            },
            body: JSON.stringify({ email, status }),
          });
    
          // Check if the response is not OK (non-2xx status code)
          if (!response.ok) {
            const error = await response.json(); // Fetch any error message from the server
            setErrorMessage(error.message || 'Please try again later.');
            setShow(true);
          }
    
          const data = await response.json();
          // Handle success response
          setSuccessMessage(data.message || 'Issuer successfully validated.');
          setShow(true);
          fetchData();
          setShowButton(false)
        } catch (error) {
          // Display error message in the UI
          setErrorMessage(error.message || 'Please try again later.');
          setShow(true);
        } finally {
          setLoading(false);
        }
      };



    const fetchInfoData = async (email) => {
        try {
          const response = await fetch(`${apiUrl}/api/get-issuers-log`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              queryCode: 1,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
    
          const data = await response.json();
          setCertInfo(data?.data);
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle error as needed
        }
    };
    
    useEffect(() => {
        if (issuerDetails?.email) {
            fetchInfoData(issuerDetails.email);
        }
    }, [issuerDetails]);
    

    return (
        <Modal size='lg'  className='drawer-wrapper'   show={modalShow} onHide={()=>{onHide(); setShowButton(true)}}>
                 <AlertModal handleClose={handleClose} show={show} successMessage={successMessage} errorMessage={errorMessage} />
                 <Loading isLoading={loading} />
                
                <div  className='header d-flex align-items-center justify-content-between'>
                    <h2 className='title' style={{fontFamily:"Montserrat"}}>Issuer Details</h2>
                    <div className='close' onClick={()=>{onHide(); setShowButton(true)}}>
                        <Image 
                            src="https://images.netcomlearning.com/ai-certs/icons/close-grey-bg.svg"
                            width={32}
                            height={32}
                            alt='Close Drawer'
                        />
                    </div>
                </div>
                <hr />
                
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
                                    <div className='name'style={{fontFamily:"Montserrat"}} >{issuerDetails.name}</div>
                                }
                                {issuerDetails.designation && 
                                    <div className='designation'>{issuerDetails.designation}</div>
                                }
                                <div className='contact d-flex align-items-md-center'>
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
                                    <Col xs={10} md={4}>
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
                                    <Col xs={12} md={4}style={{display:"flex", flexDirection:"column", width:"100%"}}>
                                        <div className='label'>Website</div>
                                        <div className='info'>
                                            <Link href={issuerDetails.websiteLink} target='_blank' style={{textDecoration:"none",color:"black"}}>
                                                {issuerDetails.websiteLink}
                                            </Link>
                                        </div>
                                    </Col>
                                }
                                {issuerDetails.address && issuerDetails.city && issuerDetails.state && issuerDetails.country && issuerDetails.zip && (
                                    <Col xs={10} md={4} style={{display:"flex", flexDirection:"column", width:"100%"}}>
                                        <div className='label'>Address</div>
                                        <div className='info'style={{ width:"100%"}}>
                                            {issuerDetails.address}, {issuerDetails.city}, {issuerDetails.state}, {issuerDetails.country}, {issuerDetails.zip}                                            
                                        </div>
                                    </Col>
                                )}
                            </Row>

                        </div>
                        { certInfo && 
                        <div className='org-details'>
                            <h2 className='title'>Issuance Metrics</h2>
                            <Row>
                               
                                    <Col xs={12} md={4}>
                                        <div className='label'>Issued</div>
                                        <div className='info'>{certInfo?.issued || 0}</div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Reissued</div>
                                        <div className='info'>{certInfo?.renewed || 0 }</div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Reactivated</div>
                                        <div className='info'>{certInfo?.reactivated || 0 }</div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Revocked</div>
                                        <div className='info'>{certInfo?.revoked || 0 }</div>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <div className='label'>Matic Spent</div>
                                        <div className='info'>{(issuerDetails?.transactionFee || 0).toFixed(3)}</div>
                                    </Col>
                            </Row>

                        </div>
                        }
                        {issuerDetails.approved &&
                        <>
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
                                    <Col md={2} xs={12} className="d-flex justify-content-center align-items-end pt-3">
                                        <Button  type="submit" label="Update" className="golden custom-button " />
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className='org-details'>
            <h2 className='title'>Restrict Issuance</h2>
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
                       getLabel(service.serviceId) : 
                       `${getLabel(service.serviceId)} (Locked)`}
                   </option>
                ))}
            </Form.Control>
        </Form.Group>
    </Col>

    <Col md={2} xs={12} className="d-flex align-items-center justify-content-center pt-3">
        <Button 
            type="submit" 
            className="golden custom-button " 
            label={isLocked ? "Lock" : "Unlock"}
        />
    </Col>
</Row>


            </Form>
        </div>
        </>
                }
        <div className='action'>
            {showButton && 
    <Button 
    label={issuerDetails.approved ? 'Reject' : 'Accept'} 
    className={issuerDetails.approved ? 'warning w-25' : 'success w-25'} 
    onClick={()=>{issuerDetails.approved ?handleIssuer(issuerDetails.email, 2): handleIssuer(issuerDetails.email, 1)}}
    />
}
</div>

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
            </Modal>
    );
}

export default IssuerDetailsDrawer;
