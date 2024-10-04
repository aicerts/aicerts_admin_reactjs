import React from 'react'
import ServerTable from '../components/serverTable'

const Liveserver = () => {
  return (
    <div className='page-bg d-flex justify-content-center'>
      <div  className='  h-100 live-wrapper' style={{ width:"80%"}}>
      <ServerTable/>
      </div>
    </div>
  )
}

export default Liveserver
