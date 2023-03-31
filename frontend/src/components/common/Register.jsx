import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./RL.css";

const Register = (props) => {

  const navigate = useNavigate();
  const [existingEmails, setExistingEmails] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/user")
      .then(res => {
        const usersTemp = res.data;
        let existingEmailsTemp = [];
        usersTemp.forEach(function(user) {
          existingEmailsTemp.push(user.email);
          if (user.loggedIn === true) {
            navigate("/");
          }
        });
        setExistingEmails(existingEmailsTemp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.id, navigate]);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userDOB, setUserDOB] = useState();
  const [height, setHeight] = useState();
  const [weight, setWeight] = useState();
  const [physicalIssues, setPhysicalIssues] = useState([]);

  const onChangeUserName = (event) => {
    setUserName(event.target.value);
  };

  const onChangeUserEmail = (event) => {
    setUserEmail(event.target.value);
  };

  const onChangeUserPassword = (event) => {
    setUserPassword(event.target.value);
  };

  const onChangeUserDOB = (event) => {
    setUserDOB(event.target.value);
  };

  const onChangeHeight = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      setHeight(event.target.value);
    }
  };  
  
  const onChangeWeight = (event) => {
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      setWeight(event.target.value);
    }
  };

  const onChangePhysicalIssues = (event) => {
    const context = event.target.checked;
    const issue = event.target.value;
    let currentPIArray = [...physicalIssues];
    if (context) {
      currentPIArray.push(issue);
    } else {
      let removeIndex = currentPIArray.indexOf(issue);
      currentPIArray.splice(removeIndex, 1);
    }
    setPhysicalIssues(currentPIArray);
  }

  const resetInputs = () => {
    setUserName("");
    setUserEmail("");
    setUserPassword("");
    setUserDOB("mm/dd/yyyy");
    setHeight("");
    setWeight("");
    setPhysicalIssues([]);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (existingEmails.indexOf(userEmail) < 0) {
      const date = new Date();
      let age;
  
      const dobMonth = parseInt(userDOB.split("-").splice(1, 1).toString(""));
      const dobDay = parseInt(userDOB.split("-").splice(2, 1).toString(""));
      const dobYear = parseInt(userDOB.split("-").splice(0, 1).toString(""));
  
      if (dobMonth < date.getMonth()) {
        age = date.getFullYear() - dobYear;
      } else if (dobMonth > date.getMonth()) {
        age = date.getFullYear() - dobYear - 1;
      } else {
        if (dobDay >= date.getDate()) {
          age = date.getFullYear() - dobYear;
        } else {
          age = date.getFullYear() - dobYear - 1;
        }
      }
  
      const newUser = {
        userName: userName,
        userEmail: userEmail,
        userPassword: userPassword,
        userDOB: userDOB,
        age: age,
        height: parseInt(height),
        weight: parseInt(weight),
        physicalIssues: physicalIssues
      };
  
      axios
        .post("http://localhost:4000/user/register", newUser)
        .then((response) => {
          console.log("Working till here.");
          alert("Created\t" + userName);
          console.log(response.data);
          navigate("/");
          window.location.reload();
        });
  
      resetInputs();
    } else {
      // console.log(document.getElementById("email-already-exists").innerHTML);
      document.getElementById("email-already-exists").style.display = "none !important";
      document.getElementById("email-already-exists").removeAttribute('id');  
    }

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
                <span class="input-group-text-custom-pre">Name</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" id="userName" onChange={onChangeUserName} aria-label="Username" aria-describedby="basic-addon1" />
            </div>

            <div class="alert alert-danger" role="alert" id="email-already-exists">
              This email already exists.
            </div>

            <div class="input-group mb-3">
              <input type="text" class="form-control" placeholder="User's email"  id="userEmail" onChange={onChangeUserEmail} aria-label="Recipient's username" aria-describedby="basic-addon2" />
              <div class="input-group-append">
                <span class="input-group-text-custom-post">@example.xyz</span>
              </div>
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Password</span>
              </div>
              <input type="password" class="form-control" id="userPassword" onChange={onChangeUserPassword} aria-describedby="basic-addon3" />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Date of Birth</span>
              </div>
              <input type="date" class="form-control" id="userDOB" onChange={onChangeUserDOB} aria-describedby="basic-addon3" />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Height</span>
              </div>
              <input type="number" class="form-control" aria-label="Amount (to the nearest dollar)" id="height" onChange={onChangeHeight} />
              <div class="input-group-append">
                <span class="input-group-text-custom-post">cm</span>
              </div>
            </div>
            

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Weight</span>
              </div>
              <input type="number" class="form-control" aria-label="Amount (to the nearest dollar)" id="weight" onChange={onChangeWeight} />
              <div class="input-group-append">
                <span class="input-group-text-custom-post">kg</span>
                {/* <button class="dropdown-toggle btn btn-outline-dark" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">units</button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" id="weight-in-kg">KG</a>
                  <a class="dropdown-item" href="weight-in-lbs">LBS</a>
                </div> */}
              </div>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Elbow Joint Pain" onChange={onChangePhysicalIssues} id="elbow-joint-pain" />
              <label class="form-check-label" for="elbow-joint-pain">
                Elbow Joint Pain
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Knee Pain" onChange={onChangePhysicalIssues} id="knee-pain" />
              <label class="form-check-label" for="knee-pain">
                Knee Pain
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Obesity" onChange={onChangePhysicalIssues} id="obesity" />
              <label class="form-check-label" for="obesity">
                Obesity (Morbid or not) 
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Arthiritis" onChange={onChangePhysicalIssues} id="arthiritis" />
              <label class="form-check-label" for="arthiritis">
                Arthiritis
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Other" onChange={onChangePhysicalIssues} id="other-issues" />
              <label class="form-check-label" for="other-issues">
                Other
              </label>
            </div>

            <br/><br/>
            
            <div>
              <button class="btn btn-success" onClick={onSubmit}>Register</button>
            </div>

          </div>
        </div>
      </body>
    </html>
  );
};

export default Register;