import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"

export default class About extends Component {
    render() {
        return (
            <section className="page-section bg-primary" id="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2 className="text-white mt-0">Your next intern!</h2>
                            <hr className="divider light my-4"/>
                            <p className="text-white-50 mb-4">I'm a Mechanical Engineering student at the University of
                                Waterloo. I'm experienced with SolidWorks (CSWP), Finite Element Analysis, and GD&T. I
                                also have extensive programming experience in various languages including Python, Java,
                                and C++. I have a passion for using all of my skills for designing mechanical devices
                                from the ground up! </p>
                            <a className="btn btn-light btn-xl js-scroll-trigger"
                               href="/static/Resume.pdf">My Resume</a>
                            <hr className="divider my-4"/>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
