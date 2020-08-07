import React, {Component} from "react"
import "../../styles/custom.scss"
import PlayButton from "./play_button.jsx";


export default class GamesPage extends Component {
    getLink() {
        const game = document.getElementById("gameSelection").value
        const difficulty = document.getElementById("difficultySelection").value
        let url = "/play?game=" + game + "&difficulty=" + difficulty
        if (document.getElementById("turnTimerSelection").checked) {
            const startingTime = document.getElementById("startingTime").value
            const increment = document.getElementById("increment").value
            url += "&starting-time=" + startingTime + "&increment=" + increment
        }
        else if (document.getElementById("aiModeSelector").checked) {
            const aiTime = document.getElementById("aiTime").value
            url += "&ai-time=" + aiTime
        }
        else {
            const aiPositions = document.getElementById("aiPositions").value
            url += "&ai-positions=" + aiPositions
        }
        const allowLogging = document.getElementById("loggingSelection").checked
        if (allowLogging) {
            url += "&log-stats=true"
        }
        return url
    }

    toggleTurnTimer() {
        const checkedElements = document.getElementById("turnTimerCheckedElements")
        const uncheckedElements = document.getElementById("turnTimerUncheckedElements")
        if (document.getElementById("turnTimerSelection").checked) {
            uncheckedElements.style.display = "none"
            checkedElements.style.display = "block"
        } else {
            checkedElements.style.display = "none"
            uncheckedElements.style.display = "block"
        }
    }

    toggleAIMode() {
        const aiTime = document.getElementById("aiTime")
        const aiPositions = document.getElementById("aiPositions")
        if (document.getElementById("aiModeSelector").checked) {
            aiTime.disabled = false
            aiPositions.disabled = true
        } else {
            aiPositions.disabled = false
            aiTime.disabled = true
        }
    }

    render() {
        return (
            <div className="container">
                <h2>Game Setup</h2>
                <div className="row form-group">
                    <label htmlFor="gameSelection" className="mdb-main-label p-3">Pick a Game: </label>
                    <select className="mdb-select md-form colorful-select dropdown-primary" defaultValue="connect4"
                            id="gameSelection">
                        <option value="connect4">Connect 4</option>
                        <option value="checkers">Checkers</option>
                        <option value="othello">Othello</option>
                        <option value="amazons">Amazons</option>
                    </select>
                    <a href="https://en.wikipedia.org/wiki/Connect_Four#Gameplay" target="_blank">How to Play</a>
                </div>
                <div className="row form-group">
                    <label htmlFor="difficultySelection" className="mdb-main-label p-3">Difficulty Level: </label>
                    <select className="mdb-select md-form colorful-select dropdown-primary" defaultValue="medium"
                            id="difficultySelection">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <p>How does this work?<span className="glyphicon glyphicon-question-sign" aria-hidden="true"/></p>
                </div>
                <div className="row">
                    <input className="form-check-input" type="checkbox" id="turnTimerSelection"
                           onClick={this.toggleTurnTimer}/>
                    <label htmlFor="turnTimerSelection">Turn Timer</label>
                </div>
                <div className="container" id="turnTimerCheckedElements" style={{display: "none"}}>
                    <h3>Turn Timer Settings</h3>
                    <div className="row">
                        <label htmlFor="startingTime">Starting Time: </label>
                        <input className="form-text" type="number" id="startingTime" defaultValue="900"/>
                    </div>
                    <div className="row">
                        <label htmlFor="increment">Increment: </label>
                        <input className="form-text" type="number" id="increment" defaultValue="10"/>
                    </div>
                </div>
                <div className="container" id="turnTimerUncheckedElements" style={{display: "block"}}>
                    <h3>AI Settings</h3>
                    <div className="row">
                        <label htmlFor="aiModeSelector">Fixed Time?</label>
                        <input className="form-check-input" type="checkbox" id="aiModeSelector" defaultChecked
                               onClick={this.toggleAIMode}/>
                    </div>
                    <div className="row">
                        <label htmlFor="aiTime">Time: </label>
                        <input className="form-text" type="number" id="aiTime" defaultValue="3"/>
                        <label htmlFor="aiPositions">Positions: </label>
                        <input className="form-text" type="number" id="aiPositions" disabled defaultValue="100"/>
                    </div>
                </div>
                <div className="row">
                    <input className="form-check-input" type="checkbox" id="loggingSelection" defaultChecked/>
                    <label htmlFor="loggingSelection">Send Anonymous Statistics</label>
                </div>
                <PlayButton getLink={this.getLink}/>
            </div>
        )
    }
}
