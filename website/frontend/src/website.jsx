import React from "react";
import "./styles/custom.scss"
import {render} from "react-dom";
import WebsitePage from "./components/website/website_page.jsx";

render(
    <React.StrictMode>
        <WebsitePage/>
    </React.StrictMode>,
    document.getElementById("app"));
