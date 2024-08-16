import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;

const SearchAdmin = ({issuerDetails, setIssuerDetails}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('email'); // Default search parameter
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Debounced function to fetch suggestions
    const fetchSuggestions = debounce(async (term, criterion) => {
        if (!term.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/api/get-filtered-issuers`,
                {
                    input: searchTerm,
                    filter: searchBy,
                    flag: 1
                  });


            setSuggestions(response.data?.details);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, 300); // Debounce delay of 300ms

    useEffect(() => {
        fetchSuggestions(searchTerm, searchBy);
        // Cleanup: No need to call fetchSuggestions.cancel()
        return () => {
            clearTimeout(); // Just clear the timeout if you need to handle any remaining timeouts
        };
    }, [searchTerm, searchBy]);
    

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchBySelect = (eventKey) => {
        setSearchBy(eventKey);
        setSearchTerm(''); // Reset search term when search criterion changes
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion) => {
        // setSearchTerm(suggestion);
        setIssuerDetails(suggestion)
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Call the search API with the current search term and criterion
        try {
            const response = await axios.post(`${apiUrl}/api/get-filtered-issuers`,
                {
                    input: searchTerm,
                    filter: searchBy,
                    flag: 2
                  }
                
            );
            // Process the response as needed
            console.log('Search Results:', response.data);
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="search">
                <div className="search d-flex align-items-start">
                    {/* Search Criteria Dropdown */}
                    <Dropdown onSelect={handleSearchBySelect} className="me-2">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Search by: {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="name">Name</Dropdown.Item>
                            <Dropdown.Item eventKey="email">Email</Dropdown.Item>
                            <Dropdown.Item eventKey="organizationName">Organization Name</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Search Input and Suggestions */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Form.Control
                            type="text"
                            placeholder={`Search by ${searchBy}`}
                            value={searchTerm}
                            onChange={handleSearchTermChange}
                            autoComplete="off"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="suggestions-list" style={suggestionsListStyle}>
                                {suggestions?.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        style={suggestionItemStyle}
                                        onMouseDown={(e) => e.preventDefault()} // Prevents input blur
                                    >
                                        {suggestion[searchBy]}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Search Button */}
                    {/* <div className="submit ms-2">
                        <Button
                            className="golden"
                            type="submit"
                            disabled={!searchTerm.trim()}
                        >
                            <div className="magnifier" style={{ position: 'relative', width: '20px', height: '20px' }}>
                                <Image
                                    src="https://images.netcomlearning.com/ai-certs/icons/magnifier-white.svg"
                                    layout="fill"
                                    objectFit="contain"
                                    alt="Search"
                                />
                            </div>
                        </Button>
                    </div> */}
                </div>
            </Form.Group>
        </Form>
    );
};

// Inline styles for suggestions list and items
const suggestionsListStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    maxHeight: '200px',
    overflowY: 'auto',
    listStyle: 'none',
    padding: 0,
    margin: 0,
};

const suggestionItemStyle = {
    padding: '8px 12px',
    cursor: 'pointer',
    borderBottom: '1px solid #eee',
};

export default SearchAdmin;
