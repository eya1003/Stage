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

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Typography, Button, TextField, DialogContentText } from '@material-ui/core';
import Swal from "sweetalert2";


function CheckQueue (){


    const [error, setError] = useState('');
    const [activeSection, setActiveSection] = useState("Rabbit MQ");
    const navigate = useNavigate(); // Initialize useNavigate
    const [searchQueue, setSearchQueue] = useState(""); // State to store the search queue value
    const [queueExists, setQueueExists] = useState(''); 
    const [Res, setRes] = useState(false);
  
      const handleCheckQueueExistence = async () => {
        const storedConfig = JSON.parse(localStorage.getItem("rabbitConfig"));
      
        if (!storedConfig) {
          console.error("RabbitMQ configuration missing");
          return;
        }
      
        const { rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword } = storedConfig;
      
        try {
          const response = await axios.post("http://localhost:5000/qu/checkExist", {
            rabbitmqHostname,
            rabbitmqPort,
            rabbitmqUsername,
            rabbitmqPassword,
            qu: searchQueue,
          });
      
          setQueueExists(response.data.exists);
      
          setTimeout(() => {
            setQueueExists(null);
            setSearchQueue(""); // Clear the input field after searching
          }, 30000);
      
          console.log(queueExists);
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "An error occurred while checking queue existence",
            icon: "error",
            confirmButtonText: "Change Port",
            showCancelButton: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Change Port",
                input: "number",
                inputValue: rabbitmqPort,
                inputPlaceholder: "Enter new port...",
                showCancelButton: true,
                confirmButtonText: "Save",
              }).then((changeResult) => {
                if (changeResult.isConfirmed) {
                  const newPort = changeResult.value;
      
                  // Update the port in local storage
                  const updatedConfig = { ...storedConfig, rabbitmqPort: newPort };
                  localStorage.setItem("rabbitConfig", JSON.stringify(updatedConfig));
      
                }
              });
            }
          });
        }
      };
      
      const QueueInformationTable = async() => {

        const storedConfig = JSON.parse(localStorage.getItem("rabbitConfig"));
        const { rabbitmqHostname, rabbitmqPort, rabbitmqUsername, rabbitmqPassword } = storedConfig;

        if (!storedConfig) {
          setError("RabbitMQ configuration missing");
          navigate("/admin/configQueue");
          return;
        }
        try {
          const rabbitConfig = JSON.parse(localStorage.getItem('rabbitConfig'));
    
          const response = await axios.post('http://localhost:5000/qu/checkAll', rabbitConfig);
    
          if (response.status === 200) {
            setRes(response.data);
            setError(null);
          } else {
            setError('Failed to fetch queue information.');
          }
        } catch (error) {
          {
            Swal.fire({
              title: "Error",
              text: "An error occurred while checking queue existence",
              icon: "error",
              confirmButtonText: "Change Port",
              showCancelButton: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Change Port",
                  input: "number",
                  inputValue: rabbitmqPort,
                  inputPlaceholder: "Enter new port...",
                  showCancelButton: true,
                  confirmButtonText: "Save",
                }).then((changeResult) => {
                  if (changeResult.isConfirmed) {
                    const newPort = changeResult.value;
        
                    // Update the port in local storage
                    const updatedConfig = { ...storedConfig, rabbitmqPort: newPort };
                    localStorage.setItem("rabbitConfig", JSON.stringify(updatedConfig));
        
                  }
                });
              }
            });
          }
        }
      }


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
  {/* this part about search queue with name */}
<Col lg="8" >
        <Card className="card-stats" >
        <CardBody>
           
        <Row style={{  justifyContent: 'center'}}>
              <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px', marginBottom: '50px' }}>
            <CardTitle tag="h3" style={{ color: '#666', fontSize: '24px', fontWeight: ' ' }}>
            Use the input field to check if the queue name exists.       
            </CardTitle>
            <p style={{ color: '#666', fontSize: '18px' }}>
            </p>
          </div>
                <Col md="8" xs="7">
                  
                  <div className="numbers">
                  <CardTitle tag="p"  >
                      <Input
                        placeholder="Enter queue name..."
                        value={searchQueue}
                        onChange={(e) => setSearchQueue(e.target.value)}
                        style={{
                          borderRadius: '5px',
                          border: '1px solid #ccc',
                          padding: '10px',
                          fontSize: '16px',
                          width: '100%',
                        }}
                        required
                      />
                    </CardTitle>
                    <p />
                  </div>
                </Col>
                  <Col md="4" xs="5" style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button style={{ backgroundColor: "#f17e5d", fontSize: '18px', fontWeight: 'bold', padding: '10px 50px' , marginTop:"19px"}} onClick={handleCheckQueueExistence}>
                    Search
                  </Button>
                </Col>
                <Alert color={queueExists ? "success" : "danger"} style={{ marginTop: '20px', textAlign: 'left', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>
          {queueExists ? "Queue exists" : "Queue does not exist"}
        </Alert>

         </Row>

        </CardBody>
        </Card>
</Col>


  {/*  check queue */}

    <Col lg="8" >

        <Card className="card-stats" >
        <CardBody>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' , marginBottom: '25px'}}>
  <button onClick={QueueInformationTable}>Check Queues</button>
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
