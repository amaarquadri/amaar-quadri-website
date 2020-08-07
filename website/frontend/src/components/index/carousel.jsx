import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import Card from "./card.jsx";

export default class Carousel extends Component {
    render() {
        return (
            <div className="container">
                <h2 className="text-center mt-0">{this.props.title}</h2>
                <div className="card-deck">
                    {this.props.cards.map(card => <Card {...card}/>)}
                </div>
            </div>
        )
    }
}
