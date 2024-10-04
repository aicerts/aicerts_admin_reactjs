import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button as BootstrapButton,
  Form,
  Spinner,
} from "react-bootstrap"; // Import Spinner for loading
import Recycle from "../../assets/img/recycle.png";
import Button from "../../shared/button/button";
import Image from "next/image";
import AlertModal from "./alertModal"; // Import AlertModal
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;



const ServerTable = ({ onView }) => {
  const [servers, setServers] = useState([]); // Hold servers fetched from API
  const [serverStatuses, setServerStatuses] = useState({}); // Hold server statuses
  const [loadingDelete, setLoadingDelete] = useState(false); // Loading state for delete operation
  const [alertModal, setAlertModal] = useState({
    show: false,
    errorMessage: "",
    successMessage: "",
  }); // State for Alert Modal
  const [formData, setFormData] = useState({
    serverName: "",
    serverAddress: "",
    endPoint: "",
  });

  // Fetch server list from API
  const fetchServers = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
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
          console.error("Error fetching servers:", data.error);
        }
      } catch (error) {
        console.error("Error fetching servers:", error.message);
      }
    }
  };

  // Fetch server status for each row
  const fetchServerStatus = async (server) => {
    try {
      // Ensure server address starts with http or https
      let serverAddress = server.serverAddress;
      if (
        !serverAddress.startsWith("http://") &&
        !serverAddress.startsWith("https://")
      ) {
        serverAddress = `http://${serverAddress}`;
      }

      // Remove trailing slashes from serverAddress and leading slashes from serverEndpoint
      serverAddress = serverAddress.replace(/\/+$/, ""); // Remove all trailing slashes from serverAddress
      const serverEndpoint = server.serverEndpoint.replace(/^\/+/, ""); // Remove all leading slashes from serverEndpoint

      const fullUrl = `${serverAddress}/${serverEndpoint}`; // Join with a single slash

      // Fetch the server status
      const response = await fetch(fullUrl);
      setServerStatuses((prev) => ({
        ...prev,
        [server.serverAddress]: response.ok ? "Active" : "Inactive",
      }));
    } catch (error) {
      setServerStatuses((prev) => ({
        ...prev,
        [server.serverAddress]: "Inactive",
      }));
    }
  };

  // Handle delete server
  const handleDelete = async (serverName) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setLoadingDelete(true); // Set loading state to true
    try {
      const response = await fetch(`${apiUrl}/api/delete-server-details`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.JWTToken}`,
        },
        body: JSON.stringify({ serverName }),
      });

      if (response.ok) {
        // Show success message in AlertModal
        setAlertModal({
          show: true,
          successMessage: "Server deleted successfully",
          errorMessage: "",
        });
        // Refresh server list after deletion
        fetchServers();
      } else {
        setAlertModal({
          show: true,
          errorMessage: "Error deleting server",
          successMessage: "",
        });
      }
    } catch (error) {
      setAlertModal({
        show: true,
        errorMessage: `Error deleting server: ${error.message}`,
        successMessage: "",
      });
    } finally {
      setLoadingDelete(false); // Set loading state to false after operation
    }
  };

  // Fetch servers on mount
  useEffect(() => {
    fetchServers();
  }, []);

  // Fetch server status whenever the server list updates
  useEffect(() => {
    servers?.forEach((server) => {
      fetchServerStatus(server);
    });
  }, [servers]);

  return (
    <div className="issuer-data">
      <p className="font-weight-bold title-blockchain">Live Servers</p>
     <div style={{width:"100%", overflow:"auto"}}>
     <Table bordered>
        <thead className="table-secondary">
          {" "}
          {/* Set header background color to gray */}
          <tr>
            <th>S.No</th> {/* Serial Number column */}
            <th>Name</th>
            <th>IP</th>
            <th>End Point</th> {/* Add endpoint column */}
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {servers?.map((server, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* Display the serial number */}
              <td>{server.serverName}</td>
              <td>
                {server.serverAddress ? (
                  <a
                    style={{ textDecoration: "none", color: "#5B5A5F" }}
                    href={
                      server.serverAddress.startsWith("http://") ||
                      server.serverAddress.startsWith("https://")
                        ? server.serverAddress
                        : `http://${server.serverAddress}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {server.serverAddress}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>{server.serverEndpoint}</td> {/* Display endpoint */}
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor:
                      serverStatuses[server.serverAddress] === "Active"
                        ? "rgba(255, 136, 91, 0.1)"
                        : "rgba(250, 188, 63, 0.1)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    width: "fit-content",
                    color:
                      serverStatuses[server.serverAddress] === "Active"
                        ? "#FF885B"
                        : "#DB371F",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor:
                        serverStatuses[server.serverAddress] === "Active"
                          ? "rgba(255, 136, 91, 1)"
                          : "rgba(219, 55, 31, 1)",
                      marginRight: "5px",
                    }}
                  />
                  {serverStatuses[server.serverAddress] || "Checking..."}
                </div>
              </td>
              <td>
                <span
                  style={{
                    color: loadingDelete ? "#A0A0A0" : "#DB371F",
                    cursor: loadingDelete ? "not-allowed" : "pointer",
                    
                  }}
                  className="d-flex text-center align-items-center gap-1"
                  onClick={
                    !loadingDelete
                      ? () => handleDelete(server.serverName)
                      : null
                  }
                >
                  <Image
                    src={Recycle}
                    alt="remove"
                    style={{
                      color: loadingDelete ? "#A0A0A0" : "#DB371F", // Gray image when loading
                      width: "16px",
                    }}
                  />
                  Delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
     </div>

      {/* Alert Modal for showing error/success messages */}
      <AlertModal
        show={alertModal.show}
        handleClose={() => setAlertModal({ ...alertModal, show: false })}
        errorMessage={alertModal.errorMessage}
        successMessage={alertModal.successMessage}
      />
    </div>
  );
};

export default ServerTable;
