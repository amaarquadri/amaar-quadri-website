import React, {Component} from "react"
import "../../styles/custom.scss"
import * as tfjs from '@tensorflow/tfjs'
import axios from "axios"
import {v4 as uuid} from "uuid"
import Square from "./square.jsx"
import GameClass from "./Connect4.js"
import HeuristicNode from "./MCTS.js"
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
        this.userMoved = false
        this.handleClick = this.handleClick.bind(this)
        this.resetGame = this.resetGame.bind(this)
        this.postComment = this.postComment.bind(this)
        axios.defaults.xsrfCookieName = "csrftoken"
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"
    }

    componentDidMount() {
        tfjs.loadLayersModel(staticURL + this.props.urlParameters.game + "_" + this.props.urlParameters.difficulty + "_model.json")
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
                new Promise(resolve => {
                    let root = new HeuristicNode(GameClass.getStartingState(), null, GameClass, predictFunc)

                    while (!this.userMoved || root.children === null) {
                        const bestNode = root.chooseExpansionNode()

                        if (bestNode === null) {
                            continue
                        }

                        bestNode.expand()
                    }
                    this.userMoved = false
                    resolve(root)
                })
                    .then(this.recurse)
                    .catch(() => {})
            })
            .catch(error => {
                console.log('Error Loading Model! Error message: ')
                console.log(error)
                this.setState({modelError: true})
            })
    }

    recurse(root) {
        this.onUserMove(root).then(this.onAIMove).then(this.recurse)
    }

    onUserMove(root) {
        return new Promise((resolve, reject) => {
            const userMove = GameClass.toTensorFlowState(this.state.data)
            root = root.children.filter(move => GameClass.stateEquals(move.position, userMove))[0]
            if (GameClass.isOver(root.position)) {
                reject('Game Over!')
            }

            const startTime = Date.now()
            while (Date.now() - startTime < 1000 * this.props.urlParameters['ai-time']) {
                const bestNode = root.chooseExpansionNode()

                if (bestNode === null) {
                    break
                }

                bestNode.expand()
            }
            resolve(root)
        })
    }

    onAIMove(root) {
        return new Promise((resolve, reject) => {
            root = root.chooseBestNode()
            this.setState({data: GameClass.toReactState(root.position)})
            this.userMoved = false

            if (GameClass.isOver(root.position)) {
                reject('Game Over!')
            }

             while (!this.userMoved || root.children === null) {
                const bestNode = root.chooseExpansionNode()

                if (bestNode === null) {
                    continue
                }

                bestNode.expand()
            }
            resolve(root)
        })
    }

    handleClick(row, column) {
        if (this.state.gameFinished || this.state.aiMoving) {
            return
        }

        if (this.userMoved) {
            console.log('AI is still deciding!')
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

                this.userMoved = true
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