import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import Navbar from "./navbar.jsx"
import About from "./about.jsx"
import Mechanical from "./mechanical.jsx";
import Software from "./software.jsx"
import Contact from "./contact.jsx";


export default class IndexPage extends Component {
    scrollToAbout() {

    }

    scrollToMechanical() {

    }

    scrollToSoftware() {

    }

    scrollToContact() {

    }

    render() {
        return (
            <React.Fragment>
                <Navbar onScrollToAbout={this.scrollToAbout} onScrollToMechanical={this.scrollToMechanical}
                        onScrollToSoftware={this.scrollToSoftware} onScrollToContact={this.scrollToContact}/>
                <About/>
                <Mechanical/>
                <Software/>
                <Contact/>
            </React.Fragment>
        )
    }
}
