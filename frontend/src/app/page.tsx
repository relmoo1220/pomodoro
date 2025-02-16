"use client";

import { useState, useEffect, useRef } from "react";
import { MotionButtonComponent } from "@/components/MotionButton";
import { RollingText } from "@/components/RollingText";
import Timer from "@/components/Timer";
import MusicPlayer from "@/components/MusicPlayer";
import { fairyDustCursor } from "cursor-effects";

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string>("25 / 5");
  const [minutes, setMinutes] = useState<number>(25);
  const [seconds, setSeconds] = useState<number>(0);
  const [isWorkPhase, setIsWorkPhase] = useState(true);

  const speak = (message: string) => {
    const utterance = new SpeechSynthesisUtterance(message);
    speechSynthesis.speak(utterance);
  };

  const [workTime, restTime] = activeTimer
    .split(" / ")
    .map((time) => parseInt(time));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleTimer = () => {
    setIsRunning((prev) => !prev);
    speak(isRunning ? "Pause" : "Start");
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsWorkPhase(true);
    setMinutes(workTime);
    setSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTimerComplete = () => {
    if (minutes === 0 && seconds === 0) {
      if (isWorkPhase) {
        setIsWorkPhase(false);
        setMinutes(restTime);
        speak("Rest");
      } else {
        setIsWorkPhase(true);
        setMinutes(workTime);
        speak("Work");
      }
      setSeconds(0);
      setIsRunning(true);
    }
  };

  useEffect(() => {
    const cursor = fairyDustCursor() as any;
    return () => {
      if (cursor && cursor.destroy) {
        cursor.destroy();
      }
    };
  }, []);

  useEffect(() => {
    setMinutes(workTime);
    setSeconds(0);
  }, [activeTimer]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) return 59;
          return prevSeconds - 1;
        });

        setMinutes((prevMinutes) =>
          seconds === 0 ? Math.max(prevMinutes - 1, 0) : prevMinutes
        );
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, seconds]);

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      handleTimerComplete();
    }
  }, [minutes, seconds]);

  return (
    <div className="flex flex-col w-full h-screen bg-primary text-secondary p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row w-full lg:h-2/3 space-y-6 lg:space-y-0 lg:items-center">
        <div className="flex flex-col lg:w-full lg:items-center w-full space-y-4 lg:text-left">
          <RollingText
            text="Minimal Pomodoro"
            className="text-2xl lg:text-2xl font-extrabold"
          />
          <span className="text-sm lg:text-base lg:w-[50%]">
            Stay focused and productive with Minimal Pomodoro. A simple,
            distraction-free tool to help you break work into manageable
            intervals with short breaks in between. Perfect for boosting
            efficiency, reducing burnout, and maximizing your time. Start your
            productivity journey today!
          </span>
          <MusicPlayer />
        </div>
      </div>

      <div className="flex flex-col h-[25%] w-full justify-center items-center space-y-4 mt-10 xl:mb-6">
        <div
          className={`w-full lg:w-[50%] text-center font-extrabold text-lg border border-white p-2 rounded-md ${
            isWorkPhase ? "bg-green-600" : "bg-yellow-600"
          }`}
        >
          <span>{isWorkPhase ? "Work" : "Rest"}</span>
        </div>
        <div className="w-[50%] border border-white p-4 rounded-md">
          <Timer minutes={minutes} seconds={seconds} />
        </div>
      </div>

      <div className="flex flex-col h-[25%] w-full justify-center items-center space-y-6 mt-4">
        <div className="flex flex-wrap justify-center space-x-2 lg:space-x-4">
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
              className={`w-24 sm:w-28 lg:w-40 p-2 text-sm lg:text-base font-extrabold rounded-md ${
                activeTimer === option.value
                  ? "bg-purple-600 hover:bg-purple-400"
                  : "bg-purple-300 hover:bg-purple-200"
              } text-ellipsis overflow-hidden whitespace-nowrap`}
              onClick={() => setActiveTimer(option.value)}
            >
              <span className="block sm:hidden">{option.shortLabel}</span>
              <span className="hidden sm:block">{option.label}</span>
            </MotionButtonComponent>
          ))}
        </div>
        <div className="w-full flex flex-wrap justify-center items-center space-x-4">
          <MotionButtonComponent
            className={`px-6 py-2 text-sm lg:text-base font-extrabold rounded-md ${
              isRunning
                ? "bg-red-600 hover:bg-red-400"
                : "bg-green-600 hover:bg-green-400"
            } text-white`}
            onClick={handleToggleTimer}
          >
            {isRunning ? "Pause" : "Start"}
          </MotionButtonComponent>

          <MotionButtonComponent
            className="px-6 py-2 text-sm lg:text-base font-extrabold bg-yellow-600 hover:bg-yellow-400 text-white rounded-md"
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
