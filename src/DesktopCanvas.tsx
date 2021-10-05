import React, { useEffect } from "react";
import DesktopMiniSrc from "./desktop-mini.png";

interface IDesktopCanvas {
  multiplier?: number;
}

function DesktopCanvas({ multiplier = 1.18 }: IDesktopCanvas) {
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const background = document.getElementById("desktop") as HTMLCanvasElement;
    // var rect = background.getBoundingClientRect();
    background.width = background.clientWidth * dpr;
    background.height = background.clientHeight * dpr;
    const context = background.getContext("2d");
    if (!context) return;

    context.scale(dpr, dpr);

    const image = new Image();
    image.src = DesktopMiniSrc;
    image.onload = () => {
      const width = image.width * multiplier;
      const height = image.height * multiplier;
      const x = background.width / dpr / 2 - width / 2;
      const y = background.height / dpr / 2 - height / 2;
      context.drawImage(image, x, y, width, height);

      // const zoomInCanvas = () => {
      //   console.log("zoom in");
      //   // context.clearRect(0, 0, canvas.width, canvas.height);
      //   // const multiplier = 2;
      //   // const width = image.width * multiplier;
      //   // const height = image.height * multiplier;
      //   // context.drawImage(image, 0, 0, width, height);
      //   context.scale(20, 20);
      // };

      // setTimeout(() => {
      //   zoomInCanvas();
      // }, 2000);
    };
  }, []);

  return <canvas id="desktop" className="desktop" />;
}

export default DesktopCanvas;
