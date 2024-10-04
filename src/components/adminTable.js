import React, { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import EyeIcon from "../../assets/img/eye-icon.svg"; // Eye icon from react-icons
import Image from "next/image";
import AlertModal from "./alertModal";
import Loading from "./loading";

const AdminTable = ({
  issuers,
  selectedTab,
  onView,
  setIssuers,
  fetchData,
}) => {
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const getStatusStyle = (status) => {
    switch (status) {
      case 0:
        return { color: "#FABC3F", backgroundColor: "rgba(250, 188, 63, 0.1)" }; // Pending (yellow)
      case 1:
        return { color: "#FF885B", backgroundColor: "#FF885B1A" }; // Active (green)
      case 2:
        return { color: "#FF0000", backgroundColor: "rgba(255, 0, 0, 0.1)" }; // Inactive (red)
      case 3:
        return { color: "#A52A2A", backgroundColor: "rgba(165, 42, 42, 0.1)" };
      default:
        return {};
    }
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleIssuer = async (email, status) => {
    setLoading(true);
    setErrorMessage(""); // Clear previous error messages
    setSuccessMessage(""); // Clear previous success messages

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.JWTToken) {
        throw new Error("User is not authenticated. Please log in again.");
      }

      // Make the API call
      const response = await fetch(`${apiUrl}/api/validate-issuer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedUser.JWTToken}`,
        },
        body: JSON.stringify({ email, status }),
      });

      // Check if the response is not OK (non-2xx status code)
      if (!response.ok) {
        const error = await response.json(); // Fetch any error message from the server
        setErrorMessage(error.message || "Please try again later.");
        setShow(true);
      }

      const data = await response.json();

      // Handle success response
      setSuccessMessage(data.message || "Issuer successfully validated.");
      setShow(true);
      fetchData();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issuer-data">
      <AlertModal
        handleClose={handleClose}
        show={show}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      
      <Loading isLoading={loading} />
      {issuers && issuers.length > 0 ? (
        <Table bordered>
          <thead>
            <tr>
              <th>S.No</th> {/* Add S.No column here */}
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              {/* Conditionally render "Matic" and "Action" columns if selectedTab is not 'issuerRequest' */}
              {/* {selectedTab !== 'issuerRequest' && <th>Matic</th>} */}
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {issuers.map((issuer, index) => (
              <tr key={issuer._id}>
                <td>{index + 1}</td> {/* Display S.No here */}
                <td>{issuer.name}</td>
                <td>{issuer.email}</td>
                <td>
                  <div
                    className="d-flex align-items-center"
                    style={{
                      
                      columnGap: "6px",
                      padding: "5px 10px",
                      width: "fit-content",
                      ...getStatusStyle(issuer.status),
                    }}
                  >
                    <span
                      style={{
                        height: "10px",
                        width: "10px",
                        backgroundColor:
                          issuer.status === 1
                            ? "#FF885B" // Active
                            : issuer.status === 2
                            ? "#FF0000" // Inactive
                            : issuer.status === 3
                            ? "#A52A2A" // Rejected (example color, you can change it)
                            : "#FABC3F", // Pending

                        borderRadius: "50%",
                        display: "inline-block",
                      }}
                    ></span>
                    {issuer.status === 1
                      ? "Active"
                      : issuer.status === 2
                      ? "Inactive"
                      : issuer.status === 3
                      ? "Rejected"
                      : "Pending"}
                  </div>
                </td>
                {/* {selectedTab !== 'issuerRequest' && <td>{issuer.matic || 'N/A'}</td>} */}
                <td>
                  <div
                    className="d-flex align-items-center pointer"
                    style={{
                      columnGap: "10px",
                      color: "#CFA935",
                      cursor: "pointer",
                    }}
                    onClick={() => onView(issuer)}
                  >
                    <Image src={EyeIcon} alt="view" />
                    View
                  </div>
                </td>
                {selectedTab === "issuerRequest" && (
                  <td>
                    <div
                      className="d-flex align-items-center pointer"
                      style={{
                        columnGap: "10px",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      {/* Show both Accept and Reject buttons if issuer.status is not 3 */}
                      {issuer.status === 0 ? (
                        <>
                          <button
                            className="global-button golden sm"
                            onClick={() => handleIssuer(issuer.email, 1)}
                          >
                            Accept
                          </button>
                          <button
                            className="global-button outlined sm"
                            onClick={() => handleIssuer(issuer.email, 2)}
                          >
                            Reject
                          </button>
                        </>
                      ) : issuer.status === 2 ? (
                        <button
                          className="global-button golden sm"
                          onClick={() => handleIssuer(issuer.email, 1)}
                        >
                          Reapprove
                        </button>
                      ) : issuer.status === 3 ? (
                        <button
                          className="global-button golden sm"
                          onClick={() => handleIssuer(issuer.email, 1)}
                        >
                          Accept
                        </button>
                      ) : null}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#FF885B",
            marginBottom: "70px",
          }}
        >
          No Data Found
        </div>
      )}
    </div>
  );
};

export default AdminTable;
