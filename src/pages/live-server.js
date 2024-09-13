import React from 'react'
import ServerTable from '../components/serverTable'

const Liveserver = () => {
  return (
    <div className='page-bg'>
      <div  className='position-relative h-100 live-wrapper'>
      <ServerTable/>
      </div>
    </div>
  )
}

export default Liveserver
