import React, { Component } from "react";

//import { BlockTypes } from "./BlockTypes";
import { BlockMatrix, BlockRotationMatrix } from "./BlockMatrix"

export default class Block extends Component {
  interval = null;
  //delay = 1000;
  time = -3;
  color = "#A9F0FF";
  width = 1;
  stopped = false;

  constructor(props) {
    super(props);

    this.state = {
      // Block matrix
      matrix: BlockMatrix[props.type],
      // What points should not collide, when rotating
      collisionRotationMatrix: BlockRotationMatrix[props.type],
      // rotation index
      rotationIndex: 0,
      // position of the matrix (left top), in units (not px)
      pos: {
        x: 0,
        y: 0
      },
      // position of the matrix relative to the grid
      gridPos: {
        x: 0,
        y: 0
      },
      // position of each cell relative to the grid (inside the grid)
      gridMatrix: {
        x: 0,
        y: 0
      }
    };
    
    this.calculateWidth();

    this.state.gridPos = {
      x: Math.ceil(this.props.gridWidth / 2 - this.width / 2),
      y: this.time
    };
    this.state.pos = {
      x: this.state.gridPos.x * this.props.cellSize * this.props.sizeMultiplier,
      y: this.state.gridPos.y * this.props.cellSize * this.props.sizeMultiplier
    };
  }

  componentDidMount() {
    if (!this.interval) {
      this.interval = setInterval(this.tick.bind(this), this.props.delay);
    }

    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    window.removeEventListener("keydown", this.onKeyDown.bind(this));
  }

  increaseSpeed() {

  }

  // calculate width, scanning the whole matrix
  calculateWidth(m = null) {
    // matrix optional
    if(m === null) m = this.state.matrix;
    let sum = 0;
    if(m) {
      const reduced = new Array(m[0].length);
      m.forEach(e => {
        if(0 in e) reduced[0] = reduced[0] ? reduced[0] : e[0];
        if(1 in e) reduced[1] = reduced[1] ? reduced[1] : e[1];
        if(2 in e) reduced[2] = reduced[2] ? reduced[2] : e[2];
        if(3 in e) reduced[3] = reduced[3] ? reduced[3] : e[3];
      });
      sum = reduced.reduce((pv, cv) => pv + cv, 0);
      this.width = sum;
    }
  }

  calculateGridMatrix(input = null) {
    if(input === null) {
      input = this.state.matrix;
    }
    // calculating grid positions
    let m = input.map((v, _y) => {
      return v.map((vv,_x) => {
        return {
          filled: vv ? true : false,
          color: this.color,
          x: this.state.gridPos.x + _x,
          y: this.state.gridPos.y + _y
        }
      });
    });
    // flatten
    m = m.flat();
    return m;
  }

  updateGridMatrix() {
    const m = this.calculateGridMatrix();
    this.setState({
      gridMatrix: m
    });
    return m;
  }

  core_collision(dir, gridMatrix = null) {

    if(gridMatrix === null) {
      gridMatrix = this.updateGridMatrix();
    }

    return this.props.core.collision(
      dir,
      gridMatrix
    );
  }

  core_blockLifeEnd() {

    const gridMatrix = this.updateGridMatrix();
    this.props.core.blockLifeEnd(gridMatrix);
  }

  tick() {
    const collision = this.core_collision("down");
    if (collision) {
      this.stop();
    } else {
      this.time++;
      this.moveDown();
    }
  }

  stop() {
    //console.log("Block :: stop()");
    this.stopped = true;
    clearInterval(this.interval);
    this.core_blockLifeEnd();
  }

  onKeyDown(event) {
    if (!this.stopped && this.state.gridPos.y >= 0) {
      switch (event.key) {
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowRight":
          this.moveRight();
          break;
        case "ArrowDown":
          this.moveDown();
          break;
        case "ArrowUp":
          this.rotate();
          break;
        default:
          break;
      }
    }
  }

  moveLeft() {
    //console.log("moveLeft");
    const collision = this.core_collision("left");
    if (!collision) {
      this.move(true);
    }
  }

  moveRight() {
    //console.log("moveRight");
    const collision = this.core_collision("right");
    if (!collision) {
      this.move(false);
    }
  }

  move(left) {
    //console.log("move()", left ? "Left" : "Right");
    let gridX = left ? this.state.gridPos.x - 1 : this.state.gridPos.x + 1;
    let gridY = this.state.gridPos.y;
    this.setState(
      {
        gridPos: {
          x: gridX,
          y: gridY
        },
        pos: {
          x: gridX * this.props.cellSize * this.props.sizeMultiplier,
          y: this.state.pos.y
        }
      }
    );
  }

  moveDown() {
    const collision = this.core_collision("down");
    //console.log("Collision down", collision)
    if (collision) {
      this.stop();
    } else {
      //console.log("moveDown");
      let gridX = this.state.gridPos.x;
      let gridY = this.state.gridPos.y + 1;
      this.setState(
        {
          gridPos: {
            x: gridX,
            y: gridY
          },
          pos: {
            x: gridX * this.props.cellSize * this.props.sizeMultiplier,
            y: gridY * this.props.cellSize * this.props.sizeMultiplier
          }
        }
      );
    }
  }

  rotate() {
    //console.log("rotate");

    const collisionMatrix = this.state.collisionRotationMatrix[this.state.rotationIndex];
    const gridCollisionMatrix = this.calculateGridMatrix(collisionMatrix);

    if(!this.core_collision('rotate', gridCollisionMatrix))
    {
      //console.log("rotate: no collision, collisionMatrix/gridCollisionMatrix", collisionMatrix, gridCollisionMatrix);

      let matrix = JSON.parse(JSON.stringify(this.state.matrix));
      matrix = rotateMatrix(matrix);
      const gridMatrix = this.calculateGridMatrix(matrix);

      const rotationIndex = this.state.rotationIndex + 1 > 3 ? 0 : this.state.rotationIndex + 1;
      this.setState(
        {
          matrix: matrix,
          gridMatrix: gridMatrix,
          rotationIndex: rotationIndex
        }
      );

      this.calculateWidth(matrix);

      // border kicking
      if (this.state.gridPos.x + this.width > this.props.gridWidth) {
        this.move(true);
      }
      if (this.state.gridPos.x < 0) {
        this.move(false);
      }

    }

  }


  render() {
    return (
      <div
        className="IBlock"
        style={{
          //border: 'solid 1px black',
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translateX(${this.state.pos.x}px) translateY(${
            this.state.pos.y
          }px)`,
          transition: "transform .05s linear"
        }}
      >
        {draw(this.state.matrix, this.props, this.color)}
      </div>
    );
  }
}

function draw(matrix, props, color) {
  return (
    <>
      {matrix.map((v, i) => {
        return (
          <div key={props.id + "_" + i}>
            {v.map((vv, ii) => {
              return (
                <div
                  key={props.id + "_" + i + "_" + ii}
                  style={{
                    backgroundColor: vv ? "rgba(169, 241, 255, 1.0)" : "transparent",
                    float: "left",
                    width: props.cellSize * props.sizeMultiplier,
                    height: props.cellSize * props.sizeMultiplier,
                    opacity: 0.6
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

// https://codereview.stackexchange.com/questions/186805/rotate-an-n-%C3%97-n-matrix-90-degrees-clockwise
// User: Kruga
export function rotateMatrix(matrix) {
  let result = [];
  for (let i = 0; i < matrix[0].length; i++) {
    let row = matrix.map(e => e[i]).reverse();
    result.push(row);
  }
  return result;
}
