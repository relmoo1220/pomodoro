"use client";

import { useState, useEffect, useRef } from "react";
import SortingHat from "@/components/SortingHat";
import { MotionButtonComponent } from "@/components/MotionButton";
import { RollingText } from "@/components/RollingText";
import Timer from "@/components/Timer";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string>("25 / 5"); // Default to 1 min work / 1 min rest
  const [minutes, setMinutes] = useState<number>(1); // Work time in minutes
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
        speak("Rest time");
      } else {
        setIsWorkPhase(true); // Switch to work phase
        setMinutes(workTime); // Set work phase time
        speak("Work time");
      }
      setSeconds(0); // Reset seconds
      setIsRunning(true); // Start the next phase immediately
    }
  };

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
    <div className="flex flex-col w-full h-screen bg-primary text-secondary">
      <div className="flex w-full h-3/5">
        <div className="flex flex-col w-[50%] space-y-4 pl-12 pt-6">
          <RollingText
            text="Minimal Pomodoro"
            className="text-4xl font-extrabold"
          />
          <span>
            Stay focused and productive with Minimal Pomodoro. A simple,
            distraction-free tool to help you break work into manageable
            intervals with short breaks in between. Perfect for boosting
            efficiency, reducing burnout, and maximizing your time. Start your
            productivity journey today!
          </span>
          <MusicPlayer />
        </div>
        <div className="w-[50%]">
          <SortingHat />
        </div>
      </div>
      <div className="flex flex-col h-1/5 w-full justify-center items-center">
        {/* Work/Rest Label */}
        <div
          className={`w-[50%] justify-center items-center text-center font-extrabold text-lg border border-white ${
            isWorkPhase ? "bg-green-600" : "bg-yellow-600"
          }`}
        >
          <span>{isWorkPhase ? "Work" : "Rest"}</span>
        </div>
        {/* Timer */}
        <div className="w-[50%] border border-white">
          <Timer minutes={minutes} seconds={seconds} />
        </div>
      </div>
      <div className="flex flex-col h-1/5 w-full justify-center items-center">
        <div className="flex h-1/2">
          <div className="flex space-x-4">
            <MotionButtonComponent
              className={`${
                activeTimer === "25 / 5"
                  ? "bg-purple-600 hover:bg-purple-400"
                  : "bg-purple-300 hover:bg-purple-200"
              } font-extrabold w-40`}
              onClick={() => setActiveTimer("25 / 5")}
            >
              25 mins / 5 mins
            </MotionButtonComponent>
            <MotionButtonComponent
              className={`${
                activeTimer === "50 / 10"
                  ? "bg-purple-600 hover:bg-purple-400"
                  : "bg-purple-300 hover:bg-purple-200"
              } font-extrabold w-40`}
              onClick={() => setActiveTimer("50 / 10")}
            >
              50 mins / 10 mins
            </MotionButtonComponent>
            <MotionButtonComponent
              className={`${
                activeTimer === "90 / 20"
                  ? "bg-purple-600 hover:bg-purple-400"
                  : "bg-purple-300 hover:bg-purple-200"
              } font-extrabold w-40`}
              onClick={() => setActiveTimer("90 / 20")}
            >
              90 mins / 20 mins
            </MotionButtonComponent>
          </div>
        </div>
        <div className="w-full flex justify-center items-center space-x-12">
          <MotionButtonComponent
            className={`${
              isRunning
                ? "bg-red-600 hover:bg-red-400"
                : "bg-green-600 hover:bg-green-400"
            } text-white font-extrabold px-8 py-3 rounded-md`}
            onClick={handleToggleTimer}
          >
            {isRunning ? "Pause" : "Start"}
          </MotionButtonComponent>

          <MotionButtonComponent
            className="bg-yellow-600 text-white font-extrabold hover:bg-yellow-400 px-8 py-3 rounded-md"
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
