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


const PasswordresetLink = () => {

    const [email, setEmail] = useState("")
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    let navigate = useNavigate()

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        try {
            setMessage("")
            const data = { email }
            const apiReq = axios.post("users/password-reset", data)
            console.log(apiReq)
            setEmail("")
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
                            <Card.Header>Request Password Reset </Card.Header>
                            {isError && <Alert variant='danger' onClose={() => setIsError(false)} dismissible="true">{error}</Alert>}
                            {message && <Alert variant="success">{message}</Alert>}
                            <Form onSubmit={handlePasswordReset} className="p-3">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <FloatingLabel label=" Enter Email address">
                                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                                    </FloatingLabel>
                                </Form.Group>
                                <div className="text-end mb-2" >
                                    <Button onClick={navigate} variant="outline-primary" type="submit">
                                        Send mail
                                    </Button>
                                </div>
                                <br /><br />
                                <small>Go Back To </small><NavLink to="/login">Login</NavLink>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default PasswordresetLink