import React, { useEffect, useState } from "react";
import "./App.css";
import Game, { GAME_STATE, IGameState } from "./Game";
import confetti from "canvas-confetti";

const shootConfetti = () => {
  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 },
  });
};

const FPS = 30;

const WORDS = Lib();

function App() {
  const [gameLoopId, setGameLoopId] = useState<NodeJS.Timeout | null>(null);
  const [state, setState] = useState<IGameState | null>(null);
  const game = React.useMemo(() => Game({ WORDS }), []);
  const handleKeyDown = React.useCallback(({ key, code }: KeyboardEvent) => {
    const word = game.onKeydown({ key, code });
    if (word) {
      word.isKilled() && shootConfetti();
    } else {
      console.log("miss");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    const tick = () => {
      game.tick();
      setState(game.getState());
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
      <div className="words">
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
      <div className="player"></div>
      {state?.state === GAME_STATE.SCORE && state?.score ? (
        <h1
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            textAlign: "center",
            transform: "translate(-50%, -50%)",
          }}
        >
          SCORE: {state.score}
          <br />
          TIME: {(state.game_duration / 1000).toFixed(2)} sec.
        </h1>
      ) : null}
    </div>
  );
}

function Lib() {
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
  };
  return Object.values(lib).flat();
}

export default App;
