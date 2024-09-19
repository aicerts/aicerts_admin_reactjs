import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface AddServerModalProps {
  show: boolean;
  onHide: () => void;
}

interface Server {
  serverName: string;
  endPoint: string;
  serverIp: string;
}

const AddServerModal: React.FC<AddServerModalProps> = ({ show, onHide }) => {
  const [serverName, setServerName] = useState<string>('');
  const [endPoint, setEndPoint] = useState<string>('');
  const [serverIp, setServerIp] = useState<string>('');

  const handleAddServer = () => {
    const newServer: Server = {
      serverName,
      endPoint,
      serverIp,
    };
    console.log(newServer);
    onHide(); // Close the modal after adding
  };

  // Styles defined within the component
 

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header style={styles.modalHeader} closeButton>
        <Modal.Title style={styles.modalTitle}>Add New Server</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formServerName">
            <Form.Label style={styles.formLabel}>Server Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter server name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEndPoint">
            <Form.Label style={styles.formLabel}>End Point</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter endpoint"
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formServerIp">
            <Form.Label style={styles.formLabel}>Server IP</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter server IP"
              value={serverIp}
              onChange={(e) => setServerIp(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button
          className='global-button golden'
          onClick={handleAddServer}
        >
          Add Server
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddServerModal;


const styles = {
  modalHeader: {
    backgroundColor: '#F3F3F3',
  },
  modalTitle: {
    fontFamily:  "Montserrat",
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2F3847',
  },
  formLabel: {
    fontFamily:  "Montserrat",
    fontSize: '16px',
    color: '#5B5A5F',
  }

};