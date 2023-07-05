import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <Sidebar />
          <main className="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            {/* Your dashboard content goes here */}
            <h1>Dashboard Page</h1>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
