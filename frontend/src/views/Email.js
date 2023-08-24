
import React, { useEffect, useState } from "react";
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
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const [imapHost, setIMAPHost] = useState('');
  const [imapPort, setIMAPPort] = useState('');
  const [result, setResult] = useState('');

  const [hostSMTPS, setHostSMTPS] = useState('');
  const [portSMTPS, setPortSMTPS] = useState('');
  const [resultS, setResultS] = useState('');

  const [activeSection, setActiveSection] = useState("SMTP");


  //SMTP
  const checkServerSMTPStatus = async () => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/email/checkEmail', {
        host: host,
        port: port,
      });

      const data = response.data;
      setStatus(data === 'Email server is up' ? 'Server is reachable' : 'Server is not reachable');
   
    } catch (error) {
      console.error('Error checking email server status:', error);
      setStatus('Failed to check server status.');
    } finally {
      setLoading(false);
    }
  };

  
  
//IMAP
  const checkIMAPStatus = async () => {
    try {
      const response = await axios.post('http://localhost:5000/email/checkIMAP', {
        imapHost: imapHost,
        imapPort: imapPort,
      });

      const data = response.data;
      setResult(data.imapServer ? 'IMAP server is reachable' : 'IMAP server is not reachable');
    } catch (error) {
      console.error('Error checking IMAP server status:', error);
      setResultS('Failed to check IMAP server status');
    }
  };

  //SMTPS
  const checkSMTPSServer = async () => {
    try {
      const response = await axios.post('http://localhost:5000/email/checkSMTPS', {
        host: hostSMTPS,
        port: parseInt(portSMTPS), // Parse port as integer
      });

      const data = response.data;
      setResultS(data.smtpsServer ? 'SMTPS server is reachable' : 'SMTPS server is not reachable');
    } catch (error) {
      console.error('Error checking SMTPS server status:', error);
      setResult('Failed to check SMTPS server status');
    }
  };


  return (
    <>

      <div className="content" style={{ marginTop: "", width: "1500px" }} >
        <Row >
          <Col lg="3" md="3" sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <div
                      className="icon-big text-center icon-warning"
                      onClick={() => setActiveSection("SMTP")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category"> Port 25</p>
                      <CardTitle
                        tag="p"
                        onClick={() => setActiveSection("SMTP")}
                        style={{
                          cursor: "pointer",
                          color:
                            activeSection === "SMTP"
                              ? "#f17e5d"
                              : "inherit",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }} 
                      >
                        SMTP
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> Simple Mail Transfer Protocol
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="2" sm="2">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <div
                      className="icon-big text-center icon-warning"
                      onClick={() => setActiveSection("IMAP")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category"> Port 993</p>
                      <CardTitle
                        tag="p"
                        onClick={() => setActiveSection("IMAP")}
                        style={{
                          cursor: "pointer",
                          color:
                            activeSection === "IMAP"
                              ? "#f17e5d"
                              : "inherit",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }} 
                      >
                        IMAP
                      </CardTitle>                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> Internet Message Access Protocol
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="2" sm="3">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                  <div
                      className="icon-big text-center icon-warning"
                      onClick={() => setActiveSection("SMTPS")}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category"> Port 465</p>
                      <CardTitle
                        tag="p"
                        onClick={() => setActiveSection("SMTPS")}
                        style={{
                          cursor: "pointer",
                          color:
                            activeSection === "SMTPS"
                              ? "#f17e5d"
                              : "inherit",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }} 
                      >
                        SMTPS
                      </CardTitle>                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> Secure Simple Mail Transfer Protocol
                </div>
              </CardFooter>
            </Card>
          </Col>
                        
        </Row>


{activeSection === "SMTP" && (
        <Col lg="8" sm="5">
      <Card className="card-stats">
        <CardBody>
          <Row>
            <Col md="11"  style={{  justifyContent: 'center',height: '47vh' }} >
              <div>
            <div>
        <label>Host:</label>
        <input
          type="text"
          value={host}
          placeholder="smtp.gmail.com"
          onChange={(e) => setHost(e.target.value)}
        />
      </div>
      <div>
        <label>Port:</label>
        <input
          type="text"
          value={port}
          onChange={(e) => setPort(e.target.value)}
        />
      </div>
      <button onClick={checkServerSMTPStatus} disabled={loading}>
        Check Server Status
      </button>
      <Col md="8">
        <div className="queue-list-container" style={{ marginTop:"25px"}}>
          {/* Utilisez ul et li pour afficher une liste ordonnée avec des points */}
          <ul className="list-unstyled" style={styles.list}>
          {loading ? (
        <p>Loading...</p>
      ) : (
        <p>{status}</p>
      )}
          </ul>
        </div>
      </Col>
     
    </div>
                
            </Col>
            <br/>
          </Row>
        </CardBody>
      </Card>

    
    </Col>
)}



{activeSection === "IMAP" && (

<Col lg="8" sm="5">
<Card className="card-stats">
<CardBody>
  <Row>
    <Col md="11"  style={{  justifyContent: 'center',height: '47vh' }} >
                  
    <div>
      <div>
        <label>IMAP Host:</label>
        <input type="text" value={imapHost} placeholder="imap.gmail.com" onChange={e => setIMAPHost(e.target.value)} />
      </div>
      <div>
        <label>IMAP Port:</label>
        <input type="text" value={imapPort} onChange={e => setIMAPPort(e.target.value)} />
      </div>
      <button onClick={checkIMAPStatus}>Check IMAP Server Status</button>
      <Col md="8">
        <div className="queue-list-container" style={{ marginTop:"25px"}}>
          <ul className="list-unstyled" style={styles.list}>
        <p>{result}</p>
          </ul>
        </div>
      </Col>
    </div>
        
    </Col>
    <br/>
  </Row>
</CardBody>
</Card>


</Col>
)}

{activeSection === "SMTPS" && (
<Col lg="8" sm="5">
      <Card className="card-stats">
        <CardBody>
          <Row>
            <Col md="11"  style={{  justifyContent: 'center',height: '47vh' }} >
<div>
      <div>
        <label>SMTPS Host:</label>
        <input type="text" value={hostSMTPS} placeholder="smtp.gmail.com" onChange={e => setHostSMTPS(e.target.value)} />
      </div>
      <div>
        <label>SMTPS Port:</label>
        <input type="text" value={portSMTPS} onChange={e => setPortSMTPS(e.target.value)} />
      </div>
      <button onClick={checkSMTPSServer}>Check SMTPS Server Status</button>
      <Col md="6">
        <div className="queue-list-container" style={{ marginTop:"25px"}}>
          {/* Utilisez ul et li pour afficher une liste ordonnée avec des points */}
          <ul className="list-unstyled" style={styles.list}>
        <p>{resultS}</p>
          </ul>
        </div>
      </Col> 
         </div>
    </Col>
    </Row>
    </CardBody>
    </Card>
    </Col>
)}

     </div>
    </>
  );
}
const styles = {
  list: {
    backgroundColor: '#f17e5d',
    borderRadius: '8px',
    padding: '1px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    listStyleType: 'circle', // Utilisez listStyleType pour afficher les points
    textAlign: 'center', // Center-align the content within the ul

  },
  listItem: {
    fontSize: '18px',
    fontWeight: '',
    marginBottom: '10px',
    color: '#fff',
  },
};
export default Dashboard;
