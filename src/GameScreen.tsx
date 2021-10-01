import React from "react";
import { IGameState } from "./Game";
import NumberEasing from "react-number-easing";
import { keyframes } from "@emotion/react";
import { css } from "@emotion/css";

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
              zIndex: cursor ? 2 : 1,
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
  const particles = state?.getParticles() || [];
  const Particles = React.useMemo(
    () => particles.map((particle) => <Particle {...particle} />),
    [particles || []]
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
          <div className="particles" id="particles">
            {Particles}
          </div>
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

interface IParticle {
  destination: { x: number; y: number };
  duration: number;
  key: string;
}
function Particle({ destination, duration, key }: IParticle) {
  const container = document.getElementById("particles");
  const { offsetHeight: containerHeight, offsetWidth: containerWidth } =
    container || {
      offsetHeight: 1,
      offsetWidth: 1,
    };
  const x = map(destination.x, 0, 1, -containerWidth / 2, containerWidth / 2);
  const y = map(destination.y, 0, 1, -containerHeight, 0);

  const bounce = keyframes`
  from, {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(${x}px, ${y}px,0);
  }
`;

  return (
    <div
      key={key}
      className={css({
        animation: `${bounce} ${duration}ms ease infinite`,
        position: "absolute",
        bottom: "calc(45px - (9px / 2))",
        left: "calc(50% - (9px / 2))",
        transform: "translate(0, 0)",
        width: "9px",
        height: "9px",
        background: "white",
        animationTimingFunction: `steps(${Math.floor(duration / 30)}, end)`,
      })}
    ></div>
  );
}
function map(
  value: number,
  low1: number,
  high1: number,
  low2: number,
  high2: number
) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

export default GameScreen;
