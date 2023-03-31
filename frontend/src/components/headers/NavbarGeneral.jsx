import React from "react"
import { useNavigate } from "react-router-dom";
import "./NavbarGeneral.css";

const NavbarGeneral = () => {
  const navigate = useNavigate();

  return (
    <html>
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossOrigin="anonymous"></link>
      </head>
      <body>
        <header class="p-1 bg-dark text-white">
          <div class="container">
            <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <button class="d-flex btn btn-dark align-items-center mb-2 mb-lg-0 text-white text-decoration-none" onClick={() => navigate("/")}>
                <img src={require("./dumbbells-icon.png")} width="40px" alt="The workout sign" />
              </button>

              <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li><button onClick={() => navigate("/")} class="btn btn-dark px-2 py-1">Home</button></li>
                <li><button onClick={() => navigate("/")} class="btn btn-dark px-2 py-1">Features</button></li>
                <li><button onClick={() => navigate("/")} class="btn btn-dark px-2 py-1">Pricing</button></li>
                <li><button onClick={() => navigate("/")} class="btn btn-dark px-2 py-1">FAQs</button></li>
                <li><button onClick={() => navigate("/")} class="btn btn-dark px-2 py-1">About</button></li>
              </ul>

              <div class="text-end">
                <button type="button" class="btn btn-outline-light me-2" onClick={() => navigate("/login")}>Login</button>
                <button type="button" class="btn btn-warning" onClick={() => navigate("/register")}>Sign-up</button>
              </div>
            </div>
          </div>
        </header>
      </body>
    </html>
  );

};

export default NavbarGeneral;
