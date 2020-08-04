import React from "react";
import "./styles/custom.scss"
import {render} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import GamesPage from "./components/games_page.jsx";

render(
    <React.StrictMode>
        <BrowserRouter>
            <GamesPage/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("app"));
