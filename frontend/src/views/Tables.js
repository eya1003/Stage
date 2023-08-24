
import axios from "axios";
import { Dropdown , DropdownButton} from 'react-bootstrap';

import React, { useEffect, useState } from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";
// ... (import statements)
import '../App.css'; // Update with the correct path to your CSS file
import Swal from "sweetalert2";


function Tables() {
  const [users, setUsers] = useState([]);

 

  const handleBlockUser = (id) => {
    // Make a POST request to your backend API with the user ID
    axios
      .put('http://localhost:5000/user/block',{id})
      
      .catch((error) => {
        // Handle the error here if needed
        console.error('Failed to block user:', error);
      });
    
  };
  const handleUnblockUser = (id) => {
    // Make a POST request to your backend API with the user ID
    axios
      .put('http://localhost:5000/user/Unblock',{id})
      
      .catch((error) => {
        // Handle the error here if needed
        console.error('Failed to block user:', error);
      });
    
  };

  const fetchUsers = () => {
    axios.get('http://localhost:5000/user/allUser')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Failed to fetch users:', error);
      });
  };

  useEffect(() => {
    // Fetch users from the API endpoint initially
    fetchUsers();

    // Set up an interval to fetch data every 10 seconds
    const interval = setInterval(() => {
      fetchUsers();
    }, 2000); // 2000 milliseconds = 2 seconds

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <div className="content" style={{ marginTop: "150px", width: "1500px" }}>

        <Row >
          <Col md="" >
            {/* Updated the md value to "12" to occupy the full width */}
            <Card style={{ width: "1100px"}}>
              <CardHeader>
                <CardTitle tag="h4">List Of Users</CardTitle>
              </CardHeader>
              <CardBody>
                {/* Added the "table-responsive" class */}
                <Table responsive >
                  <thead className="text-primary">
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th></th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.bloque ? 'Blocked User' : 'Not Blocked'}</td>
                        <td>{user.verify ? 'Verified Account' : 'Account not Verified'}</td>
                        <td>
                        <DropdownButton title="Actions">

                        <Dropdown.Item href="" onClick={() => {
                              if (user.bloque) {
                                  Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, UnBlock it!',
                                    customClass: {
                                      popup: 'swal2-popup-glassmorphism', // Add the class for glass morphism effect
                                      title: 'swal2-title-glassmorphism', // Customize title class for glass morphism
                                      content: 'swal2-content-glassmorphism', // Customize content class for glass morphism
                                      confirmButton: 'swal2-confirm-glassmorphism', // Customize confirm button class for glass morphism
                                      cancelButton: 'swal2-cancel-glassmorphism', // Customize cancel button class for glass morphism
                                    },
                                }).then((result) => { 
                                    if (result.isConfirmed) {
                                      handleUnblockUser(user._id);
                                        //handleRefresh();
                                        Swal.fire(
                                          'Unblocked!',
                                          'The user has been unblocked.',
                                          'success'
                                        )
                                    }
                                });
                                  
                              } else {
                                  Swal.fire({
                                      title: 'Are you sure?',
                                      text: "You won't be able to revert this!",
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Yes, Block it!'
                                  }).then((result) => {
                                      if (result.isConfirmed) {
                                         handleBlockUser(user._id);

                                          //handleRefresh();
                                          Swal.fire(
                                            'Blocked!',
                                            'The user has been blocked.',
                                            'success'
                                          )
                                      }
                                  });
                              }
                          }}>
                            {user.bloque ? (
                                <>
                                    <i className="bx bx-check me-1"></i>Unblock
                                </>
                            ) : (
                                <>
                                    <i className="bx bx-trash me-1"></i>Block
                                </>
                            )}
                        </Dropdown.Item>
</DropdownButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
=    </>
  );
}

export default Tables;
