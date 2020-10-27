import React from "react";
import "./styles/custom.scss"
import {render} from "react-dom";
import SunnybrookPage from "./components/sunnybrook/sunnybrook_page.jsx";

render(
    <React.StrictMode>
        <SunnybrookPage/>
    </React.StrictMode>,
    document.getElementById("app"));
