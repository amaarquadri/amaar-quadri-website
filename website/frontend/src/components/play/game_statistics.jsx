import React, {Component} from 'react'
import "../../styles/custom.scss"

export default class GameStatistics extends Component {
    getGameName() {
        switch (this.props.urlParameters.game) {
            case "connect4":
                return "Connect 4"
            default:
                return "Game"
        }
    }

    getDifficulty() {
        switch (this.props.urlParameters.difficulty) {
            case "easy":
                return "Easy"
            case "medium":
                return "Medium"
            case "hard":
                return "Hard"
            default:
                return "Medium"
        }
    }

    render() {
        return (
            <React.Fragment>
                <h2>{this.getGameName()} Stats on {this.getDifficulty()}</h2>
                <p><b>Player Wins</b>: {this.props.gameStatistics.humanWins},&nbsp;
                    <b>AI Wins</b>: {this.props.gameStatistics.aiWins},&nbsp;
                    <b>Draws</b>: {this.props.gameStatistics.draws}</p>
                {this.props.gameStatistics.comments.length > 0 &&
                    <React.Fragment>
                        <h4>What People Are Saying</h4>
                        {this.props.gameStatistics.comments.map((commentData, index) => (
                            <p key={index}><b>{commentData.name}:</b> {commentData.comment} <b>on {commentData.date}</b></p>
                        ))}
                    </React.Fragment>
                }
            </React.Fragment>
        )
    }
}
