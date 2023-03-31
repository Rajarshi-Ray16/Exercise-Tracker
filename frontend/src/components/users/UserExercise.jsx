import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate, BrowserRouter as Router, Route, Link } from "react-router-dom";
// import "./UserExercise.css";

const UserExercise = (props) => {
  
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const setShow = (numValue) => {
    const contextPlace = document.getElementById('custom-dropdown');
    console.log("The area says: ", contextPlace.innerHTML);
    if (numValue === 0) {
      setShowAdd(false);
      setShowEdit(false);
      setShowDelete(false);
    }
    else if (numValue === 1) {
      // contextPlace.innerHTML = "Add an exercise";
      // contextPlace.setAttribute(backgroundColor, "green");
      contextPlace.style.backgroundColor = "green";
      setShowAdd(true);
      setShowEdit(false);
      setShowDelete(false);
    }
    else if (numValue === 2) {
      // contextPlace.innerHTML = "Edit an exercise";
      // contextPlace.className += " btn-info";
      setShowAdd(false);
      setShowEdit(true);
      setShowDelete(false);
    }
    else if (numValue === 3) {
      // contextPlace.innerHTML = "Delete an exercise";
      // contextPlace.className += " btn-danger";
      setShowAdd(false);
      setShowEdit(false);
      setShowDelete(true);
    }
  }

  return (
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
      </head>
      <body>
        {/* <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton-AED" data-bs-toggle="dropdown" aria-expanded="false">
            Add, Edit, or Delete Exercises
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton-AED">
            <button class="dropdown-item btn btn-secondary" onClick={() => setShow(1)}>Add an exercise</button>
            <button class="dropdown-item btn btn-secondary" onClick={() => setShow(2)}>Edit an exercise</button>
            <button class="dropdown-item btn btn-secondary" onClick={() => setShow(3)}>Delete an exercise</button>
          </div>
        </div> */}
        <AddExercise />
        {/* {showAdd ? <AddExercise />: (showEdit ? <EditExercise /> : (showDelete ? <DeleteExercise /> : <div></div>))} */}
      </body>
    </html>
  )
}

