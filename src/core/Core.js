import React, { Component } from "react"

import Grid from "./Grid"
import Start from "./Start"
import Replay from "./Replay"
import Info from "./Info"

import Block from "../blocks/Block"
import { BagOfBlocks } from "../blocks/BlockTypes"

import Bg from "./Bg"

import { Colors } from './Colors'

import { Swipeable } from 'react-swipeable'
import Tappable from 'react-tappable';

export default class Core extends Component {

  defaultGridCellColor = Colors.Light;

  pointsPerRow = 1000;
  pointsPerRowMultiplier = 1.5;
  pointsFourRowsMultiplier = 2;

  blockStep = 0;

  bag = [];

  startSpeed = 1000;
  startTime = null;
  currentTime = null;

  swipeConfig = {
    delta: 10,                             // min distance(px) before a swipe starts
    preventDefaultTouchmoveEvent: true,   // preventDefault on touchmove, *See Details*
    trackTouch: true,                      // track touch input
    trackMouse: false,                     // track mouse input
    rotationAngle: 0,                      // set a rotation angle
  }

  constructor(props) {
    super(props);

    this.state = {
      animation: 'none',
      start: true,
      running: false,
      speed: 1000,
      level: 1,
      sizeMultiplier: 3,
      cellSize: 10,
      gridWidth: 10,
      gridHeight: 16,
      block: null,
      blockCount: -1,
      grid: [],
      points: 0,
      nextBlockType: null,
      log: []
    };

    for (let i = 0; i < this.state.gridHeight; i++) {
      this.state.grid[i] = [];
      for (let j = 0; j < this.state.gridWidth; j++) {
        this.state.grid[i][j] = {
          filled: false,
          color: this.defaultGridCellColor
        };
      }
    }

    this.blockRef = React.createRef();

  }

  log(msg) {
    // let l = this.state.log.slice(0);
    // l.push(msg);
    // this.setState({log:l});
  }

  swipeLeftHandler(eventData) {
    this.log("swipeLeftHandler")
    if(this.state.running && this.blockRef.current) this.blockRef.current.moveLeft();
  }

  swipeRightHandler(eventData) {
    this.log("swipeRightHandler")
    if(this.state.running && this.blockRef.current) this.blockRef.current.moveRight();
  }

  swipeDownHandler(eventData) {
    this.log("swipeDownHandler")
    if(this.state.running && this.blockRef.current) this.blockRef.current.moveDown();
  }

  swipeUpHandler(eventData) {
    this.log("swipeUpHandler")
    if(this.state.running && this.blockRef.current) this.blockRef.current.rotate();
  }

  tapHandler() {
    this.log("tapHandler")
    if(this.state.running && this.blockRef.current){
      this.blockRef.current.rotate();
    } else {
      this.gameStart();
    }
  }

  gameStart() {
    this.startTime = new Date();

    this.bag = BagOfBlocks();

    let grid = [];
    for (let i = 0; i < this.state.gridHeight; i++) {
      grid[i] = [];
      for (let j = 0; j < this.state.gridWidth; j++) {
        grid[i][j] = {
          filled: false,
          color: this.defaultGridCellColor
        };
      }
    }
    this.setState(
      {
        running: true,
        grid: grid,
        start: false,
        points: 0,
      },
      () => {
        this.addBlock();
      }
    );
  }

  gameEnd() {
    // Game Over
    //console.log("GAME OVER");
    this.setState(
      {
        running: false
      },
      () => {}
    );
  }

  addBlock() {
    let type, next;
    if (!this.bag.length) {
      this.bag = BagOfBlocks();
    }
    if(!this.state.nextBlockType) {
      type = this.bag.pop();
      next = this.bag.pop();
    } else {
      type = this.state.nextBlockType;
      next = this.bag.pop();
    }

    //const type = RandomBlockType();

    const block = (
      <Block
        id={this.state.blockCount}
        key={this.state.blockCount} // this is needed to reset the Block Element!!!
        ref={this.blockRef}
        core={this}
        type={type}
        delay={this.state.speed}
        sizeMultiplier={this.state.sizeMultiplier}
        cellSize={this.state.cellSize}
        gridWidth={this.state.gridWidth}
        gridHeight={this.state.gridHeight}
        onUpdateGrid={this.updateGrid.bind(this)}
        touchEvent={this.state.touchEvent}
      />
    );
    this.setState({
      block: block,
      blockCount: this.state.blockCount + 1,
      nextBlockType: next,
    });
    this.blockStep = 0;
  }

  blockLifeEnd(gridMatrix) {
    //console.log("Core :: blockLifeEnd()");
    this.updateGrid(gridMatrix);
    if (this.blockStep < 4) {
      this.gameEnd();
    } else {
      this.addBlock();
    }
  }

