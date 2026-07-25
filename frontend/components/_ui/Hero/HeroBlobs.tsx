"use client";

import { motion } from "framer-motion";

type Square = {
  size: number;
  x: string;
  y: string;
  color: string;
  blur: number;
  opacity: number;
  duration: number;
  delay: number;
  xRange: number;
  yRange: number;
  rotate: number;
};

const SQUARES: Square[] = [
  {
    size: 120,
    x: "6%",
    y: "16%",
    color: "#33BBB0",
    blur: 28,
    opacity: 0.45,
    duration: 16,
    delay: 0,
    xRange: 70,
    yRange: 45,
    rotate: 28,
  },
  {
    size: 72,
    x: "78%",
    y: "14%",
    color: "#33BBB0",
    blur: 18,
    opacity: 0.4,
    duration: 12,
    delay: 0.8,
    xRange: -55,
    yRange: 60,
    rotate: -32,
  },
  {
    size: 180,
    x: "55%",
    y: "48%",
    color: "#1F6F75",
    blur: 42,
    opacity: 0.35,
    duration: 20,
    delay: 0.3,
    xRange: 45,
    yRange: -50,
    rotate: 20,
  },
  {
    size: 56,
    x: "22%",
    y: "58%",
    color: "#5AD1C6",
    blur: 14,
    opacity: 0.5,
    duration: 10,
    delay: 1.4,
    xRange: -40,
    yRange: -55,
    rotate: -18,
  },
  {
    size: 96,
    x: "84%",
    y: "62%",
    color: "#2A9A90",
    blur: 22,
    opacity: 0.38,
    duration: 15,
    delay: 0.5,
    xRange: -60,
    yRange: 35,
    rotate: 40,
  },
  {
    size: 48,
    x: "44%",
    y: "22%",
    color: "#33BBB0",
    blur: 10,
    opacity: 0.55,
    duration: 9,
    delay: 1.1,
    xRange: 50,
    yRange: 30,
    rotate: -22,
  },
  {
    size: 140,
    x: "12%",
    y: "72%",
    color: "#256370",
    blur: 36,
    opacity: 0.3,
    duration: 18,
    delay: 0.2,
    xRange: 35,
    yRange: -40,
    rotate: 15,
  },
  {
    size: 64,
    x: "68%",
    y: "78%",
    color: "#5AD1C6",
    blur: 16,
    opacity: 0.35,
    duration: 13,
    delay: 1.8,
    xRange: -30,
    yRange: -45,
    rotate: -25,
  },
];

export default function HeroBlobs() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {SQUARES.map((square, index) => (
        <motion.div
          key={index}
          className="absolute rounded-md"
          style={{
            width: square.size,
            height: square.size,
            left: square.x,
            top: square.y,
            backgroundColor: square.color,
            opacity: square.opacity,
            filter: `blur(${square.blur}px)`,
            willChange: "transform",
          }}
          animate={{
            x: [0, square.xRange, -square.xRange * 0.55, 0],
            y: [0, square.yRange, -square.yRange * 0.45, 0],
            rotate: [0, square.rotate, -square.rotate * 0.65, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{
            duration: square.duration,
            delay: square.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181818]/20 via-transparent to-[#181818]/85" />
    </div>
  );
}
