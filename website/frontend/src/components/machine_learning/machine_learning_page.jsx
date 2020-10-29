import React, {Component} from "react"
import "../../styles/custom.scss"


export default class MachineLearningPage extends Component {
    state = {
        text: "Deepmind level shit"
    }

    render() {
        return (
            <React.Fragment>
                <h1>Machine Learning</h1>
                <p>{this.state.text}</p>
                <img src={staticURL + "training_process.png"} alt=""/>
            </React.Fragment>
        )
    }
}
