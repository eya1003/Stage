import React, { useEffect } from 'react';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../userRedux/userActions';

const Dashboard = () => {

    const dispatch = useDispatch();

  // Fetch users from the Redux store
  const userList = useSelector((state) => state.userDisplay);
  const { loading, error, users } = userList;

  useEffect(() => {
    // Dispatch the getUsers action on component mount
    dispatch(getUsers());
  }, [dispatch]);

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ display: 'flex', height: '100vh' }}>
          <div className="table-responsive text-nowrap">
          {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Phone</th>
              <th>Image URL</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.phone}</td>
                <td>{user.imageURL}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


