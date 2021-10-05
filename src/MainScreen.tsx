import React, { useState } from "react";
import TitleSrc from "./title.png";
import DesktopCanvas from "./DesktopCanvas";

interface IMainScreen {}

function MainScreen(props: IMainScreen) {
  const [activeMenu, setActiveMenu] = useState(0);
  const MENU = ["START CHALLENGE", "PRACTICE", "LEADERBOARDS"];
  const handleMouse = (id: number) => () => {
    setActiveMenu(id);
  };

  return (
    <div className="main-screen">
      <div className="container">
        <div className="logo"></div>
        <img
          width="737"
          style={{ margin: "70px auto", display: "block" }}
          src={TitleSrc}
          className="title"
        />
        <ul className="menu eightBit">
          {MENU.map((label, id) => (
            <li
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
