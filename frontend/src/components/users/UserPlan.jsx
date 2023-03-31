import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserPlan.css";

const UserPlan = (props) => {
  
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const setShow = (numValue) => {
    const contextPlace = document.getElementById('dropdownMenuButton-AED');
    if (numValue === 0) {
      setShowAdd(false);
      setShowEdit(false);
      setShowDelete(false);
    }
    else if (numValue === 1) {
      contextPlace.innerHTML = "Add an exercise";
      contextPlace.className += " btn-success";
      setShowAdd(true);
      setShowEdit(false);
      setShowDelete(false);
    }
    else if (numValue === 2) {
      contextPlace.innerHTML = "Edit an exercise";
      contextPlace.className += " btn-info";
      setShowAdd(false);
      setShowEdit(true);
      setShowDelete(false);
    }
    else if (numValue === 3) {
      contextPlace.innerHTML = "Delete an exercise";
      contextPlace.className += " btn-danger";
      setShowAdd(false);
      setShowEdit(false);
      setShowDelete(true);
    }
  }

  return (
    <html>
      <body>
        {/* <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton-AED" data-bs-toggle="dropdown" aria-expanded="false">
            Add, Edit, or Delete Plan
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><button class="btn btn-secondary dropdown-item" onClick={() => setShow(1)}>Add an exercise</button></li>
            <li><button class="btn btn-secondary dropdown-item" onClick={() => setShow(2)}>Edit an exercise</button></li>
            <li><button class="btn btn-secondary dropdown-item" onClick={() => setShow(3)}>Delete an exercise</button></li>
          </ul>
        </div> */}
        <AddPlan />
        {/* {showAdd ? <AddPlan />: (showEdit ? <EditPlan /> : (showDelete ? <DeletePlan /> : <div></div>))} */}
      </body>
    </html>
  )
}

