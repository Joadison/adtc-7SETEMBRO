import React from "react";
import "./Snowfall.css";

const Snowfall = () => {
  const snowContent = ['❄', '❅', '❆']; 

  const generateSnowflakes = () => {
    return Array.from({ length: 100 }).map((_, i) => {
      const size = `${Math.random() * 5 + 6}px`; 
      const duration = `${Math.random() * 5 + 10}s`; 
      const delay = `${Math.random() * 3}s`; 
      const rotation = `${Math.random() * 360}deg`; 

      const flakeContent = snowContent[Math.floor(Math.random() * snowContent.length)];

      return (
        <div
          key={i}
          className="snow"
          style={{
            left: `${Math.random() * 100}vw`,
            "--flake-size": size,
            "--fall-duration": duration,
            "--fall-delay": delay,
            "--flake-rotation": rotation,
          } as React.CSSProperties}
        >
          <span className="snow-icon">{flakeContent}</span>
        </div>
      );
    });
  };

  return <div id="snow-container">{generateSnowflakes()}</div>;
};

export default Snowfall;
