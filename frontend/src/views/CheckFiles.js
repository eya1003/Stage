
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
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
function CheckFiles(){


  const [fileList, setFileList] = useState([]);
  const [summary, setSummary] = useState({ numFiles: 0, numFolders: 0 });
  const [loading, setLoading] = useState(false);

  const chosenFileZilla = JSON.parse(localStorage.getItem('chosenFileZilla'));

  const handleGetFileList = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/file/getFile', {
        host: chosenFileZilla.host,
        port: chosenFileZilla.port,
        user: chosenFileZilla.user,
        password: chosenFileZilla.password,
      });

      const { fileList, summary } = response.data;
      setFileList(fileList);
      setSummary(summary);
    } catch (error) {
      console.error('Error getting file list:', error);
    } finally {
      setLoading(false);
    }
  };
    const [activeSection, setActiveSection] = useState("File Zilla");

    const navigate= useNavigate()
    const [fileZillaConfigs, setFileZillaConfigs] = useState([]);

    useEffect(() => {
      const configs = JSON.parse(localStorage.getItem('NumberedFileZillaConfigs')) || [];
      setFileZillaConfigs(configs);
    }, []);

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
          localStorage.setItem('chosenFileZilla', JSON.stringify(config));
          // You can add any other logic you want here
          Swal.fire('Chosen!', 'The configuration has been chosen.', 'success');
        }
      });
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
            <div className="welcome-message" style={{ textAlign: 'center' }}>
    <CardTitle tag="h3" style={{ color: '#51bcda', fontSize: '24px', fontWeight: 'bold', marginLeft:"15px" }}>
      Stored Configurations
    </CardTitle>
  </div>
  <Col style={{ marginTop: "50px", marginLeft: "-250px", marginRight: "40px" }}>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap' }}>
        {fileZillaConfigs.map((config, index) => (
          <li
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '20px', // Increase padding for more spacing inside the box
              marginBottom: '30px', // Increase margin bottom for more spacing between boxes
              backgroundColor: '#f9f9f9',
              width: 'calc(50% - 10px)', // Increase the width of the boxes
              marginRight: index % 2 === 0 ? '20px' : '0', // Add margin to separate boxes
            }}
          >
            <div>
            <strong>FilleZilla Hostname:</strong> {config.host}<br />
            <strong>FilleZilla Port:</strong> {config.port}<br />
            <strong>FilleZilla UserName:</strong> {config.user}<br />

            </div>
            <button  onClick={() => handleChooseConfig(config)}
                  >Choose</button>
                   

          </li>
        ))}
      </ul>
    </Col>


         </Row>
        </CardBody>
        </Card>
</Col>

<Col lg="8" >

<Card className="card-stats" >
<CardBody>
  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '25px' }}>
    <button onClick={handleGetFileList} disabled={loading}>
      {loading ? 'Loading...' : 'Check Server'}
    </button>
  </div>

 
  <div>
  <table className="queue-info-table">
    <thead>
      <tr>
        <th className="colored-header">Number of Files</th>
        <th className="colored-header">Number of Folders</th>
        <th className="colored-header">File Names</th>
        <th className="colored-header">Folder Names</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{summary.numFiles}</td>
        <td>{summary.numFolders}</td>
        <td>
          <ul>
            {fileList.map((item, index) => (
              item.startsWith('[FILE]') && (
                <li key={index}>{item.replace('[FILE] ', '')}</li>
              )
            ))}
          </ul>
        </td>
        <td>
          <ul>
            {fileList.map((item, index) => (
              item.startsWith('[DIR]') && (
                <li key={index}>{item.replace('[DIR] ', '')}</li>
              )
            ))}
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>




</CardBody> 
</Card>
</Col>
        </div>
        </>
    )
}
export default CheckFiles;
