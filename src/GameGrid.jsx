import { useEffect, useState } from "react";

import { consoleBranding } from "./console";
import {
  GAME_TILES_WIDE,
  GAME_TILES_TALL,
  GAME_START_FRAME_SPEED,
  SNAKE_START_LENGTH,
} from "./constants";
import { Cell } from "./Cell";
import { useInterval } from "./useInterval";
import { useStyles } from "./GameGrid.styles";
import Confetti from "react-confetti";
import axios from "axios";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getTile = (name) => {
  return `tiles/${name}.png`;
};

const willEatApple = (cells, newX, newY) => {
  return cells.reduce((acc, cell) => {
    if (cell.x === newX && cell.y === newY && cell.isApple) acc = true;
    return acc;
  }, false);
};

const getCellsWithNewApple = (cells) => {
  const availableCells = cells.filter((cell) => cell.snakeSegment === 0);
  const newAppleCellIndex = getRandomInt(0, availableCells.length);
  const newAppleCell = availableCells[newAppleCellIndex];
  return cells.map((cell) => {
    if (cell.x === newAppleCell.x && cell.y === newAppleCell.y) {
      return { ...cell, isApple: true, img: getTile("apple") };
    }
    return {
      ...cell,
      isApple: false,
      img: cell.img === getTile("apple") ? "" : cell.img,
    };
  });
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

const getNewBodyImage = (enterDirection, exitDirection) => {
  if (enterDirection === "up" && exitDirection === "right")
    return getTile("cornerbr");
  if (enterDirection === "down" && exitDirection === "right")
    return getTile("cornertr");
  if (enterDirection === "up" && exitDirection === "left")
    return getTile("cornerbl");
  if (enterDirection === "down" && exitDirection === "left")
    return getTile("cornertl");
  if (enterDirection === "up" && exitDirection === "up")
    return getTile("vertical");
  if (enterDirection === "down" && exitDirection === "down")
    return getTile("vertical");

  if (enterDirection === "left" && exitDirection === "up")
    return getTile("cornertr");
  if (enterDirection === "right" && exitDirection === "up")
    return getTile("cornertl");
  if (enterDirection === "left" && exitDirection === "down")
    return getTile("cornerbr");
  if (enterDirection === "right" && exitDirection === "down")
    return getTile("cornerbl");
  if (enterDirection === "left" && exitDirection === "left")
    return getTile("horizontal");
  if (enterDirection === "right" && exitDirection === "right")
    return getTile("horizontal");
};

const moveSnake = (cells, newX, newY, direction, snakeLength) => {
  return cells.map((cell) => {
    const isNewHead = cell.x === newX && cell.y === newY;
    const wasHead = cell.snakeSegment === 1;
    let newSnakeSegment = isNewHead
      ? 1
      : cell.snakeSegment === 0
      ? 0
      : cell.snakeSegment + 1;
    if (newSnakeSegment > snakeLength) newSnakeSegment = 0;
    const isTail = newSnakeSegment === snakeLength;
    return {
      ...cell,
      enterDirection: isNewHead ? direction : cell.enterDirection,
      exitDirection: wasHead ? direction : cell.exitDirection,
      snakeSegment: newSnakeSegment,
      img: wasHead
        ? getNewBodyImage(cell.enterDirection, direction)
        : isNewHead
        ? getTile(`head${direction}`)
        : isTail
        ? getTile(`tail${cell.exitDirection}`)
        : cell.isApple
        ? getTile("apple")
        : newSnakeSegment === 0
        ? ""
        : cell.img,
    };
  });
};

let cellsStructure = [];
for (let x = 1; x <= GAME_TILES_WIDE; x++) {
  for (let y = 1; y <= GAME_TILES_TALL; y++) {
    let img = "";
    let snakeSegment = 0;
    for (let i = 0; i < SNAKE_START_LENGTH; i++) {
      if (
        x === Math.round(GAME_TILES_WIDE / 2) - i &&
        y === Math.round(GAME_TILES_TALL / 2)
      ) {
        img = getTile("horizontal");
        if (i === SNAKE_START_LENGTH - 1) img = getTile(`tailright`);
        if (i === 0) img = getTile("headright");
        snakeSegment = i + 1;
      }
    }
    cellsStructure.push({
      x,
      y,
      img,
      snakeSegment,
      enterDirection: "right",
      exitDirection: "right",
      isApple: false,
    });
  }
}
const initialCells = getCellsWithNewApple(cellsStructure);

const keysDefault = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
  space: false,
};

