import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from './axios'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import Alert from 'react-bootstrap/Alert'
import Modal from 'react-bootstrap/Modal'
import CloseButton from 'react-bootstrap/CloseButton'
import { ModalFooter, NavbarBrand } from 'react-bootstrap'

//Function to saparate date from an iso formate from database
function formateDate(date) {
  const _ = new Date(date)
  const d = _.getDate() < 10 ? `0${_.getDate()}` : _.getDate()
  const m = _.getMonth() < 9 ? `0${_.getMonth() + 1}` : _.getMonth() + 1
  const y = _.getFullYear()

  return [y, m, d].join("-")

}

const Myform = (props) => {

  //States
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState("")

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { title, text }
      await axios.post("/users/todo", data)
      props.onHide()
      setTitle("")
      setText("")
    } catch (error) {
      setIsError(true)
      setError(error.response.data.message)
    }
  }

  return (
    <Modal size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Title className='p-3'>
        <Row>
          <Col className='d-flex align-items-center' sm="10" md="10" lg="10">
            Add Todo
          </Col>
          <Col className='d-flex justify-content-end' sm="2" md="2" lg="2">
            <CloseButton onClick={props.onHide} />
          </Col>
        </Row>
      </Modal.Title>
      <Form onSubmit={handleFormSubmit}>
        <Modal.Body>
          <Row>
            <Col sm="12" md="12" lg="12">
              {isError && <Alert variant='danger' onClose={() => setIsError(false)} dismissible="true">{error}</Alert>}
              <Form.Group className="mb-3">
                <FloatingLabel label="Enter Todo title ">
                  <Form.Control type="title" placeholder="Enter todo title" onChange={(e) => setTitle(e.target.value)} value={title} required />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3">
                <FloatingLabel label="Description">
                  <Form.Control type="textarea" placeholder="Enter your name" onChange={(e) => setText(e.target.value)} value={text} required />
                </FloatingLabel>
              </Form.Group>
            </Col >
          </Row >
        </Modal.Body >
        <ModalFooter className='d-flex justify-content-end' >
          <Button className='btn-sm' variant="outline-success" type="submit">
            Add
          </Button>
        </ModalFooter>
      </Form>
    </Modal >

  )
}


const Addtodo = () => {

  const [list, setList] = useState([])
  const [date, setDate] = useState(formateDate(new Date()))
  const [reloadList, setReloadList] = useState(true)
  const [modalShow, setModalShow] = React.useState(false)
  const [updateModel, setUpdateModel] = React.useState(false)
  const [username, setUsername] = React.useState("")
  const [picture, setPicture] = React.useState()
  const [search, setSearch] = React.useState("")
  let navigate = useNavigate()

  const getList = async () => {
    const req = await axios.get("/users/todo", {
      params: {
        date: formateDate(date)
      }
    })
    setList(req.data.data)
  }

  const getCurrentUser = async () => {
    const req = await axios.get("/users/getData")
    setUsername(`Signed in as, ${req.data.data.name}`)
    setPicture(`${req.data.data.photo}`)
    setReloadList(reloadList)
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
    getCurrentUser()
  }, [reloadList])

  //Function to call on form submit
  const logout = () => {
    localStorage.clear("")
    navigate("/login")
  }

  return (
    <div>
      <Navbar bg="light" variant="light" className="d-flex flex-row-reverse pe-3">
        <Nav>
          <NavbarBrand>
            <img src={`http://localhost:8080/static/${picture}`} className='img-fluid rounded' width="25" ></img>
          </NavbarBrand>
          <NavDropdown title={username} size="sm">
            <NavDropdown.Item onClick={() => setUpdateModel(true)} >Edit Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
      <Container>
        <Row className="justify-content-md-center mt-3">
          <Col lg={true} className='pb-3' >
            <Card border="warning" text="dark" >
              <Card.Header>
                <Row>
                  <Col sm="12" xs="12" className='d-flex align-items-center fs-5'>
                    Todo List
                  </Col>
                  <Col md="auto" xs="7" sm="7" lg="4"  >
                    <Form.Control type="date" onChange={(e) => { setDate(e.target.value); setReloadList(!reloadList) }} value={date} />
                  </Col>
                  <Col xs="5" sm="5" lg="4" >
                    <div className='d-flex flex-row-reverse'>
                      <Button className='btn-sm' variant="outline-success" onClick={() => setModalShow(true)} > Add </Button>
                    </div>
                  </Col>
                  <Col>
                    <div className='mt-2'>
                      <Form.Control type="search" placeholder="Search Todo Here..." aria-label="Search" onChange={(e) => { setSearch(e.target.value) }} value={search} />
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className='py-0 overflow-auto' style={{ maxHeight: `${window.innerWidth <= 425 ? window.innerHeight - 180 : window.innerHeight - 150}px` }} >
                {
                  list.filter((val) => {
                    if (search == "") {
                      return val
                    } else {
                      return val.title.toLowerCase().includes(search.toLowerCase())
                    }
                  })
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((task, index) => {
                      return (
                        <Row className={`px-1 py-2 ${list.length !== index + 1 ? "border-bottom" : ""}`} key={task._id} onClick={() => toggleTodo(task)} style={{ textDecorationLine: task.isCompleted ? 'line-through' : "" }} >
                          <Col xs="12" sm="12" md="10" >
                            <blockquote className="blockquote mb-0">
                              <p>{task.title}</p>
                              <footer className="blockquote-footer">{task.text}
                              </footer>
                            </blockquote>
                          </Col>
                          <Col xs="12" sm="12" md="2" className='d-flex flex-row-reverse align-items-center'>
                            <div>
                              <Button className='btn-sm' variant="outline-danger" onClick={() => deleteTodo(task._id)} >Delete</Button>
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
      <Myform show={modalShow} onHide={() => { setModalShow(false); setReloadList(!reloadList) }} />
      <Update show={updateModel} onHide={() => { setUpdateModel(false) }} />
    </div >

  )

}


const Update = (props) => {

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [isError, setIsError] = React.useState(false)
  const [id, setID] = React.useState("")
  const [error, setError] = React.useState("")
  const [reloadList] = React.useState(true)

  const getDetails = async () => {
    const req = await axios.get("/users/getData")
    setName(`${req.data.data.name}`)
    setEmail(`${req.data.data.email}`)
    setID(`${req.data.data._id}`)

  }

  useEffect(() => {
    getDetails()
  }, [reloadList])

  const handleUpdateForm = async (e) => {

    const data = { name, email }
    try {
      const apireq = await axios.patch(`/users/update/${id}`, data)
      localStorage.setItem("token", apireq.data.data)
      console.log(apireq.data.data)
    } catch (error) {
      setIsError(true)
      setError(error.response.data.message)
    }

  }

  return (
    <Modal size="lg"
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Title className='p-3'>
        <Row>
          <Col className='d-flex align-items-center' sm="10" md="10" lg="10">
            Edit Profile
          </Col>
          <Col className='d-flex justify-content-end' sm="2" md="2" lg="2">
            <CloseButton onClick={props.onHide} />
          </Col>
        </Row>
      </Modal.Title>
      <Modal.Body>
        <Form onSubmit={handleUpdateForm} encType='multipart/form-data'>
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
          <div className="text-end" >
            <Button className='btn-sm' variant="outline-primary" type="submit">
              Update
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>

  )

}
export default Addtodo