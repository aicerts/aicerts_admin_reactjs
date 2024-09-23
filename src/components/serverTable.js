import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Recycle from '../../assets/img/recycle.png';
import Button from '../../shared/button/button';
import Image from 'next/image';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;

const ServerTable = ({ onView }) => {
    const [servers, setServers] = useState([]); // Hold servers fetched from API

    // Fetch server list from API
    const fetchServers = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.JWTToken) {
        try {
            const response = await fetch(`${apiUrl}/api/get-server-details`, {
                headers: {
                  Authorization: `Bearer ${storedUser.JWTToken}`,
                },
              }); // API call to get server details
            const data = await response.json();
            if (response.ok) {
                setServers(data.data); // Assuming `data` contains an array of servers
            } else {
                console.error('Error fetching servers:', data.error);
            }
        } catch (error) {
            console.error('Error fetching servers:', error.message);
        }
    }

    };

  

    // Fetch servers on mount
    useEffect(() => {
        fetchServers();
    }, []);



    return (
        <div className='issuer-data'>
            <p className='font-weight-bold title-blockchain'>Live Servers</p>
            <Table bordered>
                <thead className="table-secondary"> {/* Set header background color to gray */}
                    <tr>
                        <th>S.No</th> {/* Serial Number column */}
                        <th>Name</th>
                        <th>IP</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {servers.map((server, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td> {/* Display the serial number */}
                            <td>{server.serverName}</td>
                            <td>
                                {server.serverAddress ? (
                                    <a
                                    href={
                                        server.serverAddress.startsWith('http://') ||
                                        server.serverAddress.startsWith('https://')
                                        ? server.serverAddress
                                        : `http://${server.serverAddress}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    >
                                    {server.serverAddress}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                                </td>

                            <td>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: server.serverStatus ? 'rgba(255, 136, 91, 0.1)' : 'rgba(250, 188, 63, 0.1)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        width: 'fit-content',
                                        color: server.serverStatus ? '#FF885B' : '#DB371F' 
                                    }}
                                >
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor:server.serverStatus ? 'rgba(255, 136, 91, 1)' : 'rgba(219, 55, 31, 1)',
                                            marginRight: '5px'
                                        }}
                                    />
                                    {server.serverStatus ? 'Active' : 'Inactive'}
                                </div>
                            </td>
                            <td>
                                <span style={{color:"#DB371F", cursor: 'pointer'}} className='d-flex text-center align-items-center'>
                                    <Image src={Recycle} alt='remove' style={{color:"#DB371F", width: '16px' }} />
                                    Delete
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
