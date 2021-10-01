import React from "react";

interface ILeaderboard {
  id: number;
  deadline: string;
}

function Leaderboard({ id, deadline }: ILeaderboard) {
  const leaderboardData: { id: number; score: number; name: string }[] = [];
  const score = leaderboardData.find(({ id: _id }) => _id === id) || 0;

  return (
    <div className="leaderboard">
      <div className="deadline">
        DEADLINE{" "}
        <span className="outlined" style={{ marginLeft: "0.2em" }}>
          {deadline}
        </span>
      </div>
      <div className="score">
        <span className="outlined">SCORE</span>
        <span style={{ marginLeft: "1.9em" }}>{score}</span>
      </div>
    </div>
  );
}

export default Leaderboard;
