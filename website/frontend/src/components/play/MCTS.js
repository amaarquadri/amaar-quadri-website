export default class AsyncMCTS {
    // TODO: continue processing while the user is moving

    constructor(GameClass, position, networkFunc, c=Math.sqrt(2), d=1) {
        this.GameClass = GameClass
        this.root = new HeuristicNode(position, null, GameClass, networkFunc, c, d, null, true)
        this.totalPositionsEvaluated = 0
    }

    chooseMove(position, timeAllowed=-1, positionsAllowed=-1) {
        // Either timeAllowed (in milliseconds) or positionsAllowed must passed as a parameter. The other must be -1.
        if ((timeAllowed === -1) === (positionsAllowed === -1)) {
            throw new Error("Exactly one of timeAllowed or positionsAllowed must be specified!")
        }
        return new Promise((resolve, reject) => {
            const startTime = Date.now()

            // Ensure at least 1 expansion
            if (this.root.children === null) {
                this.root.expand()
            }

            const matchingChildren = this.root.children.filter((child) =>
                this.GameClass.stateEquals(child.position, position))
            if (matchingChildren.length !== 1) {
                reject(matchingChildren.length === 0 ? "Illegal Move!" : "Multiple identical moves in state tree!")
                return
            }
            this.root = matchingChildren[0]

            if (this.GameClass.isOver(this.root.position)) {
                reject('Game Finished!')
                return
            }

            let newPositionsEvaluated = 0
            while (timeAllowed === -1 ? this.root.countExpansions() < positionsAllowed : Date.now() - startTime < timeAllowed) {
                const bestNode = this.root.chooseExpansionNode()

                if (bestNode === null) {
                    break
                }

                bestNode.expand()
                newPositionsEvaluated++
            }

            // Ensure at least 1 expansion
            if (this.root.children === null) {
                this.root.expand()
            }

            this.totalPositionsEvaluated += newPositionsEvaluated
            const lastMovePositionsEvaluated = this.root.countExpansions()
            this.root = this.root.chooseBestNode()
            resolve({
                move: this.root.position,
                totalPositionsEvaluated: this.totalPositionsEvaluated,
                lastMovePositionsEvaluated: lastMovePositionsEvaluated
            })
        })
    }

    reset(position) {
        this.root = new HeuristicNode(position, null, this.GameClass, this.root.networkFunc,
            this.root.c, this.root.d, null, this.root.verbose)
        this.totalPositionsEvaluated = 0
    }
}

class HeuristicNode {
    constructor(position, parent, GameClass, networkFunc, c=Math.sqrt(2), d=1,
                networkCallResults=null, verbose=false) {
        this.position = position
        this.parent = parent
        this.GameClass = GameClass
        this.networkFunc = networkFunc
        this.c = c
        this.d = d
        this.fullyExpanded = GameClass.isOver(position)
        this.isMaximizing = GameClass.isPlayer1Turn(position)
        this.children = null
        this.verbose = verbose

        if (this.fullyExpanded) {
            this.heuristic = GameClass.getWinner(position)
            this.policy = null
            this.expansions = Infinity
        }
        else {
            if (networkCallResults == null) {
                networkCallResults = networkFunc([position])[0]
            }
            this.policy = networkCallResults[0]
            this.heuristic = networkCallResults[1]
            this.expansions = 0
        }
    }

    countExpansions() {
        return this.expansions
    }

    getEvaluation() {
        return this.heuristic
    }

    expand() {
        if (this.children !== null) {
            throw new Error('Node already has children!')
        }
        if (this.fullyExpanded) {
            throw new Error('Node is terminal!')
        }

        this.ensureChildren()
        if (this.children === null) {
            throw new Error('Failed to create children!')
        }

        const criticalValue = this.isMaximizing ? Math.max(...this.children.map(child => child.heuristic)) :
            Math.min(...this.children.map(child => child.heuristic))
        this.heuristic = criticalValue

        let node = this.parent
        while (node !== null) {
            if ((node.isMaximizing && criticalValue > node.heuristic) ||
                (!node.isMaximizing && criticalValue < node.heuristic)) {
                node.heuristic = criticalValue
                node.expansions += 1
                node = node.parent
            }
            else {
                node.expansions += 1
                node = node.parent
                break
            }
        }

        while (node !== null) {
            node.expansions += 1
            node = node.parent
        }
    }

    chooseExpansionNode() {
        if (this.fullyExpanded) {
            return null
        }

        if (this.countExpansions() === 0) {
            return this
        }

        this.ensureChildren()
        let bestHeuristic = this.isMaximizing ? -Infinity : Infinity
        let bestChild = null
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i]

            if (child.fullyExpanded) {
                const optimalValue = this.isMaximizing ? 1 : -1
                if (child.getEvaluation() === optimalValue) {
                    this.setFullyExpanded(optimalValue)
                    return this.parent === null ? null : this.parent.chooseExpansionNode()
                }
                continue
            }

