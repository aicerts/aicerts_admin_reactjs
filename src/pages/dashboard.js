import React, { useCallback, useEffect, useState } from "react";
import AdminHeader from "../components/adminHeader";
import AdminTable from "../components/adminTable";
import Button from "../../shared/button/button";
import { useRouter } from "next/router";
import IssuerDetailsDrawer from "../components/issuer-details-drawer";
import SearchAdmin from "../components/searchAdmin";
import BarChart from "../components/barChart";

const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("issuerRequest"); // Default to 'issueList' tab
  const [token, setToken] = useState("");
  const [issuers, setIssuers] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [issuerDetails, setIssuerDetails] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    allIssuers: 0,
    activeIssuers: 0,
    inactiveIssuers: 0,
    pendingIssuers: 0,
    maticSpent: 0,
  });
  const router = useRouter();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const fetchData =useCallback( async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

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
        setDashboardData({
          allIssuers: data?.allIssuers,
          activeIssuers: data?.activeIssuers,
          inactiveIssuers: data?.inactiveIssuers,
          pendingIssuers: data?.pendingIssuers,
          maticSpent: data?.maticSpent,
        });
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },[router]);

  useEffect(() => {
    fetchData();
  }, [router, fetchData]);

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
  const filteredIssuers =
    selectedTab === "issueList"
      ? issuers.filter((issuer) => issuer.status === 1)
      : issuers.filter(
          (issuer) =>
            issuer.status === 0 || issuer.status === 3 || issuer.status === 2
        );

  return (
    <div className="page-bg">
      <div
        style={{ padding: "0px 150px", marginTop: "125px", height:"fit-content" }}
        className="position-relative d-flex flex-column gap-3"
      >
        <p
          style={{ position: "absolute", left: "150px", top: "0px", }}
          className="font-weight-bold title-blockchain"
        >
          Dashboard
        </p>

        <IssuerDetailsDrawer
          setModalShow={setModalShow}
          modalShow={modalShow}
          setIssuerDetails={setIssuerDetails}
          onHide={handleCloseModal}
          issuerDetails={issuerDetails}
          fetchData={fetchData}
          
        />
   
          <AdminHeader dashboardData={dashboardData} />
       
        <BarChart />
        {/* <PieChart/> */}
        <br />
        <div style={{border: "1px solid #BFC0C2", backgroundColor:"white"}} className=" d-flex flex-column gap-3 p-3">
        <div className=" d-flex flex-row justify-content-between">
          <SearchAdmin issuers={issuers} setIssuers={setIssuers} />

          <div className=" d-flex gap-2">
            <Button
            
              label="Issuer Request"
              className={
                selectedTab === "issuerRequest" ? "golden" : "outlined"
              }
              
              onClick={() => handleTabChange("issuerRequest")}
            />
            <Button
          
              label="Issue List"
              className={
                selectedTab === "issueList" ? "golden " : "outlined"
              }
              onClick={() => handleTabChange("issueList")}
            />
          </div>
        </div>
        <div >
          <AdminTable
            selectedTab={selectedTab}
            issuers={filteredIssuers}
            onView={handleView}
            fetchData={fetchData}
          />
        </div>

        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