const AddPlan = (props) => {

  const navigate = useNavigate();
  const [foundUser, setFoundUser] = useState("");
  const [exercises, setExercises] = useState([]);
  
  const [planNameAdd, setPlanNameAdd] = useState();
  const [typeAdd, setTypeAdd] = useState();
  const [targetAdd, setTargetAdd] = useState([]);
  const [dayAdd, setDayAdd] = useState();
  const [addedExercises, setAddedExercises] = useState([]);
  const [restTimeBDEAdd, setRestTimeBDEAdd] = useState();

  useEffect(() => {
    let loggedInTemp = false;
    let userEmailTemp;
    axios
      .get("http://localhost:4000/user")
      .then((response) => {
        let usersTemp = response.data;
        usersTemp.map((user, ind) => {
          if (user.loggedIn === true) {
            setFoundUser(user);
            userEmailTemp = user.email;
            loggedInTemp = true;
          }
        });
        if (!loggedInTemp) {
          navigate("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:4000/user/exercises")
      .then((response) => {
        let exerciseTemp = [];
        const exercisesTemp = response.data;
        exercisesTemp.forEach((exercise) => {
          if ((exercise.addedBy === "admin") || (exercise.addedBy === userEmailTemp)) {
            exerciseTemp.push(exercise);
          }
        });
        setExercises(exerciseTemp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [navigate])

  const onChangePlanNameAdd = (event) => {
    setPlanNameAdd(event.target.value);
  };

  const onChangeTypeAdd = (event) => {
    setTypeAdd(event.target.value);
    if (event.target.value.toLowerCase() !== "target") {
      // console.log("We got 'target' in the box");
      document.getElementById("chest").disabled = true;
      document.getElementById("shoulders").disabled = true;
      document.getElementById("forearms").disabled = true;
      document.getElementById("triceps").disabled = true;
      document.getElementById("biceps").disabled = true;
      document.getElementById("back").disabled = true;
      document.getElementById("legs").disabled = true;
    } else {
      document.getElementById("chest").disabled = false;
      document.getElementById("shoulders").disabled = false;
      document.getElementById("forearms").disabled = false;
      document.getElementById("triceps").disabled = false;
      document.getElementById("biceps").disabled = false;
      document.getElementById("back").disabled = false;
      document.getElementById("legs").disabled = false;
    }
  };

  const onChangeTargetAdd = (event) => {
    let targetArray = [...targetAdd];
    const checkValue = event.target.checked;
    const contextValue = event.target.value;
    // console.log("The value of", contextValue, "is", checkValue);
    if (checkValue) {
      targetArray.push(contextValue);
      if ((contextValue === "Anterior Deltoids") || (contextValue === "Lateral Deltoids") || (contextValue === "Posterior Deltoids")) {
        if (targetArray.indexOf("Shoulders") < 0) {
          targetArray.push("Shoulders");
          document.getElementById("shoulders").setAttribute('checked', '');
        }
      }
      if ((contextValue === "Lats") || (contextValue === "Traps") || (contextValue === "Rhomboids")) {
        if (targetArray.indexOf("Back") < 0) {
          targetArray.push("Back");
          document.getElementById("back").setAttribute('checked', '');
        }
      }
      if ((contextValue === "Quads") || (contextValue === "Glutes") || (contextValue === "Calves") || (contextValue === "Hamstrings")) {
        if (targetArray.indexOf("Legs") < 0) {
          targetArray.push("Legs");
          document.getElementById("legs").setAttribute('checked', '');
        }
      }
    } else {
      const removeValue = targetArray.indexOf(contextValue); 
      targetArray.splice(removeValue, 1);
    }
    console.log(targetArray);
    setTargetAdd(targetArray);
  };

  const onChangeDayAdd = (event) => {
    setDayAdd(event.target.value);
  };

  const onChangeRestTimeBDEAdd = () => {
    let targetHours = document.getElementById("hoursBDE").value;
    if (!targetHours) {
      targetHours = 0;
    }
    let targetMinutes = document.getElementById("minutesBDE").value;
    if (!targetMinutes) {
      targetMinutes = 0;
    }
    let targetSeconds = document.getElementById("secondsBDE").value;
    if (!targetSeconds) {
      targetSeconds = 0;
    }
    const targetTime = ((parseInt(targetHours) * 3600) + (parseInt(targetMinutes) * 60) + parseInt(targetSeconds));
    // console.log("The time between exercises is:", targetTime);
    setRestTimeBDEAdd(targetTime);
  }

  const resetInputsAdd = () => {
    setPlanNameAdd();
    setTypeAdd();
    setTargetAdd([]);
    setDayAdd();
    setRestTimeBDEAdd();
  };

  const onSubmitAdd = (event) => {
    event.preventDefault();
    
    const newPlan = {
      email: foundUser.email,
      planName: planNameAdd,
      type: typeAdd,
      target: targetAdd,
      day: dayAdd,
      plans: addedExercises,
      restTimeBDE: restTimeBDEAdd
    };

    console.log(newPlan);

    axios
      .post("http://localhost:4000/user/addplan", newPlan)
      .then(response => {
        console.log("Saved.");
        alert("Plan has been added!");
        console.log(response.data);
      });

    resetInputsAdd();
    window.location.reload();
  };

  const onAddExerciseClick = (event) => {
    let valueEdit = document.getElementById("exercise-name");
    valueEdit.innerHTML = event.target.value;
  }

  const onAddExerciseAdd = (event) => {
    const targetValue = document.getElementById("exercise-name").innerHTML;
    const targetSets = document.getElementById("sets").value;
    const targetReps = document.getElementById("reps").value;
    const targetWeight = document.getElementById("weight").value;
    let targetHours = document.getElementById("hours").value;
    if (!targetHours) {
      targetHours = 0;
    }
    let targetMinutes = document.getElementById("minutes").value;
    if (!targetMinutes) {
      targetMinutes = 0;
    }
    let targetSeconds = document.getElementById("seconds").value;
    if (!targetSeconds) {
      targetSeconds = 0;
    }
    const targetTime = ((parseInt(targetHours) * 3600) + (parseInt(targetMinutes) * 60) + parseInt(targetSeconds));
    let addedExercisesTemp = [...addedExercises];
    if (targetValue !== "Choose which exercise to add:" && targetValue !== "No exercises in the database.") {
      let detailsExercise;
      exercises.forEach((exercise) => {
        if (exercise.exerciseName === targetValue) {
          detailsExercise = Object.assign({}, exercise);
          console.log("The details are:", detailsExercise);
        }
      });
      let timesExerciseRepeated = 0;
      addedExercisesTemp.forEach(addedExerciseTemp => {
        if (addedExerciseTemp.exerciseDetails.info === detailsExercise.info) {
          timesExerciseRepeated += 1;
        }
      });
      detailsExercise.exerciseName = detailsExercise.exerciseName + " - " + (timesExerciseRepeated + 1);
      console.log("The name is: ", detailsExercise.exerciseName);    
      const addedExercise = {
        exerciseDetails: detailsExercise,
        sets: parseInt(targetSets),
        reps: parseInt(targetReps),
        weight: parseInt(targetWeight),
        timeBR: targetTime
      }
      addedExercisesTemp.push(addedExercise);
      setAddedExercises(addedExercisesTemp);
    }
  
    document.getElementById("exercise-name").innerHTML = "Choose which exercise to add:";
    document.getElementById("sets").value = 0;
    document.getElementById("sets").removeAttribute('value');
    document.getElementById("reps").value = 0;
    document.getElementById("reps").removeAttribute('value');
    document.getElementById("weight").value = 0;
    document.getElementById("weight").removeAttribute('value');
    document.getElementById("hours").value = 0;
    document.getElementById("hours").removeAttribute('value');
    document.getElementById("minutes").value = 0;
    document.getElementById("minutes").removeAttribute('value');
    document.getElementById("seconds").value = 0;
    document.getElementById("seconds").removeAttribute('value');
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  const openModal = (event) => {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  }

  const closeModal = (event) => {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  var modal = document.getElementById("myModal");

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }  


  return (
    <html>
      <head>
        {/* <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js" integrity="sha384-vFJXuSJphROIrBnz7yo7oB41mKfc8JzQZiCq4NCceLEaO4IHwicKwpJf9c9IpFgh" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/js/bootstrap.min.js" integrity="sha384-alpBpkh1PFOepccYVYDB4do5UnbKysX5WZXm3XxPqe5iKTfUKjNkCk9SaVuEZflJ" crossorigin="anonymous"></script> */}
      </head>
      <body>
        <div class="container">
          <div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Name of the Plan</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" id="userName" onChange={onChangePlanNameAdd} aria-label="Username" aria-describedby="basic-addon1" />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Type</span>
              </div>
              <input type="text" class="form-control" placeholder="Target, Compound, Cardio" id="typeAdd" onChange={onChangeTypeAdd} aria-describedby="basic-addon3" />
            </div>

            <div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Chest" onChange={onChangeTargetAdd} id="chest" disabled/>
                <label class="form-check-label" for="chest">
                  Chest
                </label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Shoulders" onChange={onChangeTargetAdd} id="shoulders" disabled/>
                <label class="form-check-label" for="shoulders">
                  Shoulders
                </label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Triceps" onChange={onChangeTargetAdd} id="triceps" disabled/>
                <label class="form-check-label" for="triceps">
                  Triceps
                </label>
              </div>
              
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Forearms" onChange={onChangeTargetAdd} id="forearms" disabled/>
                <label class="form-check-label" for="forearms">
                  Forearms
                </label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Biceps" onChange={onChangeTargetAdd} id="biceps" disabled/>
                <label class="form-check-label" for="biceps">
                  Biceps
                </label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Back" onChange={onChangeTargetAdd} id="back" disabled/>
                <label class="form-check-label" for="back">
                  Back
                </label>
              </div>
              
              <div class="form-check">
                <input class="form-check-input" type="checkbox" value="Legs" onChange={onChangeTargetAdd} id="legs" disabled/>
                <label class="form-check-label" for="legs">
                  Legs
                </label>
              </div>
              <br />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Day</span>
              </div>
              <input type="text" class="form-control" id="dayAdd" onChange={onChangeDayAdd} />
            </div>

            {(() => {
              if (addedExercises.length !== 0) {
                return (
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">Order</th>
                        <th scope="col">Exercise</th>
                        <th scope="col">Sets</th>
                        <th scope="col">Reps</th>
                        <th scope="col">Weight</th>
                        <th scope="col">Rest time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addedExercises.map((addedExercise, index) => (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{addedExercise.exerciseDetails.exerciseName}</td>
                          <td>{addedExercise.sets}</td>
                          <td>{addedExercise.reps}</td>
                          <td>{addedExercise.weight}</td>
                          <td>{addedExercise.timeBR}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              } else {
                return (
                  <table></table>
                )
              }
            })()}

            <p>
              <button id="myBtn" onClick={openModal}>Add exercise</button>
              <br />
            </p>

            <div id="myModal" class="modal">
              <div class="modal-dialog" role="document">
                <div class="modal-content">

                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Add an exercise and sets</h5>
                  </div>

                  <div class="modal-body">

                    {(() => {
                      if (exercises.length === 0) {
                        return (
                          <p>
                            <div class="exercise-name-select">
                              <button id="exercise-name" class="exercise-name" disabled>No exercises in the database.</button>
                            </div>
                          </p>
                        )
                      } else {
                        return (
                          <p>
                            <div class="exercise-name-select">
                              <button id="exercise-name" class="exercise-name">Choose which exercise to add:</button>
                              <div class="exercise-names">
                                {exercises.map(exercise => (
                                  <button class="exercise-name-option" onClick={onAddExerciseClick} value={exercise.exerciseName}>{exercise.exerciseName}</button>
                                ))}
                              </div>
                            </div>
                          </p>
                        )
                      }
                    })()}

                    <div id="sets-reps-weights">

                      <div class="input-group mb-3">

                        <input type="number" class="form-control" placeholder="Sets" id="sets" aria-label="Sets" aria-describedby="basic-addon1" />
                        <div class="input-group-midpend">
                          <span class="input-group-text-custom-mid">Sets</span>
                        </div>

                        <input type="number" class="form-control" placeholder="Reps" id="reps" aria-label="Reps" aria-describedby="basic-addon1" />
                        <div class="input-group-midpend">
                          <span class="input-group-text-custom-mid">Reps</span>
                        </div>

                        <input type="number" class="form-control" placeholder="Weight" id="weight" aria-label="Weight" aria-describedby="basic-addon1" />
                        <div class="input-group-postpend">
                          <span class="input-group-text-custom-post">KG</span>
                        </div>

                      </div>

                    </div>

                    <div id="time-between-sets">

                      <div class="input-group mb-3">

                        <input type="number" class="form-control" placeholder="Hours" id="hours" aria-label="Hours" aria-describedby="basic-addon1" min="0" max="99" />
                        <div class="input-group-midpend">
                          <span class="input-group-text-custom-mid">hr</span>
                        </div>

                        <input type="number" class="form-control" placeholder="Minutes" id="minutes" aria-label="Minutes" aria-describedby="basic-addon1" min="0" max="59" />
                        <div class="input-group-midpend">
                          <span class="input-group-text-custom-mid">min</span>
                        </div>

                        <input type="number" class="form-control" placeholder="Seconds" id="seconds" aria-label="Seconds" aria-describedby="basic-addon1" min="0" max="59" />
                        <div class="input-group-postpend">
                          <span class="input-group-text-custom-post">sec</span>
                        </div>

                      </div>
                    
                    </div>

                  </div>

                  <div class="modal-footer">

                    <button type="button" class="btn btn-secondary" onClick={closeModal}>Close</button>
                    <button type="button" class="btn btn-primary" onClick={onAddExerciseAdd} data-dismiss="modal">Add exercise</button>

                  </div>

                </div>
              </div>
              <p></p>
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Rest time between different exercises</span>
              </div>

              <input type="number" class="form-control" placeholder="Hour" id="hoursBDE" aria-label="HoursBDE" aria-describedby="basic-addon1" min="0" max="99" onClick={onChangeRestTimeBDEAdd} />
              <div class="input-group-midpend">
                <span class="input-group-text-custom-mid">hr</span>
              </div>

              <input type="number" class="form-control" placeholder="Min" id="minutesBDE" aria-label="MinutesBDE" aria-describedby="basic-addon1" min="0" max="59" onClick={onChangeRestTimeBDEAdd} />
              <div class="input-group-midpend">
                <span class="input-group-text-custom-mid">min</span>
              </div>

              <input type="number" class="form-control" placeholder="Sec" id="secondsBDE" aria-label="SecondsBDE" aria-describedby="basic-addon1" min="0" max="59" onClick={onChangeRestTimeBDEAdd} />
              <div class="input-group-postpend">
                <span class="input-group-text-custom-post">sec</span>
              </div>
            </div>

            <div>
              <button class="btn btn-success" onClick={onSubmitAdd}>Add Plan</button>
            </div>

          </div>
        </div>
      </body>      
    </html>
  );
};

const EditPlan = (props) => {

  const [foundUser, setFoundUser] = useState("");
  let usersTemp;
  
  const [planNameEdit, setPlanNameEdit] = useState();
  const [typeEdit, setTypeEdit] = useState();
  const [targetEdit, setTargetEdit] = useState([]);
  const [dayEdit, setDayEdit] = useState();
  const [restTimeBDEEdit, setRestTimeBDEEdit] = useState();
  
  useEffect(() => {
    axios
      .get("http://localhost:4000/user")
      .then((response) => {
        usersTemp = response.data;
        usersTemp.map((user, ind) => {
          if (user.loggedIn === true) {
            setFoundUser(user);
          }
        })
      })
      .catch((error) => {
        console.log(error);
      });   
  }, [])
  
  const onChangePlanNameEdit = (event) => {
    setPlanNameEdit(event.target.value);
  };
  
  const onChangeTypeEdit = (event) => {
    setTypeEdit(event.target.value);
  };
  
  const onChangeTargetEdit = (event) => {
    let targetArray = [...targetEdit];
    const checkValue = event.target.checked;
    const contextValue = event.target.value;
    // console.log("The value of", contextValue, "is", checkValue);
    if (checkValue) {
      targetArray.push(contextValue);
      if ((contextValue === "Anterior Deltoids") || (contextValue === "Lateral Deltoids") || (contextValue === "Posterior Deltoids")) {
        if (targetArray.indexOf("Shoulders") < 0) {
          targetArray.push("Shoulders");
          document.getElementById("shoulders").setAttribute('checked', '');
        }
      }
      if ((contextValue === "Lats") || (contextValue === "Traps") || (contextValue === "Rhomboids")) {
        if (targetArray.indexOf("Back") < 0) {
          targetArray.push("Back");
          document.getElementById("back").setAttribute('checked', '');
        }
      }
      if ((contextValue === "Quads") || (contextValue === "Glutes") || (contextValue === "Calves") || (contextValue === "Hamstrings")) {
        if (targetArray.indexOf("Legs") < 0) {
          targetArray.push("Legs");
          document.getElementById("legs").setAttribute('checked', '');
        }
      }
    } else {
      const removeValue = targetArray.indexOf(contextValue); 
      targetArray.splice(removeValue, 1);
    }
    console.log(targetArray);
    setTargetEdit(targetArray);
  };
  
  const onChangeDayEdit = (event) => {
    setDayEdit(event.target.value);
  };
  
  const onChangeRestTimeBDEEdit = (event) => {
    setRestTimeBDEEdit(event.target.value);
  }
  
  const resetInputsEdit = () => {
    setPlanNameEdit();
    setTypeEdit();
    setTargetEdit([]);
    setDayEdit();
    setRestTimeBDEEdit();
  };
  
  const onSubmitEdit = (event) => {
    event.preventDefault();
    
    const newPlan = {
      email: foundUser.email,
      planName: planNameEdit,
      type: typeEdit,
      target: targetEdit,
      day: dayEdit,
      restTimeBDE: restTimeBDEEdit
    };
  
    console.log(newPlan);
  
    axios
      .post("http://localhost:4000/user/editplan", newPlan)
      .then(response => {
        console.log("Saved.");
        alert("Plan has been edited!");
        console.log(response.data);
      });
  
    resetInputsEdit();
  };

  return (
    <html>
      <body>
        <div class="container">
          <div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Name of the Plan</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" id="userName" onChange={onChangePlanNameEdit} aria-label="Username" aria-describedby="basic-addon1" />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Type</span>
              </div>
              <input type="password" class="form-control" placeholder="Target, Compound, Cardio" id="typeEdit" onChange={onChangeTypeEdit} aria-describedby="basic-addon3" />
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Chest" onChange={onChangeTargetEdit} id="chest" />
              <label class="form-check-label" for="chest">
                Chest
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Shoulders" onChange={onChangeTargetEdit} id="shoulders" />
              <label class="form-check-label" for="shoulders">
                Shoulders
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Anterior Deltoids" onChange={onChangeTargetEdit} id="anterior-deltoids" />
              <label class="form-check-label" for="anterior-deltoids">
                Anterior Deltoids
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Lateral Deltoids" onChange={onChangeTargetEdit} id="lateral-deltoids" />
              <label class="form-check-label" for="lateral-deltoids">
                Lateral Deltoids
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Posterior Deltoids" onChange={onChangeTargetEdit} id="posterior-deltoids" />
              <label class="form-check-label" for="posterior-deltoids">
                Posterior Deltoids
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Triceps" onChange={onChangeTargetEdit} id="triceps" />
              <label class="form-check-label" for="triceps">
                Triceps
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Forearms" onChange={onChangeTargetEdit} id="forearms" />
              <label class="form-check-label" for="forearms">
                Forearms
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Biceps" onChange={onChangeTargetEdit} id="biceps" />
              <label class="form-check-label" for="biceps">
                Biceps
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Back" onChange={onChangeTargetEdit} id="back" />
              <label class="form-check-label" for="back">
                Back
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Traps" onChange={onChangeTargetEdit} id="triceps" />
              <label class="form-check-label" for="triceps">
                Traps
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Rhomboids" onChange={onChangeTargetEdit} id="rhomboids" />
              <label class="form-check-label" for="rhomboids">
                Rhomboids
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Lats" onChange={onChangeTargetEdit} id="lats" />
              <label class="form-check-label" for="lats">
                Lats
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Legs" onChange={onChangeTargetEdit} id="legs" />
              <label class="form-check-label" for="legs">
                Legs
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Quads" onChange={onChangeTargetEdit} id="quads" />
              <label class="form-check-label" for="quads">
                Quads
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Glutes" onChange={onChangeTargetEdit} id="glutes" />
              <label class="form-check-label" for="glutes">
                Glutes
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Hamstrings" onChange={onChangeTargetEdit} id="hamstrings" />
              <label class="form-check-label" for="hamstrings">
                Hamstrings
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="Calves" onChange={onChangeTargetEdit} id="calves" />
              <label class="form-check-label" for="calves">
                Calves
              </label>
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Day</span>
              </div>
              <input type="text" class="form-control" id="dayEdit" onChange={onChangeDayEdit} />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Rest time between different exercises</span>
              </div>
              <input type="string" class="form-control" id="restTimeBDEEdit" onChange={onChangeRestTimeBDEEdit} />
            </div>

            <br/><br/>
            
            <div>
              <button class="btn btn-success" onClick={onSubmitEdit}>Edit Plan</button>
            </div>

          </div>
        </div>
      </body>
    </html>
  );
};

const DeletePlan = (props) => {

  const [exerciseNameDelete, setPlanNameDelete] = useState();

  const onChangePlanNameDelete = (event) => {
    setPlanNameDelete(event.target.value);
  };

  const resetInputsDelete = () => {
    setPlanNameDelete("");
  };

  const onSubmitDelete = (event) => {
    event.preventDefault();

    const deletePlan = {
      exerciseName: exerciseNameDelete
    };

    axios
      .post("http://localhost:4000/user/deleteplan", deletePlan)
      .then(response => {
        console.log("Working till here.");
        if (response.data.val === 1) {
          console.log("Deleted.");
          alert("Plan has been deleted!");
        }
        console.log(response.data);
      });

    resetInputsDelete();
  };

  return (
    <html>
      <body>
        <div class="container">
          <div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Name of the Plan</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" id="userName" onChange={onChangePlanNameDelete} aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <br/><br/>
            <div>
              <button class="btn btn-success" onClick={onSubmitDelete}>Delete Plan</button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default UserPlan;