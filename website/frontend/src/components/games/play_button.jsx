import React from "react"
import "../../styles/custom.scss"


export default function PlayButton({getLink}) {
    return (
        <button type="button" onClick={() => window.location.href = getLink()}>
            Play Game
        </button>
    )
}
