import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; 
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import Chart from "chart.js/auto";
import { useRouter } from 'next/router';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL_USER;
import calenderIcon from "../../public/icons/calendar.svg";
import { AiOutlineCalendar, AiOutlineDown } from 'react-icons/ai';
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image'
const getYears = (numYears) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: numYears }, (_, i) => currentYear - i);
};

const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
      <Image className="me-2" width={26} height={26} src={calenderIcon} alt="Calendar Icon" />
      <span>{value}</span>
      <AiOutlineDown className="icon-down" />
    </div>
  ));
  CustomInput.displayName = "CustomInput";

function BarChart() {
    const [responseData, setResponseData] = useState(null);
    const [email, setEmail] = useState(''); // Placeholder email
    const [token, setToken] = useState(null);
    const [year, setYear] = useState(new Date());
    const [loading, setLoading] = useState(false); // State to track loading status
    const [selectedFilter, setSelectedFilter] = useState("All");
    
    Chart.register(CategoryScale, LinearScale, BarElement, Title);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.JWTToken) {
            setToken(storedUser.JWTToken);
            setEmail(storedUser.email);
        } else {
            router.push("/");
        }
    }, [router]);

    const fetchData = async (selectedYear) => {
        try {
            setLoading(true); // Set loading to true before making the API call
            const response = await fetch(`${apiUrl}/api/get-admin-graph-details/${selectedYear}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();
            setResponseData(data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false); // Set loading to false after the API call
        }
    };

    // @ts-ignore: Implicit any for children prop
    useEffect(() => {
        if(email && year){
            fetchData(year?.getFullYear());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, email]);

    const handleYearChange = (date) => {
        const selectedYear = date.getFullYear(); // Extract the year as a number
        setYear(new Date(selectedYear, 0, 1)); // Update the year as a Date object for DatePicker
        fetchData(selectedYear);
    };
    
    

    const handleFilterChange = (e) => {
        const filter = e.target.value;
        setSelectedFilter(filter);
    };

    const labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    
    const chartData = responseData ? {
        labels: labels,
        datasets: [
            {
                label: "Issuer",
                backgroundColor: "#CFA935",
                borderColor: "#CFA935",
                data: responseData.map(item => item.count[0]),
                barThickness: 20,
                borderRadius:12
            },
            {
                label: "Issuance",
                backgroundColor: "#3D915E",
                borderColor: "#3D915E",
                data: responseData.map(item => item.count[1]),
                barThickness: 20,
                borderRadius:12
            },
        ],
    } : {
        labels: labels,
        datasets: [
            {
                label: "A1",
                backgroundColor: "#CFA935",
                borderColor: "#CFA935",
                data: Array(12).fill(0),
                barThickness: 20,
                borderRadius: 6,
            },
            {
                label: "A2",
                backgroundColor: "#3D915E",
                borderColor: "#3D915E",
                data: Array(12).fill(0),
                barThickness: 20,
                borderRadius: 6,
            },
        ],
    };

    const filteredChartData = {
        ...chartData,
        datasets: chartData.datasets.filter(dataset => 
            selectedFilter === "All" || dataset.label === selectedFilter
        ),
    };

    const getPadding = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth < 600) {
                return { left: 10, right: 10, top: 20, bottom: 20 };
            } else if (window.innerWidth < 900) {
                return { left: 50, right: 50, top: 50, bottom: 50 };
            } else {
                return { left: 50, right: 50, top: 50, bottom: 50 };
            }
        }
        return { left: 50, right: 50, top: 50, bottom: 50 }; // Default padding
    };

    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        setChartOptions({
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                    position: "top",
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        dash: [5],
                        color: "rgba(0,0,0,0.2)",


                    },
                    ticks: {
                        display: true,
                    },
                    barPercentage: 0.6, 
                    categoryPercentage: 0.5, 
                },
                y: {
                    grid: {
                        display:true,
                        color: "rgba(0,0,0,0.2)",
                        dash: [10,5],
                        
                    },
                    ticks: {
                        stepSize: 5,
                        maxTicksLimit: 10, 
                        callback: function (value) {
                            return value;
                        },
                    },
                },
            },
            layout: {
                padding: getPadding(),
            },
        });
    }, []);

    return (
        <div className=" outer-container">
              <div className="date-picker-container">
      <DatePicker
      
        selected={year}
        onChange={handleYearChange}
        dateFormat="yyyy"
        showYearPicker
        customInput={<CustomInput />}
        maxDate={new Date()} // Limits to the current year
        className="form-control"
        
      />
    </div>
            <div className="filter-options d-none d-md-flex">
                <label>
                    <input
                        type="radio"
                        value="All"
                        checked={selectedFilter === "All"}
                        onChange={handleFilterChange}
                    />
                    All
                </label>
                <label>
                    <input
                        type="radio"
                        value="Issuer"
                        checked={selectedFilter === "Issuer"}
                        onChange={handleFilterChange}
                    />
                    Issuer
                </label>
                <label>
                    <input
                        type="radio"
                        value="Issuance"
                        checked={selectedFilter === "Issuance"}
                        onChange={handleFilterChange}
                    />
                    Issuance
                </label>
            </div>
            {loading ? (
                <div className="loader">
                    <div className="spinner-border text-danger" role="status"></div>
                </div>
            ) : (
                <Bar
                    width={"100%"}
                    height={"90%"}
                    data={filteredChartData}
                    options={chartOptions}
                />
            )}
        </div>
    );
}

export default BarChart;
