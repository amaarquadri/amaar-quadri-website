import React from "react";
import "./styles/custom.scss"
import {render} from "react-dom";
import TigercatPage from "./components/tigercat/tigercat_page.jsx";

render(
    <React.StrictMode>
        <TigercatPage/>
    </React.StrictMode>,
    document.getElementById("app"));
