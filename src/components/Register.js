import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import axios from './axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { MdFileUpload } from "react-icons/md";

const Register = () => {

  //States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isError, setIsError] = useState(false)
  const [photo, setPhoto] = useState()
  const [error, setError] = useState("")
  const [file, setFile] = React.useState(null)
  const navigate = useNavigate()

  //Function called on form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = new FormData()
      data.append('name', name)
      data.append('email', email)
      data.append('password', password)
      data.append('photo', photo)

      //Making Api Request
      await axios.post("/users/register", data)
      navigate("/login")
    } catch (error) {
      setIsError(true)
      setError(error.response.data.message)
    }

  }

  const fileHandler = (event) => {
    setFile(event.target.files[0])
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Card style={{ width: '20rem' }} >
              <Card.Header>Register </Card.Header>
              <Form onSubmit={handleFormSubmit} encType='multipart/form-data' className="p-3">
                {isError && <Alert variant='danger' onClose={() => setIsError(false)} dismissible="true">{error}</Alert>}
                <Form.Group className="mb-3" controlId="formBasicName">
                  <FloatingLabel label="Enter Your name ">
                    <Form.Control type="name" placeholder="Enter email" onChange={(e) => setName(e.target.value)} value={name} required />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <FloatingLabel label="Enter an Email address">
                    <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <FloatingLabel label="Enter password">
                    <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                  </FloatingLabel>
                </Form.Group>
                <div>
                  <Row>
                    <Col xs="10" sm="10" lg="10">
                      <Form.Group className="mb-3" controlId="formBasicPhoto">
                        <Form.Control type="file" accept=".png, .jpg, .jpeg" onChange={(e) => setPhoto(e.target.files[0]), fileHandler} required />
                      </Form.Group>
                    </Col>
                    <Col xs="2" sm="2" lg="2">
                      <img src={file ? URL.createObjectURL(file) : null} alt={file ? file.name : null} width="36" />
                    </Col>
                  </Row>
                </div>
                <div className="text-end" >
                  <Button variant="outline-primary" type="submit">
                    Submit
                  </Button>
                </div>
                <br /><br />
                <small>Already Have An Account ? </small><NavLink to="/login">Login</NavLink>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>

  )
}
export default Register