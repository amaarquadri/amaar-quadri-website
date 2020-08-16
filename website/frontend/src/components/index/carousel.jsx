import React, {Component} from "react"
import "../../styles/custom.scss"
import Card from "./card.jsx";

export default class Carousel extends Component {
    render() {
        return (
            <div className="container" id={this.props.id}>
                <h2 className="text-center mt-0">{this.props.title}</h2>
                <div className="card-deck">
                    {this.props.cards.map(card => <Card {...card}/>)}
                </div>
            </div>
        )
    }
}
