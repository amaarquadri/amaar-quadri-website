import React from "react";
import "./styles/custom.scss"
import {render} from "react-dom";
import AquadroneMechanicalPage from "./components/aquadrone_mechanical/aquadrone_mechanical_page.jsx";

render(
    <React.StrictMode>
        <AquadroneMechanicalPage/>
    </React.StrictMode>,
    document.getElementById("app"));
