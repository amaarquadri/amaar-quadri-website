import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {render} from "react-dom"
import PlayPage from "./components/play/play_page.jsx"

render(
    <React.StrictMode>
        <PlayPage/>
    </React.StrictMode>,
    document.getElementById("app"))
