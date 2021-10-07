import React, { useState } from "react";
import DesktopCanvas from "./DesktopCanvas";

function Registration() {
  enum STEPS {
    "REGISTRATION",
    "HOW-TO",
  }
  const [step, setStep] = useState(STEPS.REGISTRATION);
  const [name, setName] = useState("");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);
  const [contact, setContact] = useState("");
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setContact(e.target.value);
  const handleToHowTo = () => {
    if (!name || !contact) return;

    let leaderboardData: {
      id: string;
      score: number;
      name: string;
      contact: string;
    }[] = JSON.parse(localStorage.getItem("leaderboard") || "[]");
    const prevResults = leaderboardData.find(
      ({ name: _name, contact: _contact }) =>
        _name === name && _contact === contact
    );
    localStorage.setItem(
      "player-id",
      prevResults?.id || String(Math.floor(Math.random() * 100000))
    );
    localStorage.setItem("player", name);
    localStorage.setItem("contact", contact);
    setStep(STEPS["HOW-TO"]);
  };

  return (
    <div className="registration">
      <DesktopCanvas />
      <div className="logo"></div>
      {step === STEPS.REGISTRATION ? (
        <div className="registration-step">
          <div className="text eightBit">
            Оставьте свои контакты, чтобы мы связались с вами в случае победы
          </div>
          <div>
            <label className="eightBit" htmlFor="player">
              ИМЯ
              <input
                type="text"
                name="player"
                autoComplete="chrome-off"
                className="eightBit"
                id="player"
                value={name}
                onChange={handleNameChange}
              />
            </label>
          </div>
          <div style={{ paddingTop: "30px" }}>
            <label className="eightBit" htmlFor="contact">
              ТЕЛЕФОН ИЛИ ТЕЛЕГРАМ
              <input
                type="text"
                name="contact"
                autoComplete="chrome-off"
                id="contact"
                className="eightBit"
                value={contact}
                onChange={handleContactChange}
              />
            </label>
          </div>
          <div>
            <div
              onClick={handleToHowTo}
              style={{
                opacity: name && contact ? 1 : 0.6,
              }}
              className="button eightBit"
            >
              Register
            </div>
          </div>
        </div>
      ) : null}
      {step === STEPS["HOW-TO"] ? <div className="how-to"></div> : null}
    </div>
  );
}

export default Registration;
