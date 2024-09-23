import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Image from 'next/image'; // Assuming you're using Next.js
import dashboardServices from '@/services/dashboardServices';

interface AddServerModalProps {
  show: boolean;
  onHide: () => void;
}

interface Server {
  serverName: string;
  endPoint: string;
  serverIp: string;
}

const AddServerModal: React.FC<AddServerModalProps> = ({ show, onHide  }) => {
  const [serverName, setServerName] = useState<string>('');
  const [endPoint, setEndPoint] = useState<string>('');
  const [serverIp, setServerIp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddServer = () => {
    setIsLoading(true);  // Set loading state
    setMessage(null);
    setError(null);
    const userItem = localStorage.getItem('user');
    const storedUser = userItem ? JSON.parse(userItem) : null;
    
    if (storedUser && storedUser.JWTToken) {

    const newServer: Server = {
      serverName,
      endPoint,
      serverIp,
    };

    const apiData = {
      email:storedUser.email,
      serverName: newServer.serverName,
      serverAddress: newServer.serverIp,
      serverEndpoint: newServer.endPoint,
    };

    dashboardServices.AddServer(apiData, (response) => {
      setIsLoading(false);  // Reset loading state

      if (response.status === "SUCCESS") {
        setMessage("Server added successfully");
        console.log("Server added successfully:", response.data);
      } else {
        setError("Error adding server: " + response.error);
        console.error("Error adding server:", response.error);
      }
    });
  };
}

  const handleBack=(()=>{
    setError("")
    setIsLoading(false)
    setMessage("")
    setServerName('')
    setServerIp('')
    setEndPoint('')
    onHide();
})

  return (
    <Modal show={show} onHide={handleBack} centered>
      <Modal.Header style={styles.modalHeader} closeButton>
        <Modal.Title style={styles.modalTitle}>Add New Server</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      { (!message && !error) && (
        <Form>
          <Form.Group className="mb-3" controlId="formServerName">
            <Form.Label style={styles.formLabel}>Server Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter server name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              disabled={isLoading}  // Disable input during loading
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEndPoint">
            <Form.Label style={styles.formLabel}>End Point</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter endpoint"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              disabled={isLoading}  // Disable input during loading
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formServerIp">
            <Form.Label style={styles.formLabel}>Server IP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter server IP"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
              disabled={isLoading}  // Disable input during loading
            />
          </Form.Group>
        </Form>
      )}
        {!isLoading && (message || error) && (
                    <div className='text-center'>
                        {error ? (
                            <>
                                <div className='error-icon'>
                                    <Image
                                        src="/icons/invalid-password.gif"
                                        layout='fill'
                                        objectFit='contain'
                                        alt='Error'
                                    />
                                </div>
                                <h3 className='text' style={{ color: 'red' }}>{error}</h3>
                            </>
                        ) : (
                            <>
                            <div className='error-icon'>
                                <Image
                                    src="/icons/success.gif"
                                    layout='fill'
                                    objectFit='contain'
                                    alt='Success'
                                />
                            </div>
                            <h3 className='text' style={{ color: '#CFA935' }}>{message}</h3>
                        </>
                        )}
                        <button className='global-button golden mt-3' onClick={handleBack}>
                            Ok
                        </button>
                    </div>
                )}
      </Modal.Body>
      { (!message && !error) && (
      <Modal.Footer className="d-flex justify-content-center">
        <Button
          className='global-button golden'
          onClick={handleAddServer}
          disabled={isLoading}  // Disable button during loading
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              /> Adding...
            </>
          ) : (
            "Add Server"
          )}
        </Button>
      </Modal.Footer>
      )}
    </Modal>
  );
};

export default AddServerModal;

const styles = {
  modalHeader: {
    backgroundColor: '#F3F3F3',
  },
  modalTitle: {
    fontFamily: "Montserrat",
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2F3847',
  },
  formLabel: {
    fontFamily: "Montserrat",
    fontSize: '16px',
    color: '#5B5A5F',
  }
};
