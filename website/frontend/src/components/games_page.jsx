import React, {Component} from "react"
import "../styles/custom.scss"
import PlayButton from "./play_button.jsx";


export default class GamesPage extends Component {
    getLink() {
        return "/connect4"
    }

    render() {
        return (
            <div className="container">
                <h2>Game Setup</h2>
                <div className="row form-group">
                    <label htmlFor="gameSelection" className="mdb-main-label p-3">Pick a Game: </label>
                    <select className="mdb-select md-form colorful-select dropdown-primary" defaultValue="connect4" id="gameSelection">
                        <option value="connect4">Connect 4</option>
                        <option value="checkers">Checkers</option>
                        <option value="othello">Othello</option>
                        <option value="amazons">Amazons</option>
                    </select>
                    <a href="https://en.wikipedia.org/wiki/Connect_Four#Gameplay" target="_blank">How to Play</a>
                </div>
                <div className="row form-group">
                    <label htmlFor="difficultySelection" className="mdb-main-label p-3">Difficulty Level: </label>
                    <select className="mdb-select md-form colorful-select dropdown-primary" defaultValue="medium" id="difficultySelection">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <p>How does this work?<span className="glyphicon glyphicon-question-sign" aria-hidden="true"/></p>
                </div>
                <div className="row">
                    <input className="form-check-input" type="checkbox" value="" id="turnTimerSelection"/>
                    <label htmlFor="turnTimerSelection">Turn Timer</label>
                </div>
                <PlayButton getLink={this.getLink}/>
            </div>
        )
    }
}
