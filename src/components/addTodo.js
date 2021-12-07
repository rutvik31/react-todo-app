import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from './axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Alert from 'react-bootstrap/Alert'


function formateDate(date) {
    const _ = new Date(date)
    const d = _.getDate() < 10 ? `0${_.getDate()}` : _.getDate()
    const m = _.getMonth() < 10 ? `0${_.getMonth() + 1}` : _.getMonth() + 1
    const y = _.getFullYear()

    return [d, m, y].join("-")

}

const Addtodo = () => {

    //States
    const [title, setTitle] = useState("")
    const [text, setText] = useState("")
    const [isCompleted, setIsCompleted] = useState("false")
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("")
    let navigate = useNavigate()
    const [list, setList] = useState([])
    const [date, setDate] = useState(new Date())

    const [reloadList, setReloadList] = useState(true)
    const getList = async () => {
        const req = await axios.get("/users/gettodo", {
            params: {
                date: formateDate(date)
            }
        })
        setList(req.data.data)
    }

    const toggleTodo = async (todo) => {
        await axios.post("/users/toggletodo", todo)
        setReloadList(!reloadList)
    }

    useEffect(() => {
        getList()
    }, [reloadList])

    //Function to call on form submit
    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = { title, text, isCompleted }

            const apiReq = await axios.post("/users/addtodo", data)
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
            <Container>
                <Row className="pt-3">
                    <Col>
                        <Card >
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
                                <div className="text-center" >
                                    <Button variant="primary" type="submit">
                                        Add
                                    </Button>
                                </div>
                                <div className="text-end" >
                                    <Button onClick={logout} variant="primary" type="button">
                                        logout
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
                <Row className="justify-content-md-center mt-3">
                    <Col md="auto">
                        <Form.Control type="date" onChange={(e) => {setDate(e.target.value); setReloadList(!reloadList)}}  value={date} />
                    </Col>
                    <Col md="auto">
                        <Card style={{ width: '20rem' }}>
                            <Card.Header>Todo List </Card.Header>
                            <ul>
                                {list.map(task => {
                                    return (
                                        <li key={task._id} onClick={() => toggleTodo(task)} style={{ textDecorationLine: task.isCompleted ? 'line-through' : "" }}>
                                            {task.text}
                                        </li>
                                    )
                                })}
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>

    );

}

export default Addtodo