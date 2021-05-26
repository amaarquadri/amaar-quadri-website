import React, {Component} from "react"
import "../../styles/custom.scss"

export default class Contact extends Component {
    state = {
        text: "Want to get in touch? Give me a call " +
            "or send me an email and I will get back to you as soon as possible!",
        phoneNumber: "+1 (647) 767-1796",
        email: "amaarquadri@gmail.com"
    }

    render() {
        return (
            <section className="page-section" id="contact">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2 className="mt-0">Let's Get In Touch!</h2>
                            <hr className="divider my-4"/>
                            <p className="text-muted mb-5">{this.state.text}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 ml-auto text-center mb-5 mb-lg-0">
                            <i className="fas fa-phone fa-3x mb-3 text-muted"/>
                            <div>{this.state.phoneNumber}</div>
                        </div>
                        <div className="col-lg-4 mr-auto text-center">
                            <i className="fas fa-envelope fa-3x mb-3 text-muted"/>
                            <a className="d-block" href={"mailto:" + this.state.email}>{this.state.email}</a>
                        </div>
                    </div>
                    <hr className="divider my-4"/>
                </div>
            </section>
        )
    }
}
