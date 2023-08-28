
import React, { useState } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import Swal from 'sweetalert2'

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Input,
  Button,
  Alert,
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";
import axios from "axios"; // Import axios library

function Dashboard() {


 const [failedConfigs, setFailedConfigs] = useState([]);

 const handleCheckConfigs = async () => {
  try {
    const storedConfigs = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('rabbitConfig')) {
        const config = JSON.parse(localStorage.getItem(key));
        storedConfigs.push(config);
      }
    }

    const response = await axios.post('http://localhost:5000/qu/checkConfigs', storedConfigs);
    setFailedConfigs(response.data);
  } catch (error) {
    console.error('Error checking configurations:', error);
  }
};

  

  return (
    <>

      <div className="content"  >
        <Row >
          <Col lg="4" md="4" sm="4">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">AMQP protocol</p>
                      <CardTitle tag="p">Rabbit MQ</CardTitle>
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
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category"> +23,000 customers</p>
                      <CardTitle tag="p">IBM </CardTitle>
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
          <Col lg="4" md="4" sm="4">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">FTP</p>
                      <CardTitle tag="p">File Zilla</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Port 21
                </div>
              </CardFooter>
            </Card>
          </Col>
          
        </Row>
       
        <div className="content" style={{ marginTop: "", width: "1500px" }} >
      
        <Col lg="8">
  <Card className="card-stats">
    <CardBody>
      <div className="welcome-message" style={{ textAlign: 'center' }}>
        <CardTitle tag="h3" style={{ color: '#51bcda', fontSize: '24px', fontWeight: 'bold', marginLeft: '15px' }}>
          Check All Configurations
        </CardTitle>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '25px' }}>
        <button onClick={handleCheckConfigs}>Check Config</button>
      </div>

      <div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
  {failedConfigs.map((failedConfig, index) => (
    <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      <h4 style={{ color: '#FF5733', marginBottom: '5px', fontWeight: 'bold' }}>Failed Configuration:</h4>
      <p style={{ marginBottom: '5px' }}>
        <span style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '5px', borderRadius: '5px' }}>RabbitMQ Hostname:</span> {failedConfig.config.rabbitmqHostname}
      </p>
      <p style={{ marginBottom: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>RabbitMQ Port:</span> {failedConfig.config.rabbitmqPort}
      </p>
      <p style={{ marginBottom: '5px' }}>
        <span style={{ fontWeight: 'bold' }}>RabbitMQ Username:</span> {failedConfig.config.rabbitmqUsername}
      </p>
    </li>
  ))}
</ul>

</div>


    </CardBody>
  </Card>
</Col>
   
</div>
      </div>
    </>
  );
}

export default Dashboard;
