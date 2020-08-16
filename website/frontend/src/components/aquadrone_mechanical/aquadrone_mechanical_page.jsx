import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"


export default class AquadroneMechanicalPage extends Component {
    state = {
        text: "Here's some data lol"
    }

    render() {
        return (
            <React.Fragment>
                <h1>Aquadrone Mechanical</h1>
                <p>{this.state.text}</p>
            </React.Fragment>
        )
    }
}
