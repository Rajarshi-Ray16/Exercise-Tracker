import React, { useState, useEffect }  from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NavbarUser = (props) => {

    const navigate = useNavigate();

    const [foundUser, setFoundUser] = useState("");
    let usersTemp;

    useEffect(() => {
        axios
            .get("http://localhost:4000/user")
            .then(res => {
                usersTemp = res.data;
                usersTemp.forEach(function(user) {
                    if (user.loggedIn === true) {
                        setFoundUser(user)
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, [props.id, usersTemp]);
    
    function logout() {
    
      const toBeLoggedOut = {
        userID: foundUser._id
      }
    
      axios
        .post("http://localhost:4000/user/logout", toBeLoggedOut)
        .then(res => {
            console.log("Response", res.data)
            if (res.data.val === 1) {
                alert("Logged Out!")
                navigate("/")
                window.location.reload()
            }
        })
    }

    return (
        <html>
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous" />
        </head>
        <body>
            <header class="p-1 bg-dark text-white">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                <button class="d-flex btn btn-dark align-items-center mb-2 mb-lg-0 text-white text-decoration-none" onClick={() => navigate("/")}>
                    {/* <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"></svg> */}
                    <img src={require("./dumbbells-icon.png")} width="40px" alt="The workout sign" />
                </button>

                <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                    <li><button onClick={() => navigate("/")} class="btn btn-dark px-2 py-1">Home</button></li>
                    <li><button onClick={() => navigate("/")} class="btn btn-dark px-2 py-1">Features</button></li>
                    <li><button onClick={() => navigate("/userexercise")} class="btn btn-dark px-2 py-1">Exercises</button></li>
                    <li><button onClick={() => navigate("/userplan")} class="btn btn-dark px-2 py-1">Schedules</button></li>
                    <li><button onClick={() => navigate("/userworkout")} class="btn btn-dark px-2 py-1">Workout</button></li>
                </ul>

                <div class="text-end">
                    <button type="button" class="btn btn-outline-info mx-1" onClick={() => navigate("/userprofile")}>{foundUser.name}</button>
                    <button type="button" class="btn btn-warning mx-1 me-2" onClick={() => logout()}>Logout</button>
                </div>
                </div>
            </div>
            </header>
        </body>
        </html>
    );

};

export default NavbarUser;
