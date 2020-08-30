import React from "react";
import "./styles/custom.scss"
import {render} from "react-dom";
import MachineLearningPage from "./components/machine_learning/machine_learning_page.jsx";

render(
    <React.StrictMode>
        <MachineLearningPage/>
    </React.StrictMode>,
    document.getElementById("app"));
