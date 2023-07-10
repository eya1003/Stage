import React from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ display: 'flex', height: '100vh' }}>
          <div className="table-responsive text-nowrap">
            <h3>Test</h3>
            {/* Rest of your table code */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
