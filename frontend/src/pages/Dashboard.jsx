import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import { Button } from 'react-bootstrap';

const Dashboard = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  const [tableData, setTableData] = useState({
    messages: [],
    state: '',
    queue: {
      name: '',
      messageCount: 0,
      consumerCount: 0,
    },
  });

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/qu/getQueue/${searchValue}`, {
        method: 'GET',
      });
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ display: 'flex', height: '100vh' }}>
          <div className="table-responsive text-nowrap">
            <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
              <div className="navbar-nav align-items-center">
                <div className="nav-item d-flex align-items-center">
                  <i className="bx bx-search fs-4 lh-0"></i>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none rounded-pill"
                    style={{ width: '300px', height: '40px' }}
                    placeholder="Search..."
                    aria-label="Search..."
                    value={searchValue}
                    onChange={handleInputChange}
                  />
                  <Button type="submit" variant="primary" onClick={handleSearch} className="rounded-pill ms-2">
                    Check
                  </Button>
                </div>
              </div>
            </div>
            <div className="table-responsive text-nowrap">
  <table className="table table-bordered mt-3">
    <thead>
      <tr>
        <th>Name</th>
        <th>Message Count</th>
        <th>Consumer Count</th>
        <th>Last Message</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{tableData.queue.name}</td>
        <td>{tableData.queue.messageCount}</td>
        <td>{tableData.queue.consumerCount}</td>
        <td>
          {tableData.messages && tableData.messages.length > 0 ? (
            Object.entries(tableData.messages[tableData.messages.length - 1]).map(([key, value]) => (
              <div key={key}>
                <strong>{key}: </strong>
                {value}
              </div>
            ))
          ) : (
            <div>No messages received</div>
          )}
        </td>
      </tr>
    </tbody>
  </table>
</div>




          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
