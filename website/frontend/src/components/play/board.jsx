import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import * as tfjs from '@tensorflow/tfjs'
import Square from "./square.jsx"
import GameClass from "./Connect4.js"
import AsyncMCTS from "./MCTS.js"


export default class Board extends Component {
    state = {
        data: GameClass.toReactState(GameClass.getStartingState()),
        message: 'Yellow\'s Turn',
        modelLoaded: false,
        modelError: false,
        totalPositionsEvaluated: 0,
        lastMovePositionsEvaluated: 0,
        gameFinished: false
    }

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
        this.resetGame = this.resetGame.bind(this)
    }

    componentDidMount() {
        tfjs.loadLayersModel('/static/model.json')
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
        if (this.state.message.substring(0, 11) === 'Game Over: ') {
            return
        }

        const currentState = GameClass.toTensorFlowState(this.state.data);
        const userMove = GameClass.performUserMove(currentState, row, column)
        if (userMove !== null) {
            if (GameClass.isOver(userMove)) {
                this.setState({
                    data: this.getHighlight(this.state.data, GameClass.toReactState(userMove)),
                    message: 'Game Over: ' + this.getWinnerMessage(userMove),
                    gameFinished: true
                })
            } else {
                this.setState({
                    data: this.getHighlight(this.state.data, GameClass.toReactState(userMove)),
                    message: 'Ai\'s Turn'
                })
            }
        } else {
            this.setState({
                message: 'Invalid Move! Try Again!'
            })
        }
    }

    getWinnerMessage(state) {
        let winner
        switch (GameClass.getWinner(state)) {
            case 0:
                winner = 'Draw'
                break
            case 1:
                winner = 'You Win!'
                break
            case -1:
                winner = 'You Lose!'
                break
            default:
                winner = ''
        }
        return winner
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
                if (this.props.urlParameters['ai-time'] !== null) {
                    timeAllowed = 1000 * this.props.urlParameters['ai-time']
                }
                else if (this.props.urlParameters['ai-positions'] !== null) {
                    positionsAllowed = this.props.urlParameters['ai-positions']
                }
                else {
                    // TODO: implement more sophisticated time management system than just playing on increment
                    timeAllowed = 1000 * this.props.urlParameters['increment']
                }

                this.moveChooser.chooseMove(position, timeAllowed, positionsAllowed)
                    .then(moveData => {
                        const aiMove = moveData.move
                        if (GameClass.isOver(aiMove)) {
                            this.setState({
                                data: this.getHighlight(this.state.data, GameClass.toReactState(aiMove)),
                                message: 'Game Over: ' + this.getWinnerMessage(aiMove),
                                totalPositionsEvaluated: moveData.totalPositionsEvaluated,
                                lastMovePositionsEvaluated: moveData.lastMovePositionsEvaluated,
                                gameFinished: true
                            })
                        } else {
                            this.setState({
                                data: this.getHighlight(this.state.data, GameClass.toReactState(aiMove)),
                                message: GameClass.isPlayer1Turn(aiMove) ? 'Your Turn' : 'Ai\'s Turn',
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
            totalPositionsEvaluated: 0,
            lastMovePositionsEvaluated: 0,
            gameFinished: false
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
                {this.state.gameFinished && <button className="btn btn-primary" onClick={this.resetGame}>Play Again?</button>}
            </React.Fragment>
        )
    }

    renderLoadingMessage() {
        return (
            <h3>{this.state.modelError ? "Unable to load! Refresh the page or try again later." : "Loading..."}</h3>
        )
    }

    render() {
        return (
            <div className="container-fluid w-50">
                {this.state.modelLoaded ? this.renderBoard() : this.renderLoadingMessage()}
            </div>
        )
    }
}
