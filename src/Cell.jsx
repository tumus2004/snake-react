import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { CELL_WIDTH, CELL_HEIGHT } from "./constants";

const useStyles = makeStyles({
  cell: {
    position: "absolute",
    width: `${CELL_WIDTH}px`,
    height: `${CELL_HEIGHT}px`,
  },
});

export const Cell = ({ x, y, imageUrl }) => {
  const styles = useStyles();
  const xPos = x * CELL_WIDTH - CELL_WIDTH;
  const yPos = y * CELL_HEIGHT - CELL_HEIGHT;

  return (
    <div
      style={{
        top: `${yPos}px`,
        left: `${xPos}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      id={`${x}-${y}`}
      className={styles.cell}
    ></div>
  );
};
