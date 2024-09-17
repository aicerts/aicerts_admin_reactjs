import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Recycle from '../../assets/img/recycle.png';

import Button from '../../shared/button/button';
import Image from 'next/image';

const ServerTable = ({ onView }) => {
    const [status, setStatus] = useState({
        certs365Admin: 'pending',
        certs365Issuer: 'pending',
        lmsLive: 'pending',
        lmsBackup: 'pending',
    });

    const checkStatus = async (ip, key) => {
        try {
            const response = await fetch(`${ip}/api/health`);
            const data = await response.json();

            if (response.ok && data.status === 'SUCCESS') {
                setStatus(prevStatus => ({ ...prevStatus, [key]: 'active' }));
            } else {
                setStatus(prevStatus => ({ ...prevStatus, [key]: 'inactive' }));
            }
        } catch (error) {
            setStatus(prevStatus => ({ ...prevStatus, [key]: 'inactive' }));
        }
    };

    useEffect(() => {
        checkStatus('http://52.72.67.100:8000', 'lmsLive');
        checkStatus('http://54.146.227.42:3002', 'lmsBackup');
        checkStatus('https://api1.certs365.io', 'certs365Admin');
        checkStatus('https://api2.certs365.io', 'certs365Issuer');
    }, []);

    const issuers = [
        {
            name: "certs365 Admin",
            status: status.certs365Admin,
            ip: "https://api1.certs365.io", 
        },
        {
            name: "certs365 Issuer",
            status: status.certs365Issuer,
            ip: "https://api2.certs365.io", 
        },
        {
            name: "LMS Live",
            status: status.lmsLive,
            ip: "http://52.72.67.100:8000"
        },
        {
            name: "LMS BackUp",
            status: status.lmsBackup,
            ip: "http://54.146.227.42:3002"
        }
    ];

    return (
        <div className='issuer-data'>
            <Table bordered>
                <thead style={{ backgroundColor: '#F3F3F3' }}>
                    <tr>
                        <th>Name</th>
                        <th>IP</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {issuers.map((issuer, index) => (
                        <tr key={index}>
                            <td>{issuer.name}</td>
                            <td>{issuer.ip || 'N/A'}</td>
                            <td>
                            <div 
  style={{ 
    display: 'flex', 
    alignItems: 'center',
    backgroundColor: issuer.status === 'active' ? 'rgba(255, 136, 91, 0.1)' : 'rgba(250, 188, 63, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    width: 'fit-content',
    color: issuer.status === 'active' ? '#FF885B' : '#FABC3F' // Change text color based on status
  }}
>
  <span 
    style={{ 
      display: 'inline-block',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: issuer.status === 'active' ? '#FF885B' : '#FABC3F',
      marginRight: '5px'
    }}
  />
  {issuer.status === 'active' ? 'Active' : 'Inactive'}
</div>

                            </td>
                            <td>
                            <span style={{color:"#DB371F", cursor: 'pointer'}} className='d-flex text-center align-items-center'>
                                    <Image src={Recycle} alt='remove' style={{color:"#DB371F", width: '16px' }} />
                                    Remove
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ServerTable;
