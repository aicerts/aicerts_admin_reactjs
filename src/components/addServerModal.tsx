import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import Image from 'next/image'; 
import dashboardServices from '@/services/dashboardServices';

interface AddServerModalProps {
  show: boolean;
  onHide: () => void;
  isEditMode: boolean;
  serverData?: {
    serverName: string;
    endPoint: string;
    serverIp: string;
    id: string;
  };
}

const AddServerModal: React.FC<AddServerModalProps> = ({ show, onHide, isEditMode, serverData }) => {
  const [serverName, setServerName] = useState<string>('');
  const [endPoint, setEndPoint] = useState<string>('');
  const [serverIp, setServerIp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Populate fields when editing
  useEffect(() => {
    if (isEditMode && serverData) {
      setServerName(serverData.serverName);
      setEndPoint(serverData.endPoint);
      setServerIp(serverData.serverIp);
    }
  }, [isEditMode, serverData]);

  const handleAddOrEditServer = () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);
    const userItem = localStorage.getItem('user');
    const storedUser = userItem ? JSON.parse(userItem) : null;

    if (storedUser && storedUser.JWTToken) {
      const apiData = {
        email: storedUser.email,
        serverName,
        serverAddress: serverIp,
        serverEndpoint: endPoint,
      };

      const callback = (response: any) => {
        setIsLoading(false);
        if (response.data.code == 200) {
          setMessage(isEditMode ? 'Server updated successfully' : 'Server added successfully');
        } else {
          setError(response.data.message || "Please Try Again Later");
        }
      };

      if (isEditMode && serverData?.id) {
        // Make API call to update server
        // dashboardServices.EditServer(serverData.id, apiData, callback);
      } else {
        // Make API call to add server
        dashboardServices.AddServer(apiData, callback);
      }
    }
  };

  const handleBack = () => {
    setError('');
    setIsLoading(false);
    setMessage('');
    setServerName('');
    setServerIp('');
    setEndPoint('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleBack} centered>
      <Modal.Header style={styles.modalHeader} closeButton>
        <Modal.Title style={styles.modalTitle}>
          {isEditMode ? 'Edit Server' : 'Add New Server'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {(!message && !error) && (
          <Form>
            <Form.Group className="mb-3" controlId="formServerName">
              <Form.Label style={styles.formLabel}>Server Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter server name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndPoint">
              <Form.Label style={styles.formLabel}>End Point</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter endpoint"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formServerIp">
              <Form.Label style={styles.formLabel}>Server IP/ Server URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter server IP"
                value={serverIp}
                onChange={(e) => setServerIp(e.target.value)}
                disabled={isLoading}
              />
            </Form.Group>
          </Form>
        )}
        
        {!isLoading && (message || error) && (
          <div className="text-center">
            {error ? (
              <>
                <div className="error-icon">
                  <Image
                    src="/icons/invalid-password.gif"
                    layout="fill"
                    objectFit="contain"
                    alt="Error"
                  />
                </div>
                <h3 className="text" style={{ color: 'red' }}>{error}</h3>
              </>
            ) : (
              <>
                <div className="error-icon">
                  <Image
                    src="/icons/success.gif"
                    layout="fill"
                    objectFit="contain"
                    alt="Success"
                  />
                </div>
                <h3 className="text" style={{ color: '#CFA935' }}>{message}</h3>
              </>
            )}
            <button className="global-button golden mt-3" onClick={handleBack}>
              Ok
            </button>
          </div>
        )}
      </Modal.Body>
      {(!message && !error) && (
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            className="global-button golden"
            onClick={handleAddOrEditServer}
            disabled={isLoading || !serverIp || !serverName || !endPoint}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> {isEditMode ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              isEditMode ? 'Update Server' : 'Add Server'
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
  },
};
