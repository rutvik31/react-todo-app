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

const Register = () => {

    //States
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    //Function called on form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { name, email, password }
            //Making Api Request
            await axios.post("/users/register", data)
            navigate("/login")
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
                            <Card.Header>Register </Card.Header>
                            <Form onSubmit={handleFormSubmit} className="p-3">
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
                                <div className="text-end" >
                                    <Button variant="primary" type="submit">
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