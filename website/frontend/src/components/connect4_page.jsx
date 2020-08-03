import React, {Component} from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import Board from "./board.jsx"

export default class Connect4Page extends Component {
    render() {
        return (
            <React.Fragment>
                <h1>Connect 4</h1>
                <Board />
            </React.Fragment>
        )
    }
}
