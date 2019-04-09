import React, { Component } from 'react'

export default class Grid extends Component {
  
    gridWidth() {
        return this.props.sizeMultiplier * this.props.cellSize * this.props.gridWidth + 'px';
    }

    gridHeight() {
        return this.props.sizeMultiplier * this.props.cellSize * this.props.gridHeight + 'px';
    }

    mainHeight() {
        return this.props.sizeMultiplier * this.props.cellSize * this.props.gridHeight + 50 + 'px';
    }

    render() {
        return (

            // <div className="mainContainer" style={{
            //     position: 'relative',
            //     margin: "0 auto",
            //     width: this.gridWidth(),
            //     height: this.mainHeight(),
            // }}>
                

                <div blockcount={this.props.blockCount} className="gridContainer" style={
                    {
                        position: 'relative',
                        width: this.gridWidth(),
                        height: this.gridHeight(),
                    }
                }>
                    <div className="blockContainer">
                        { this.props.block }

                        {
                            this.props.grid.map((row, rowIndex) => (
                                <div key={rowIndex}>
                                    {
                                        row.map((col, colIndex) => (
                                            <div key={rowIndex+"_"+colIndex} className="cellContainer" style={{
                                                width: this.props.sizeMultiplier * this.props.cellSize + 'px',
                                                height: this.props.sizeMultiplier * this.props.cellSize + 'px',
                                                backgroundColor: col.color,
                                                //backgroundColor: 'rgba(169, 241, 255, 1.0)',
                                                opacity: col.filled? 1.0 : 0.4,
                                            }}></div>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>

                </div>
            // </div>
        
        )
    }
}