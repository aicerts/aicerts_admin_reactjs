import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Card, Col, Image, Row } from 'react-bootstrap';
import DashboardCard from '../components/dashboardCard';
import dashboardServices from "../services/dashboardServices"

const Blockchain = () => {
    const [details, setDetails] = useState({});
    const [token, setToken] = useState('');
    const [balance, setBalance] = useState('');
    const [issuers, setIssuers] = useState([]);
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [address] = useState(process.env.NEXT_PUBLIC_BASE_OWNER_ADDRESS);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const [tab, setTab] = useState(1);


    const handleChange = (value) => {
        setTab(value);
      };

      


    const addTrustedOwner = () => {
        window.location = "/add-trusted-owner"
    }

    const removeTrustedOwner = () => {
        window.location = "/remove-trusted-owner"
    }

    const createDetail = (response, period, index) => ({
        title: "Issuance",
        titleValue: period,
        badgeIcon: "",
        value: response?.data?.details[period][index] || "0",
        percentage: "+21.01%",
        image: "/icons/badge-cert.svg",
      });
      

    const getDetails = async () => {
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
      };
      useEffect(()=>{
       
          
          getDetails();
      },[])

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

    
  return (
    <div className='d-flex justify-content-center mt-2 dashboard'>
      <Col xs md="10" >
                        
                                
                        <Card style={{borderRadius:"0"}} className='p-3 mb-2 card-body'>
                            <div className='d-flex flex-row justify-content-between text-center align-items-center'>

                        <h4 className='font-weight-bold' >Issuance</h4>

                        <div className='admin-button-container mb-2'>
  <span onClick={() => handleChange(1)} className={`btn ${tab === 1 ? 'btn-golden' : ''}`}>NetCom</span>
  <span className="vertical-line"></span>
  <span onClick={() => handleChange(2)} className={`btn ${tab === 2 ? 'btn-golden' : ''}`}>LMS</span>
</div>
</div>
                       
                        <Row className='mt-2'>
                        <Col xs md="4">
                        <DashboardCard item={tab === 1? details.NetComTotal : details.LmsTotal}/>
                        
                        </Col>
                        <Col xs md="4">
                        <DashboardCard item={tab === 1?details.NetComMonth: details.LmsMonth}/>
                        
                        </Col>
                        <Col xs md="4">
                        <DashboardCard item={tab === 1?details.NetComWeek: details.LmsWeek}/>
                        
                        </Col>
                        </Row>
                        
                            </Card>
                            <Row >
                                <Col md={6}>
                            <Card style={{borderRadius:"0px"}}  className='card-body'>
                                <Card.Header>Admin Wallet Balance</Card.Header>
                                <Card.Body>
                                    {balance && <h2 className='my-2 balance'><Image height={35} width={35} src="/icons/matic.svg" /> <strong>{balance}</strong></h2>}
                                    <hr className='dashed' />
                                    <div className='latest-update'><span>Last Updated:</span> <strong>02/03/2024</strong></div>
                                </Card.Body>
                            </Card>
                            </Col>
                            <Col md={6}>
                            <Card style={{borderRadius:"0px"}}  className='mt-4 mt-md-0 card-body'>
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
                        </Col>
    </div>
  )
}

export default Blockchain;