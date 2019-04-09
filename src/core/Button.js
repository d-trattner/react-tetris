import React, {Component} from 'react'

import { Colors } from './Colors';

export default class Button extends Component {

    constructor(props) {
        super(props)
        this.state = {
            over: false
        }
    }

    render() {
        const {text, textOver, onClick} = this.props;
        return (
            <div style={{
                padding: this.state.over ? '20px' : '10px',
                margin: '10px',
                cursor: 'pointer',
                color: Colors.Dark,
                backgroundColor: Colors.Light,
                fontSize: "20px",
                lineHeight: "20px",
                transition: 'all 500ms',
            }} onClick={onClick} onMouseOver={()=>{this.setState({over:true})}} onMouseOut={()=>{this.setState({over:false})}}>
                {this.state.over?textOver:text}
            </div>
        )
    }
}
