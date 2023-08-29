import React, { useState, useCallback, useEffect } from "react";
import "../App.css"
import axios from "axios"; // Import axios library
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
    Alert,
    
  } from "reactstrap";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";


function CheckQueue (){


    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState("Rabbit MQ");
    const navigate = useNavigate(); // Initialize useNavigate
    const [Res, setRes] = useState(false);

  
    const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    // Retrieve configurations from localStorage
    const existingConfigs = Object.keys(localStorage).filter(
      (key) => key.startsWith('rabbitConfig')
    );
    const configData = existingConfigs.map((configKey) => {
      return { key: configKey, data: JSON.parse(localStorage.getItem(configKey)) };
    });
    setConfigurations(configData);
  }, []);


  const QueueInformationTable = async () => {
    try {
      const storedConfig = JSON.parse(localStorage.getItem('chosenConfig'));

      if (!storedConfig&& !storedConfig.data) {
        Swal.fire({
          title: "Error",
          text: "Stored configuration not found",
          icon: "error",
            })
      }

      const response = await axios.post('http://localhost:5000/qu/checkAll', storedConfig.data);

      if (response.status === 200) {
        setRes(response.data);
        setError(null);
      } else {
        Swal.fire({
          title: "Error",
          text: "An error occurred while checking queue ",
          icon: "error",
            })      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while checking queue ",
        icon: "error",
          })
            }
  };

  const handleCheckAll = async () => {
    setRes(null); // Clear previous response
    setError(null); // Clear previous error

    // Introduce a 5-second delay
    setTimeout(async () => {
      await QueueInformationTable();

      if (error) {
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error',
        });
      }
    }, 1000); // 5000 milliseconds = 5 seconds
  };
const handleChooseConfig = (config) => {
        // Show a confirmation dialog using Swal
        Swal.fire({
          title: 'Choose Configuration',
          text: 'Are you sure you want to choose this configuration?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, choose it!',
        }).then((result) => {
          if (result.isConfirmed) {
            // Save the chosen configuration to localStorage
            localStorage.setItem('chosenConfig', JSON.stringify(config));
            // You can add any other logic you want here
            Swal.fire('Chosen!', 'The configuration has been chosen.', 'success');
          }
        });
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
           
        <Row >
  <div className="welcome-message" style={{ textAlign: 'center' }}>
    <CardTitle tag="h3" style={{ color: '#51bcda', fontSize: '24px', fontWeight: 'bold', marginLeft:"15px" }}>
      Stored Configurations
    </CardTitle>
  </div>

  <Col  style={{ marginTop: "50px", marginLeft: "-250px" ,marginRight:"40px"}}>
  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap' }}>
    {configurations.map((config, index) => (
      <li
        key={config.key}
        style={{
          border: '1px solid #ccc',
          padding: '20px', // Increase padding for more spacing inside the box
          marginBottom: '30px', // Increase margin bottom for more spacing between boxes
          backgroundColor: '#f9f9f9',
          width: 'calc(50% - 10px)', // Increase the width of the boxes
          marginRight: index % 2 === 0 ? '20px' : '0', // Add margin to separate boxes
        }}
      >
        <strong>RabbitMQ Hostname:</strong> {config.data.rabbitmqHostname}<br />
        <strong>RabbitMQ Port:</strong> {config.data.rabbitmqPort}<br />
        <strong>RabbitMQ Username:</strong> {config.data.rabbitmqUsername}<br />
        {/* You can add more fields here */}
        <button
                  onClick={() => handleChooseConfig(config)}
                  >Choose</button>
                      

      </li>
    ))}
  </ul>
</Col>


</Row>


        </CardBody>
        </Card>
</Col>


  {/*  check queue */}

    <Col lg="8" >

        <Card className="card-stats" >
        <CardBody>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' , marginBottom: '25px'}}>
  <button onClick={handleCheckAll}>Check Queues</button>
</div>
{Res && (
  <div>  <table className="queue-info-table">
    <thead>
      <tr>
        <th className="colored-header">Nombre Total</th>
        <th className="colored-header">Nombre Failed Queue</th>
        <th className="colored-header">Noms des Queues Failed</th>
        <th className="colored-header">Empty</th>
        <th className="colored-header">Undeliverable</th>
        <th className="colored-header">DLX</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{Res.totalQueues}</td>
        <td>{Res.totalFailedQueues}</td>
        <td>
          <ul>
            {Res.failedQueueNames.map(queueName => (
              <li key={queueName}>{queueName}</li>
            ))}
          </ul>
        </td>
        <td>
          <ul>
            {Res.failedQueueNames.map(queueName => (
              <li key={queueName}>
                {Res.emptyQueueNames.includes(queueName) ? <span className="animated checkmark">✓</span> : <span className="animated cross">✗</span>}
              </li>
            ))}
          </ul>
        </td>
        <td>
          <ul>
            {Res.failedQueueNames.map(queueName => (
              <li key={queueName}>
                {Res.unroutableQueueNames.includes(queueName) ? <span className="animated checkmark">✓</span> : <span className="animated cross">✗</span>}
              </li>
            ))}
          </ul>
        </td>
        <td>
          <ul>
            {Res.failedQueueNames.map(queueName => (
              <li key={queueName}>
                {Res.dlxQueueNames.includes(queueName) ? <span className="animated checkmark">✓</span> : <span className="animated cross">✗</span>}
              </li>
            ))}
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
  <div className="explanations">
 
      <p>
        <strong >DLX:</strong> Messages that cannot be processed successfully are sent to a Dead Letter Exchange (DLX) configured for this queue.
      </p>
      <p>
        <strong>Unroutable:</strong> Messages that cannot be routed to any consumers because the number of messages exceeds the number of consumers.
      </p>
      <p>
        <strong>Empty:</strong> Queues with no messages waiting to be processed.
      </p>
    </div>
  </div>
)}

        </CardBody>
        </Card>
    </Col>




</Col>
        )}
        </div>


        </>
    )


}

export default CheckQueue;
 