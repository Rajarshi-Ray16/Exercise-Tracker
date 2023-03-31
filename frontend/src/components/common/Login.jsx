import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./RL.css";

const Login = (props) => {

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/user")
      .then(res => {
        const usersTemp = res.data;
        usersTemp.forEach(function(user) {
          if (user.loggedIn === true) {
            navigate("/");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.id, navigate]);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const onChangeUserEmail = (event) => {
    setUserEmail(event.target.value);
  };

  const onChangeUserPassword = (event) => {
    setUserPassword(event.target.value);
  };

  const resetInputs = () => {
    setUserEmail("");
    setUserPassword("");
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const searchUser = {
      userEmail: userEmail,
      userPassword: userPassword
    };

    console.log("The user has inputted the following: ", searchUser);

    axios
      .post("http://localhost:4000/user/login", searchUser)
      .then((response) => {
        if (response.data === 1) {
          alert("Fill in both the boxes.");
          return console.log(response.data);
        } else if (response.data === 2) {
          alert("Wrong password.");
          return console.log(response.data);
        } else {
          console.log(response.data);
          navigate("/");
          window.location.reload();
        }
      });

    resetInputs();

  };

  return (
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous"></link>
        {/* <link href="Register.css"  type="text/css"rel="stylesheet" /> */}
      </head>
      <body>
        <div class="container">
          <div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Email</span>
              </div>
              <input type="text" class="form-control" placeholder="Registered email"  id="userEmail" onChange={onChangeUserEmail} aria-label="Recipient's username" aria-describedby="basic-addon2" />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Password</span>
              </div>
              <input type="password" class="form-control" placeholder="Password" id="userPassword" onChange={onChangeUserPassword} aria-describedby="basic-addon3" />
            </div>
            <br />
            
            <div>
              <button class="btn btn-success" onClick={onSubmit}>Login</button>
            </div>

          </div>
        </div>
      </body>
    </html>
  );
};

export default Login;