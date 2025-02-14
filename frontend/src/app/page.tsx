"use client";

import { useState, useEffect, useRef } from "react";
import SortingHat from "@/components/SortingHat";
import { MotionButtonComponent } from "@/components/MotionButton";
import { RollingText } from "@/components/RollingText";
import Timer from "@/components/Timer";
import MusicPlayer from "@/components/MusicPlayer";
import { fairyDustCursor } from "cursor-effects";

export default function Home() {
  
  const [isRunning, setIsRunning] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string>("25 / 5"); // Default to 1 min work / 1 min rest
  const [minutes, setMinutes] = useState<number>(25); // Work time in minutes
  const [seconds, setSeconds] = useState<number>(0); // Seconds countdown
  const [isWorkPhase, setIsWorkPhase] = useState(true); // Flag for work/rest phase

  const speak = (message: string) => {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  const [workTime, restTime] = activeTimer
    .split(" / ")
    .map((time) => parseInt(time));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer toggle (Start/Pause)
  const handleToggleTimer = () => {
    setIsRunning((prev) => !prev);
    if (isRunning) {
      speak("Pause");
    } else {
      speak("Start");
    }
  };

  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false); // Stop the timer
    setIsWorkPhase(true);
    setMinutes(workTime); // Set the initial time based on phase
    setSeconds(0); // Reset seconds to 0
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear any existing interval
  };

  // Handle timer completion (Switch phases)
  const handleTimerComplete = () => {
    if (minutes === 0 && seconds === 0) {
      // Switch phases
      if (isWorkPhase) {
        setIsWorkPhase(false); // Switch to rest phase
        setMinutes(restTime); // Set rest phase time
        speak("Rest");
      } else {
        setIsWorkPhase(true); // Switch to work phase
        setMinutes(workTime); // Set work phase time
        speak("Work");
      }
      setSeconds(0); // Reset seconds
      setIsRunning(true); // Start the next phase immediately
    }
  };

  const isWebGLAvailable = () => {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      );
    } catch (e) {
      return false;
    }
  };

  const [hasWebGL, setHasWebGL] = useState(isWebGLAvailable());

  useEffect(() => {
    // Instantiate the fairyDustCursor with any options you like.
    const cursor = fairyDustCursor() as any;

    // Optional: return a cleanup function if you want to destroy the effect on unmount
    return () => {
      if (cursor && cursor.destroy) {
        cursor.destroy();
      }
    };
  }, []);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());
  }, []);

  useEffect(() => {
    setMinutes(workTime);
    setSeconds(0);
  }, [activeTimer]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            return 59; // Reset seconds first
          }
          return prevSeconds - 1;
        });

        setMinutes((prevMinutes) => {
          return seconds === 0 ? Math.max(prevMinutes - 1, 0) : prevMinutes;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, seconds]);

  // Separate useEffect to handle phase switching exactly once
  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      handleTimerComplete();
    }
  }, [minutes, seconds]);

  return (
    <div className="flex flex-col w-full h-screen bg-primary text-secondary p-4 md:p-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row w-full md:h-2/3 space-y-6 md:space-y-0 md:items-center">
        <div
          className={`flex flex-col ${
            hasWebGL
              ? "md:w-1/2 md:pl-12 md:pt-6"
              : "md:w-full md:items-center w-full"
          } space-y-4 md:text-left`}
        >
          <RollingText
            text="Minimal Pomodoro"
            className="text-2xl md:text-2xl font-extrabold"
          />
          <span className="text-sm md:text-base md:w-[50%]">
            Stay focused and productive with Minimal Pomodoro. A simple,
            distraction-free tool to help you break work into manageable
            intervals with short breaks in between. Perfect for boosting
            efficiency, reducing burnout, and maximizing your time. Start your
            productivity journey today!
          </span>
          <MusicPlayer />
        </div>
        <div
          className={`justify-center items-center ${
            hasWebGL ? "md:block md:w-1/2" : "hidden"
          }`}
        >
          {hasWebGL && <SortingHat />}
        </div>
      </div>

      {/* Timer Section */}
      <div className="flex flex-col h-[25%] w-full justify-center items-center space-y-4">
        <div
          className={`w-full md:w-[50%] text-center font-extrabold text-lg border border-white p-2 rounded-md ${
            isWorkPhase ? "bg-green-600" : "bg-yellow-600"
          }`}
        >
          <span>{isWorkPhase ? "Work" : "Rest"}</span>
        </div>
        <div className="w-full md:w-[50%] border border-white p-4 rounded-md">
          <Timer minutes={minutes} seconds={seconds} />
        </div>
      </div>

      {/* Button Section */}
      <div className="flex flex-col h-[25%] w-full justify-center items-center space-y-6 mt-4">
        <div className="flex flex-wrap justify-center space-x-2 md:space-x-4">
          {[
            {
              label: "25 mins / 5 mins",
              value: "25 / 5",
              shortLabel: "25m / 5m",
            },
            {
              label: "50 mins / 10 mins",
              value: "50 / 10",
              shortLabel: "50m / 10m",
            },
            {
              label: "90 mins / 20 mins",
              value: "90 / 20",
              shortLabel: "90m / 20m",
            },
          ].map((option) => (
            <MotionButtonComponent
              key={option.value}
              className={`w-24 sm:w-28 md:w-40 p-2 text-sm md:text-base font-extrabold rounded-md ${
                activeTimer === option.value
                  ? "bg-purple-600 hover:bg-purple-400"
                  : "bg-purple-300 hover:bg-purple-200"
              } text-ellipsis overflow-hidden whitespace-nowrap`}
              onClick={() => setActiveTimer(option.value)}
            >
              {/* Display the short label for mobile/tablet, and the full label for larger screens */}
              <span className="block sm:hidden">{option.shortLabel}</span>
              <span className="hidden sm:block">{option.label}</span>
            </MotionButtonComponent>
          ))}
        </div>

        <div className="w-full flex flex-wrap justify-center items-center space-x-4">
          <MotionButtonComponent
            className={`px-6 py-2 text-sm md:text-base font-extrabold rounded-md ${
              isRunning
                ? "bg-red-600 hover:bg-red-400"
                : "bg-green-600 hover:bg-green-400"
            } text-white`}
            onClick={handleToggleTimer}
          >
            {isRunning ? "Pause" : "Start"}
          </MotionButtonComponent>

          <MotionButtonComponent
            className="px-6 py-2 text-sm md:text-base font-extrabold bg-yellow-600 hover:bg-yellow-400 text-white rounded-md"
            onClick={resetTimer}
            disabled={isRunning}
          >
            Reset
          </MotionButtonComponent>
        </div>
      </div>
    </div>
  );
}
