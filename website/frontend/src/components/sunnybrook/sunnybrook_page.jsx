import React, {Component} from "react"
import "../../styles/custom.scss"


export default class SunnybrookPage extends Component {
    state = {
        text: "Catheters all the way down"
    }

    render() {
        return (
            <React.Fragment>
                <h1>Sunnybrook Research Institute</h1>
                <p>{this.state.text}</p>
            </React.Fragment>
        )
    }
}
