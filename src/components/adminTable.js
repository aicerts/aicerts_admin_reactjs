import React from 'react';
import { Table } from 'react-bootstrap';
import EyeIcon from '../../assets/img/eye-icon.svg'; // Eye icon from react-icons
import Image from 'next/image';

const AdminTable = ({ issuers, selectedTab, onView }) => {
  const getStatusStyle = (status) => {
    return status === 'Pending'
      ? { color: '#FABC3F', backgroundColor: 'rgba(250, 188, 63, 0.1)' } // Red with 10% bg for pending
      : { color: '#FF885B', backgroundColor: 'rgba(255, 136, 91, 0.1)' }; // Green with 10% bg for approved
  };

  return (
    <div className='issuer-data'>
      {issuers && issuers.length > 0 ? (
        <Table bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              {/* Conditionally render "Matic" and "Action" columns if selectedTab is not 'newRequest' */}
              {selectedTab !== 'newRequest' && <th>Matic</th>}
              {selectedTab !== 'newRequest' && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {issuers.map((issuer) => (
              <tr key={issuer._id}>
                <td>{issuer.name}</td>
                <td>{issuer.email}</td>
                <td>
                  <div
                    className='d-flex align-items-center'
                    style={{
                      columnGap: '5px',
                      padding: '5px',
                      width: 'fit-content',
                      ...getStatusStyle(issuer.approved ? 'Approved' : 'Pending'),
                    }}
                  >
                    <span
                      style={{
                        height: '10px',
                        width: '10px',
                        backgroundColor: issuer.approved ? '#FF885B' : '#FABC3F',
                        borderRadius: '50%',
                        display: 'inline-block',
                      }}
                    ></span>
                    {issuer.approved ? 'Active' : 'Pending'}
                  </div>
                </td>
                {/* Conditionally render "Matic" and "Action" columns if selectedTab is not 'newRequest' */}
                {selectedTab !== 'newRequest' && <td>{issuer.matic || 'N/A'}</td>}
                {selectedTab !== 'newRequest' && (
                  <td>
                    <div
                      className='d-flex align-items-center pointer'
                      style={{ columnGap: '10px', color: '#CFA935', cursor: 'pointer' }}
                      onClick={() => onView(issuer)}
                    >
                      <Image src={EyeIcon} />
                      View
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px', color: '#FF885B' , marginBottom:"70px"}}>
          No Data Found
        </div>
      )}
    </div>
  );
};

export default AdminTable;
