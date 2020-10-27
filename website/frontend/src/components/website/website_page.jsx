import React, {Component} from "react"
import "../../styles/custom.scss"


export default class WebsitePage extends Component {
    state = {
        text: "React to this"
    }

    render() {
        return (
            <React.Fragment>
                <h1>Personal Website Development</h1>
                <p>{this.state.text}</p>
            </React.Fragment>
        )
    }
}
