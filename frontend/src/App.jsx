import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./components/common/Home";
import Show from "./components/common/Register";
import ShowLogin from "./components/common/Login";
import NavbarGeneral from "./components/headers/NavbarGeneral";
import NavbarUser from "./components/headers/NavbarUser";
import UserExercise from "./components/users/UserExercise";
import UserPlan from "./components/users/UserPlan";
import UsersList from "./components/users/UsersList";
import UserWorkout from "./components/users/UserWorkout";

const Layout = (props) => {

  const [navbarValue, setNavbarValue] = useState(0)
  let usersTemp;

  useEffect(() => {

    axios
      .get("http://localhost:4000/user")
      .then((response) => {
        usersTemp = response.data;
        usersTemp.map((user, ind) => {
          if (user.loggedIn === true) {
            setNavbarValue(1)
            return navbarValue;
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });

  }, [props.id]);

  return (
    <div>
        {(navbarValue === 0) ? <NavbarGeneral /> :<NavbarUser />}
        <div className="container">
            <Outlet/>
        </div>
    </div>
  );
};

function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="users" element={<UsersList />} />
            <Route path="register" element={<Show />} />
            <Route path="login" element={<ShowLogin />} />
            <Route path="userworkout" element={<UserWorkout />} />
            <Route path="userexercise" element={<UserExercise />} />
            <Route path="userplan" element={<UserPlan />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

export default App;