            const puctHeuristic = this.getPuctHeuristicForChild(i)
            if (!isFinite(puctHeuristic)) {
                return child
            }

            if (this.isMaximizing) {
                const combinedHeuristic = child.getEvaluation() + puctHeuristic
                if (combinedHeuristic > bestHeuristic) {
                    bestHeuristic = combinedHeuristic
                    bestChild = child
                }
            }
            else {
                const combinedHeuristic = child.getEvaluation() - puctHeuristic
                if (combinedHeuristic < bestHeuristic) {
                    bestHeuristic = combinedHeuristic
                    bestChild = child
                }
            }
        }

        if (bestChild === null) {
            if (this.verbose && !this.fullyExpanded && this.parent === null) {
                console.log('Fully expanded tree!')
            }

            const minimaxEvaluation = this.isMaximizing ? Math.max(...this.children.map(child => child.getEvaluation())) :
                Math.min(...this.children.map(child => child.getEvaluation()))
            this.setFullyExpanded(minimaxEvaluation)
            return this.parent === null ? null : this.parent.chooseExpansionNode()
        }

        return bestChild.chooseExpansionNode()
    }

    chooseBestNode() {
        //instead of choosing from distribution, always play the optimal move

        const optimalValue = this.isMaximizing ? 1 : -1
        if (this.fullyExpanded) {
            if (this.verbose) {
                if (this.getEvaluation() === optimalValue) {
                    console.log('I\'m going to win')
                }
                else if (this.getEvaluation() === 0) {
                    console.log('It\'s a draw')
                }
                else {
                    console.log('I resign')
                }
            }

            const acc = this.children.reduce((acc, child) => {
                if (child.fullyExpanded && child.getEvaluation() === this.getEvaluation()) {
                    const childDepthToEndGame = child.depthToEndGame()
                    if (acc.bestChild === null ||
                        (this.getEvaluation() === optimalValue ? (childDepthToEndGame < acc.bestDepthToEndGame) :
                            (childDepthToEndGame > acc.bestDepthToEndGame))) {
                        acc.bestChild = child
                        acc.bestDepthToEndGame = childDepthToEndGame
                    }
                }
                return acc
            }, {
                bestChild: null,
                bestDepthToEndGame: 0
            })
            return acc.bestChild
        }
        else {
            const acc = this.children.reduce((acc, child) => {
                let childScore
                if (!child.fullyExpanded) {
                    childScore = child.countExpansions()
                }
                else if (child.getEvaluation() === -optimalValue) {
                    childScore = 0
                }
                else {
                    const winningChance = (this.getEvaluation() * optimalValue) / 2 + 0.5
                    childScore = this.countExpansions() * (1 - winningChance)
                }

                if (acc.bestChild === null || childScore > acc.bestScore) {
                    acc.bestChild = child
                    acc.bestScore = childScore
                }
                return acc
            }, {
                bestChild: null,
                bestScore: 0
            })
            return acc.bestChild
        }
    }

    depthToEndGame() {
        if (!this.fullyExpanded) {
            throw new Error('Node not fully expanded!')
        }

        if (this.children === null) {
            return 0
        }

        const optimalValue = this.isMaximizing ? 1 : -1
        if (this.getEvaluation() === optimalValue) {
            return 1 + Math.min(...this.children
                .filter(child => child.fullyExpanded && child.getEvaluation() === this.getEvaluation())
                .map(child => child.depthToEndGame()))
        }
        else {
            return 1 + Math.max(...this.children
                .filter(child => child.fullyExpanded && child.getEvaluation() === this.getEvaluation())
                .map(child => child.depthToEndGame()))
        }
    }

    setFullyExpanded(minimaxEvaluation) {
        this.heuristic = minimaxEvaluation
        this.expansions = Infinity
        this.fullyExpanded = true
    }

    getPuctHeuristicForChild(i) {
        const explorationTerm = this.c * Math.sqrt(Math.log(this.expansions) / (this.children[i].expansions + 1))
        const policyTerm = this.d * this.policy[i]
        return explorationTerm + policyTerm
    }

    ensureChildren() {
        if (this.children === null) {
            const moves = this.GameClass.getPossibleMoves(this.position)
            const networkCallResults = this.networkFunc(moves)
            this.children = moves.map((move, index) => new HeuristicNode(move, this, this.GameClass,
                this.networkFunc, this.c, this.d, networkCallResults[index], this.verbose))
            this.expansions = 1
        }
    }

    toJson() {
        // This is meant for debugging purposes
        // Converting to json with JSON.parse will cause an error due to circular dependencies
        return {
            position: this.position,
            fullyExpanded: this.fullyExpanded,
            children: this.children === null ? null : this.children.map(child => child.toJson()),
            isMaximizing: this.isMaximizing,
            verbose: this.verbose,
            heuristic: this.heuristic,
            policy: this.policy,
            expansions: this.expansions
        }
    }
}