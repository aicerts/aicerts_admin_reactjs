import React, { useEffect, useState } from 'react'
import Button from '../../shared/button/button'
import bgHeader from "../../assets/img/bg-adminheader.svg"
import dashboardServices from "../services/dashboardServices"
import Image from 'next/image'

const AdminHeader = ({dashboardData}) => {
  const [totalBalance, setTotalBalance] = useState('');


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
  useEffect(()=>{
   
      
      getDetails();
  },[])
  return (
    <div style={{background: "../../assets/img/bg-adminheader.svg"}} className='admin-header-wrapper d-flex flex-column flex-md-row justify-content-between'>
        {/* <div className='admin-header-card d-flex flex-column text-centre'>
<div className='card-title d-flex justify-content-center align-items-center text-center'>
Total Issuer
</div>
<div className='d-flex flex-column justify-content-center align-items-center text-center'>
    <h2 className='d-flex text-center'>{dashboardData?.allIssuers || 0}</h2>
 
</div>
        </div> */}
           <div className='admin-header-card d-flex flex-row text-centre justify-content-between'>
       <div className='d-flex flex-row text-centre justify-content-center'>
        <div className='badge-container'>
        <Image width={20} height={50} className='badge-cert' src="/icons/badge-cert.svg" alt='Badge'/> {/* Image for badge */}
      </div>
<div
  style={{ height: '100%' }}

className='d-flex flex-column ms-3'>
<p className='text-header-card'>Total Issuer</p>
   
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



    </div>
        </div>
        <div className='admin-header-card d-flex flex-row text-centre'>
        <div className='badge-container'>
        <Image width={20} height={50} className='badge-cert' src="/icons/badge-cert.svg" alt='Badge'/> {/* Image for badge */}
      </div>
<div
  style={{ height: '100%' }}

className='d-flex flex-column ms-3'>
<p className='text-header-card'>Total Certifcated Issuer</p>
   
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
<p className='text-header-card'>Total Availble Balance/ Matics spent</p>
   
    <h5 className='text-header-card-bold '>{ 0}</h5>
   
</div>
        </div>

        
      
    </div>
  )
}

export default AdminHeader
