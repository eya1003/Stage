
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
import axios from "axios"; // Import axios library

function Dashboard() {

  const [searchQueue, setSearchQueue] = useState(""); // State to store the search queue value
  const [messages, setMessages] = useState([]);
  const [messagesQu, setMessagesQu] = useState([]);
  const [queueNames, setQueueNames] = useState([]);
  const [queueState, setQueueState] = useState('');
  const [ibmState, setIbmState] = useState('');
  const [error, setError] = useState('');
  const [errorGet, setErrorGet] = useState('');
  const [activeSection, setActiveSection] = useState("Rabbit MQ");

// Rabbit MQ
  const handleSearchClick = () => {
    setError(''); // Clear any previous error messages

    // Make the API request to check server status and queue existence
    axios
      .get(`http://localhost:5000/qu/getQueue/${searchQueue}`)
      .then((response) => {
        const {  state, messages } = response.data;
        setQueueState(state);
        setError(''); // Clear any previous error messages
        setMessagesQu(messages)
        // alert('Green: Success'); // Show green alert for successful response
      })
  
       // alert('Green: Success'); // Show green alert for successful response
      
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500 && error.response.data.error === 'RabbitMQ server is down or not reachable') {
            setError('Server down'); // Server is down or not reachable
            Swal.fire(
              'Server is Down!'
            )
          } else if ( error.response.data.error === 'queue not found') {
            Swal.fire(
              'No queue Found!'
            ) // Queue does not exist
         }
        } else {
          Swal.fire(
            'Network Error!',
          ) // Network error or other issues
        }
      });
  };


  

  // Rabbit MQ
  const getNamesQueues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/qu/getQueueNames');

      if (response.status === 200) {
        setQueueNames(response.data);
        setErrorGet(''); // Clear any previous error message
      } else {
        setErrorGet('Failed to fetch queue names');
      }
    } catch (error) {
      setErrorGet(`Error occurred: ${error.message}`);
    }
  };


// IBM Web sphere

  const handleCheckClick = () => {
    setError(''); // Clear any previous error messages

    // Make the API request to check server status and queue existence
    axios
      .get(`http://localhost:5000/qu/CheckServer`) 
      .then((response) => {
        const { status } = response.data;
        setIbmState(status);
        console.log(status)
        setError(''); // Clear any previous error messages
       // alert('Green: Success'); // Show green alert for successful response
       Swal.fire(
        'Server is Up!'
      )
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500 && error.response.data.error === 'RabbitMQ server is down or not reachable') {
            setError('Server down'); // Server is down or not reachable
            Swal.fire(
              'Server is Down!'
            )
          } 
      }});
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

          <Col lg="28" ><Col lg="8" >
            {/* get all queues names */}


          <Card className="card-stats" >
            <CardBody>
              <Row style={{  justifyContent: 'center'}}>
              <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px', marginBottom:'50px' }}>
          
            <p style={{ color: '#666', fontSize: '18px' }}>
              Click the button below to get the name's queues.
            </p>
          </div>
                
                  <Col md="4" xs="5" style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button style={{ backgroundColor: "#f17e5d", fontSize: '18px', fontWeight: 'bold', padding: '10px 30px' }} onClick={getNamesQueues}>
                    Check Server
                  </Button>
                  
                </Col>
              
              </Row>

              <Row className="mt-4 justify-content-center">
      <Col md="8">
        <div className="queue-list-container">
          {/* Utilisez ul et li pour afficher une liste ordonnée avec des points */}
          <ul className="list-unstyled" style={styles.list}>
            {queueNames.map((queueName, index) => (
              <li key={index} style={styles.listItem}>
                {queueName}
              </li>
            ))}
          </ul>
        </div>
      </Col>
    </Row>
            </CardBody>
          </Card>
{/* queue with name */}

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
                  <Button style={{ backgroundColor: "#f17e5d", fontSize: '18px', fontWeight: 'bold', padding: '10px 30px' }} onClick={handleSearchClick}>
                    Search
                  </Button>
                </Col>
                 
                {error && (
                <Alert color="danger" style={{ marginTop: '20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{error}</span>
                </Alert>
              )}
              {queueState && (
                <Alert color="success" style={{ marginTop: '20px', textAlign: 'left', padding: '20px', borderRadius: '5px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Queue State: {queueState}</span>
                  <p>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Idle:</span> There are no messages in the queue, and there are no consumers actively consuming messages.
                  </p>
                  <p>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Backlogged:</span> The queue has messages in it, but there are no consumers actively consuming those messages.
                  </p>
                  <p>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Active:</span> The queue has messages in it, and there are consumers actively consuming those messages.
                  </p>
                  <p>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Unknown:</span> The state of the queue could not be determined due to some unknown or unexpected condition.
                  </p>
                  
                </Alert>
                
              )}

          {messagesQu && (
            <Alert color="success" style={{ marginTop: '20px', textAlign: 'left', padding: '20px', borderRadius: '5px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Messages in the queue</span>
              <div>
              <ul>

                {messagesQu.map((message, index) => (
                  <p key={index} style={{ fontWeight: '', fontSize: '16px', marginBottom: '5px' }}>
                    {message}
                  </p>
                ))}
                                      </ul>

              </div>
            </Alert>
          )}

                {errorGet && (
                <Alert color="danger" style={{ marginTop: '20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{errorGet}</span>
                </Alert>
              )}

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
            <Col md="11"  style={{  justifyContent: 'center',height: '47vh' }} >
            <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <CardTitle tag="h2" style={{ color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          Welcome to the IBM Web Sphere Server Status Checker
        </CardTitle>
        <p style={{ color: '#666', fontSize: '18px' }}>
          Click the button below to check the server's current status.
        </p>
      </div>
                <br/>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '15vh' }}>

                <Button style={{ backgroundColor: "#f17e5d" }} onClick={handleCheckClick}>
                  Check Server
                </Button>
                <br/>
                <br/>
          
                </div>
                {error && <Alert color="danger">  <span style={{ fontWeight: 'bold' , fontSize: '12px',}}> {error} </span>  </Alert>}
                {ibmState && (
                <Alert style={{ marginTop: '20px', textAlign: 'left', padding: '20px', borderRadius: '5px', backgroundColor:"#ef8157" }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>IBM Server State: {ibmState}</span>
                  
                </Alert>
                
              )}
            </Col>
            <br/>
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
