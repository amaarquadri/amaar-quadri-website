import React, {Component} from "react"
import "../../styles/custom.scss"

export default class About extends Component {
    render() {
        return (
            <section className="page-section bg-primary" id="about">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center">
                            <h2 className="text-white mt-0">Your next intern!</h2>
                            <hr className="divider light my-4"/>
                            <p className="text-black-50 mb-4"><b>I'm a Mechanical Engineering student at the University of
                                Waterloo. I'm experienced with SolidWorks (CSWE), Finite Element Analysis, and GD&T. I
                                also have extensive programming experience in various languages including Python, Java,
                                and C++. I have a passion for using all of my skills for designing mechanical devices
                                from the ground up!</b></p>
                            <a className="btn btn-light btn-xl js-scroll-trigger"
                               href={staticURL + "Mechanical_Engineering_Resume.pdf"}>Resume for Mechanical Positions</a>
                            &nbsp;&nbsp;&nbsp;
                            <a className="btn btn-light btn-xl js-scroll-trigger"
                               href={staticURL + "Software_Engineering_Resume.pdf"}>Resume for Software Positions</a>
                            <hr className="divider my-4"/>
                            <a className="btn btn-light btn-xl js-scroll-trigger"
                               href={staticURL + "Letters_of_Recommendation.pdf"}>Letters of Recommendation</a>
                            <hr className="divider my-4"/>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}
