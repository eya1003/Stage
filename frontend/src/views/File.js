
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
  const [fileTransfers, setFileTransfers] = useState({ STOR: [], RETR: [] });
  const [activeSection, setActiveSection] = useState("File Zilla");


  const checkFileServer = () => {
    axios
      .get("http://localhost:5000/file/checkServer")
      .then((response) => {
        // The server responded with the status of the email server
        const isServerUp = response.data; // Assuming the server returns true/false
        console.log('File server status:', isServerUp);
        setMsg("File server is reachable");

        Swal.fire(
            'File transferserver is reachable!'
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
  
  const checkCrushFTPServer = () => {
    axios
      .get("http://localhost:5000/file/checkCrushServer")
      .then((response) => {
        // The server responded with the status of the email server
        const isServerUp = response.data; // Assuming the server returns true/false
        console.log('File server status:', isServerUp);
        setMsg("File server is reachable");

        Swal.fire(
            'Crush FTP server is reachable!'
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
  


  const fetchFileTransfers = async () => {
    try {
      const response = await fetch('http://localhost:5000/file/get'); // Assuming the API is available at the same domain as the React app
      const data = await response.json();
      setFileTransfers(data);
    } catch (error) {
      console.error('Error fetching file transfers:', error);
    }
  };



  return (
    <>

      <div className="content" style={{ marginTop: "", width: "1500px" }} >
      <Row>
          <Col lg="4" md="4" sm="4">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div
                      className="icon-big text-center icon-warning"
                      onClick={() => setActiveSection("File Zilla")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">AMQP protocol</p>
                      <CardTitle
                        tag="p"
                        onClick={() => setActiveSection("File Zilla")}
                        style={{
                          cursor: "pointer",
                          color:
                            activeSection === "File Zilla" ? "#f17e5d" : "inherit",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        File Zilla
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> 4.7 million messages/second
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="4" md="4" sm="4">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div
                      className="icon-big text-center icon-warning"
                      onClick={() => setActiveSection("IBM WebSphere")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category"> +23,000 customers</p>
                      <CardTitle
                        tag="p"
                        onClick={() => setActiveSection("Crush FTP")}
                        style={{
                          cursor: "pointer",
                          color:
                            activeSection === "Crush FTP"
                              ? "#f17e5d"
                              : "inherit",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }} 
                      >
                        Crush FTP
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> Middleware
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {activeSection === "File Zilla" && (
<div>
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

    <Col lg="8" sm="5" style={{ height: '100%' }}>
      <Card className="card-stats">
        <CardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Row>
            <Col md="11" style={{ justifyContent: 'center', height: '47vh', position: 'relative' }}>
              <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ color: '#666', fontSize: '18px' }}>
                  Click the button below to check the File's name.
                </p>
              </div>
              <br />
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>
                <Button style={{ backgroundColor: '#f17e5d', marginTop: '' }} onClick={fetchFileTransfers}>
                  Fetch File Transfers
                </Button>
              </div>
                       {fileTransfers && (
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <Alert>
                    <div>
                      <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <CardTitle tag="h2" style={{ color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                          STOR Transfers:
                        </CardTitle>
                      </div>
                      <ul>
                        {fileTransfers.STOR.map((transfer, index) => (
                          <li key={index}>{transfer.fileName}</li>
                        ))}
                      </ul>
                      <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <CardTitle tag="h2" style={{ color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                          RETR Transfers:
                        </CardTitle>
                      </div>
                      <ul>
                        {fileTransfers.RETR.map((transfer, index) => (
                          <li key={index}>{transfer.fileName}</li>
                        ))}
                      </ul>
                    </div>
                  </Alert>
                </div>
              )}
              {error && (
                <Alert color="danger">
                  <span style={{ fontWeight: 'bold', fontSize: '12px' }}>{error}</span>
                </Alert>
              )}
              
            </Col>
            <br />
          </Row>
        </CardBody>
      </Card>
    </Col>
    </div>
        )}

{activeSection === "Crush FTP" && (

  <div>
<Col lg="8" sm="5">
      <Card className="card-stats">
        <CardBody>
          <Row>
            <Col md="11"  style={{  justifyContent: 'center',height: '47vh' }} >
            <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <CardTitle tag="h2" style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          Welcome to the Crush FTP Server Status Checker
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

)}
     </div>
    </>
  );
}

export default Dashboard;
