import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css"

export default class Square extends Component {
    static PREFIX = '/static/'

    render() {
        return (
            <img className="img-fluid" onClick={this.props.onClick} src={this.getImgSrc()} alt=''/>
        )
    }

    getImgSrc() {
        const data = this.props.squareData
        if (data.p1Piece) {
            return Square.PREFIX +
                (data.highlight? 'yellow_circle_dark_square_highlighted.png' : 'yellow_circle_dark_square.png')
        }
        else if (data.p2Piece) {
            return Square.PREFIX +
                (data.highlight? 'red_circle_dark_square_highlighted.png' : 'red_circle_dark_square.png')
        }
        else {
            return Square.PREFIX + 'dark_square.png'
        }
    }
}
