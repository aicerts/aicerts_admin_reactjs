import Image from 'next/image'
import React from 'react'
import { Modal } from 'react-bootstrap'

const AlertModal = ({handleClose,errorMessage,successMessage,show }) => {
  return (
    <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
    <Modal.Body>
      {errorMessage !== '' ? (
        <>
          <div className='error-icon'>
            <Image
              src="/icons/invalid-password.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <div className='text' style={{ color: '#ff5500' }}>{errorMessage}</div>
          <button className='warning' onClick={handleClose}>Ok</button>
        </>
      ) : (
        <>
          <div className='error-icon success-image'>
            <Image
              src="/icons/success.gif"
              layout='fill'
              objectFit='contain'
              alt='Loader'
            />
          </div>
          <div className='text' style={{ color: '#CFA935' }}>{successMessage}</div>
          <button className='success' onClick={handleClose}>Ok</button>
        </>
      )}


    </Modal.Body>
  </Modal>
  )
}

export default AlertModal