const AddExercise = (props) => {

  const [foundUser, setFoundUser] = useState("");
  const [existingExercises, setExistingExercises] = useState([]);
  let usersTemp;
  
  const [exerciseNameAdd, setExerciseNameAdd] = useState();
  const [typeAdd, setTypeAdd] = useState();
  const [targetAdd, setTargetAdd] = useState([]);
  const [equipmentAdd, setEquipmentAdd] = useState();
  const [infoAdd, setInfoAdd] = useState();

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
    axios
      .get("http://localhost:4000/user/exercises")
      .then((response) => {
        let exerciseTemp = [];
        const exercisesTemp = response.data;
        exercisesTemp.forEach((exercise) => {
          if ((exercise.addedBy === "admin") || (exercise.addedBy === foundUser.email)) {
            exerciseTemp.push(exercise.exerciseName);
          }
        });
        setExistingExercises(exerciseTemp);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  const onChangeExerciseNameAdd = (event) => {
    setExerciseNameAdd(event.target.value);
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
      document.getElementById("anterior-deltoids").disabled = true;
      document.getElementById("lateral-deltoids").disabled = true;
      document.getElementById("posterior-deltoids").disabled = true;
      document.getElementById("back").disabled = true;
      document.getElementById("traps").disabled = true;
      document.getElementById("rhomboids").disabled = true;
      document.getElementById("lats").disabled = true;
      document.getElementById("legs").disabled = true;
      document.getElementById("quads").disabled = true;
      document.getElementById("glutes").disabled = true;
      document.getElementById("hamstrings").disabled = true;
      document.getElementById("calves").disabled = true;
    } else {
      document.getElementById("chest").disabled = false;
      document.getElementById("shoulders").disabled = false;
      document.getElementById("forearms").disabled = false;
      document.getElementById("triceps").disabled = false;
      document.getElementById("biceps").disabled = false;
      document.getElementById("anterior-deltoids").disabled = false;
      document.getElementById("lateral-deltoids").disabled = false;
      document.getElementById("posterior-deltoids").disabled = false;
      document.getElementById("back").disabled = false;
      document.getElementById("traps").disabled = false;
      document.getElementById("rhomboids").disabled = false;
      document.getElementById("lats").disabled = false;
      document.getElementById("legs").disabled = false;
      document.getElementById("quads").disabled = false;
      document.getElementById("glutes").disabled = false;
      document.getElementById("hamstrings").disabled = false;
      document.getElementById("calves").disabled = false;
    }
  };

  const onChangeTargetAdd = (event) => {
    let targetArray = [...targetAdd];
    const checkValue = event.target.checked;
    const contextValue = event.target.value;
    if (checkValue) {
      if (targetArray.indexOf(contextValue) < 0) {
        targetArray.push(contextValue);
      }
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

  const onChangeEquipmentAdd = (event) => {
    setEquipmentAdd(event.target.value);
  };

  const onChangeInfoAdd = (event) => {
    setInfoAdd(event.target.value);
  };

  const resetInputsAdd = () => {
    setExerciseNameAdd();
    setTypeAdd();
    setTargetAdd([]);
    setEquipmentAdd();
    setInfoAdd();
  };

  const onSubmitAdd = (event) => {

    if ((exerciseNameAdd) && (exerciseNameAdd !== "") && (existingExercises.indexOf(exerciseNameAdd) < 0)) {
      event.preventDefault();
      let forAllValue, email;
  
      if (foundUser.email === "rajarshi.ray16@gmail.com") {
        forAllValue = true;
        email = "admin";
      } else {
        forAllValue = false;
        email = foundUser.email;
      }
      
      const newExercise = {
        exerciseName: exerciseNameAdd,
        type: typeAdd,
        target: targetAdd,
        info: infoAdd,
        equipment: equipmentAdd,
        forAll: forAllValue,
        addedBy: email
      };
  
      console.log(newExercise);
  
      axios
        .post("http://localhost:4000/user/addexercise", newExercise)
        .then(response => {
          console.log("Saved.");
          alert("Exercise has been added!");
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
  
      resetInputsAdd();
    } else if ((!exerciseNameAdd) || (exerciseNameAdd === "")) {
      alert("Add the name for the exercise.")
    } else {
      alert("The exercise already exists");
    }

  };

  return (
    <html>
      <body>
        <div class="container">
          <div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Name of the Exercise</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" id="userName" onChange={onChangeExerciseNameAdd} aria-label="Username" aria-describedby="basic-addon1" />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Type</span>
              </div>
              <input type="text" class="form-control" placeholder="Target, Compound, Cardio" id="typeAdd" onChange={onChangeTypeAdd} aria-describedby="basic-addon3" />
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Chest" onChange={onChangeTargetAdd} id="chest" />
              <label class="form-check-label" for="chest">
                Chest
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Shoulders" onChange={onChangeTargetAdd} id="shoulders" />
              <label class="form-check-label" for="shoulders">
                Shoulders
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Anterior Deltoids" onChange={onChangeTargetAdd} id="anterior-deltoids" />
              <label class="form-check-label" for="anterior-deltoids">
                Anterior Deltoids
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Lateral Deltoids" onChange={onChangeTargetAdd} id="lateral-deltoids" />
              <label class="form-check-label" for="lateral-deltoids">
                Lateral Deltoids
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Posterior Deltoids" onChange={onChangeTargetAdd} id="posterior-deltoids" />
              <label class="form-check-label" for="posterior-deltoids">
                Posterior Deltoids
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Triceps" onChange={onChangeTargetAdd} id="triceps" />
              <label class="form-check-label" for="triceps">
                Triceps
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Forearms" onChange={onChangeTargetAdd} id="forearms" />
              <label class="form-check-label" for="forearms">
                Forearms
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Biceps" onChange={onChangeTargetAdd} id="biceps" />
              <label class="form-check-label" for="biceps">
                Biceps
              </label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Back" onChange={onChangeTargetAdd} id="back" />
              <label class="form-check-label" for="back">
                Back
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Traps" onChange={onChangeTargetAdd} id="traps" />
              <label class="form-check-label" for="triceps">
                Traps
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Rhomboids" onChange={onChangeTargetAdd} id="rhomboids" />
              <label class="form-check-label" for="rhomboids">
                Rhomboids
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Lats" onChange={onChangeTargetAdd} id="lats" />
              <label class="form-check-label" for="lats">
                Lats
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Legs" onChange={onChangeTargetAdd} id="legs" />
              <label class="form-check-label" for="legs">
                Legs
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Quads" onChange={onChangeTargetAdd} id="quads" />
              <label class="form-check-label" for="quads">
                Quads
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Glutes" onChange={onChangeTargetAdd} id="glutes" />
              <label class="form-check-label" for="glutes">
                Glutes
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Hamstrings" onChange={onChangeTargetAdd} id="hamstrings" />
              <label class="form-check-label" for="hamstrings">
                Hamstrings
              </label>
            </div>
            
            <div class="form-check">
              <input class="form-check-input" type="checkbox" disabled value="Calves" onChange={onChangeTargetAdd} id="calves" />
              <label class="form-check-label" for="calves">
                Calves
              </label>
            </div>

            <br />
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Equipment</span>
              </div>
              <input type="text" class="form-control" id="equipmentAdd" onChange={onChangeEquipmentAdd} />
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text-custom-pre">Info</span>
              </div>
              <input type="text" class="form-control" id="infoAdd" onChange={onChangeInfoAdd} />
            </div>

            <br/><br/>
            
            <div>
              <button class="btn btn-success" onClick={onSubmitAdd}>Add Exercise</button>
            </div>

          </div>
        </div>
      </body>
    </html>
  );
};

const EditExercise = (props) => {

  const [foundUser, setFoundUser] = useState("");
  let usersTemp;
  
  const [exerciseNameEdit, setExerciseNameEdit] = useState();
  const [typeEdit, setTypeEdit] = useState();
  const [targetEdit, setTargetEdit] = useState([]);
  const [infoEdit, setInfoEdit] = useState();

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

  const onChangeExerciseNameEdit = (event) => {
    setExerciseNameEdit(event.target.value);
  };

  const onChangeTypeEdit = (event) => {
    setTypeEdit(event.target.value);
  };

  const onChangeTargetEdit = (event) => {
    let targetArray = [...targetEdit];
    const checkValue = event.target.checked;
    const contextValue = event.target.value;
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

  const onChangeInfoEdit = (event) => {
    setInfoEdit(event.target.value);
  };

  const resetInputsEdit = () => {
    setExerciseNameEdit();
    setTypeEdit();
    setTargetEdit([]);
    setInfoEdit();
  };

  const onSubmitEdit = (event) => {
    event.preventDefault();

    // let forAllValue, name;

    // if (foundUser.email === "rajarshi.ray16@gmail.com") {
    //   forAllValue = true;
    //   name = "admin";
    // } else {
    //   forAllValue = false;
    //   name = foundUser.name;
    // }
    
    const foundExercise = {
      exerciseName: exerciseNameEdit,
      type: typeEdit,
      target: targetEdit,
      info: infoEdit
      // forAll: forAllValue,
      // editedBy: name
    };

    console.log(foundExercise);

    axios
      .post("http://localhost:4000/user/editexercise", foundExercise)
      .then(response => {
        console.log("Saved.");
        alert("Exercise has been added!");
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
                <span class="input-group-text-custom-pre">Name of the Exercise</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" id="userName" onChange={onChangeExerciseNameEdit} aria-label="Username" aria-describedby="basic-addon1" />
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
                <span class="input-group-text-custom-pre">Info</span>
              </div>
              <input type="number" class="form-control" id="infoEdit" onChange={onChangeInfoEdit} />
            </div>

            <br/><br/>
            
            <div>
              <button class="btn btn-success" onClick={onSubmitEdit}>Edit Exercise</button>
            </div>

          </div>
        </div>
      </body>
    </html>
  );
};

const DeleteExercise = (props) => {

  const [exerciseNameDelete, setExerciseNameDelete] = useState();

  const onChangeExerciseNameDelete = (event) => {
    setExerciseNameDelete(event.target.value);
  };

  const resetInputsDelete = () => {
    setExerciseNameDelete("");
  };

  const onSubmitDelete = (event) => {
    event.preventDefault();

    const deleteExercise = {
      exerciseName: exerciseNameDelete
    };

    // This creates data that is present externally 
    axios
      .post("http://localhost:4000/user/deleteexercise", deleteExercise)
      .then(response => {
        console.log("Working till here.");
        if (response.data.val === 1) {
          console.log("Deleted.");
          alert("Exercise has been deleted!");
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
                <span class="input-group-text-custom-pre">Name of the Exercise</span>
              </div>
              <input type="text" class="form-control" placeholder="Name" id="userName" onChange={onChangeExerciseNameDelete} aria-label="Username" aria-describedby="basic-addon1" />
            </div>
            <br/><br/>
            <div>
              <button class="btn btn-success" onClick={onSubmitDelete}>Add Exercise</button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
};

export default UserExercise;