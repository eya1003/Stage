
import React, { useState } from "react";
import Swal from 'sweetalert2'

// reactstrap components
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Button,
  Alert,
} from "reactstrap";
import axios from "axios"; // Import axios library

function Dashboard() {

  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');


  const checkFileServer = () => {
    axios
      .get("http://localhost:5000/file/checkServer")
      .then((response) => {
        // The server responded with the status of the email server
        const isServerUp = response.data; // Assuming the server returns true/false
        console.log('File server status:', isServerUp);
        setMsg("File server is reachable");

        Swal.fire(
            'File transfer server is reachable!'
          ) 
        // Handle the server status accordingly (e.g., update state, show a message, etc.)
      })
      .catch((error) => {
        console.error('Error checking File transfer server status:', error);
        Swal.fire(
            'Connection Error!',
          )
        // Handle the error (e.g., show an error message)
      });
  };
  



  return (
    <>

      <div className="content" style={{ marginTop: "", width: "1500px" }} >
        <Row >
          <Col lg="4" md="4" sm="4">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category"> Port 21</p>
                      <CardTitle tag="p"> FTP</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> File Transfer Protocol
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Col lg="8" sm="5">
      <Card className="card-stats">
        <CardBody>
          <Row>
            <Col md="11"  style={{  justifyContent: 'center',height: '47vh' }} >
            <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <CardTitle tag="h2" style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          Welcome to the FILE Transfer Server Status Checker
        </CardTitle>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Click the button below to check the File server's current status.
        </p>
      </div>
                <br/>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>

                <Button style={{ backgroundColor: "#f17e5d" , marginTop:"", }} onClick={checkFileServer}>
                  Check Server
                </Button>
                <br/>
                <br/>
          
                </div>
                {error && <Alert color="danger">  <span style={{ fontWeight: 'bold' , fontSize: '12px',}}> {error} </span>  </Alert>}

                {msg && <Alert color="success">  <span style={{ fontWeight: 'bold' , fontSize: '14px'}}> {msg}</span> </Alert> }  

                
            </Col>
            <br/>
          </Row>
        </CardBody>
      </Card>

    
    </Col>
     </div>
    </>
  );
}

export default Dashboard;
