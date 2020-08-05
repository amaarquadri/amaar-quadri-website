import React from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import {render} from "react-dom"
import PlayPage from "./components/play/play_page.jsx"

render(
    <React.StrictMode>
        {/* The JSON string must be modified to replace the escaped escaped quotes so that it can be parsed. */}
        <PlayPage urlParameters={JSON.parse(urlParametersJSON.replace(/&quot;/g, '"'))}/>
    </React.StrictMode>,
    document.getElementById("app"))
