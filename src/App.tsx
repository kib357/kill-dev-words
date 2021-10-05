import React, { useEffect, useState } from "react";
import "./App.css";
import Game, { GAME_STATE, IGameState } from "./Game";
import confetti, { shape } from "canvas-confetti";
import GameScreen from "./GameScreen";
import { IWordObject } from "./Word";
import DesktopMiniSrc from "./desktop-mini.png";
import Leaderboard from "./Leaderboard";
import MainScreen from "./MainScreen";

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

// const DURATION = 30 * 1000;
const DURATION = 60 * 1000; // minute
// const DURATION = 1000;

function App() {
  const [leaderboard, setLeaderboard] = useState<null | {
    id: number;
    deadline: string;
  }>(null);
  const [gameLoopId, setGameLoopId] = useState<NodeJS.Timeout | null>(null);
  const [tickId, setTickId] = useState(0);
  const [state, setState] = useState<IGameState | null>(null);
  const game = React.useMemo(
    () => Game({ WORDS, PLAYER_OFFSET, duration: DURATION }),
    []
  );
  const handleKeyDown = React.useCallback(({ key, code }: KeyboardEvent) => {
    const state = game.getState().state;

    if (state === GAME_STATE.PLAY) {
      const word = game.onKeydown({ key, code });
      if (word) {
        word.isKilled() && shootConfetti(word);
      } else {
        console.log("miss");
      }
    }
  }, []);

  const handleLeaderboard = (props: { id: number; deadline: string }) => {
    setLeaderboard(props);
    document.removeEventListener("keydown", handleKeyDown);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const tick = () => {
      game.tick();
      setState(game.getState());
      setTickId(Date.now());
    };

    tick();
    const interval = setInterval(tick, 1000 / FPS);
    setGameLoopId(interval);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
      <MainScreen />
      {/* GAMESCREEN AND LEADERBOARD */}
      {/* {leaderboard ? (
        <Leaderboard
          {...leaderboard}
          onHome={() => {
            setLeaderboard(null);
          }}
        />
      ) : (
        <GameScreen
          FPS={FPS}
          duration={DURATION}
          tickId={tickId}
          state={state}
          onLeaderboard={handleLeaderboard}
        />
      )} */}
      {/* <div className="words">
        {state?.words.map((word) => {
          const { duration } = word;
          const _word = word.getWord();
          const typed = _word.substr(0, word.getTyped());
          const notTyped = _word.substr(word.getTyped());

          return (
            <div
              key={word.id}
              className={`word toEnd`}
              style={{
                left: word.pos + "%",
                transitionDuration: `${duration}ms`,
                animationDuration: `${duration}ms`,
                animationTimingFunction: "steps(100, end)",
                transitionTimingFunction: "steps(100, end)",
                background: notTyped.length === 0 ? "green" : undefined,
              }}
            >
              <span style={{ color: "orange", fontWeight: "bold" }}>
                {typed}
              </span>
              {notTyped}
            </div>
          );
        })}
      </div>
      <div className="player"></div> */}
    </div>
  );
}

function Lib() {
  // TODO добавить смешные слова, слова мемы программистов
  var lib = {
    1: "nil lib go pen var if add zsh run php bug fix api key add all id em erb rem px ux ui svg for box git xml rtc pre rgb hsl rel web js def moz end to dev css".split(
      " "
    ),
    2: "void null code scss bash else push edge ruby pull tidy head body foot haml slim jade true html color top span left right save fork flex none bold auto href link size ease fill path rgba hsla from skew sort font size team sass hash json less attr text data".split(
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
