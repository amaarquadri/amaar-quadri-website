import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import {render} from "react-dom";
import AquadroneMechanicalPage from "./components/aquadrone_mechanical/aquadrone_mechanical_page.jsx";

render(
    <React.StrictMode>
        <AquadroneMechanicalPage/>
    </React.StrictMode>,
    document.getElementById("app"));
