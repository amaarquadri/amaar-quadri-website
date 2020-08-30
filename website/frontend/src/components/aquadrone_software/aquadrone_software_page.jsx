import React, {Component} from "react"
import "../../styles/custom.scss"


export default class AquadroneSoftwarePage extends Component {
    state = {
        text: "EKFs and shit"
    }

    render() {
        return (
            <React.Fragment>
                <h1>Aquadrone Software</h1>
                <p>{this.state.text}</p>
            </React.Fragment>
        )
    }
}
