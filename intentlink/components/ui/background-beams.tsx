"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      className: "h-6",
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 4,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      className: "h-20",
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      className: "h-12",
    },
    {
      initialX: 500,
      translateX: 500,
      duration: 6,
      repeatDelay: 4,
      delay: 2,
      className: "h-6",
    },
  ];

  return (
    <div
      className={cn(
        "absolute h-full w-full inset-0 [mask-size:40px] [mask-repeat:repeat] pointer-events-none",
        className
      )}
    >
      {beams.map((beam, idx) => (
        <CollisionMechanism
          key={`beam-${idx}`}
          beamOptions={beam}
          containerRef={null}
        />
      ))}
    </div>
  );
};

const CollisionMechanism = React.forwardRef<
  HTMLDivElement,
  {
    containerRef: React.RefObject<HTMLDivElement> | null;
    beamOptions?: {
      initialX?: number;
      translateX?: number;
      initialY?: number;
      translateY?: number;
      rotate?: number;
      className?: string;
      duration?: number;
      delay?: number;
      repeatDelay?: number;
    };
  }
>((props) => {
  const { beamOptions = {} } = props;
  const beamRef = useRef<HTMLDivElement>(null);
  const {
    initialX = 0,
    translateX = 0,
    initialY = 0,
    translateY = 200,
    rotate = 0,
    className = "",
    duration = 2,
    delay = 0,
    repeatDelay = 0,
  } = beamOptions;

  useEffect(() => {
    const beam = beamRef.current;
    if (!beam) return;

    const animateBeam = () => {
      beam.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${rotate}deg)`;
      beam.style.opacity = "0";

      setTimeout(() => {
        beam.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
        beam.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotate}deg)`;
        beam.style.opacity = "1";
      }, 50);

      setTimeout(() => {
        beam.style.opacity = "0";
        setTimeout(animateBeam, repeatDelay * 1000);
      }, duration * 1000);
    };

    setTimeout(animateBeam, delay * 1000);
  }, [
    initialX,
    translateX,
    initialY,
    translateY,
    rotate,
    duration,
    delay,
    repeatDelay,
  ]);

  return (
    <div
      ref={beamRef}
      className={cn(
        "absolute left-0 top-20 w-px h-32 bg-gradient-to-t from-cyan-500 via-purple-500 to-transparent opacity-0",
        className
      )}
      style={{
        boxShadow: "0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(189, 0, 255, 0.3)",
      }}
    />
  );
});

CollisionMechanism.displayName = "CollisionMechanism";
