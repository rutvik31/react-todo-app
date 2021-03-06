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
import { MdDelete, MdAddTask, MdLogout, MdLastPage, MdFirstPage } from "react-icons/md";
import { FaSort } from "react-icons/fa";

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
  const [priority, setPriority] = useState("")
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState("")

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { title, text, priority }
      await axios.post("/users/todo", data)
      console.log(data)
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
                  <Form.Control type="textarea" placeholder="Enter Description" onChange={(e) => setText(e.target.value)} value={text} required />
                </FloatingLabel>
              </Form.Group>
              <Form.Group>
                <Form.Label>Select Priority</Form.Label>
                <Form.Select type="priority" onChange={(e) => setPriority(e.target.value)} value={priority} required>
                  <option> Normal </option>
                  <option> High </option>
                </Form.Select>
              </Form.Group>
            </Col >
          </Row >
        </Modal.Body >
        <ModalFooter className='d-flex justify-content-end' >
          <Button variant="outline-success btn-sm" data-toggle="tooltip" title="Add a task" type="submit">
            <MdAddTask size="1rem" />
          </Button>
        </ModalFooter>
      </Form>
    </Modal >

  )
}


const Addtodo = () => {

  const [list, setList] = React.useState([])
  const [date, setDate] = React.useState(formateDate(new Date()))
  const [reloadList, setReloadList] = React.useState(true)
  const [modalShow, setModalShow] = React.useState(false)
  const [updateModel, setUpdateModel] = React.useState(false)
  const [username, setUsername] = React.useState("")
  const [picture, setPicture] = React.useState()
  const [sort, setSort] = React.useState(0)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [size, setSize] = React.useState(5)
  const [len, setLen] = React.useState(1)
  const [totalPage, setTotalPage] = React.useState(1)

  let navigate = useNavigate()

  const getList = async () => {
    const params = {
      date: formateDate(date)
    }
    if (sort != 0) {
      params.sort = sort
    }
    if (search && search.length > 0) {
      params.search = search
    }
    if (page) {
      params.page = page
    }
    if (size) {
      params.size = size
    }
    const req = await axios.get("/users/todo", {
      params: params
    })

    if (req.data && req.data.data && req.data.data.data) {
      setList(req.data.data.data)
    }
    if (req.data.data.meta.length > 0) {
      setLen(req.data.data.meta[0].title)
      setTotalPage(Math.ceil(len / size))
    }
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

  const toggleSort = () => {

    if (sort == 0) {
      setSort(1)
      setReloadList(!reloadList)
    } else if (sort == 1) {
      setSort(-1)
      setReloadList(!reloadList)
    } else if (sort == -1) {
      setSort(0)
      setReloadList(!reloadList)
    }
  }

  const searchQ = () => {
    let st
    if (st) {
      clearTimeout(st)
    }
    st = setTimeout(() => {
      setReloadList(!reloadList)
    }, 1000)
  }

  useEffect(() => {
    getList()
    getCurrentUser()
  }, [reloadList])

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
            <NavDropdown.Item onClick={logout}><MdLogout /> Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>
      <Container>
        <Row className="justify-content-md-center mt-3 ">
          <Col lg={true} className='pb-3' >
            <Card>
              <Card.Header className='p-2 '>
                <Row>
                  <Col xs="6" sm="6" lg="9" xl="9" className='d-flex align-items-center fs-5 '>
                    Todo List
                  </Col>
                  <Col xs="6" sm="6" lg="3" xl="3" className='d-flex align-items-center fs-5'>
                    <Form.Control type="date" onChange={(e) => { setDate(e.target.value); setReloadList(!reloadList) }} value={date} />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body className='py-0 overflow-auto' style={{ maxHeight: `${window.innerWidth <= 425 ? window.innerHeight - 273 : window.innerHeight - 243}px` }} >
                <div className="d-flex justify-content-center">
                  <Row>
                    <Col xs="8" sm="8" lg="8" xl="8" className='d-flex align-items-center fs-5 p-2'>
                      <Form.Control type="search" placeholder="Search" aria-label="Search" onChange={(e) => { setSearch(e.target.value); searchQ() }} />
                    </Col>
                    <Col xs="2" sm="2" lg="2" xl="2" className='d-flex align-items-center fs-5 p-2'>
                      <Button variant="outline-success btn-sm" data-toggle="tooltip" title="Sort Task" onClick={() => toggleSort()} type="submit" >
                        <FaSort size="1.2rem" />
                      </Button>
                    </Col>
                    <Col xs="2" sm="2" lg="2" xl="2" className='d-flex align-items-center fs-5 p-2'>
                      <Button variant="outline-success btn-sm" data-toggle="tooltip" title="Add a new task" onClick={() => setModalShow(true)} type='submit'>
                        <MdAddTask size="1.2rem" />
                      </Button>
                    </Col>
                  </Row>
                </div>
                {
                  list.map((task, index) => {
                    return (
                      <Row className={`px-1 py-2 ${list.length !== index + 1 ? "border-bottom" : ""} border-top `} key={index} onClick={() => toggleTodo(task)} style={{ textDecorationLine: task.isCompleted ? 'line-through' : "" }} >
                        <Col xs="12" sm="12" md="10" >
                          <blockquote className="blockquote mb-0">
                            <p>{task.title}</p>
                            <footer className="blockquote-footer">{task.text}
                              <h6>Priority : {task.priority}</h6>
                            </footer>
                          </blockquote>
                        </Col>
                        <Col xs="12" sm="12" md="2" className='d-flex flex-row-reverse'>
                          <div>
                            <MdDelete size="1.5rem" color='red' type='submit' onClick={() => deleteTodo(task._id)} />
                          </div>
                        </Col>
                      </Row>
                    )
                  })
                }
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-center">
                      <Button className="ms-2 me-2" variant="outline-success btn-sm" data-toggle="tooltip" title="Go To Previous Page" onClick={() => { setPage(page > 1 ? page - 1 : 1); setReloadList(!reloadList) }}>
                        <MdFirstPage size="1rem" />
                      </Button>
                      <Button variant="outline-success btn-sm" data-toggle="tooltip" title="Go To Next Page" onClick={() => { setPage(totalPage > 0 && totalPage > page ? page + 1 : page); setReloadList(!reloadList) }}>
                        <MdLastPage size="1rem" />
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Footer>
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

