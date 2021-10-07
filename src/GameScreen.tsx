import React, { useEffect } from "react";
import { GAME_STATE, IGameState } from "./Game";
import NumberEasing from "react-number-easing";
import { keyframes } from "@emotion/react";
import { css } from "@emotion/css";
import DesktopCanvas from "./DesktopCanvas";

type IOnLeaderboard = { id: number; deadline: string };

function GameScreen(props: {
  state: IGameState | null;
  tickId: number;
  duration: number;
  FPS: number;
  onLeaderboard: (props: IOnLeaderboard) => void;
}) {
  const playerId =
    localStorage.getItem("player-id") ||
    String(Math.floor(Math.random() * 100000));
  const playerName = localStorage.getItem("player") || "Name";
  const [isScoreScreen, setScoreScreen] = React.useState(false);
  const { state, tickId, duration, FPS, onLeaderboard } = props;
  const Words = React.useMemo(() => {
    return state?.words.map((word) => {
      const { duration } = word;
      const _word = word.getWord();
      const typed = _word.substr(0, word.getTyped());
      const cursor = typed ? _word.substr(word.getTyped(), 1) : null;
      const notTyped = _word.substr(
        typed ? word.getTyped() + 1 : word.getTyped()
      );

      // duration min 500 max 10000
      // 6000 - 60
      const steps = Math.floor(duration / 90);

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
    });
  }, [state?.words || []]);
  const particles = state?.getParticles() || [];
  const Particles = React.useMemo(
    () => particles.map((particle) => <Particle {...particle} />),
    [particles || []]
  );

  const { start_timestamp = 0 } = state || {};
  const [deadlineValue, deadlinePos] = getDeadline({
    start_timestamp,
    duration,
    tickId,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let timeoutLeaderboardId: NodeJS.Timeout;
    if (state?.state === GAME_STATE.SCORE) {
      timeoutId = setTimeout(() => {
        setScoreScreen(true);

        let leaderboardData: {
          id: string;
          score: number;
          name: string;
          contact: string;
        }[] = JSON.parse(localStorage.getItem("leaderboard") || "[]");
        const data = {
          id: playerId,
          name: playerName,
          score: state.score,
          contact: localStorage.getItem("contact") || "",
        };
        // update previous results
        if (leaderboardData.find(({ id: _id }) => _id === playerId)) {
          leaderboardData = leaderboardData.map((data) => {
            if (data.score < state.score) {
              data.score = state.score;
            }
            return data;
          });
        } else {
          leaderboardData.push(data);
        }

        localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));

        timeoutLeaderboardId = setTimeout(() => {
          onLeaderboard({
            id: playerId,
            deadline: deadlineValue,
          });
        }, 1500);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutLeaderboardId);
    };
  }, [state?.state]);

  return (
    <div className={`game ${isScoreScreen ? "leaderboard" : null}`}>
      <div className="deadline">
        <div
          className="deadline-container"
          style={{
            position: "absolute",
            bottom: "36px",
            left: "36px",
            willChange: "transform",
            transition: `transform ${Math.floor(1100 / FPS)}ms linear`,
            transform: `translate3d(0,${Math.floor(
              map(deadlinePos, 0, 1, -978, 0)
            )}px,0)`,
          }}
        >
          <div className="label">
            <span className="outlined">DEADLINE</span>
            <span className="countdown" style={{ marginLeft: "0.2em" }}>
              &nbsp;{deadlineValue}
            </span>
          </div>
          <div className="score-in-deadline">
            <span className="outlined">SCORE</span>
            <span style={{ marginLeft: "1.9em" }}>
              {formatScore(state?.score || 0)}
            </span>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="logo"></div>
        <div className="viewport">
          {state?.state === GAME_STATE.SCORE ? (
            <GameOver duration={duration} state={state} />
          ) : null}
          {state?.state === GAME_STATE.PLAY ? (
            <>
              <div className="words">{Words}</div>
              <div className="particles" id="particles">
                {Particles}
              </div>
            </>
          ) : null}
          <canvas
            style={{ width: "100%", height: "100%" }}
            id="fireworks"
          ></canvas>
          <div className="player"></div>
        </div>
        <DesktopCanvas />
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
        <div style={{ opacity: 0 }} className="typed-char outlined">
          T
        </div>
      </div>
    </div>
  );
}

interface IScore {
  value?: number;
}
export function formatScore(n: number) {
  return numberWithSpaces(Math.floor(n));
}
const Score: React.FC<IScore> = React.memo(({ value = 0 }) => {
  return (
    <NumberEasing
      decimals={0}
      speed={1000}
      key="score"
      ease="cubicIn"
      value={value}
      customFunctionRender={formatScore}
    />
  );
});

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

function getDeadline({
  start_timestamp,
  duration,
  tickId,
}: {
  start_timestamp: number;
  duration: number;
  tickId: number;
}): [string, number] {
  const progress = tickId - start_timestamp;
  const time = convertMS(Math.max(duration - progress, 0));
  const deadlineValue = `${padNumber(time.minute)}:${padNumber(time.seconds)}`,
    // 0 -> 1
    dealdlinePos = Math.min(progress, duration) / duration;

  return [deadlineValue, dealdlinePos];
}

function padNumber(n: number) {
  return String(n).padStart(2, "0");
}

function convertMS(milliseconds: number) {
  var day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  return {
    day: day,
    hour: hour,
    minute: minute,
    seconds: seconds,
  };
}

function GameOver({
  state,
  duration,
}: {
  state: IGameState;
  duration: number;
}) {
  return (
    <div className="gameover eightBit">
      {state.game_duration === duration ? "TIME IS UP" : "GAME OVER"}
    </div>
  );
}

export default GameScreen;
