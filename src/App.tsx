import React, { useEffect, useState } from "react";
import "./App.css";
import Game, { GAME_STATE, IGameState, SCREENS } from "./Game";
import confetti, { shape } from "canvas-confetti";
import GameScreen from "./GameScreen";
import { IWordObject } from "./Word";
import Leaderboard from "./Leaderboard";
import MainScreen from "./MainScreen";
import Registration from "./Registration";

const PLAYER_OFFSET = 65;
const shootConfetti = (word: IWordObject) => {
  const myCanvas = document.getElementById(
    "fireworks"
  ) as HTMLCanvasElement | null;
  var myConfetti = myCanvas
    ? confetti.create(myCanvas, { resize: true })
    : confetti;
  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  const now = Date.now();
  const { pos, duration, timestamp } = word;
  const currentPos = duration - (now - timestamp);
  const progress = 1 - (duration - currentPos) / duration;

  if (myCanvas) {
    // from x: 10%, y: 100%
    const start = {
      x: pos / 100,
      y: 0,
    };
    // to x: 50%, y: 0% - PLAYER_OFFSET
    const end = {
      x: 0.5,
      y: (myCanvas.clientHeight - PLAYER_OFFSET) / myCanvas.clientHeight,
    };

    // word current position
    const lookPos = {
      x: start.x + (end.x - start.x) * (1 - progress),
      y: start.y + (end.y - start.y) * (1 - progress),
    };

    const look = {
      particleCount: 5 + Math.random() * 10,
      spread: 220,
      startVelocity: 10,
      ticks: 35,
      gravity: 0.5,
      colors: ["#ffffff"],
      shapes: ["square"] as shape[],
      origin: {
        x: lookPos.x,
        // since they fall down, start a bit higher than random
        y: lookPos.y,
      },
    };

    myConfetti(look);
  } else {
    const look = {
      particleCount: 10,
      spread: 220,
      startVelocity: 10,
      ticks: 40,
      gravity: 0.4,
      colors: ["#ffffff"],
      shapes: ["square"] as shape[],
      origin: {
        x: Math.random(),
        // since they fall down, start a bit higher than random
        y: Math.random() - 0.2,
      },
    };

    myConfetti(look);
  }
};

const FPS = 30;

const WORDS = Lib();

const DURATION_PRACTICE = 30 * 1000;
const DURATION = 2 * 60 * 1000; // minute
// const DURATION = 1000;

function App() {
  const [leaderboard, setLeaderboard] = useState<null | {
    id?: string;
    deadline?: string;
    score?: number;
  }>(null);
  const [duration, setDuration] = useState(DURATION);
  const [screen, setScreen] = useState<SCREENS>(SCREENS.MAIN);
  const handleScreenChange = (_screen: SCREENS) => setScreen(_screen);
  const [gameLoopId, setGameLoopId] = useState<NodeJS.Timeout | null>(null);
  const [tickId, setTickId] = useState(0);
  const [state, setState] = useState<IGameState | null>(null);
  let [game, setGame] = useState<any | null>(null);
  const handleKeyDown = React.useCallback(
    ({ key, code }: KeyboardEvent) => {
      const state = game?.getState().state;

      if (state === GAME_STATE.PLAY) {
        const word = game?.onKeydown({ key, code });
        if (word) {
          word.isKilled() && shootConfetti(word);
        } else {
          console.log("miss");
        }
      }
    },
    [game]
  );

  const handleLeaderboard = (props: {
    id?: string;
    score?: number;
    deadline?: string;
  }) => {
    setLeaderboard(props);
    document.removeEventListener("keydown", handleKeyDown);
    game = null;
    setScreen(SCREENS.LEADERBOARD);
  };

  useEffect(() => {
    if (screen === SCREENS.GAME) {
      if (localStorage.getItem("skip-registration")) {
        setDuration(DURATION_PRACTICE);
        setGame(Game({ WORDS, PLAYER_OFFSET, duration: DURATION_PRACTICE }));
      } else {
        setDuration(DURATION);
        setGame(Game({ WORDS, PLAYER_OFFSET, duration: DURATION }));
      }
    }
  }, [screen]);

  useEffect(() => {
    let interval: any;
    if (game) {
      document.addEventListener("keydown", handleKeyDown);
      const tick = () => {
        game.tick();
        setState(game.getState());
        setTickId(Date.now());
      };

      tick();
      interval = setInterval(tick, 1000 / FPS);
      setGameLoopId(interval);
    }

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [game]);

  useEffect(() => {
    if (state?.state === GAME_STATE.SCORE) {
      console.log("SCORE SCREEN");
      gameLoopId && clearInterval(gameLoopId);
      setGameLoopId(null);
    } else if (state?.state === GAME_STATE.PLAY) {
      console.log("PLAY SCREEN");
    }
  }, [state?.state]);

  return (
    <div className="App">
      {screen === SCREENS.MAIN ? (
        <MainScreen
          onLeaderboard={handleLeaderboard}
          onScreenChange={handleScreenChange}
        />
      ) : null}
      {screen === SCREENS.REGISTRATION ? (
        <Registration onScreenChange={handleScreenChange} />
      ) : null}
      {screen === SCREENS.GAME ? (
        <GameScreen
          FPS={FPS}
          duration={duration}
          tickId={tickId}
          state={state}
          onLeaderboard={handleLeaderboard}
        />
      ) : null}
      {screen === SCREENS.LEADERBOARD ? (
        <Leaderboard
          {...leaderboard}
          onHome={() => {
            handleScreenChange(SCREENS.MAIN);
          }}
        />
      ) : null}
    </div>
  );
}

function Lib() {
  // TODO ???????????????? ?????????????? ??????????, ?????????? ???????? ??????????????????????????
  var lib = {
    1: "nil npm lib go pen var if add zsh run php bug fix api key add all id em erb rem px ux ui svg for box git xml rtc pre rgb hsl rel web js def moz end to dev css".split(
      " "
    ),
    2: "void yarn node null code scss bash else push edge ruby pull tidy head body foot haml slim jade true html color top span left right save fork flex none bold auto href link size ease fill path rgba hsla from skew sort font size team sass hash json less attr text data".split(
      " "
    ),
    3: "react ember event width height clone gulp concat fetch valid aside style elsif babel jquery param start assign posts logos chrome blogs block align xcode slack class agile xmlns origin comma scrum stroke scale false rails".split(
      " "
    ),
    4: "inline method deploy target assign window grunt commit minify jekyll stylus article import tweets google opacity weight bottom scroll italic profile hidden github keytrap editor webkit string number integer decimal period jsconf".split(
      " "
    ),
    5: "inherit function includes bourbon normalize angular explorer section ternary twitter overflow absolute postcss invalid viewbox content sublime session display background compile bracket backbone boolean codepen dreamhire contains standup".split(
      " "
    ),
    6: "chriscoyier javascript cssdevconf customers autoprefixer stackoverflow visibility headphones underscore bootstrap csstricks typescript livescript customer settings semicolon attribute parenthesis markdown compiler responsive preprocessor webdesign developer development".split(
      " "
    ),
    authors: "gary petr anna sergey manychat".split(" "),
  };
  return Object.values(lib).flat();
}

export default App;
