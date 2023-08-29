
import React, { useEffect, useState } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import Swal from 'sweetalert2'
import CryptoJS from 'crypto-js';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import axios from "axios"; // Import axios library
import { Navigate, useNavigate } from "react-router-dom";

function Dashboard() {

  const [activeSection, setActiveSection] = useState("Rabbit MQ");
  const [host, setHost] = useState('');
  const [adminPort, setAdminPort] = useState('');
  const [serverStatus, setServerStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState(null); // Initialize the message state
  const navigate= useNavigate()

// Rabbit MQ from body
const [formData, setFormData] = useState({
  rabbitmqHostname: '',
  rabbitmqPort: '',
  rabbitmqUsername: '',
  rabbitmqPassword: '',
});

const handleChange = event => {
  const { name, value } = event.target;
  setFormData(prevData => ({
    ...prevData,
    [name]: value,
  }));
};

const handleSubmit = async (event) => {
  event.preventDefault();
  try {

    const encryptedPassword = CryptoJS.AES.encrypt(
      formData.rabbitmqPassword, 
      'your-secret-key'
    ).toString();

    const response = await axios.post('http://localhost:5000/qu/whyyy', {
      rabbitmqHostname: formData.rabbitmqHostname,
      rabbitmqPort: formData.rabbitmqPort,
      rabbitmqUsername: formData.rabbitmqUsername,
      rabbitmqPassword:  formData.rabbitmqPassword, 
    });

    
    if (response.data.status === 'Success') {
      const configNumber = parseInt(localStorage.getItem('configNumber'), 10) || 0;
      const newConfigKey = `rabbitConfig${configNumber + 1}`;
      const existingConfigs = Object.keys(localStorage).filter(
        (key) => key.startsWith('rabbitConfig')
      );
      const isDuplicate = existingConfigs.some((key) =>
        JSON.stringify(formData) === localStorage.getItem(key)
      );
    
      // Encrypt the password before storing in localStorage
      const encryptedPassword = CryptoJS.AES.encrypt(
        formData.rabbitmqPassword,
        'your-secret-key'
      ).toString();
      if (!isDuplicate) {
        // Save the encrypted password in the formData object
        const encryptedFormData = {
          ...formData,
          rabbitmqPassword: encryptedPassword,
        };// Save the encrypted formData in localStorage
        localStorage.setItem(newConfigKey, JSON.stringify(encryptedFormData));
        localStorage.setItem('configNumber', configNumber + 1);
        Swal.fire('Connect successfully');

      navigate("/admin/queue"); // Use the navigate function to redirect
    } 
  }else {
      // Show Swal message for error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while connecting.',
      });
    }

    setMessage(response.data);

    setTimeout(() => {
      setMessage(null);
      setFormData({
        rabbitmqHostname: '',
        rabbitmqPort: '',
        rabbitmqUsername: '',
        rabbitmqPassword: '',
      });
    }, 30000);

    setTimeout(() => {
      localStorage.removeItem('rabbitConfig');
      localStorage.removeItem('configTimestamp');
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
  } catch (error) {
    // Show Swal message for connection error
    Swal.fire({
      icon: 'error',
      title: 'Connection Error',
      text: 'An error occurred while checking RabbitMQ server.',
    });
    console.error('Error checking RabbitMQ server:', error);
  }
};

// IBM Web sphere

const handleSubmitIBM = async (event) => { 
  event.preventDefault();

  try {
    const response = await axios.post('http://localhost:5000/qu/CheckServer', {
      host: host,
      adminPort: adminPort,
    });

    const { status } = response.data;
    setServerStatus(status);
    setErrorMessage('');

    if (status === 'UP') {
      Swal.fire('IBM WebSphere server is reachable');
    }

    setTimeout(() => {
      setServerStatus('');
      setHost('');
      setAdminPort('');
    }, 30000);
  } catch (error) {
    const message = error.response.data.error || 'An error occurred while checking server status.';
    setServerStatus('');
    Swal.fire('Connection Error'); 
  }
};

  return (
    <>
      <div className="content" style={{ width: "1500px" }}>
        <Row>
          <Col lg="4" md="4" sm="4">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div
                      className="icon-big text-center icon-warning"
                      onClick={() => setActiveSection("Rabbit MQ")}
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
                        onClick={() => setActiveSection("Rabbit MQ")}
                        style={{
                          cursor: "pointer",
                          color:
                            activeSection === "Rabbit MQ" ? "#f17e5d" : "inherit",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        Rabbit MQ
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
                        onClick={() => setActiveSection("IBM WebSphere")}
                        style={{
                          cursor: "pointer",
                          color:
                            activeSection === "IBM WebSphere"
                              ? "#f17e5d"
                              : "inherit",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }} 
                      >
                        IBM WebSphere
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
     {activeSection === "Rabbit MQ" && (

          <Col lg="28" >
            
            <Col lg="8" >
          <Card className="card-stats" >
            <CardBody>
              <Row style={{  justifyContent: 'center'}}>
              <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px', marginBottom:'-20px' }}>
          
            <p style={{ color: '#666', fontSize: '18px' }}>
              Check server
            </p>
          </div>
              </Row>

              <Row className="mt-4 justify-content-center">
   
      <form onSubmit={handleSubmit}>
        <label>
          Hostname:
          <input type="text" name="rabbitmqHostname" required value={formData.rabbitmqHostname} onChange={handleChange} />
        </label>
        <label>
          Port:
          <input type="text" name="rabbitmqPort" required value={formData.rabbitmqPort} onChange={handleChange} style={{
              padding: '10px',
              width: '100%',
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: 'px', // Increase the font size
              padding: '10px', 
          }} />
        </label>
        <label>
          Username:
          <input type="text" name="rabbitmqUsername" required value={formData.rabbitmqUsername} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="rabbitmqPassword" required value={formData.rabbitmqPassword} onChange={handleChange} />
        </label>
        <button type="submit">Check server</button>
      </form> 

      <Col md="8">
        <div className="queue-list-container" style={{ marginTop:"15px"}}>
          {/* Utilisez ul et li pour afficher une liste ordonnée avec des points */}
          <ul className="list-unstyled" style={styles.list}>
          {message !== null && (
        <p> {message}</p>  
      )}
          </ul>
        </div>
      </Col>
    </Row>            
            </CardBody>
          </Card>
        </Col>
          </Col>            
        )}

       {activeSection === "IBM WebSphere" && (
                  <Col lg="28" >
                    <Col lg="8" >

      <Card className="card-stats">
        <CardBody>
        <Row>
            <Col md="11"  style={{  justifyContent: 'center',height: '45vh' }} >
            <h2>IBM Web Sphere Server Checker</h2>
      <div>
        <label>Host:</label>
        <input type="text" value={host} onChange={(e) => setHost(e.target.value)} />
      </div>
      <div>
        <label>Port:</label>
        <input type="text" value={adminPort} onChange={(e) => setAdminPort(e.target.value)} />
      </div>
      <button onClick={handleSubmitIBM}>Check Status</button>
                
            </Col>
            <br/>
            <Col md="8">
        <div className="queue-list-container" style={{ marginTop:"15px"}}>
          <ul className="list-unstyled" style={styles.list}>
          {serverStatus !== null && (
        <p>{serverStatus }</p>
      )}
          </ul>
        </div>
      </Col>
          </Row>
        </CardBody>
      </Card>   
    </Col>
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
    padding: '10px',
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
export default Dashboard;
