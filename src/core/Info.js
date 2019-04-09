import React, { Component } from 'react'

import { BlockMatrix } from "../blocks/BlockMatrix";

import { Colors } from './Colors';

export default class Info extends Component {

    constructor(props) {
        super(props)
        this.state = {
            matrix: []
        }
    }

    componentDidUpdate() {
        //console.log("Info :: componentDidUpdate", this.props.nextBlockType)
        if(this.props.nextBlockType) {
            let matrix = BlockMatrix[this.props.nextBlockType];
            if(matrix !== this.state.matrix) {
                this.setState({
                    matrix: matrix
                })
            }
        }
    }

    render() {

        const { points, level } = this.props;

        return (
            <div
            className="infoContainer"
            style={{
            width: "100%",
            height: "50px",
            backgroundColor: Colors.Dark,
            opacity: 0.7,
            color: Colors.Light,
            fontSize: "20px",
            lineHeight: "20px"
            }}
        >

            <div style={{ // next block container
                position: 'absolute',
                width: '50px',
                height: '50px',
                backgroundColor: Colors.Light,
            }}>
                <div style={{ // center container
                    margin: "0",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>
                    {
                        this.state.matrix.map((row, rowIndex) => {
                            return (
                                <div key={rowIndex} style={{ // row
                                    width: `${row.length*5}px`,
                                    height: `5px`,
                                }}>
                                    {
                                        row.map((cell, cellIndex) => {
                                            return (
                                                <div key={cellIndex} style={{ // cell
                                                    width: `5px`,
                                                    height: `5px`,
                                                    backgroundColor: cell ? Colors.Dark : "transparent",
                                                    float: 'left',
                                                }}>
                                                
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>

            <div
                style={{
                clear: "both",
                marginLeft: '50px',
                }}
            >
                <div
                style={{
                    float: "left"
                }}
                >
                points
                </div>
                <div
                style={{
                    float: "right"
                }}
                >
                {points}
                </div>
            </div>
            <div
                style={{
                clear: "both",
                marginLeft: '50px',
                }}
            >
                <div
                style={{
                    float: "left"
                }}
                >
                level
                </div>
                <div
                style={{
                    float: "right"
                }}
                >
                {level}
                </div>
            </div>
            </div>
        
        )
    }
}
