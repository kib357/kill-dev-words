import React from "react";
import { IGameState } from "./Game";
import NumberEasing from "react-number-easing";

function GameScreen(props: { state: IGameState | null }) {
  const { state } = props;
  const Words = React.useMemo(
    () =>
      state?.words.map((word) => {
        const { duration } = word;
        const _word = word.getWord();
        const typed = _word.substr(0, word.getTyped());
        const cursor = typed ? _word.substr(word.getTyped(), 1) : null;
        const notTyped = _word.substr(
          typed ? word.getTyped() + 1 : word.getTyped()
        );

        // duration min 500 max 10000
        // 6000 - 60
        const steps = Math.floor(duration / 110);

        return (
          <div
            key={word.id}
            className={`word toEnd eightBit`}
            style={{
              left: word.pos + "%",
              transitionDuration: `${duration}ms`,
              animationDuration: `${duration}ms`,
              animationTimingFunction: `steps(${steps}, end)`,
              transitionTimingFunction: `steps(${steps}, end)`,
            }}
          >
            <span className="outlined_inverted">{typed}</span>
            {cursor ? <span className="cursor">{cursor}</span> : null}
            <span>{notTyped}</span>
          </div>
        );
      }),
    [state?.words || []]
  );

  return (
    <div className="game">
      <div className="deadline">
        <span className="outlined">DEADLINE</span>
        <span style={{ marginLeft: "0.2em" }}>&nbsp;1:59</span>
      </div>
      <div className="container">
        <div className="logo"></div>
        <div className="viewport">
          <div className="words">{Words}</div>
          <div className="particles"></div>
          <canvas
            style={{ width: "100%", height: "100%" }}
            id="fireworks"
          ></canvas>
          <div className="player"></div>
        </div>
        <div className="desktop"></div>
      </div>
      <div className="sidebar">
        <div className="score">
          <span className="outlined">SCORE</span>
          <span
            style={{
              marginLeft: "0.2em",
              minWidth: "4em",
              display: "inline-block",
            }}
          >
            &nbsp;
            <Score key="score-wrapper" value={state?.score} />
          </span>
        </div>
        <div className="typed-char outlined">T</div>
      </div>
    </div>
  );
}

interface IScore {
  value?: number;
}
const Score: React.FC<IScore> = React.memo(({ value = 0 }) => {
  const format = (n: number) => numberWithSpaces(Math.floor(n));
  return (
    <NumberEasing
      decimals={0}
      speed={1000}
      key="score"
      ease="cubicIn"
      value={value}
      customFunctionRender={format}
    />
  );
});

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export default GameScreen;
