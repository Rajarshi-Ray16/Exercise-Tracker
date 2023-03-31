import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const UserProfile = (props) => {
  
  const navigate = useNavigate();

  const [userFound, setUserFound] = useState();
  const [userExercises, setUserExercises] = useState();
  const [userPlans, setUserPlans] = useState();

  useEffect(() => {

    let foundUser;
    
    axios
    .get("http://localhost:4000/user")
    .then(response => {
      const usersTemp = response.data;
      usersTemp.forEach(user => {
        if (user.loggedIn === true) {
          setUserFound(user);
          foundUser = user;
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });

    axios
    .get("http://localhost:4000/user/exercises")
    .then(response => {
      const exercisesTemp = response.data;
      let exerciseTemp = [];
      exercisesTemp.forEach(exercise => {
        if ((exercise.addedBy === foundUser.email) || ((exercise.addedBy === "admin") && (foundUser.email === "rajarshi.ray16@gmail.com"))) {
          exerciseTemp.push(exercise);
        }
      });
      setUserExercises(exerciseTemp);
    })
    .catch((error) => {
      console.log(error);
    });

    axios
    .get("http://localhost:4000/user/plans")
    .then(response => {
      const plansTemp = response.data;
      let planTemp = [];
      plansTemp.forEach(plan => {
        if (plan.email === foundUser.email) {
          planTemp.push(plan);
        }
      });
      setUserPlans(planTemp);
    })
    .catch((error) => {
      console.log(error);
    });

  }, [props.id]);
  
  return (
      <html>
        <body>
          <div class="container">
            <div id="details-table">
              {(() => {
                if (userFound) {
                  return (
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Age</th>
                          <th scope="col">Height</th>
                          <th scope="col">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{userFound.name}</td>
                          <td>{userFound.email}</td>
                          <td>{userFound.age}</td>
                          <td>{userFound.height} cm</td>
                          <td>{userFound.weight} kg</td>
                        </tr>
                      </tbody>
                    </table>
                  )
                } else {
                  return (
                    <table class="table"></table>
                  )
                }
              })()}
            </div>
            <div id="exercises-table">
              {(() => {
                if ((userExercises) && (userExercises.length !== 0)) {
                  return (
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Sl. No.</th>
                          <th scope="col">Exercise Name</th>
                          <th scope="col">Type</th>
                          <th scope="col">Target</th>
                          <th scope="col">Equipment</th>
                          <th scope="col">Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userExercises.map((userExercise, index) => (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{userExercise.exerciseName}</td>
                            <td>{userExercise.type}</td>
                            <td>{userExercise.target.toString()}</td>
                            <td>{userExercise.equipment}</td>
                            <td>{userExercise.info}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                } else {
                  return (
                    <div>
                      We're here
                      <table>

                      </table>
                    </div>
                  )
                }
              })()}
            </div>
            <div id="plans-table">
              {(() => {
                if ((userPlans) && (userPlans.length !== 0)) {
                  return (
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Sl. No.</th>
                          <th scope="col">Plan Name</th>
                          <th scope="col">Type</th>
                          <th scope="col">Target</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userPlans.map((userPlan, index) => (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{userPlan.planName}</td>
                            <td>{userPlan.type}</td>
                            <td>{userPlan.target}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                } else {
                  return (
                    <table class="table">
                      <tr>
                        <th scope="col">Sl. No.</th>
                        <th scope="col">Plan Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Target</th>
                      </tr>
                    </table>
                  )
                }
              })()}
            </div>
          </div>
        </body>
      </html>
    );
  }
    
export default UserProfile;