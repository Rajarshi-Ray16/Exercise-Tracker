import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserWorkout.css"

const UserWorkout = (props) => {

  const [plans, setPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/user/plans")
      .then((response) => {
        setPlans(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [])

  const navigate = useNavigate();

  const onWorkoutClick = (event) => {
    let valueEdit = document.getElementById("plan-name");
    valueEdit.innerHTML = event.target.value;
    document.getElementById("show-workout").style.display = "block";

    axios
      .get("http://localhost:4000/user/plans")
      .then((response) => {
        const plansTemp = response.data;
        plansTemp.every(plan => {
          if (plan.planName === event.target.value) {
            setSelectedPlan(plan);
            setExercises(plan.plans);
            // if (document.getElementById('workout-button').innerHTML === "Start Workout") {
            //   plan.plans.forEach((disableExercise, ind) => {
            //     let idRequired = disableExercise.exerciseDetails.exerciseName;
            //     if (document.getElementById(idRequired).disabled === false) {
            //       document.getElementById(idRequired).disabled = true;
            //       console.log("Disabling:", ind);
            //     }
            //   })
            // }
            return false;
          }
          return true;
        })
      })
      .catch((error) => {
        console.log(error);
      });

  }

  const [rests, setRests] = useState();
  const [restOrExercise, setRestOrExercise] = useState();

  const workout = (event) => {
    const workoutButton = document.getElementById('workout-button');
    if (workoutButton.innerHTML === "Start Workout") {
      exercises.forEach((disableExercise, ind) => {
        let idRequired = disableExercise.exerciseDetails.exerciseName;
        if (document.getElementById(idRequired).disabled === false) {
          document.getElementById(idRequired).disabled = true;
          console.log("Disabling:", ind);
        }
      })
      const removeDropdown = document.getElementById('plan-name-select');
      removeDropdown.style.display = "none";
      workoutButton.innerHTML = "End Workout";
      workoutButton.classList.remove("btn-outline-primary");
      workoutButton.classList.add("btn-outline-warning");
      exercises.map((exercise, order) => {
        exercise.done = exercise.sets;
        exercise.order = order + 1;
      })
      let firstExercise;
      exercises.every(exercise => {
        if (exercise.order === 1) {
          firstExercise = exercise.exerciseDetails.exerciseName;
          return false;
        }
        return true
      })
      const startFirstExercise = document.getElementById(firstExercise);
      startFirstExercise.disabled = false;
      // On finishing the first set of the first exercise. 
      if (!currentExercise) {
        setCurrentExercise(1);
        setRestOrExercise(true);
      }
      let nextButton = document.getElementById("next-button-div");
      nextButton.style.display = "block";
    } else {
      workoutButton.innerHTML = "Workout done";
      workoutButton.classList.remove("btn-outline-warning");
      workoutButton.classList.add("btn-secondary");
      workoutButton.disabled = true;
      let nextButton = document.getElementById("next-button-div");
      nextButton.style.display = "none";
    }
  }

  const [currentExercise, setCurrentExercise] = useState();

  const onClickNext = (value) => {
    
    const workoutButton = document.getElementById('workout-button');
    
    if (workoutButton.innerHTML === "End Workout") {
      
      // If the exercise was going on.
      if ((restOrExercise) && (value !== false)) {

        setRestOrExercise(false);
        let nextButton = document.getElementById("next-button");
        nextButton.classList.add("rest-button");
        nextButton.innerHTML = "Skip rest";

        // For finishing a set.
        exercises[currentExercise - 1].done -= 1;
        
        // For finising all the sets of a given exercise.
        if (exercises[currentExercise - 1].done === 0) {
          console.log("End of exercise.");
          setCurrentExercise(currentExercise + 1);
        } else {
          console.log("The timer will start now.")
          setTimeout(onClickNext(false), exercises[currentExercise - 1].timeBR * 1000);
          console.log("What's happening?");
          return;
        }
  
        if ((currentExercise === exercises.length) && (exercises[currentExercise - 1].done === 0)) {
          let nextButtonDiv = document.getElementById("next-button-div");
          nextButtonDiv.style.display = "none";
          workoutButton.innerHTML = "Workout done";
          workoutButton.classList.remove("btn-outline-warning");
          workoutButton.classList.add("btn-secondary");
          workoutButton.disabled = true;
        }

      } else {

        console.log("We are moving to a workout");

        setRestOrExercise(true);
        let nextButton = document.getElementById("next-button");
        nextButton.classList.remove("rest-button");
        nextButton.innerHTML = "Next";

      }

    }

  }

  const skipRest = () => {

    if (!restOrExercise) {
      setRestOrExercise(true);
      let nextButton = document.getElementById("next-button");
      nextButton.classList.remove("rest-button");
      nextButton.innerHTML = "Next";
    }

  }

  return (
    <html>
      <body>
        {(() => {
          if (plans.length === 0) {
            return (
              <div id="plan-name-select" class="plan-name-select">
                <button id="plan-name" class="plan-name" disabled>No plans in the database.</button>
              </div>
            )
          } else {
            return (
              <div id="plan-name-select" class="plan-name-select">
                <button id="plan-name" class="plan-name">Choose which plan to add:</button>
                <div class="plan-names">
                  {plans.map(plan => (
                    <button class="plan-name-option" onClick={onWorkoutClick} value={plan.planName}>{plan.planName}</button>
                  ))}
                </div>
              </div>
            )
          }
        })()}
        <div id="show-workout">
          <br />
          {(() => {
            if (exercises.length === 0) {
              return (
                <div class="list-exercises">
                  There are no exercises in the plan. 
                </div>
              )
            } else {
              return (
                <div class="list-exercises">
                  {exercises.map((exercise, ind) => (
                    <div class="exercises-and-time">
                      {(() => {
                        if (ind !== 0) {
                          return (
                            <div class="rest-time">
                              <span>Rest for {selectedPlan.restTimeBDE} seconds</span>
                            </div>
                          )
                        }
                      })()}
                      <div class="exercise-card">
                        <div class="exercise-details-grid">
                          <div class="exercise-details-list">
                            {/* <h4>{exercise.exerciseDetails.exerciseName}<span> - <button class="btn btn-info" id={exercise.exerciseDetails.exerciseName} value={exercise.exerciseDetails.exerciseName}>Next</button></span></h4> */}
                            <h4 id={exercise.exerciseDetails.exerciseName} value={exercise.exerciseDetails.exerciseName}>{exercise.exerciseDetails.exerciseName}</h4>
                            <h6>{exercise.exerciseDetails.target.toString()}</h6>
                          </div>
                          <div class="exercise-info-list">
                            <ul>
                              <li>Sets: {exercise.sets}</li>
                              <li>Reps: {exercise.reps}</li>
                              <li>Weight: {exercise.weight}</li>
                            </ul>
                          </div>
                        </div>
                        <div class="time-between-sets">Rest between sets: {exercise.timeBR} seconds</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          })()}
          <div>
            <div id="next-button-div">
              <br />
              <button className="next-button" value={"Next button"} id="next-button" onClick={onClickNext}>Next</button>
            </div>
            <br />
            <button className="btn btn-outline-primary" id="workout-button" onClick={workout}>Start Workout</button>
          </div>
        </div>
      </body>
    </html>
  )
}

export default UserWorkout;