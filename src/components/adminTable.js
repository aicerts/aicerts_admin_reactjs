import React from 'react';
import { Table } from 'react-bootstrap';
import Button from '../../shared/button/button';

const AdminTable = ({ issuers, selectedTab, onView }) => {
  
  return (
    <div className='issuer-data'>
      <Table bordered>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Matic</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {issuers?.map((issuer) => (
            <tr key={issuer._id}>
              <td>{issuer.name}</td>
              <td>{issuer.email}</td>
              <td>{issuer.approved ? 'Approved' : 'Pending'}</td>
              <td>{issuer.matic || 'N/A'}</td>
              <td>
                <div className='d-flex align-items-center' style={{ columnGap: "10px" }}>
                  <Button
                    label='View'
                    onClick={() => onView(issuer)}
                    className='golden ps-3 pe-3 py-2'
                  />
                  {/* {selectedTab !== 'newRequest' && (
                    <Button
                      label='Add Matic'
                      onClick={() => handleAddMatic(issuer._id)}
                      className='succ ps-3 pe-3 py-2'
                    />
                  )} */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminTable;
