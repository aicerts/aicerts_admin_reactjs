import React from 'react'
import { Table } from 'react-bootstrap'

const adminTable = () => {
    const [token, setToken] = useState('');
    const [issuers, setIssuers] = useState([]);
    
    useEffect(() => {
        // Fetch data from the API endpoint
        const storedUser = JSON.parse(localStorage.getItem('user'));

        const fetchData = async () => {
            try {
                // Check if user is in localStorage

                if (storedUser && storedUser.JWTToken) {
                    // User is available, set the token
                    setToken(storedUser.JWTToken);

                    // Fetch issuers data
                    const response = await fetch(`${apiUrl}/api/get-all-issuers/`, {
                        headers: {
                            Authorization: `Bearer ${storedUser.JWTToken}`
                        }
                    });
                    const data = await response.json();
                    setIssuers(data.data);

                } else {
                    // User is not available, redirect to login
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [address, router]);

  return (
    <div className='issuer-data'>
                                        <Table bordered>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Organization</th>
                                                    <th>Email</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {unapprovedIssuers?.map((issuer) => (
                                                    <tr key={issuer._id}>
                                                        <td>{issuer.name}</td>
                                                        <td>{issuer.organization}</td>
                                                        <td>{issuer.email}</td>
                                                        <td>
                                                            <div className='d-flex align-items-center' style={{ columnGap: "20px" }}>
                                                                <Button
                                                                    label='Approve'
                                                                    onClick={() => handleApprove(issuer.email)}
                                                                    disabled={issuer.approved}
                                                                    className='golden ps-3 pe-3 py-2'
                                                                />
                                                                <Button
                                                                    label='Reject'
                                                                    onClick={() => handleReject(issuer.email)}
                                                                    disabled={issuer.approved}
                                                                    className='danger ps-3 pe-3 py-2'
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
  )
}

export default adminTable
