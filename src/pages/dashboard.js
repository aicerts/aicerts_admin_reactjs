import React, { useState, useEffect } from 'react';
import Button from '../../shared/button/button';
import Image from 'next/legacy/image';
import { Table, Modal, Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link'
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Dashboard = ({ loggedInUser }) => {
    const router = useRouter();
    const [issuers, setIssuers] = useState([]);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    const [address] = useState('0xD18eAEf19131964B6251E6aDd468617f1A162723'); // Static address
    const [balance, setBalance] = useState('');
    const [showDrawer, setShowDrawer] = useState(false);

    const handleCloseDrawer = () => setShowDrawer(false);
    const handleShowDrawer = () => setShowDrawer(true);

    const handleClose = () => {
        setShow(false);
    };

    const addTrustedOwner = () => {
        window.location = "/add-trusted-owner"
    }

    const removeTrustedOwner = () => {
        window.location = "/remove-trusted-owner"
    }

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
    }, []);

    const handleApprove = async (email) => {
        try {
            // Hit the API to approve the issuer with the given email
            const response = await fetch(`${apiUrl}/api/approve-issuer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log('Issuer approved:', data.message);

            // Update the local state to reflect the approval status
            setShow(true)
            setMessage(data.message)
            setIssuers((prevIssuers) =>
                prevIssuers.map((issuer) =>
                    issuer.email === email ? { ...issuer, approved: true } : issuer
                )
            );
        } catch (error) {
            console.error('Error approving issuer:', error);
        }
    };

    const unapprovedIssuers = issuers.filter(issuer => !issuer.approved);

    return (
        <>
            <Container fluid className='dashboard mt-5'>
                <Row>
                    <Col xs md="9">
                        <div className='heading d-flex justify-content-between align-items-center mb-4'>
                            <h2 className='title'>Issuer Login Credentials</h2>
                            <Button label='View Issuer Details  &#8594;' className='golden ps-4 pe-4' onClick={handleShowDrawer} />
                        </div>
                        <Card>
                            <Card.Body>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Organization</th>
                                            <th>Email</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {issuers?.map((issuer) => ( */}
                                        {unapprovedIssuers?.map((issuer) => (
                                            <tr key={issuer._id}>
                                                <td>{issuer.name}</td>
                                                <td>{issuer.organization}</td>
                                                <td>{issuer.email}</td>
                                                <td>
                                                    {/* {issuer.approved ? (
                                                        <button className='btn btn-success'>Approved</button>
                                                    ) : ( */}
                                                    <div className='d-flex align-items-center' style={{ columnGap: "20px" }}>
                                                        <Button
                                                            label='Approve'
                                                            onClick={() => handleApprove(issuer.email)}
                                                            disabled={issuer.approved}
                                                            className='golden ps-3 pe-3 py-2'
                                                        />
                                                        <Button
                                                            label='Reject'
                                                            onClick={() => handleApprove(issuer.email)}
                                                            disabled={issuer.approved}
                                                            className='danger ps-3 pe-3 py-2'
                                                        />
                                                    </div>
                                                    {/* )} */}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs md="3">
                        <Card className=''>
                            <Card.Header>Admin Wallet Balance</Card.Header>
                            <Card.Body>
                                {balance && <h2 className='my-2 balance'>&#8377;: <strong>{balance}</strong></h2>}
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

            <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
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
                    <button className='success' onClick={handleClose}>Ok</button>
                </Modal.Body>
            </Modal>

            <div className="drawer-overlay" onClick={handleCloseDrawer}></div>

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
                <Form.Group controlId="search">
                    <div className="search d-flex">
                        <Form.Control 
                            type='text'
                            placeholder='Search User by email'
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
                            />
                        </div>
                    </div>
                </Form.Group>
                <div className='profile-info d-flex'>
                    <div className='pic'>jd</div>
                    <div className='details'>
                        <div className='name'>John Doe</div>
                        <div className='designation'>Sr. UI/UX Designer</div>
                        <div className='contact d-flex align-items-center'>
                            <Link href="tel:7836280835">
                                <div className='item d-flex align-items-center'>
                                    <Image 
                                        src="https://images.netcomlearning.com/ai-certs/icons/phone-call.svg"
                                        width={16}
                                        height={16}
                                        alt='Phone'
                                    />
                                    7836280835
                                </div>
                            </Link>
                            <Link href="mailto:john.doe@aicerts.io">
                                <div className='item d-flex align-items-center'>
                                    <Image 
                                        src="https://images.netcomlearning.com/ai-certs/icons/email-darksvg.svg"
                                        width={16}
                                        height={16}
                                        alt='Phone'
                                    />
                                    john.doe@aicerts.io
                                </div>
                            </Link>
                        </div>
                    </div>                               
                </div>
                <div className='org-details'>
                    <h2 className='title'>Organization Details</h2>
                    <Row>
                        <Col xs={12} md={4}>
                            <div className='label'>Organization Name</div>
                            <div className='info'>AI Certs</div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className='label'>Organization Type</div>
                            <div className='info'>AI & Blockchain</div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className='label'>Industry Sector</div>
                            <div className='info'>Technology</div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className='label'>Website</div>
                            <div className='info'>
                                <Link href="https://www.aicerts.io" target='_blank'>
                                    https://www.aicerts.io
                                </Link>
                            </div>
                        </Col>
                        <Col xs={12} md={4}>
                            <div className='label'>Address</div>
                            <div className='info'>New Delhi - 110072, India</div>
                        </Col>
                    </Row>
                </div>
                <div className='action'>
                    <Button label='Reject' className='warning w-25' />
                </div>
            </div>
        </>
    );
}

export default Dashboard;
