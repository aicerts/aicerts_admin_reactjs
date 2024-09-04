import React from 'react'
import Button from '../../shared/button/button'
import bgHeader from "../../assets/img/bg-adminheader.svg"
const AdminHeader = () => {
  return (
    <div style={{background: "../../assets/img/bg-adminheader.svg"}} className='admin-header-wrapper d-flex flex-column flex-md-row justify-content-between'>
        <div className='admin-header-card d-flex flex-column text-centre'>
<div className='card-title d-flex justify-content-center align-items-center text-center'>
Total Issuer
</div>
<div className='d-flex flex-column justify-content-center align-items-center text-center'>
    <h2 className='d-flex text-center'>300</h2>
    <div>
    <Button  label="Active: 250"  className="golden m-2 " />
    <Button label="Inactive: 50"  className="outlined" />

    </div>
</div>
        </div>
        <div className='admin-header-card d-flex flex-column text-centre'>
<div className='card-title d-flex justify-content-center align-items-center text-center'>
Total Certifcated Issuer
</div>
<div
  style={{ height: '100%' }}

className='d-flex flex-column justify-content-center align-items-center text-center'>
    <h2 className='d-flex text-center'>300</h2>
   
</div>
        </div>
         <div className='admin-header-card d-flex flex-column text-centre'>
<div className='card-title d-flex justify-content-center align-items-center text-center'>
Matic's Spent / Ava. Balance
</div>
<div
  className="d-flex flex-column justify-content-center align-items-center text-center"
  style={{ height: '100%' }}
>
  <h2 className="d-flex text-center">300/500</h2>
</div>

        </div>
        
      
    </div>
  )
}

export default AdminHeader
