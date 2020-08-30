import React, {Component} from "react"
import "../../styles/custom.scss"


export default class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentDidMount() {
        document.getElementById("submitButton").disabled = true
    }

    handleKeyPress(event) {
        const textBoxEmpty = document.getElementById("commentBox").value === "";
        document.getElementById("submitButton").disabled = textBoxEmpty

        // Check if Enter was pressed
        if (!textBoxEmpty && event.keyCode === 13) {
            this.submit()
        }
    }

    submit() {
        let name = document.getElementById("nameBox").value
        if (name === "") {
            name = "Anonymous"
        }
        const comment = document.getElementById("commentBox").value
        this.props.onSubmit(name, comment)
    }

    render() {
        return (
            <React.Fragment>
                <h4>How was the game?</h4>
                <div className="row">
                    <label htmlFor="nameBox">Name:</label>
                    <input className="form-text" type="text" id="nameBox" defaultValue="Anonymous"/>
                    <label htmlFor="commentBox">Comment:</label>
                    <input className="form-text" type="text" id="commentBox" onKeyUp={this.handleKeyPress}/>
                </div>
                <button className="btn btn-primary" onClick={this.submit} id="submitButton">Submit</button>
            </React.Fragment>
        )
    }
}
