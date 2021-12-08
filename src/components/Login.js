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

const Login = () => {

    //States
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    let navigate = useNavigate()
    //Function called on form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { email, password }
            //Making Api Request
            const apiReq = await axios.post("/users/login", data)
            localStorage.setItem("token", apiReq.data.data.token)
            navigate("/")
        } catch (error) {
            setIsError(true)
            setError(error.response.data.message)
        }

    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <Card style={{ width: '20rem' }} >
                            <Card.Header>Login </Card.Header>
                            {isError && <Alert variant='danger' onClose={() => setIsError(false)} dismissible="true">{error}</Alert>}
                            <Form onSubmit={handleFormSubmit} className="p-3">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <FloatingLabel label="Email address">
                                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <FloatingLabel label="Password">
                                        <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                                    </FloatingLabel>
                                </Form.Group>
                                <div className="text-end" >
                                    <Button onClick={navigate} variant="outline-primary" type="submit">
                                        login
                                    </Button>
                                </div>
                                <br /><br />
                                <small>Don't have an account ? </small><NavLink to="/register">Register</NavLink>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>


    )
}
export default Login