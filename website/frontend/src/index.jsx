import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import {render} from "react-dom";
import IndexPage from "./components/index/index_page.jsx";

render(
    <React.StrictMode>
        <IndexPage/>
    </React.StrictMode>,
    document.getElementById("app"));
