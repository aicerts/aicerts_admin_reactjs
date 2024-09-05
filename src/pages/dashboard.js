import React, { useEffect, useState } from 'react';
import AdminHeader from '../components/adminHeader';
import AdminTable from '../components/adminTable';
import Button from '../../shared/button/button';
import { Modal } from 'react-bootstrap';
import { useRouter } from 'next/router';
import IssuerDetailsDrawer from '../components/issuer-details-drawer';

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('issueList'); // Default to 'issueList' tab
  const [token, setToken] = useState('');
  const [issuers, setIssuers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [issuerDetails, setIssuerDetails] = useState(null);
  const router = useRouter();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
      try {
        if (storedUser && storedUser.JWTToken) {
          setToken(storedUser.JWTToken);

          const response = await fetch(`${apiUrl}/api/get-all-issuers/`, {
            headers: {
              Authorization: `Bearer ${storedUser.JWTToken}`,
            },
          });
          const data = await response.json();
          setIssuers(data.data);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [router]);

  // Handle view button click
  const handleView = (data) => {
    setIssuerDetails(data);
    setModalShow(true);
  };

  // Handle close modal
  const handleCloseModal = async () => {
    setModalShow(false);
  };

  // Filtering issuers based on the selected tab
  const filteredIssuers = selectedTab === 'issueList'
    ? issuers.filter(issuer => issuer.approved === true)
    : issuers.filter(issuer => issuer.approved === false);

  return (
    <div>
      <AdminHeader />
      <div className='px-5'>
        <Button
          label="Issue List"
          className={selectedTab === 'issueList' ? 'golden m-2' : 'outlined m-2'}
          onClick={() => handleTabChange('issueList')}
        />
        <Button
          label="New Request"
          className={selectedTab === 'newRequest' ? 'golden m-2' : 'outlined m-2'}
          onClick={() => handleTabChange('newRequest')}
        />
        <AdminTable selectedTab={selectedTab} issuers={filteredIssuers} onView={handleView} />
      </div>
      <IssuerDetailsDrawer modalShow={modalShow} setIssuerDetails={setIssuerDetails} onHide={handleCloseModal} issuerDetails={issuerDetails} />
    </div>
  );
};

export default Dashboard;
