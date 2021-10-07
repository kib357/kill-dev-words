import React, { useEffect, useState } from "react";
import { formatScore } from "./GameScreen";

interface ILeaderboard {
  id?: string;
  deadline?: string;
  score?: number;
  onHome: () => void;
}

interface IData {
  id: string;
  name: string;
  score: number;
}

function Leaderboard({ id, deadline, onHome, score }: ILeaderboard) {
  const [showBtn, setBtn] = useState(false);
  const [data] = useState<IData[]>(
    JSON.parse(localStorage.getItem("leaderboard") || "[]").sort(
      (a: any, b: any) => b.score - a.score
    )
  );
  const _score = data.find(({ id: _id }) => _id === id)?.score || 0;

  const keydownTimestamp = Date.now();
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    const _showBtn = Date.now() - keydownTimestamp > 6000;
    // debugger;
    if (_showBtn && e.code === "Enter") {
      onHome();
    }
    e.preventDefault();
    e.stopPropagation();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    const WAIT = 4000;
    let timeout = setTimeout(() => {
      if (!id) return;

      document
        ?.getElementById("you")
        ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, WAIT);

    let timeout2 = setTimeout(() => {
      setBtn(true);
    }, WAIT + 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="leaderboard">
      {deadline ? (
        <div className="deadline">
          DEADLINE{" "}
          <span className="outlined" style={{ marginLeft: "0.2em" }}>
            {deadline}
          </span>
        </div>
      ) : null}
      {score || _score ? (
        <div className="score">
          <span className="outlined">SCORE</span>
          <span style={{ marginLeft: "1.9em" }}>
            {formatScore(score || _score)}
          </span>
        </div>
      ) : null}
      <div className="board">
        {data.map(({ id: _id, name, score }, index) => (
          <div>
            <span
              id={_id === id ? "you" : undefined}
              className={_id === id ? "" : "outlined"}
            >
              {index + 1}.
              <span
                style={{
                  marginLeft: "0.5em",
                  maxWidth: "1000px",
                  textOverflow: "ellipsis",
                  overflowX: "hidden",
                  display: "inline-block",
                  verticalAlign: "bottom",
                }}
              >
                {name}
              </span>
            </span>
            <span style={{ marginLeft: "0.5em" }}>{formatScore(score)}</span>
          </div>
        ))}
      </div>
      <div
        onClick={onHome}
        style={{
          opacity: showBtn ? 1 : 0,
        }}
        className="button eightBit"
      >
        Return home
      </div>
    </div>
  );
}

export default Leaderboard;
