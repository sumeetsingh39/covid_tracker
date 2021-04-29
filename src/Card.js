import React, { Component } from 'react';
import './Card.css';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    handleClick = () =>{
        this.props.selectedCard(this.props.css);
    } 
    render() { 
        return ( 
            <div className={this.props.css+" card"} onClick={this.handleClick}>
                <h3>{this.props.title}</h3>
                <h2>{this.props.today}</h2>
                <div>Total: {this.props.total}</div>
            </div>
         );
    }
}
 
export default Card;