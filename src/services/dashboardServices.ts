import API from "./index";
import { serverConfig } from "../config/server-config";
import Email from "next-auth/providers/email";



// Define the expected response structure for the registration API call
interface Response {
  status: "SUCCESS" | "ERROR";
  data?: any;
  error?: any;
  message?: any
}

// Set the base URL for the app server using the configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;

/**
 * Function to register a user
 * @param data - The data to be sent in the registration request
 * @param callback - Callback function to handle the registration response
 */
const updateLimit = (data: any, callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/allocate-credits`, // Append the endpoint to the base URL
    data: data,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error?.response?.data });
    });
};

const getDetails = (data: any,callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/get-custom-issues`,
    data:{
      email:data
    }
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const getStatus = (data: any,callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${BASE_URL}/api/get-credits-by-email`,
    data:{
      email:data
    }
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};

const AddServer = (data: any,callback: (response: Response) => void) => {
  API({
    method: "POST",
    url: `${apiUrl}/api/upload-server-details`,
    data: data
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      callback({ status: "ERROR", error: error });
    });
};


const getAllServer = (callback: (response: Response) => void) => {
  API({
    method: "GET",
    url: `${BASE_URL}/api/get-server-details`,
  })
    .then((response) => {
      callback({ status: "SUCCESS", data: response.data });
    })
    .catch((error) => {
      // Improved error handling
      callback({ status: "ERROR", error: error.message || error });
    });
};



const dashboard = {
    updateLimit,
    getDetails,
    getStatus,
    AddServer,
    getAllServer
  }
  // Export the register function as the default export for this module
  export default dashboard;