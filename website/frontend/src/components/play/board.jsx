import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import * as tfjs from '@tensorflow/tfjs'
import axios from "axios"
import {v4 as uuid} from "uuid"
import Square from "./square.jsx"
import GameClass from "./Connect4.js"
import AsyncMCTS from "./MCTS.js"
import CommentBox from "./comment_box.jsx";


export default class Board extends Component {
    state = {
        data: GameClass.toReactState(GameClass.getStartingState()),
        message: 'Yellow\'s Turn',
        modelLoaded: false,
        modelError: false,
        aiMoving: false,
        totalPositionsEvaluated: 0,
        lastMovePositionsEvaluated: 0,
        gameFinished: false,
        gameUUID: uuid(),
        commentSubmitted: false
    }

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.resetGame = this.resetGame.bind(this)
        this.postComment = this.postComment.bind(this)
        axios.defaults.xsrfCookieName = "csrftoken"
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
    }

    componentDidMount() {
        tfjs.loadLayersModel("/static/" + this.props.urlParameters.game + "_" + this.props.urlParameters.difficulty + "_model.json")
            .then(model => {
                const predictFunc = (states) => {
                    const result = model.predict(tfjs.tensor(states))
                    const policies = GameClass.separateFlattenedPolicies(Array.from(result[0].dataSync()))
                    const values = Array.from(result[1].dataSync())

                    return policies
                        .map((policy, stateIndex) => {
                            const legalMoves = GameClass.getLegalMoves(states[stateIndex])
                            return policy.filter((move, moveIndex) => legalMoves[moveIndex])
                        })
                        .map((policy, stateIndex) => [policy, values[stateIndex]])
                }
                this.moveChooser = new AsyncMCTS(GameClass, GameClass.toTensorFlowState(this.state.data), predictFunc)
                this.setState({modelLoaded: true})
            })
            .catch(error => {
                console.log('Error Loading Model! Error message: ')
                console.log(error)
                this.setState({modelError: true})
            })
    }

    handleClick(row, column) {
        if (this.state.gameFinished || this.state.aiMoving) {
            return
        }

        const currentState = GameClass.toTensorFlowState(this.state.data);
        const userMove = GameClass.performUserMove(currentState, row, column)
        if (userMove !== null) {
            if (GameClass.isOver(userMove)) {
                const winner = GameClass.getWinner(userMove)
                this.setState({
                    data: this.getHighlight(this.state.data, GameClass.toReactState(userMove)),
                    message: 'Game Over: ' + this.getWinnerMessage(winner),
                    gameFinished: true
                })
                this.postGameStatistics(winner)
            } else {
                this.setState({
                    data: this.getHighlight(this.state.data, GameClass.toReactState(userMove)),
                    aiMoving: true,
                    message: 'Ai\'s Turn'
                })
            }
        } else {
            this.setState({
                message: 'Invalid Move! Try Again!'
            })
        }
    }

    getWinnerMessage(winner) {
        switch (winner) {
            case 0:
                return 'Draw'
            case 1:
                return 'You Win!'
            case -1:
                return 'You Lose!'
            default:
                return ''
        }
    }

    getHighlight(oldReactState, newReactState) {
        return newReactState.map(rowData => rowData.map(squareData => {
            const oldSquareData = oldReactState[squareData.row][squareData.column]
            squareData.highlight = oldSquareData.p1Piece !== squareData.p1Piece ||
                oldSquareData.p2Piece !== squareData.p2Piece
            return squareData
        }))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const position = GameClass.toTensorFlowState(this.state.data);
        if (!GameClass.isPlayer1Turn(position)) {
            setTimeout(() => {
                let timeAllowed = -1
                let positionsAllowed = -1
                if (this.props.urlParameters.aiTime !== null) {
                    timeAllowed = 1000 * this.props.urlParameters.aiTime
                } else if (this.props.urlParameters.aiPositions !== null) {
                    positionsAllowed = this.props.urlParameters.aiPositions
                } else {
                    // TODO: implement more sophisticated time management system than just playing on increment
                    timeAllowed = 1000 * this.props.urlParameters.increment
                }

                this.moveChooser.chooseMove(position, timeAllowed, positionsAllowed)
                    .then(moveData => {
                        const aiMove = moveData.move
                        if (GameClass.isOver(aiMove)) {
                            const winner = GameClass.getWinner(aiMove)
                            this.setState({
                                data: this.getHighlight(this.state.data, GameClass.toReactState(aiMove)),
                                message: 'Game Over: ' + this.getWinnerMessage(winner),
                                aiMoving: false,
                                totalPositionsEvaluated: moveData.totalPositionsEvaluated,
                                lastMovePositionsEvaluated: moveData.lastMovePositionsEvaluated,
                                gameFinished: true
                            })
                            this.postGameStatistics(winner)
                        } else {
                            this.setState({
                                data: this.getHighlight(this.state.data, GameClass.toReactState(aiMove)),
                                message: GameClass.isPlayer1Turn(aiMove) ? 'Your Turn' : 'Ai\'s Turn',
                                aiMoving: false,
                                totalPositionsEvaluated: moveData.totalPositionsEvaluated,
                                lastMovePositionsEvaluated: moveData.lastMovePositionsEvaluated
                            })
                        }
                    }).catch(error => console.log(error))
            }, 100)
        }
    }

    resetGame() {
        const startingPosition = GameClass.getStartingState()
        this.moveChooser.reset(startingPosition)
        this.setState({
            data: GameClass.toReactState(startingPosition),
            message: 'Yellow\'s Turn',
            modelLoaded: true,
            modelError: false,
            aiMoving: false,
            totalPositionsEvaluated: 0,
            lastMovePositionsEvaluated: 0,
            gameFinished: false,
            gameUUID: uuid(),
            commentSubmitted: false
        })
    }

    postGameStatistics(winner) {
        if (this.props.urlParameters.logStats) {
            // TODO: send game moves, and ai position counts probability distributions and evaluations
            axios.post('/backend/post-statistic', {
                game: this.props.urlParameters.game,
                difficulty: this.props.urlParameters.difficulty,
                winner: winner,
                uuid: this.state.gameUUID
            })
                .then(response => {
                    console.log(response)
                    // TODO: show toast
                })
                .catch(error => console.log(error))
        }
    }

    postComment(name, comment) {
        axios.put('/backend/post-comment', {
            name: name,
            comment: comment,
            uuid: this.state.gameUUID
        })
            .then(response => {
                this.setState({commentSubmitted: true})
                console.log(response)
                // TODO: show toast
            })
            .catch(error => {
                console.log(error)
                // TODO: show toast
            })
    }

    renderBoard() {
        return (
            <React.Fragment>
                {this.state.data.map(rowData => (
                    <div className='row' key={rowData[0].row}>
                        {rowData.map(squareData => (
                            <div className="col p-0" key={squareData.column}>
                                <Square key={squareData.column} squareData={squareData}
                                        onClick={() => this.handleClick(squareData.row, squareData.column)}/>
                            </div>
                        ))}
                    </div>
                ))}
                <p>{this.state.message}</p>
                <h4>Ai Statistics</h4>
                <p>Total positions evaluated: {this.state.totalPositionsEvaluated}</p>
                <p>Positions evaluated for last move: {this.state.lastMovePositionsEvaluated}</p>
                {this.state.gameFinished && this.renderGameOverContent()}
            </React.Fragment>
        )
    }

    renderLoadingMessage() {
        return (
            <h3>{this.state.modelError ? "Unable to load! Refresh the page or try again later." : "Loading..."}</h3>
        )
    }

    renderGameOverContent() {
        return (
            <React.Fragment>
                <button className="btn btn-primary" onClick={this.resetGame}>Play Again?</button>
                {!this.state.commentSubmitted && this.props.urlParameters.logStats && <CommentBox onSubmit={this.postComment}/>}
            </React.Fragment>
        )
    }

    render() {
        return (
            <div className="container-fluid">
                {this.state.modelLoaded ? this.renderBoard() : this.renderLoadingMessage()}
            </div>
        )
    }
}
