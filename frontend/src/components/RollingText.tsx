// components/RollingText.tsx
"use client";

import { motion } from "framer-motion";

interface RollingTextProps {
  text: string;
  className?: string; // Accept className as a prop
}

const RollingText: React.FC<RollingTextProps> = ({ text, className }) => {
  return (
    <div className="flex space-x-2 overflow-hidden">
      {text.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: 0 }} // Start at the original position
          animate={{ y: -10 }} // Move upwards by 10px (or adjust as needed)
          transition={{
            repeat: Infinity, // Make it repeat continuously
            repeatType: "reverse", // Reverse the animation (jump back down)
            duration: 0.5, // Duration of each jump
            delay: index * 0.1, // Stagger the animation
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          className={`font-bold ${className}`} // Apply the passed className along with default styling
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
};

export { RollingText };
