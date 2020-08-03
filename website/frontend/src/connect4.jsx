import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {render} from "react-dom"
import Connect4Page from "./components/connect4_page.jsx"

render(
    <React.StrictMode>
        <Connect4Page/>
    </React.StrictMode>,
    document.getElementById("app"))
