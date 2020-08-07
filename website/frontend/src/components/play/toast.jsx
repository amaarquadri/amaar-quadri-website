import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"


export default class Toast extends Component {
    // componentDidMount() {
    //     setTimeout(() => {
    //         document.getElementById("toastDismissButton").click()
    //     }, 5000)
    // }

    render() {
        return (
            <div className="toast">
                <div className="toast-header">
                    <strong className="mr-auto text-primary">{this.props.message}</strong>
                    <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" id="toastDismissButton">&times;</button>
                </div>
            </div>
        )
    }
}
