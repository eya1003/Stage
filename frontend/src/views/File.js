
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

  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [msgs, setMsgs] = useState('');

  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [fileTransfers, setFileTransfers] = useState({ STOR: [], RETR: [] });
  const [activeSection, setActiveSection] = useState("File Zilla");

  const [ftpConfig, setFTPConfig] = useState({
    host: '',
    port: '',
    user: '',
    password: '',
  });
  const [status, setStatus] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFTPConfig((prevConfig) => ({ ...prevConfig, [name]: value }));
  };

  const checkStatus = async () => {
    try {
      const response = await axios.post('http://localhost:5000/file/checkServer', ftpConfig);
      setStatus(response.data);
  
      // Save the FTP configuration in local storage
      localStorage.setItem('FileZillaConfig', JSON.stringify(ftpConfig));
  
      setTimeout(() => {
        setStatus('');
        setFTPConfig({
          host: '',
          port: '',
          user: '',
          password: '',
        });
      }, 30000); // 30000 milliseconds = 30 seconds

      
  // Set a timeout to clear the localStorage after 4 hours (240,000 milliseconds)
    setTimeout(() => {
      localStorage.removeItem('FileZillaConfig');
    }, 240000 * 60); // 240 minutes * 60 seconds per minute * 1000 milliseconds per second

    } catch (error) {
      setStatus('Failed to check FTP server status');
    }
  };
  


  const checkCrushFTPServerStatus = () => {
    axios
      .post("http://localhost:5000/file/checkCrushServer", {
        host: host,
        port: port, 
      })
      .then((response) => {
        // The server responded with the status of the CrushFTP server
        const isServerUp = response.data; // Assuming the server returns true/false
        console.log('CrushFTP server status:', isServerUp);
        setMsgs("CrushFTP server is reachable");

        Swal.fire(
          'CrushFTP server is reachable!'
        );
      })
      .catch((error) => {
        console.error('Error checking CrushFTP server status:', error);
        Swal.fire(
          'Connection Error!'
        );
      });
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
                      <p className="card-category">FTP</p>
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
                  <i className="fas fa-sync-alt" /> 21
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
                      <p className="card-category">FTP </p>
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
                  <i className="far fa-calendar" /> 9090
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
            <Col md="11"  style={{  justifyContent: 'center',height: '65vh' }} >
            <h2>FTP Server Status Checker</h2>
      <div>
        <label>Host:</label>
        <input type="text" name="host" placeholder="127.0.0.1" value={ftpConfig.host} onChange={handleInputChange} />
      </div>
      <div>
        <label>Port:</label>
        <input type="text" name="port" value={ftpConfig.port} onChange={handleInputChange} />
      </div>
      <div>
        <label>User:</label>
        <input type="text" name="user" value={ftpConfig.user} onChange={handleInputChange} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={ftpConfig.password} onChange={handleInputChange} />
      </div>
      <button onClick={checkStatus}>Check Status</button>
                
            </Col>
            <br/>
            <Col md="8">
        <div className="queue-list-container" style={{ marginTop:"15px"}}>
          {/* Utilisez ul et li pour afficher une liste ordonnée avec des points */}
          <ul className="list-unstyled" style={styles.list}>
          {status !== null && (
        <p>{status}</p>
      )}
          </ul>
        </div>
      </Col>
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
            <Col md="11"  style={{  justifyContent: 'center',height: '45vh' }} >
            <h2>FTP Server Status Checker</h2>
      <div>
        <label>Host:</label>
        <input type="text" name="host" placeholder="127.0.0.1" value={host} onChange={(e) => setHost(e.target.value)} />
      </div>
      <div>
        <label>Port:</label>
        <input type="text" name="port" value={port} onChange={(e) => setPort(e.target.value)} />
      </div>
      <button onClick={checkCrushFTPServerStatus}>Check Status</button>
                
            </Col>
            <br/>
            <Col md="8">
        <div className="queue-list-container" style={{ marginTop:"15px"}}>
          {/* Utilisez ul et li pour afficher une liste ordonnée avec des points */}
          <ul className="list-unstyled" style={styles.list}>
          {msgs !== null && (
        <p>{msgs}</p>
      )}
          </ul>
        </div>
      </Col>
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

const styles = {
  list: {
    backgroundColor: '#f17e5d',
    borderRadius: '10px',
    padding: '0.5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    listStyleType: 'circle', // Utilisez listStyleType pour afficher les points
  },
  listItem: {
    fontSize: '18px',
    fontWeight: '',
    marginBottom: '10px',
    color: '#fff',
  },
};
