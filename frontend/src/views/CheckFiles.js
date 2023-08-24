
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
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
function CheckFiles(){
    const [activeSection, setActiveSection] = useState("File Zilla");
    const [folderPath, setFolderPath] = useState('');
    const [message, setMessage] = useState('');

    const navigate= useNavigate()
    const checkExist = async () => {
      try {
        const ftpConfig = JSON.parse(localStorage.getItem('FileZillaConfig'));
    
        if (!ftpConfig) {
          Swal.fire({
            icon: 'error',
            text: 'FTP configuration not found!',
          });
          navigate("/fileConfig")
          console.log('FTP configuration not found in localStorage.');
        } else {
          const response = await axios.post('http://localhost:5000/file/checkExist', {
            ...ftpConfig,
            folderPath: folderPath,
          });
    
          setMessage(response.data.message);
          setTimeout(() => {
            setMessage(null);
            setFolderPath('');
          }, 30000);
    
          if (response.data.message.includes('does not exist')) {
            Swal.fire({
              icon: 'error',
              text: 'Folder does not exist or connection failed!',
            });
          }
        }
      } catch (error) {
        Swal.fire({ 
          icon: 'error',
          text: 'Error!',
        });
      }
    };
    

    return(
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
        <Col lg="8" >
        <Card className="card-stats" >
        <CardBody>
           
        <Row style={{  justifyContent: 'center'}}>
              <div className="welcome-message" style={{ textAlign: 'center', marginBottom: '20px', marginBottom: '50px' }}>
            <CardTitle tag="h3" style={{ color: '#666', fontSize: '24px', fontWeight: ' ' }}>
            Use the input field to check if the folder exists.       
            </CardTitle>
            <p style={{ color: '#666', fontSize: '18px' }}>
            </p>
          </div>
                <Col md="8" xs="7">
                <input
                    type="text"
                    placeholder="Folder Path"
                    value={folderPath}
                    required
                    onChange={(e) => setFolderPath(e.target.value)}
                />
                <button onClick={checkExist}>Check Folder Existence</button>
                <Alert color={ "success"} style={{ marginTop: '20px', textAlign: 'left', padding: '10px', borderRadius: '5px', fontWeight: 'bold' }}>
          {message }
        </Alert>

              </Col>
         </Row>
        </CardBody>
        </Card>
</Col>
        </div>
        </>
    )
}
export default CheckFiles;
