"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const ShootingStars = ({
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#00f0ff",
  trailColor = "#bd00ff",
  starWidth = 10,
  starHeight = 1,
  className,
}: {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}) => {
  const [star, setStar] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    const randomizePosition = () => {
      const side = Math.floor(Math.random() * 4);
      const offset = Math.random() * window.innerWidth;

      let x, y;
      if (side === 0) {
        x = offset;
        y = 0;
      } else if (side === 1) {
        x = window.innerWidth;
        y = offset;
      } else if (side === 2) {
        x = offset;
        y = window.innerHeight;
      } else {
        x = 0;
        y = offset;
      }

      const angle = Math.atan2(
        window.innerHeight / 2 - y,
        window.innerWidth / 2 - x
      );

      const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
      const duration = Math.sqrt(
        Math.pow(window.innerWidth / 2 - x, 2) +
          Math.pow(window.innerHeight / 2 - y, 2)
      ) / speed;

      setStar({
        left: `${x}px`,
        top: `${y}px`,
        "--rotation": `${angle}rad`,
        "--duration": `${duration}s`,
        "--star-color": starColor,
        "--trail-color": trailColor,
        "--star-width": `${starWidth}px`,
        "--star-height": `${starHeight}px`,
      } as React.CSSProperties);

      const randomDelay = minDelay + Math.random() * (maxDelay - minDelay);
      setTimeout(randomizePosition, randomDelay);
    };

    randomizePosition();
  }, [minSpeed, maxSpeed, minDelay, maxDelay, starColor, trailColor, starWidth, starHeight]);

  return (
    star && (
      <span
        className={cn("shooting-star", className)}
        style={star}
      >
        <svg
          className="absolute -left-2 -top-2"
          width={starWidth * 2}
          height={starWidth * 2}
          viewBox={`0 0 ${starWidth * 2} ${starWidth * 2}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={starWidth}
            cy={starWidth}
            r={starWidth / 2}
            fill={starColor}
            style={{
              filter: `drop-shadow(0 0 ${starWidth}px ${starColor})`,
            }}
          />
        </svg>
        <style jsx>{`
          .shooting-star {
            position: absolute;
            pointer-events: none;
            animation: shoot var(--duration) linear forwards;
          }
          .shooting-star::after {
            content: "";
            position: absolute;
            width: var(--star-width);
            height: var(--star-height);
            background: linear-gradient(
              to right,
              var(--trail-color),
              transparent
            );
            transform: translateX(-100%) rotate(var(--rotation));
            animation: trail var(--duration) linear forwards;
          }
          @keyframes shoot {
            0% {
              transform: translate(0, 0) rotate(var(--rotation));
              opacity: 1;
            }
            70% {
              opacity: 1;
            }
            100% {
              transform: translate(
                calc(cos(var(--rotation)) * 1000px),
                calc(sin(var(--rotation)) * 1000px)
              ) rotate(var(--rotation));
              opacity: 0;
            }
          }
          @keyframes trail {
            0% {
              width: 0;
              opacity: 1;
            }
            30% {
              width: 100px;
              opacity: 1;
            }
            100% {
              width: 0;
              opacity: 0;
            }
          }
        `}</style>
      </span>
    )
  );
};
