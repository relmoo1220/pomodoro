"use client";

import { motion } from "framer-motion";
import { Button } from "./ui/button"; // Import ShadCN UI Button

// Wrap the Button with Framer Motion to animate it
const MotionButton = motion(Button);

// Define the MotionButton component which will accept just the label
export interface MotionButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
}

const MotionButtonComponent: React.FC<MotionButtonProps> = ({
  children,
  className,
  onClick,
  disabled,
  type,
}) => {
  return (
    <MotionButton
      whileHover={{ scale: 1.1 }} // Fixed hover animation
      whileTap={{ scale: 0.9 }} // Fixed tap animation
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </MotionButton>
  );
};

export { MotionButtonComponent };
