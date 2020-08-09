import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css"

export default class Square extends Component {
    // TODO: preload all possible images at start to prevent mid-game loading
    render() {
        return (
            <img className="img-fluid" onClick={this.props.onClick} src={staticURL + this.getImgSrc()} alt=''/>
        )
    }

    getImgSrc() {
        const data = this.props.squareData
        if (data.p1Piece) {
            return data.highlight? 'yellow_circle_dark_square_highlighted.png' : 'yellow_circle_dark_square.png'
        }
        else if (data.p2Piece) {
            return data.highlight? 'red_circle_dark_square_highlighted.png' : 'red_circle_dark_square.png'
        }
        else {
            return 'dark_square.png'
        }
    }
}
