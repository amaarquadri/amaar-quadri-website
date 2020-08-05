import React, {Component} from "react"
import "bootstrap/dist/css/bootstrap.min.css"

export default class Card extends Component {
    render() {
        return (
            <div className='card mb-4'>
                <img className='card-img-top' src={this.props.imgSrc}/>

                <div className='card-body'>
                    <h4 className='card-title'>{this.props.title}</h4>
                    <p className='card-text'>{this.props.content}</p>
                    <a className='btn btn-primary' href={this.props.link}>Learn More</a>
                </div>
            </div>
        )
    }
}
