import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../shared/button/button';
import Image from 'next/legacy/image';
import { Table, Modal, Container, Row, Col, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
import IssuerDetailsDrawer from '../components/issuer-details-drawer';
import DashboardCard from "../components/dashboardCard"
import dashboardServices from "../services/dashboardServices"

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const AdminPage  = () => {
    const router = useRouter();
    const [issuers, setIssuers] = useState([]);
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    const [address] = useState(process.env.NEXT_PUBLIC_BASE_OWNER_ADDRESS); // Static address
    const [balance, setBalance] = useState('');
    const [tab, setTab] = useState(1);
    const [details, setDetails] = useState({});
    const [showDrawer, setShowDrawer] = useState(false);
    const handleShowDrawer = () => setShowDrawer(true);
    const handleCloseDrawer = () => setShowDrawer(false);


    const handleClose = () => {
        setShow(false);
        setShowModal(false)
    };

    const addTrustedOwner = () => {
        window.location = "/add-trusted-owner"
    }

    const removeTrustedOwner = () => {
        window.location = "/remove-trusted-owner"
    }

    const handleChange = (value) => {
        setTab(value);
      };

      const createDetail = (response, period, index) => ({
        title: "Issuance",
        titleValue: period,
        badgeIcon: "",
        value: response?.data?.details[period][index] || "0",
        percentage: "+21.01%",
        image: "/icons/badge-cert.svg",
      });
      

    
    useEffect(() => {
        // Fetch data from the API endpoint
        const storedUser = JSON.parse(localStorage.getItem('user'));

        const fetchData = async () => {
            try {
                // Check if user is in localStorage

                if (storedUser && storedUser.JWTToken) {
                    // User is available, set the token
                    setToken(storedUser.JWTToken);

                    // Fetch issuers data
                    const response = await fetch(`${apiUrl}/api/get-all-issuers/`, {
                        headers: {
                            Authorization: `Bearer ${storedUser.JWTToken}`
                        }
                    });
                    const data = await response.json();
                    setIssuers(data.data);

                } else {
                    // User is not available, redirect to login
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        

       

        const handleSubmit = async (e) => {
            // e.preventDefault();

            try {
                //   setIsLoading(true);

                const response = await fetch(`${apiUrl}/api/check-balance?address=${address}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${storedUser.JWTToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                const responseData = await response.json();

                if (response.status === 200) {
                    setMessage(responseData.message || 'Success');
                    setBalance(parseFloat(responseData.balance).toFixed(2));
                    // setError('');
                } else {
                    setMessage(responseData.message || 'Failed');
                    setBalance('');
                    // setError(responseData.error || 'An error occurred while fetching balance');
                }

                // setShow(true);
            }
            catch (error) {
                console.error('Error fetching balance:', error.message);
                //   setMessage(error.message || 'An error occurred while fetching balance');
                setBalance('');
                //   setShow(true)
            }
        };

        fetchData();
        handleSubmit();
    }, [address, router]);

    const handleApproval = async (email, status) => {
        try {
            const response = await fetch(`${apiUrl}/api/validate-issuer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                },
                body: JSON.stringify({ email, status }),
            });
    
            const data = await response.json();
    
            // Update the local state to reflect the approval status
            setShow(true);
            setMessage(data.message);
            setIssuers((prevIssuers) =>
                prevIssuers.map((issuer) =>
                    issuer.email === email ? { ...issuer, approved: true } : issuer
                )
            );
        } catch (error) {
            console.error('Error approving issuer:', error);
        }
    };

    const handleApprove = async (email) => {
        await handleApproval(email, 1);
    };

    const handleReject = async (email) => {
        await handleApproval(email, 2);
    };

    const getDetails =useCallback( async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));

        try {
          dashboardServices.getDetails(storedUser.email, (response) => {
            if (response.status === 'SUCCESS') {
              const details = {
                NetComWeek: createDetail(response, "Week", 0),
                LmsWeek: createDetail(response, "Week", 1),
                NetComMonth: createDetail(response, "Month", 0),
                LmsMonth: createDetail(response, "Month", 1),
                NetComTotal: createDetail(response, "Annual", 0),
                LmsTotal: createDetail(response, "Annual", 1),
              };
              setDetails(details);
              console.log(details)
              
            } else {
              console.error("Failed to fetch details", response);
            }
          });
        } catch (error) {
          console.error("Error in getDetails:", error);
        }
      },[]);
      useEffect(()=>{
       
          
          getDetails();
      },[getDetails])

    const unapprovedIssuers = issuers?.filter(issuer => !issuer.approved);

    return (
        <>
            <div className='page-bg'>
                <div className='position-relative h-100'>
                    <div className='vertical-center dashboard-pos'>
                        <Container className='dashboard mt-5'>
                            <Row>
                                <Col xs md="8">
                                    <div className='heading d-flex justify-content-between align-items-center mb-4'>
                                        <h2 className='title'>Issuer Login Credentials</h2>
                                        <Button label='View Issuer Details  &#8594;' className='golden ps-4 pe-4' onClick={handleShowDrawer} />
                                    </div>
                                    <div className='issuer-data'>
                                        <Table bordered>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Organization</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {unapprovedIssuers?.map((issuer) => (
                                                    <tr key={issuer._id}>
                                                        <td>{issuer.name}</td>
                                                        <td>{issuer.organization}</td>
                                                        <td>{issuer.email}</td>
                                                        <td>
                                                            <div className='d-flex align-items-center' style={{ columnGap: "20px" }}>
                                                                <Button
                                                                    label='Approve'
                                                                    onClick={() => handleApprove(issuer.email)}
                                                                    disabled={issuer.approved}
                                                                    className='golden ps-3 pe-3 py-2'
                                                                />
                                                                <Button
                                                                    label='Reject'
                                                                    onClick={() => handleReject(issuer.email)}
                                                                    disabled={issuer.approved}
                                                                    className='danger ps-3 pe-3 py-2'
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col xs md="4">
                        
                                
                                <Card style={{borderRadius:"0"}} className='p-3 mb-2'>
                                <div className='admin-button-container mb-2'>
          <span onClick={() => handleChange(1)} className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>NetCom</span>
          <span className="vertical-line"></span>
          <span onClick={() => handleChange(2)} className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>LMS</span>
        </div>
                                <Col xs md="12">
                                <DashboardCard item={tab === 1? details.NetComTotal : details.LmsTotal}/>
                                
                                </Col>
                                <Row className='mt-2'>
                                <Col xs md="6">
                                <DashboardCard item={tab === 1?details.NetComMonth: details.LmsMonth}/>
                                
                                </Col>
                                <Col xs md="6">
                                <DashboardCard item={tab === 1?details.NetComWeek: details.LmsWeek}/>
                                
                                </Col>
                                </Row>
                                
                                    </Card>
                                    <Card className=''>
                                        <Card.Header>Admin Wallet Balance</Card.Header>
                                        <Card.Body>
                                            {balance && <h2 className='my-2 balance'><Image height={35} width={35} src="/icons/matic.svg" alt='' /> <strong>{balance}</strong></h2>}
                                            <hr className='dashed' />
                                            <div className='latest-update'><span>Last Updated:</span> <strong>02/03/2024</strong></div>
                                        </Card.Body>
                                    </Card>
                                    <Card className='mt-4'>
                                        <Card.Header>Trusted Owner</Card.Header>
                                        <Card.Body>
                                            <div className='trusted-owner-wrapper d-block d-md-flex align-items-center justify-content-center'>
                                                <div className='trusted-owner add' onClick={addTrustedOwner}>
                                                    <Image
                                                        src="https://images.netcomlearning.com/ai-certs/icons/add-trusted-owner.svg"
                                                        width={57}
                                                        height={57}
                                                        alt='Add trusted owner'
                                                    />
                                                    <span className='hero-name'>Add Owner</span>
                                                </div>
                                                <div className='trusted-owner remove mt-4 mt-md-0' onClick={removeTrustedOwner}>
                                                    <Image
                                                        src="https://images.netcomlearning.com/ai-certs/icons/add-trusted-owner.svg"
                                                        width={57}
                                                        height={57}
                                                        alt='Add trusted owner'
                                                    />
                                                    <span className='hero-name'>Remove Owner</span>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
            </div>
            <div className='page-footer-bg'></div>

            <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
                <Modal.Body className='p-5'>
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
                </Modal.Body>
            </Modal>
            
            <IssuerDetailsDrawer showDrawer={showDrawer} handleShowDrawer={handleShowDrawer} handleCloseDrawer={handleCloseDrawer} displayMessage={message} />
        </>
    );
}

export default AdminPage;
