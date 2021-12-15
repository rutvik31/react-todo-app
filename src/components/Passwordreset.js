import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import axios from './axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'


const Passwordreset = () => {

    const [password, setPassword] = useState("")
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    let navigate = useNavigate()

    const { token, userId } = useParams();

    //Function called on form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { password }
            //Making Api Request
            await axios.post(`/users/password-reset/${userId}/${token}`, data)
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
                            <Card.Header> Password reset form </Card.Header>
                            {isError && <Alert variant='danger' onClose={() => setIsError(false)} dismissible="true">{error}</Alert>}
                            <Form onSubmit={handleFormSubmit} className="p-3">
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <FloatingLabel label=" Enter new password">
                                        <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                                    </FloatingLabel>
                                </Form.Group>
                                <div className="text-end mb-2" >
                                    <Button onClick={navigate} variant="outline-primary" type="submit">
                                        submit
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default Passwordreset