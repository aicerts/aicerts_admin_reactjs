import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Table, Modal } from 'react-bootstrap';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Dashboard = ({ loggedInUser }) => {
    const router = useRouter();
    const [issuers, setIssuers] = useState([]);
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    const handleClose = () => {
        setShow(false);
    };

    useEffect(() => {
        // Fetch data from the API endpoint
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/get-all-issuers/`);
                const data = await response.json();
                setIssuers(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleApprove = async (email) => {
        try {
            // Hit the API to approve the issuer with the given email
            const response = await fetch(`${apiUrl}/api/approve-issuer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            console.log('Issuer approved:', data.message);

            // Update the local state to reflect the approval status
            setShow(true)
            setMessage(data.message)
            setIssuers((prevIssuers) =>
                prevIssuers.map((issuer) =>
                    issuer.email === email ? { ...issuer, approved: true } : issuer
                )
            );
        } catch (error) {
            console.error('Error approving issuer:', error);
        }
    };

    return (
        <>
        <div className='container mt-5'>
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Organization</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {issuers.map((issuer) => (
                        <tr key={issuer._id}>
                            <td>{issuer.name}</td>
                            <td>{issuer.organization}</td>
                            <td>{issuer.email}</td>
                            <td>
                                {issuer.approved ? (
                                    <span>Approved</span>
                                ) : (
                                    <React.Fragment>
                                        <input
                                            type="checkbox"
                                            onChange={() => { }}
                                        />
                                        <button
                                            onClick={() => handleApprove(issuer.email)}
                                            disabled={issuer.approved}
                                        >
                                            Approve
                                        </button>
                                    </React.Fragment>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        <Modal onHide={handleClose} className='loader-modal text-center' show={show} centered>
            <Modal.Body className='p-5'>                    
                <div className='error-icon'>
                    <Image
                        src="/icons/check-mark.svg"
                        layout='fill'
                        objectFit='contain'
                        alt='Loader'
                    />
                </div>
                <h3 style={{ color: '#198754' }}>{message}</h3>
                <button className='success' onClick={handleClose}>Ok</button>
            </Modal.Body>
        </Modal>
        </>
    );
}

// export async function getServerSideProps(context) {
//     const session = await getSession(context);
  
//     if (!session) {
//       // Redirect to login page if the user is not logged in
//       return {
//         redirect: {
//           destination: '/admin/login-2', // Adjust the path to your login page
//           permanent: false,
//         },
//       };
//     }
  
//     return {
//       props: {}, // Will be passed to the page component as props
//     };
//   }
  

export default Dashboard;
