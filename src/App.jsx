import { useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { GameGrid } from "./GameGrid";

const useStyles = makeStyles({
  appRoot: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
  },
});

function App() {
  const styles = useStyles();

  function downHandler({ key }) {
    const theKey = key === " " ? "space" : key;
    window.keysPressed = { ...window.keysPressed, [theKey]: true };
  }
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, []);

  return (
    <div className={styles.appRoot}>
      <GameGrid />
    </div>
  );
}

export default App;
