import React from "react";
import "./styles/custom.scss"
import {render} from "react-dom";
import GamesPage from "./components/games/games_page.jsx";

render(
    <React.StrictMode>
        <GamesPage/>
    </React.StrictMode>,
    document.getElementById("app"));
