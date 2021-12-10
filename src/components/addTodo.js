import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from './axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Alert from 'react-bootstrap/Alert'



function formateDate(date) {
    const _ = new Date(date)
    const d = _.getDate() < 10 ? `0${_.getDate()}` : _.getDate()
    const m = _.getMonth() < 9 ? `0${_.getMonth() + 1}` : _.getMonth() + 1
    const y = _.getFullYear()

    return [y, m, d].join("-")

}

const Addtodo = () => {

    //States
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    const [list, setList] = useState([])
    const [date, setDate] = useState(formateDate(new Date()))
    let navigate = useNavigate()
    const [reloadList, setReloadList] = useState(true)

    const getList = async () => {
        const req = await axios.get("/users/todo", {
            params: {
                date: formateDate(date)
            }
        })
        setList(req.data.data)
    }

    const toggleTodo = async (todo) => {
        await axios.patch("/users/todo", todo)
        setReloadList(!reloadList)
    }

    const deleteTodo = async (id) => {
        await axios.delete(`/users/todo/${id}`)
    }

    useEffect(() => {
        getList()
    }, [reloadList])

    //Function to call on form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { title, text }

            await axios.post("/users/todo", data)
            setTitle("")
            setText("")
            setReloadList(!reloadList)
        } catch (error) {
            setIsError(true)
            setError(error.response.data.message)
        }
    }

    const logout = () => {
        localStorage.clear("")
        navigate("/login")
    }
    return (
        <div>
            <Navbar bg="light" variant="light" className="d-flex flex-row-reverse pe-3">

                <Button variant="outline-primary" onClick={logout} type="button"> logout</Button>
            </Navbar>
            <Container>
                <Row className="pt-3">
                    <Col sm="12" md="12" lg="12">
                        <Card border="warning" bg="Light" text="dark">
                            <Card.Header>Todo Form </Card.Header>
                            <Form onSubmit={handleFormSubmit} className="p-3">
                                {isError && <Alert variant='danger' onClose={() => setIsError(false)} dismissible="true">{error}</Alert>}
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Enter Todo title ">
                                        <Form.Control type="title" placeholder="Enter todo title" onChange={(e) => setTitle(e.target.value)} value={title} required />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel label="Description">
                                        <Form.Control type="text" placeholder="Enter your name" onChange={(e) => setText(e.target.value)} value={text} required />
                                    </FloatingLabel>
                                </Form.Group>
                                <div className="text-center d-flex flex-row-reverse" >
                                    <Button variant="outline-success" type="submit">
                                        Add
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col lg={true} className='pb-3'>
                        <Card border="warning" text="dark" >
                            <Card.Header>
                                <Row>
                                    <Col className='d-flex align-items-center fs-5'>
                                        <b>Todo List </b>
                                    </Col>
                                    <Col md="auto" sm="12" className="sm">
                                        <Form.Control type="date" onChange={(e) => { setDate(e.target.value); setReloadList(!reloadList) }} value={date} />
                                    </Col>
                                </Row>
                            </Card.Header>
                            <Card.Body className='py-0 overflow-auto' style={{ maxHeight: `${window.innerWidth <= 425 ? window.innerHeight - 420 : window.innerHeight - 450}px` }} >
                                {
                                    list.map((task, index) => {

                                        return (
                                            <Row className={`px-1 py-2 ${list.length !== index + 1 ? "border-bottom" : ""}`} key={task._id} onClick={() => toggleTodo(task)} style={{ textDecorationLine: task.isCompleted ? 'line-through' : "" }} >
                                                <Col md="10" >
                                                    <blockquote className="blockquote mb-0">
                                                        <p>{task.title}</p>
                                                        <footer className="blockquote-footer">{task.text}
                                                        </footer>
                                                    </blockquote>
                                                </Col>
                                                <Col md="2" className='d-flex flex-row-reverse align-items-center'>
                                                    <div>
                                                        <Button variant="outline-danger" onClick={() => deleteTodo(task._id)} >Delete</Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        )
                                    })
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div >

    );

}

export default Addtodo