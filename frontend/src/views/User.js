
import React, { useEffect, useState } from "react";

// reactstrap components
import { Button, Card, CardHeader, CardBody, CardFooter, CardTitle, FormGroup,Form,Input, Row, Col, Alert,
} from "reactstrap";
import Swal from "sweetalert2";

function User() {

  const [msg, setMsg] = useState('');
// Retrieve user information from localStorage
const storedUser = localStorage?.getItem('userData');
const user = JSON.parse(storedUser);

  // State variables for the user information that can be edited
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [imageUrl, setImageUrl] = useState(user?.imageUrl);


   // RabbitMQ configuration states
   const [rabbitMQHostname, setRabbitMQHostname] = useState('');
   const [rabbitMQPort, setRabbitMQPort] = useState('');
   const [rabbitMQUsername, setRabbitMQUsername] = useState('');
   const [rabbitMQPassword, setRabbitMQPassword] = useState('');
 
   // Editing configuration state
   const [editingConfigKey, setEditingConfigKey] = useState(null);
  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Prepare the updated user data to send to the server
    const updatedUserData = { 
      firstName,
      lastName,
      imageUrl,
    };
    
    setMsg("Account Updated")
    console.log("msg:", msg);

    Swal.fire(
      '', 
      'Profile updated successfully.',
        'success'
    )

    // Make the API request to update the user profile with updatedUserData
    fetch(`http://localhost:5000/user/updateUser/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("User updated successfully:");
        // Handle any other logic after the update, such as showing a success message, etc.
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        const updatedUser = {
          ...storedUser,
          firstName,
          lastName,
          imageUrl
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        // Handle any error that occurred during the update process
      });
  };

 // RabbitMQ configurations from localStorage
 const [rabbitConfigs, setRabbitConfigs] = useState([]);

 useEffect(() => {
   const configs = [];
   for (let i = 0; i < localStorage.length; i++) {
     const key = localStorage.key(i);
     if (key.startsWith('rabbitConfig')) {
       const config = JSON.parse(localStorage.getItem(key));
       configs.push({ key, config });
     }
   }
   setRabbitConfigs(configs);
 }, []);

 const handleRabbitConfigChange = (index, field, value) => {
  const updatedConfigs = [...rabbitConfigs];
  updatedConfigs[index].config[field] = value;
  setRabbitConfigs(updatedConfigs);
};


const handleEditConfig = (index) => {
  const editedConfig = rabbitConfigs[index].config;

  // Prepare the RabbitMQ configuration data
  const updatedConfig = {
    rabbitmqHostname: editedConfig.rabbitmqHostname, // Use the current config's values
    rabbitmqPort: editedConfig.rabbitmqPort,
    rabbitmqUsername: editedConfig.rabbitmqUsername,
    rabbitmqPassword: editedConfig.rabbitmqPassword,
  };

  // Update the configuration in the state array
  const updatedConfigs = [...rabbitConfigs];
  updatedConfigs[index].config = updatedConfig;
  setRabbitConfigs(updatedConfigs);

  // Update the configuration in localStorage
  localStorage.setItem(rabbitConfigs[index].key, JSON.stringify(updatedConfig));

  // Clear form inputs
  setRabbitMQHostname('');
  setRabbitMQPort('');
  setRabbitMQUsername('');
  setRabbitMQPassword('');

  // ... any other logic you might need ...

  Swal.fire('Configuration updated successfully');
};


const handleDeleteConfig = (index) => {
  const configKey = rabbitConfigs[index].key;

  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove the configuration from the state array
      const updatedConfigs = rabbitConfigs.filter((_, i) => i !== index);
      setRabbitConfigs(updatedConfigs);

      // Remove the configuration from localStorage
      localStorage.removeItem(configKey);

      Swal.fire('Configuration deleted successfully', '', 'success');
    }
  });
};



  return (
    <>
      <div className="content">
        <Row>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>

          <Col md="4">
            <Card className="card-user">
              <div className="image">
                <img alt="..." src={require("assets/img/damir-bosnjak.jpg")} />
              </div>
              <CardBody>
                <div className="author">
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    <img
                      alt="..."
                      className="avatar border-gray"
                      src={require("assets/img/default-avatar.png")}
                    />
                    <h5 className="title">{firstName}  {lastName} </h5>
                  </a>
                </div>
                
              </CardBody>
              
            </Card>
            
          </Col>
          <Col md="8">
            <Card className="card-user">
              <CardHeader>
              <CardTitle
  tag="h5"
  style={{
    color: "#ef8157",
    fontSize: "24px", // Adjust the font size as needed
    borderBottom: "2px solid #ef8157", // Add a border at the bottom
    paddingBottom: "10px", // Add some spacing after the border
    marginBottom: "20px", // Add overall margin to separate from other content
  }}
>
  Edit Profile 
</CardTitle>              </CardHeader>
              <CardBody>
              {msg && <Alert color="success">  <span style={{ fontWeight: 'bold' , fontSize: '14px'}}> {msg}</span> </Alert>}

              <Form onSubmit={handleFormSubmit}>
                  <Row>
                    <Col className="pr-1" md="17">
                      <FormGroup>
                        <label>Company (disabled)</label>
                        <Input
                          defaultValue="VERMEG"
                          disabled
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                   
                   
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                          placeholder="first name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          placeholder="Last Name"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
        <Col>
          <FormGroup>
            <label>Profile Image</label>
            <Input type="file"                   
                   onChange={(e) => setImageUrl(e.target.value)}
 />
          </FormGroup>
        </Col>
      </Row>
                 
                  <Row>
                    <div className="update ml-auto mr-auto">
                      <Button
                        className="btn-round"
                        color="primary"
                        type="submit"
                      >
                        Update Profile
                      </Button>

                      
                    </div>
                    
                  </Row>

                </Form>
              </CardBody>
            </Card>
          </Col>
          </div>
          </Row>

          <Row>
  <Col md="8">
    <Card className="card-user">
      <CardHeader>
        <CardTitle
          tag="h5"
          style={{
            color: "#ef8157",
            fontSize: "24px", // Adjust the font size as needed
            borderBottom: "2px solid #ef8157", // Add a border at the bottom
            paddingBottom: "10px", // Add some spacing after the border
            marginBottom: "20px", // Add overall margin to separate from other content
          }}
        >
          Manage RabbitMQ Configurations
        </CardTitle>
      </CardHeader>
      <CardBody>
        {rabbitConfigs.map((entry, index) => (
          <div key={index}>
            <p
              style={{
                fontSize: "16px", // Adjust the font size as needed
                color: "#ef8157", // Use your preferred color
                fontWeight: "bold", // Make the text bold
                marginTop: "10px", // Add some margin at the top
                marginBottom: "5px", // Add some margin at the bottom
              }}
            >
              Configuration: {entry.key}
            </p>

            <Form>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label>RabbitMQ Hostname</label>
                    <Input
                      type="text"
                      value={entry.config.rabbitmqHostname}
                      onChange={(e) =>
                        handleRabbitConfigChange(
                          index,
                          "rabbitmqHostname",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>RabbitMQ Port</label>
                    <Input
                      type="text"
                      value={entry.config.rabbitmqPort}
                      onChange={(e) =>
                        handleRabbitConfigChange(index, "rabbitmqPort", e.target.value)
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <label>RabbitMQ Username</label>
                    <Input
                      type="text"
                      value={entry.config.rabbitmqUsername}
                      onChange={(e) =>
                        handleRabbitConfigChange(
                          index,
                          "rabbitmqUsername",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label>RabbitMQ Password</label>
                    <Input
                      type="password"
                      value={entry.config.rabbitmqPassword}
                      onChange={(e) =>
                        handleRabbitConfigChange(
                          index,
                          "rabbitmqPassword",
                          e.target.value
                        )
                      }
                    />
                  </FormGroup>
                </Col>
              </Row>
              <div>
              <Button
                className="btn-round"
                color="primary"
                onClick={() => handleEditConfig(index)}
              >
                Save Configuration
              </Button>
              <Button
                className="btn-round" style={{  backgroundColor:"#ef8157"              }}
                onClick={() => handleDeleteConfig(index)}
              >
                DELETE
              </Button>
              </div>
             
            </Form>
            {index !== rabbitConfigs.length - 1 && (
              <hr
                style={{
                  margin: "20px 0", // Add some spacing above and below the divider
                  borderColor: "#ef8157", // Use your preferred color
                }}
              />
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  </Col>
</Row>



</div>

    </>
  );
}

export default User;
