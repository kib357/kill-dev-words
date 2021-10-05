import React, { useState } from "react";
import TitleSrc from "./title.png";
import DesktopCanvas from "./DesktopCanvas";
import { SCREENS } from "./Game";

interface IMainScreen {
  onScreenChange: (screen: SCREENS) => void;
}

function MainScreen({ onScreenChange }: IMainScreen) {
  const [activeMenu, setActiveMenu] = useState(0);
  const [isToRegistration, setIsToReg] = useState(false);
  const MENU = ["START CHALLENGE", "PRACTICE", "LEADERBOARDS"];
  const handleMouse = (id: number) => () => {
    setActiveMenu(id);
  };
  const handleClick = () => {
    if (activeMenu === 0) {
      setIsToReg(true);
      setTimeout(() => {
        onScreenChange(SCREENS.REGISTRATION);
      }, 810);
    }
  };

  return (
    <div
      className={`main-screen ${isToRegistration ? "to-registration" : null}`}
    >
      <div className="container">
        <div className="logo"></div>
        <img
          width="737"
          style={{
            margin: "70px auto",
            display: isToRegistration ? "none" : "block",
          }}
          src={TitleSrc}
          className="title"
        />
        <ul
          className="menu eightBit"
          style={{
            display: isToRegistration ? "none" : undefined,
          }}
        >
          {MENU.map((label, id) => (
            <li
              onClick={handleClick}
              onMouseEnter={handleMouse(id)}
              className={activeMenu === id ? "active" : undefined}
            >
              {label}
            </li>
          ))}
        </ul>
        {/* <div className="registration"></div> */}
        {/* <div className="rules"></div> */}
        <DesktopCanvas multiplier={1} />
      </div>
    </div>
  );
}

export default MainScreen;