export const GameGrid = () => {
  const styles = useStyles();
  const [cells, setCells] = useState(initialCells);
  const [gameRunning, setGameRunning] = useState(true);
  const [isGamePaused, setGamePaused] = useState(false);
  const [snakeCrashed, setSnakeCrashed] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreCount, setScoreCount] = useState(0);
  const [snakeLength, setSnakeLength] = useState(SNAKE_START_LENGTH);
  const [snakeDirection, setSnakeDirection] = useState("right");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [yourName, setYourName] = useState("");
  const [snakePos, setSnakePos] = useState({
    x: Math.round(GAME_TILES_WIDE / 2),
    y: Math.round(GAME_TILES_TALL / 2),
  });
  const [frameDuration, setFrameDuration] = useState(GAME_START_FRAME_SPEED);

  const highScores = window.highScores || {
    first: {
      name: "Dev Mode",
      score: 100,
    },
    second: {
      name: "Dev Mode",
      score: 100,
    },
    third: {
      name: "Dev Mode",
      score: 50,
    },
  };
  const pageVisits = window.pageVisits || "dev mode";

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
      alert("snake crashed!");
      setGameRunning(false);
      setSnakeCrashed(true);
    } else {
      setSnakePos({ x: newX, y: newY });
      setSnakeDirection(direction);
      let newCells = moveSnake(cells, newX, newY, direction, snakeLength);
      if (willEatApple(cells, newX, newY)) {
        setScore(score + 5);
        if (scoreCount > 4) {
          setScoreCount(0);
          if (frameDuration > 100) {
            setFrameDuration(frameDuration - 25);
          }
        } else {
          setScoreCount(scoreCount + 1);
        }
        setSnakeLength(snakeLength + 1);
        newCells = getCellsWithNewApple(newCells);
      }
      setCells(newCells);
    }
  };

  useInterval(frame, gameRunning ? frameDuration : null);

  useEffect(() => {
    consoleBranding();
  }, []);

  const place = () => {
    let place = "none";
    if (score >= highScores.third.score) place = "third";
    if (score >= highScores.second.score) place = "second";
    if (score >= highScores.first.score) place = "first";
    return place;
  };

  const setName = (e) => {
    setYourName(e.target.value.replace(/[^a-z]/gi, ""));
  };

  const saveName = async () => {
    setFormSubmitted(true);
    const data = { newScore: score, name: yourName };
    const responseJson = await axios({
      method: "POST",
      url: "https://noobs.wtf/snake/highScores.php",
      data,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    console.log("response", responseJson);
  };

  return (
    <>
      <div className={styles.header} style={{ color: "white" }}>
        {snakeCrashed && place() !== "none" && <Confetti />}
        {highScores && (
          <div className={styles.highScoresContainer}>
            <h3>High Scores</h3>
            <p>
              1st: {highScores.first.name}, {highScores.first.score}
            </p>
            <p>
              2nd: {highScores.second.name}, {highScores.second.score}
            </p>
            <p>
              3rd: {highScores.third.name}, {highScores.third.score}
            </p>
            <p className={styles.pageVisits}>Page visits: {pageVisits}</p>
          </div>
        )}
        <img className={styles.gameTitleImg} src="logo.png" alt="SNAKE" />
        <p className={styles.controlsText}>
          <span className={styles.controls}>
            [<span className={styles.controlsButtons}>SPACE</span>] Pause [
            <span className={styles.controlsButtons}>↑↓←→</span>] Move Snake [
            <span className={styles.controlsButtons}>CTRL+R</span>] Restart Game
          </span>
        </p>
        <h3 className={styles.gameStatus}>
          {!isGamePaused && !snakeCrashed && `Points: ${score}`}
          {!snakeCrashed && isGamePaused && "PAUSED"}
        </h3>
      </div>
      <div className={styles.gameContainerWrapper}>
        <div
          className={styles.gameContainer}
          style={{
            backgroundColor: snakeCrashed ? "orange" : "green",
          }}
        >
          {snakeCrashed && (
            <div className={styles.endGameModalContainer}>
              <div className={styles.endGameModal}>
                <h3 className={styles.gameStatus}>
                  GAME OVER! Your score was: {score}
                </h3>
                {place() !== "none" && (
                  <div>
                    <h3 className={styles.congratulations}>Congratulations!</h3>
                    <p>You've taken {place()} place on the wall of fame!</p>
                  </div>
                )}
                {place() === "none" && (
                  <div>
                    <h3>Wall of Fame</h3>
                    <p>
                      1st: {highScores.first.name} {highScores.first.score}
                    </p>
                    <p>
                      2nd: {highScores.second.name} {highScores.second.score}
                    </p>
                    <p>
                      3rd: {highScores.third.name} {highScores.third.score}
                    </p>
                  </div>
                )}
                {place() !== "none" && !formSubmitted && (
                  <>
                    <input
                      onChange={setName}
                      value={yourName}
                      placeholder="your name"
                    ></input>
                    <button onClick={saveName}>Submit</button>
                  </>
                )}
                {formSubmitted && <p>Saved!</p>}
              </div>
            </div>
          )}
          {cells.map((cell) => {
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
      </div>
    </>
  );
};
