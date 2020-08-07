import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"


export default class CommentBox extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this)
        this.checkDisableSubmit = this.checkDisableSubmit.bind(this)
    }

    checkDisableSubmit() {
        document.getElementById("submitButton").disabled =
            document.getElementById("commentBox").value === ""
    }

    submit() {
        const comment = document.getElementById("commentBox").value
        this.props.onSubmit(comment)
    }

    render() {
        return (
            <React.Fragment>
                <div className="row">
                    <label htmlFor="commentBox">How was the game?</label>
                    <input className="form-text" type="text" id="commentBox" onKeyUp={this.checkDisableSubmit}/>
                </div>
                <button className="btn btn-primary" onClick={this.submit} id="submitButton">Submit</button>
            </React.Fragment>
        )
    }
}
