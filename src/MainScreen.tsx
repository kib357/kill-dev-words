import React, { useState } from "react";
import TitleSrc from "./title.png";
import DesktopCanvas from "./DesktopCanvas";
import { SCREENS } from "./Game";
interface IMainScreen {
  onScreenChange: (screen: SCREENS) => void;
  onLeaderboard: (props: any) => void;
}

function MainScreen({ onScreenChange, onLeaderboard }: IMainScreen) {
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
        localStorage.removeItem("skip-registration");
        onScreenChange(SCREENS.REGISTRATION);
      }, 810);
    } else if (activeMenu === 1) {
      setIsToReg(true);
      setTimeout(() => {
        localStorage.setItem("skip-registration", "true");
        localStorage.removeItem("player");
        localStorage.removeItem("contact");
        onScreenChange(SCREENS.REGISTRATION);
      }, 810);
    } else if (activeMenu === 2) {
      onLeaderboard({});
    }
  };
  React.useEffect(() => {
    const handleKeyDown = (e: { key: string }) => {
      switch (e.key) {
        case "ArrowDown":
          setActiveMenu(activeMenu === 2 ? 0 : activeMenu + 1);
          break;
        case "ArrowUp":
          setActiveMenu(activeMenu === 0 ? 2 : activeMenu - 1);
          break;
        case "Enter":
          handleClick();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setActiveMenu, handleClick, activeMenu]);

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
