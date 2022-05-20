import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { consoleBranding } from "./console";
import {
  GAME_CONTAINER_WIDTH,
  GAME_CONTAINER_HEIGHT,
  GAME_TILES_WIDE,
  GAME_TILES_TALL,
  GAME_START_FRAME_SPEED,
} from "./constants";
import { Cell } from "./Cell";
import { useInterval } from "./useInterval";

const useStyles = makeStyles({
  gameContainer: {
    color: "black",
    backgroundColor: "black",
    width: `${GAME_CONTAINER_WIDTH}px`,
    height: `${GAME_CONTAINER_HEIGHT}px`,
    position: "relative",
    border: "1px solid white",
  },
});

const getTile = (name) => {
  return `tiles/${name}.png`;
};

const getPreviousDirection = (imgPath) => {
  if (imgPath === getTile("headup")) return "up";
  if (imgPath === getTile("headdown")) return "down";
  if (imgPath === getTile("headleft")) return "left";
  if (imgPath === getTile("headright")) return "right";
};

const canSnakeMove = (cells, newX, newY) => {
  const targetCell = cells.find((cell) => cell.x === newX && cell.y === newY);
  if (!targetCell) return;
  return (
    targetCell.snakeSegment === 0 &&
    newX < GAME_TILES_WIDE + 1 &&
    newX > 0 &&
    newY < GAME_TILES_TALL + 1 &&
    newY > 0
  );
};

const getNewBodyImage = (previousDirection, direction) => {
  if (previousDirection === "up" && direction === "right")
    return getTile("cornerBR");
  if (previousDirection === "down" && direction === "right")
    return getTile("cornerTR");
  if (previousDirection === "up" && direction === "left")
    return getTile("cornerBL");
  if (previousDirection === "down" && direction === "left")
    return getTile("cornerTL");
  if (previousDirection === "up" && direction === "up")
    return getTile("vertical");
  if (previousDirection === "down" && direction === "down")
    return getTile("vertical");

  if (previousDirection === "left" && direction === "up")
    return getTile("cornerTR");
  if (previousDirection === "right" && direction === "up")
    return getTile("cornerTL");
  if (previousDirection === "left" && direction === "down")
    return getTile("cornerBR");
  if (previousDirection === "right" && direction === "down")
    return getTile("cornerBL");
  if (previousDirection === "left" && direction === "left")
    return getTile("horizontal");
  if (previousDirection === "right" && direction === "right")
    return getTile("horizontal");
};

const moveSnake = (cells, newX, newY, direction, snakeLength) => {
  return cells.map((cell) => {
    const isNewHead = cell.x === newX && cell.y === newY;
    const wasOldHead = cell.img.includes("head");
    return {
      ...cell,
      snakeSegment: isNewHead
        ? 1
        : cell.snakeSegment === 0
        ? 0
        : cell.snakeSegment + 1 > snakeLength
        ? 0
        : cell.snakeSegment + 1,
      img: wasOldHead
        ? getNewBodyImage(getPreviousDirection(cell.img), direction)
        : isNewHead
        ? getTile(`head${direction}`)
        : cell.img,
    };
  });
};

let cellsStructure = [];
for (let x = 1; x <= GAME_TILES_WIDE; x++) {
  for (let y = 1; y <= GAME_TILES_TALL; y++) {
    let img = "";
    if (x === GAME_TILES_WIDE / 2 && y === GAME_TILES_TALL / 2)
      img = getTile("headright");
    cellsStructure.push({ x, y, img, snakeSegment: 0 });
  }
}

const keysDefault = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  space: false,
};

export const GameGrid = () => {
  const styles = useStyles();
  const [cells, setCells] = useState(cellsStructure);
  const [gameRunning, setGameRunning] = useState(true);
  const [isGamePaused, setGamePaused] = useState(false);
  const [snakeLength, setSnakeLength] = useState(3);
  const [snakeDirection, setSnakeDirection] = useState("right");
  const [snakePos, setSnakePos] = useState({
    x: GAME_TILES_WIDE / 2,
    y: GAME_TILES_TALL / 2,
  });
  const [frameDuration, setFrameDuration] = useState(GAME_START_FRAME_SPEED);

  const frame = () => {
    if (!gameRunning) return;
    const keyStates = window.keysPressed;
    const { ArrowUp, ArrowDown, ArrowRight, ArrowLeft, space } =
      keyStates || keysDefault;
    window.keysPressed = keysDefault;
    if (space) setGamePaused(!isGamePaused);
    if (isGamePaused) return;

    let direction = snakeDirection;
    if (ArrowRight && snakeDirection !== "left") direction = "right";
    if (ArrowUp && snakeDirection !== "down") direction = "up";
    if (ArrowLeft && snakeDirection !== "right") direction = "left";
    if (ArrowDown && snakeDirection !== "up") direction = "down";

    const { x, y } = snakePos;
    const newX =
      direction === "left" ? x - 1 : direction === "right" ? x + 1 : x;
    const newY = direction === "up" ? y - 1 : direction === "down" ? y + 1 : y;

    if (!cells.length) return;

    if (!canSnakeMove(cells, newX, newY)) {
      console.log("snake crashed!");
      setGameRunning(false);
    } else {
      console.log("pos was", snakePos, "now", newX, newY);
      setSnakePos({ x: newX, y: newY });
      setSnakeDirection(direction);
      const newCells = moveSnake(cells, newX, newY, direction);
      setCells(newCells);
    }
  };

  useInterval(frame, gameRunning ? frameDuration : null);

  useEffect(() => {
    //consoleBranding();
  }, []);

  return (
    <>
      <div>
        Snake Pos{snakePos.x} {snakePos.y} Snake Dir {snakeDirection}
      </div>
      <div className={styles.gameContainer}>
        {cells.map((cell) => {
          if (cell.img !== "") console.log("cell", cell);
          return (
            <Cell
              key={`${cell.x},${cell.y}`}
              x={cell.x}
              y={cell.y}
              imageUrl={cell.img}
            />
          );
        })}
      </div>
    </>
  );
};
