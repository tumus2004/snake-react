import { makeStyles } from "@material-ui/core";
import { GAME_TILES_WIDE, GAME_TILES_TALL } from "./constants";

const useStyles = makeStyles({
  cell: {
    position: "relative",
    width: `${100 / GAME_TILES_WIDE}%`,
    height: `${100 / GAME_TILES_TALL}%`,
  },
});

export const Cell = ({ x, y, imageUrl }) => {
  const styles = useStyles();

  return (
    <div
      style={{
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
