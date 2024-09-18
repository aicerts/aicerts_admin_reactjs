import Image from 'next/image'
import React from 'react'
import { Modal } from 'react-bootstrap'

const Loading = ({isLoading}) => {
  return (
    <Modal className='loader-modal' show={isLoading} centered>
            <Modal.Body>
                <div className='certificate-loader'>
                    <Image
                        src="/backgrounds/login-loading.gif"
                        layout='fill'
                        alt='Loader'
                    />
                </div>
                <div className='text mt-3'>Please Wait</div>
                {/* <ProgressBar now={now} label={`${now}%`} /> */}
            </Modal.Body>
        </Modal>
  )
}

export default Loading
