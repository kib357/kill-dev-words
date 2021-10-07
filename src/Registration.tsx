import React, { useEffect, useState } from "react";
import DesktopCanvas from "./DesktopCanvas";
import { SCREENS } from "./Game";

interface IRegistration {
  onScreenChange: (screen: SCREENS) => void;
}

function Registration({ onScreenChange }: IRegistration) {
  enum STEPS {
    "REGISTRATION",
    "HOW-TO",
  }
  const isPractice = localStorage.getItem("skip-registration");
  const [step, setStep] = useState(
    isPractice ? STEPS["HOW-TO"] : STEPS.REGISTRATION
  );
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

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (step === STEPS["HOW-TO"]) {
      // timeout = setTimeout(() => {
      //   onScreenChange(SCREENS.GAME);
      // }, 15 * 1000);

      timeout = setTimeout(() => {
        onScreenChange(SCREENS.GAME);
      }, 9 * 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [step]);

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
      {step === STEPS["HOW-TO"] ? (
        <div className="how-to">
          <div className="rules eightBit">
            <h1>ПРАВИЛА</h1>
            <p>печатайте, чтобы выбивать слова</p>
            {/* <p>
              нажимайте как можно чаще по пробелу, чтобы закрыть всплывающее
              окно
            </p> */}
            <p>
              у вас есть {isPractice ? "30 секунд" : "2 минуты"}, чтобы
              разобраться со всеми словами
            </p>
          </div>
          <div
            data-progress="20%"
            data-content="Loading..."
            className="eightBit loading inverted-bar"
          ></div>
        </div>
      ) : null}
    </div>
  );
}

export default Registration;
