import React, { useState, useEffect } from 'react';
import Button from '../../shared/button/button';
import Image from 'next/image';
import { Table, Modal, Container, Row, Col, Card } from 'react-bootstrap';
import { useRouter } from 'next/router';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Dashboard = ({ loggedInUser }) => {
    const router = useRouter();
    const [issuers, setIssuers] = useState([]);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');
    const [token, setToken] = useState('');
    const [address] = useState('0xD18eAEf19131964B6251E6aDd468617f1A162723'); // Static address
    const [balance, setBalance] = useState('');
    

    const handleClose = () => {
        setShow(false);
    };

    const addTrustedOwner = () => {
        window.location= "/add-trusted-owner"
    }

    const removeTrustedOwner = () => {
        window.location= "/remove-trusted-owner"
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

    return (
        <>
            <Container fluid className='dashboard mt-5'>
                <Row>
                    <Col xs md="10">
                        <Card className=''>
                            <Card.Header>Issuer Details</Card.Header>
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
                                        {issuers?.map((issuer) => (
                                            <tr key={issuer._id}>
                                                <td>{issuer.name}</td>
                                                <td>{issuer.organization}</td>
                                                <td>{issuer.email}</td>
                                                <td>
                                                    {issuer.approved ? (
                                                        <button className='btn btn-success'>Approved</button>
                                                    ) : (
                                                        <React.Fragment>
                                                            <button
                                                                onClick={() => handleApprove(issuer.email)}
                                                                disabled={issuer.approved}
                                                                className='btn btn-primary'
                                                            >
                                                                Approve
                                                            </button>
                                                        </React.Fragment>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs md="2">
                        <Card className=''>
                            <Card.Header>Admin Wallet Balance</Card.Header>
                            <Card.Body>
                                {balance && <h2 className='my-2'>&#8377;: <strong>{balance}</strong></h2>}
                            </Card.Body>
                        </Card>
                        <Card className='mt-4'>
                            <Card.Header>Trusted Owner</Card.Header>
                            <Card.Body>
                                <Button label="Add Trusted Owner &#8594;" className="golden w-100" onClick={addTrustedOwner} />
                                <Button label="Remove Trusted Owner &#8594;" className="golden w-100 mt-3" onClick={removeTrustedOwner} />
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
        </>
    );
}  

export default Dashboard;
