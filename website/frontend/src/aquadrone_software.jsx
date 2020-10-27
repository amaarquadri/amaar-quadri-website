import React from "react"
import "./styles/custom.scss"
import {render} from "react-dom"
import AquadroneSoftwarePage from "./components/aquadrone_software/aquadrone_software_page.jsx"

render(
    <React.StrictMode>
        <AquadroneSoftwarePage/>
    </React.StrictMode>,
    document.getElementById("app"))
