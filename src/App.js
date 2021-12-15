import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Addtodo from "./components/addTodo";
import PasswordresetLink from "./components/PasswordresetLink";
import Passwordreset from "./components/Passwordreset";

function App() {
  const token = localStorage.getItem("token")
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/password-reset" element={<PasswordresetLink />}></Route>
        <Route path="/password-reset/:userId/:token" element={<Passwordreset />}></Route>
        <Route path="/" element={<Addtodo />}></Route>
        <Route
          exact
          path="/"
          render={() => {
            return (
              token != null ?
                <Navigate to="/" /> :
                <Navigate to="/login" />
            )
          }}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App