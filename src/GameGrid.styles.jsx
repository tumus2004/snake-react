import { makeStyles } from "@material-ui/core";
export const useStyles = makeStyles({
  endGameModalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 4,
  },
  endGameModal: {
    position: "absolute",
    width: "50%",
    height: "50%",
    top: "25%",
    left: "25%",
    backgroundColor: "rgba(0,0,0,0.8)",
    textAlign: "center",
    color: "white",
    boxSizing: "border-box",
    padding: ".5rem",
  },
  highScoresContainer: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    textAlign: "right",
    paddingRight: "1rem",
    "& h3": {
      margin: ".5rem",
    },
    "& p": {
      margin: 0,
    },
    display: "block",
    "@media screen and (max-width: 820px)": {
      fontSize: ".4rem",
    },
  },
  pageVisits: {
    color: "grey",
    fontSize: ".8rem",
    margin: ".5rem !important",
    "@media screen and (max-width: 820px)": {
      fontSize: ".4rem",
    },
  },
  gameTitleImg: {
    height: "70%",
  },
  header: {
    position: "relative",
    padding: "1rem",
    width: "100%",
    height: "20vmin",
    boxSizing: "border-box",
    textAlign: "center",
  },
  controlsText: {
    margin: 0,
    marginBottom: "2%",
  },
  gameContainerWrapper: {
    margin: "auto",
    padding: "1rem",
    boxSizing: "border-box",
    width: `80vmin`,
    height: `80vmin`,
  },
  gameContainer: {
    width: "100%",
    height: "100%",
    color: "black",
    backgroundColor: "white",
    position: "relative",
    "& > :nth-child(even)": {
      background: "rgba(0,0,0,0.1)",
    },
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  controls: {
    fontWeight: "bold",
  },
  controlsButtons: {
    color: "#eb34d8",
  },
  gameStatus: {
    margin: 0,
  },
  congratulations: {
    backgroundImage:
      "linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet, red)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "$rainbow-animation 35s linear infinite",
  },
  "@keyframes rainbow-animation": {
    to: {
      backgroundPosition: "450vh",
    },
  },
});
