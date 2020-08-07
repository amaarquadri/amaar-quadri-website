import React, {Component} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Board from "./board.jsx"
import GameStatistics from "./game_statistics.jsx"

export default class PlayPage extends Component {
    render() {
        return (
            <div className="container">
                <h1>Connect 4</h1>
                <div className="row">
                    <div className="col w-75">
                        <Board urlParameters={this.props.urlParameters}/>
                    </div>
                    <div className="col">
                        <GameStatistics urlParameters={this.props.urlParameters}
                                        gameStatistics={this.props.gameStatistics}/>
                    </div>
                </div>
            </div>
        )
    }
}