  collision(dir, gridMatrix) {
    let collision = false;

    if (this.state) {
      let g = JSON.parse(JSON.stringify(this.state.grid));
      let targetCell, tX, tY;

      gridMatrix.forEach(block => {
        if (block.filled) {
          tX = block.x;
          tY = block.y;
          if (dir === "left") {
            tX--;
            if (tX < 0) collision = true; // left bounds
          }
          if (dir === "right") {
            tX++;
            if (tX >= this.state.gridWidth) collision = true; // right bounds
          }
          if (dir === "down") {
            tY++;
            if (tY >= this.state.gridHeight) collision = true; // ground
          }

          if (!collision) {
            if (tY in g) {
              if (tX in g[tY]) {
                targetCell = g[tY][tX];
                if (targetCell.filled) collision = true;
              }
            }
          }
        }
      });
    }
    if(!collision) {
      this.animate(dir);
    }
    //console.log("Collision", collision, dir);
    this.blockStep = this.blockStep + 1;
    return collision;
  }

  animate(dir) {
    const duration = 250;
    const animation = `${dir} ${duration}ms ease-in`;
    this.setState({
      animation: animation
    },() => {
      setTimeout(() => {
        this.setState({
          animation: "none"
        });
      }, duration);
    });
  }

  updateGrid(gridMatrix) {
    //console.log("Core :: updateGrid");

    if (this.state) {
      let g = JSON.parse(JSON.stringify(this.state.grid));
      let targetCell;

      // update grid
      gridMatrix.forEach(block => {
        if (block.filled && block.x >= 0 && block.y >= 0) {
          targetCell = g[block.y][block.x];
          if (targetCell) {
            targetCell.filled = true;
            targetCell.color = block.color;
          }
        }
      });

      // full rows
      let pointsReceived = 0;
      let _g = JSON.parse(JSON.stringify(g));

      _g.forEach((row, index) => {
        // count filled cells
        let sum = 0;

        row.forEach(c => {
          sum += c.filled ? 1 : 0;
        });

        if (sum === this.state.gridWidth) {
          // remove row
          g.splice(index, 1);
          // add empty row on top
          let er = [];
          for (let j = 0; j < this.state.gridWidth; j++) {
            er.push({
              filled: false,
              color: this.defaultGridCellColor
            });
          }
          g.unshift(er);
          pointsReceived++;
        }
      });

      // points
      let points = this.state.points;
      if (pointsReceived === 4) {
        points =
          points +
          pointsReceived * this.pointsPerRow * this.pointsFourRowsMultiplier;
      } else if (pointsReceived > 1) {
        points =
          points +
          pointsReceived * this.pointsPerRow * this.pointsPerRowMultiplier;
      } else {
        points = points + pointsReceived * this.pointsPerRow;
      }

      // level and speed
      this.currentTime = new Date();
      this.minutes = new Date(this.currentTime - this.startTime).getMinutes();
      let level = this.minutes + 1;
      // 9 is already pretty hard, lets give more time on lvl 8
      if( this.minutes > 8 & this.minutes < 10) {
        this.minutes = 8;
      }
      let speed = this.startSpeed - (this.startSpeed * (level/10));
      
      //console.log(speed);

      // state
      this.setState({
        grid: g,
        points: points,
        speed: speed,
        level: level
      });
    }
  }

  render() {
    return (
      <Tappable onTap={this.tapHandler.bind(this)}>
        <Swipeable 
          onSwipedLeft={this.swipeLeftHandler.bind(this)}
          onSwipedRight={this.swipeRightHandler.bind(this)}
          onSwipedDown={this.swipeDownHandler.bind(this)}
          onSwipedUp={this.swipeUpHandler.bind(this)}
          {...this.swipeConfig}
        >
          <Bg/>

          <div
            className="rootContainer"
            style={{
              position: "relative",
              margin: "0 auto",
              width:
                this.state.sizeMultiplier *
                  this.state.cellSize *
                  this.state.gridWidth +
                "px",
              height:
                this.state.sizeMultiplier *
                  this.state.cellSize *
                  this.state.gridHeight +
                50 +
                "px",
              animation: this.state.animation
            }}
            { ...this.swipeHandlers }
          >
            {this.state.start ? (
              <Start
                onStartClick={() => {
                  this.gameStart();
                }}
              />
            ) : (
              ""
            )}

            {!this.state.start && !this.state.running ? (
              <Replay
                points={this.state.points}
                level={this.state.level}
                onStartClick={() => {
                  this.gameStart();
                }}
              />
            ) : (
              ""
            )}

            <Info points={this.state.points} level={this.state.level} nextBlockType={this.state.nextBlockType} />

            <Grid
              sizeMultiplier={this.state.sizeMultiplier}
              cellSize={this.state.cellSize}
              gridWidth={this.state.gridWidth}
              gridHeight={this.state.gridHeight}
              block={this.state.block}
              blockCount={this.state.blockCount}
              grid={this.state.grid}
              points={this.state.points}
            />
            <div style={{
              position: 'absolute',
              width: this.state.gridWidth * this.state.cellSize * this.state.sizeMultiplier + "px",
              //height: this.state.sizeMultiplier * this.state.cellSize * this.state.gridHeight + 'px',
              backgroundColor: Colors.Dark,
              color: Colors.Light,
              fontSize: '12px',
            }}>
              {this.state.log.map((item, index) => {
                return (
                  <div key={index}>{item}</div>
                );
              })}
            </div>
          </div>
        </Swipeable>
      </Tappable>
    );
  }
}
