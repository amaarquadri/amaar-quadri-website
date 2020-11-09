import Game from "./Game.js"

export default class Othello extends Game {
    static getRows() {
        return 8
    }

    static getColumns() {
        return 8
    }

    static getMoves() {
        return this.getRows() * this.getColumns()
    }

    static getName() {
        return "Othello"
    }

    static getStartingState() {
        return [
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]],
            [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]]];
    }

    static performUserMove(state, row, column) {
        //performs the user move on the given state,
        //if the selected move is illegal, then null will be returned
        if (state[row][column][0] === 1 || state[row][column][1] === 1) {
            return null
        }

        let targetRow = this.getRows() - 1
        while (state[targetRow][column][0] === 1 || state[targetRow][column][1] === 1) {
            targetRow -= 1
        }

        return state.map((rowData, rowIndex) => rowData.map((squareData, columnIndex) => {
            if (rowIndex === targetRow && columnIndex === column) {
                if (squareData[2] === 1) {
                    squareData[0] = 1
                } else {
                    squareData[1] = 1
                }
            }
            squareData[2] = (1 - squareData[2])
            return squareData
        }))
    }

    static getPossibleMoves(state) {
        const friendlyIndex = this.isPlayer1Turn(state) ? 0 : 1
        const enemyIndex = 1 - friendlyIndex
        const moves = []

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (state[i][j][0] === 1 || state[i][j][1] === 1) {
                    continue
                }

                let anyFlipped = false
                const flipSquares = [
                    [false, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false],
                    [false, false, false, false, false, false, false, false]]

                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        if (di === 0 && dj === 0) {
                            continue
                        }

                        let p_x = i + di
                        let p_y = j + dj

                        if (!this.isValid(p_x, p_y) || state[p_x][p_y][enemyIndex] === 0) {
                            continue
                        }

                        p_x += di
                        p_y += dj

                        while (this.isValid(p_x, p_y) && state[p_x][p_y][enemyIndex] === 1) {
                            p_x += di
                            p_y += dj
                        }

                        if (this.isValid(p_x, p_y) && state[p_x][p_y][friendlyIndex] === 1) {
                            anyFlipped = true
                            // success, mark all squares between i, j and p_x, p_y (not including endpoints)
                            p_x -= di
                            p_y -= dj
                            while (p_x !== i || p_y !== j) {
                                flipSquares[p_x][p_y] = true
                                p_x -= di
                                p_y -= dj
                            }
                        }
                    }
                }

                if (anyFlipped) {
                    const move = this.nullMove(state)
                    move[i][j][0] = enemyIndex
                    move[i][j][1] = friendlyIndex
                    for (let x = 0; x < 8; x++) {
                        for (let y = 0; y < 8; y++) {
                            if (flipSquares[x][y]) {
                                move[x][y][0] = enemyIndex
                                move[x][y][1] = friendlyIndex
                            }
                        }
                    }
                    moves.push(move)
                }
            }
        }

        if (moves.length === 0) {
            const passMove = this.nullMove(state)
            moves.push(passMove)
        }

        return moves
    }

    static getLegalMoves(state) {
        // Returns flattened list of legal moves
        const friendlyIndex = this.isPlayer1Turn(state) ? 0 : 1
        const enemyIndex = 1 - friendlyIndex
        const legalMoves = [
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false]]

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (state[i][j][0] === 1 || state[i][j][1] === 1) {
                    continue
                }

                directionsLoop:
                for (let di = -1; di <= 1; di++) {
                    for (let dj = -1; dj <= 1; dj++) {
                        if (di === 0 && dj === 0) {
                            continue
                        }

                        let p_x = i + di
                        let p_y = j + dj

                        if (!this.isValid(p_x, p_y) || state[p_x][p_y][enemyIndex] === 0) {
                            continue
                        }

                        p_x += di
                        p_y += dj

                        while (this.isValid(p_x, p_y) && state[p_x][p_y][enemyIndex] === 1) {
                            p_x += di
                            p_y += dj
                        }

                        if (this.isValid(p_x, p_y) && state[p_x][p_y][friendlyIndex] === 1) {
                            legalMoves[i][j] = true
                            break directionsLoop
                        }
                    }
                }
            }
        }

        return legalMoves
    }

    static isOver(state) {
        return this.getLegalMoves(state).every(isLegal => isLegal === false) &&
            this.nullMove(state).every(isLegal => isLegal === false)
    }

    static getWinner(state) {
        const sum = state.map(rowData => rowData.map(squareData => {
            if (squareData[0] === 1) {
                return 1
            }
            if (squareData[1] === 1) {
                return -1
            }
            return 0
        })).reduce((acc, val) => acc + val, 0)
        if (sum > 0) {
            return 1
        }
        if (sum < 0) {
            return -1
        }
        return 0
    }
}
