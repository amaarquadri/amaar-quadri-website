export default class Game {
    static getRows() {
        throw new Error()
    }

    static getColumns() {
        throw new Error()
    }

    static getMoves() {
        throw new Error()
    }

    static getName() {
        throw new Error()
    }

    static getStartingState() {
        throw new Error()
    }

    static toReactState(state) {
        return state.map((row, rowIndex) => row.map((square, columnIndex) => {
            return {
                row: rowIndex, column: columnIndex,
                p1Piece: square[0] === 1,
                p2Piece: square[1] === 1,
                p1Turn: square[2] === 1,
                highlight: false
            }
        }))
    }

    static toTensorFlowState(reactState) {
        return reactState.map(row => row.map(square =>
            [square.p1Piece ? 1 : 0, square.p2Piece ? 1 : 0, square.p1Turn ? 1 : 0]))
    }

    static logState(state) {
        console.log(state.map(rowData => rowData.map(squareData => {
            if (squareData[0] === 1) {
                return 1
            }
            if (squareData[1] === 1) {
                return -1
            }
            return 0
        })))
        console.log(this.isPlayer1Turn(state) ? 'P1 Turn' : 'P2 Turn')
    }

    static flatten(state) {
        return state.reduce(((acc, val) => acc.concat(Array.isArray(val) ? this.flatten(val) : val)), [])
    }

    static separateFlattenedPolicies(policies) {
        //Receives a flattened array with several policies, and outputs an array of arrays of flattened policies
        const acc = policies.reduce(((acc, val) => {
            acc.acc.push(val)
            if (acc.acc.length === this.getMoves()) {
                acc.policies.push(acc.acc)
                acc.acc = []
            }
            return acc
        }), {
            policies: [],
            acc: []
        })
        if (acc.acc.length > 0) {
            throw new Error('policies.length is not a multiple of ' + this.getMoves())
        }
        return acc.policies
    }

    static performUserMove(state, row, column) {
        //performs the user move on the given state,
        //if the selected move is illegal, then null will be returned
        throw new Error()
    }

    static isPlayer1Turn(state) {
        return state[0][0][2]
    }

    static getPossibleMoves(state) {
        throw new Error()
    }

    static getLegalMoves(state) {
        // Returns flattened list of legal moves
        throw new Error()
    }

    static isOver(state) {
        throw new Error()
    }

    static getWinner(state) {
        throw new Error()
    }

    static stateEquals(firstState, secondState) {
        for (let i = 0; i < this.getRows(); i++) {
            for (let j = 0; j < this.getColumns(); j++) {
                for (let k = 0; k < 3; k++) {
                    if (firstState[i][j][k] !== secondState[i][j][k]) {
                        return false
                    }
                }
            }
        }
        return true
    }

    static copy(state) {
        const newState = this.getStartingState()
        for (let k = 0; k < 3; k++) {
            for (let i = 0; i < this.getRows(); i++) {
                for (let j = 0; j < this.getColumns(); j++) {
                    newState[k][i][j] = state[k][i][j]
                }
            }
        }
        return newState
    }

    static nullMove(state) {
        const newState = this.getStartingState()
        for (let k = 0; k < 3; k++) {
            for (let i = 0; i < this.getRows(); i++) {
                for (let j = 0; j < this.getColumns(); j++) {
                    newState[k][i][j] = k === 2 ? (1 - state[i][j][2]) : state[i][j][k]
                }
            }
        }
        return newState
    }

    static isValid(i, j) {
        return 0 <= i && i < this.getRows() && 0 <= j && j < this.getColumns()
    }
}