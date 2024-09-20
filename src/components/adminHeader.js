import React, { useEffect, useState } from 'react'
import Button from '../../shared/button/button'
import bgHeader from "../../assets/img/bg-adminheader.svg"
import dashboardServices from "../services/dashboardServices"
import Image from 'next/image'

const AdminHeader = ({dashboardData}) => {
  const [totalBalance, setTotalBalance] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const [address] = useState(process.env.NEXT_PUBLIC_BASE_OWNER_ADDRESS);
    const [address2] = useState(process.env.NEXT_PUBLIC_BASE_OWNER_ADDRESS2);
const [message, setMessage] = useState('');
const [balance, setBalance] = useState('');



  const getDetails = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    try {
      dashboardServices.getDetails(storedUser.email, (response) => {
        if (response.status === 'SUCCESS') {
          setTotalBalance(response?.data.details?.Total || 0)
        } else {
          console.error("Failed to fetch details", response);
        }
      });
    } catch (error) {
      console.error("Error in getDetails:", error);
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    try {
        //   setIsLoading(true);

        // Make both API calls simultaneously using Promise.all
        const [response1, response2] = await Promise.all([
            fetch(`${apiUrl}/api/check-balance?address=${address}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storedUser.JWTToken}`,
                    'Content-Type': 'application/json',
                },
            }),
            fetch(`${apiUrl}/api/check-balance?address=${address2}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storedUser.JWTToken}`,
                    'Content-Type': 'application/json',
                },
            }),
        ]);

        const responseData1 = await response1.json();
        const responseData2 = await response2.json();
        if (response1.status === 200 && response2.status === 200) {
            const totalBalance = (
                parseFloat(responseData1.balance || 0) +
                parseFloat(responseData2.balance || 0)
            ).toFixed(2);

            setMessage('Success');
            setBalance(totalBalance);
        } else {
            setMessage('Failed to fetch one or both balances');
            setBalance('');
        }
    } catch (error) {
        console.error('Error fetching balances:', error.message);
        setBalance('');
        //   setShow(true);
    }
};

  useEffect(()=>{
   
    handleSubmit()
      getDetails();
  },[])
  return (
    <div style={{background: "../../assets/img/bg-adminheader.svg"}} className='mt-5 admin-header-wrapper d-flex flex-column flex-md-row justify-content-between'>
        {/* <div className='admin-header-card d-flex flex-column text-centre'>
<div className='card-title d-flex justify-content-center align-items-center text-center'>
Total Issuer
</div>
<div className='d-flex flex-column justify-content-center align-items-center text-center'>
    <h2 className='d-flex text-center'>{dashboardData?.allIssuers || 0}</h2>
 
</div>
        </div> */
      }

           <div className='admin-header-card d-flex flex-row text-centre justify-content-between'>
       <div className='d-flex flex-row text-centre justify-content-center'>
        <div className='badge-container'>
        <Image width={20} height={50} className='badge-cert' src="/icons/badge-cert.svg" alt='Badge'/> {/* Image for badge */}
      </div>
<div
  style={{ height: '100%' }}

className='d-flex flex-column ms-3'>
<p className='text-header-card'>Total Issuers</p>
   
    <h5 className='text-header-card-bold '>{dashboardData?.allIssuers || 0}</h5>
   
</div>
</div>
<div>
  <div className='active-wrapper d-flex text-center align-items-center justify-content-center'>
 Active: 
  {dashboardData?.activeIssuers || 0}
  </div>
  <div className='mt-2 inactive-wrapper d-flex text-center align-items-center justify-content-center'>
    Inactive:
  {dashboardData?.inactiveIssuers || 0}
  </div>
  <div className='mt-2 pending-wrapper d-flex text-center align-items-center justify-content-center'>
    Pending:
  {dashboardData?.pendingIssuers || 0}
  </div>



    </div>
        </div>
        <div className='admin-header-card d-flex flex-row text-centre'>
        <div className='badge-container'>
        <Image width={20} height={50} className='badge-cert' src="/icons/badge-cert.svg" alt='Badge'/> {/* Image for badge */}
      </div>
<div
  style={{ height: '100%' }}

className='d-flex flex-column ms-3'>
<p className='text-header-card'>Total Issuance</p>
   
    <h5 className='text-header-card-bold '>{totalBalance || 0}</h5>
   
</div>
        </div>
        <div className='admin-header-card d-flex flex-row text-centre'>
        <div className='badge-container'>
        <Image width={20} height={50} className='badge-cert' src="/icons/badge-cert.svg" alt='Badge'/> {/* Image for badge */}
      </div>
<div
  style={{ height: '100%' }}

className='d-flex flex-column ms-3'>
<p className='text-header-card'>Total Avl.Bal./Matic's Spent so far 
</p>
   
    <h5 className='text-header-card-bold '>{ balance || 0} / 55</h5>
   
</div>
        </div>
    </div>
  )
}

export default AdminHeader
