import React, { Component } from "react"

import Button from './Button'

import Logo from './Logo'

import { Colors } from './Colors';

export default class Replay extends Component {
  render() {
    return (
      <div
        style={{
          position: "absolute",
          zIndex: 100,
          width: "100%",
          height: "100%",
          cursor: "pointer",
          color: Colors.Light,
          fontSize: "20px",
          lineHeight: "20px",
          backgroundColor: Colors.Dark,
          padding: '10px',
          marginLeft: "-10px",
          marginTop: "-10px",
        }}
      >

        <Logo/>

        <div style={{
            fontSize: "30px",
            lineHeight: "30px",
            marginTop: '20px',
        }}>
          GAME
          <br />
          OVER
        </div>

        <div
          className="pointsContainer"
          style={{
            width: "100%",
            //height: "50px",
            //opacity: 0.7,
            color: Colors.Light,
            fontSize: "20px",
            lineHeight: "20px",
            marginTop: '20px',
          }}
        >
          points
          <br />
          {this.props.points}
          <br />
          level
          <br />
          {this.props.level}
        </div>

        <Button text="replay" textOver="REPLAY" onClick={this.props.onStartClick}/>

        {/* <div
          style={{
            marginTop: "20px",
            backgroundColor: "#26435F"
          }}
          onClick={this.props.onStartClick}
        >
          REPLAY
        </div> */}
      </div>
    );
  }
}
