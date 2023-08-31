
import React, { useState } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import Swal from 'sweetalert2'
import { Bar } from "react-chartjs-2";

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

function Dashboard() {
  const [failedConfigs, setFailedConfigs] = useState([]);
  const [storedConfigs, setStoredConfigs] = useState([]); // Add this line

  const handleCheckConfigs = async () => {
    try {
      const tempStoredConfigs = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('rabbitConfig')) {
          const config = JSON.parse(localStorage.getItem(key));
          tempStoredConfigs.push(config);
        }
      }

      if (tempStoredConfigs.length === 0) {
        console.log('No configurations found in localStorage.');
        Swal.fire({
          icon: 'error',
          title: 'Connection Error',
          text: 'An error occurred. There is no configurations.',
        });
        return;
      }

      setStoredConfigs(tempStoredConfigs); // Set storedConfigs
      const response = await axios.post('http://localhost:5000/qu/checkConfigs', tempStoredConfigs);
      setFailedConfigs(response.data);

      // Check if there are no failed configurations
      if (response.data.length === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'All configurations are correct!',
        });
      }
    } catch (error) {
      console.error('Error checking configurations:', error);
    }
  };

  // Calculate success and failure rates here
  const totalConfigs = failedConfigs.length + (storedConfigs.length - failedConfigs.length);
  const successRate = (totalConfigs - failedConfigs.length) / totalConfigs;
  const failureRate = failedConfigs.length / totalConfigs;

  // Define pie chart data and options here
  const successData = {
    labels: ["Success", "Failure"],
    datasets: [
      {
        data: [successRate * 100, failureRate * 100],
        backgroundColor: ["#6bd098", "#ef8157"],
      },
    ],
  };


  const options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: true,
      position: "bottom",
    },
  };
  const barChartData = {
    labels: ["Success Rate", "Failure Rate"],
    datasets: [
      {
        label: "Percentage",
        backgroundColor: ["#6bd098", "#ef8157"],
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
        hoverBackgroundColor: ["#6bd098", "#ef8157"],
        hoverBorderColor: "rgba(0,0,0,0.4)",
        data: [successRate * 100, failureRate * 100],
      },
    ],
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
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
        <CardTitle tag="h3" style={{ color: '#ef8157', fontSize: '24px', fontWeight: 'bold', marginLeft: '15px' }}>
          Check All RabbitMQ Configurations 
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

<Row style={{ display: 'flex', justifyContent: 'center'}}>
  <Col lg="4" style={{ marginRight:"20px"}}>
    <Card className="card-chart" style={{ border: '1px solid #ccc', borderRadius: '10px' }}>
      <CardBody>
        <div className="chart-area">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </CardBody>
    </Card>
  </Col>
  <Col lg="4" md="4" sm="4">
    <Card className="card-stats" style={{ border: '1px solid #ccc', borderRadius: '10px' }}>
      <CardBody>
        <Pie data={successData} options={options} />
      </CardBody>
      <CardFooter>
        <div className="stats">
          <i className="fas fa-sync-alt" /> Success Rate
        </div>
      </CardFooter>
    </Card>
  </Col>
</Row>


    </CardBody>
  </Card>
</Col>

</div>
      </div>
    </>
  );
}

export default Dashboard;
