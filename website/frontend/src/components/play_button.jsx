import React from "react"
import "../styles/custom.scss"
import {useHistory} from "react-router-dom"


export default function PlayButton() {
    const history = useHistory();

    return (
        <button type="button" onClick={() => {
            console.log(history)
            history.push("/connect4");
        }}>
            Play Game
        </button>
    );
}