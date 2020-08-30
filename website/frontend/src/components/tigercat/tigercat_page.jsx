import React, {Component} from "react"
import "../../styles/custom.scss"


export default class TigercatPage extends Component {
    state = {
        text: "We mulching all day"
    }

    render() {
        return (
            <React.Fragment>
                <h1>Tigercat</h1>
                <p>{this.state.text}</p>
            </React.Fragment>
        )
    }
}
