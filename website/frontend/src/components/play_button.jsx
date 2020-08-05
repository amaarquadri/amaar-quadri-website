import React from "react"
import "../styles/custom.scss"
import {useHistory} from "react-router-dom"


export default function PlayButton({getLink}) {
    const history = useHistory();

    return (
        <button type="button" onClick={() => history.push(getLink())}>
            Play Game
        </button>
    );
}