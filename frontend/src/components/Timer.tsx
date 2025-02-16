"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimerProps {
  minutes: number;
  seconds: number;
  className?: string;
}

export default function Timer({
  minutes,
  seconds,
  className = "",
}: TimerProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="xl:text-8xl text-2xl font-bold tabular-nums flex space-x-2">
        <AnimatedCount value={minutes} padding={2} />
        <span>:</span>
        <AnimatedCount value={seconds} padding={2} />
      </div>
    </div>
  );
}

// Animated number component remains the same
const AnimatedCount = ({
  value,
  padding = 2,
  duration = 0.5,
}: {
  value: number;
  padding?: number;
  duration?: number;
}) => {
  const [displayValues, setDisplayValues] = useState(
    value.toString().padStart(padding, "0").split("")
  );

  useEffect(() => {
    const debouncer = setTimeout(() => {
      setDisplayValues(value.toString().padStart(padding, "0").split(""));
    }, 50);

    return () => clearTimeout(debouncer);
  }, [value]);

  return (
    <AnimatePresence mode="popLayout">
      {displayValues.map((n, i) => (
        <motion.div
          className="inline-block tabular-nums"
          key={n + i}
          initial={{ y: 12, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -12, opacity: 0, filter: "blur(8px)" }}
          transition={{
            type: "spring",
            bounce: 0.35,
            duration,
            filter: {
              type: "spring",
              bounce: 0.35,
              duration,
              filter: (value: number) => `blur(${Math.max(0, value)}px)`,
            },
          }}
        >
          <span>{n}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};
