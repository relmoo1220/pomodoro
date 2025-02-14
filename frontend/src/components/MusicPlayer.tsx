"use client";

import { useEffect, useRef, useState } from "react";
import { MotionButtonComponent } from "./MotionButton";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

const MusicPlayer = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [widget, setWidget] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    // Load SoundCloud API dynamically
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = () => initWidget();
    document.body.appendChild(script);
  }, []);

  const initWidget = () => {
    if (iframeRef.current && window.SC) {
      const player = new window.SC.Widget(iframeRef.current);
      setWidget(player);

      player.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true);
      });

      player.bind(window.SC.Widget.Events.PAUSE, () => {
        setIsPlaying(false);
      });

      // Initialize the volume
      player.setVolume(volume); // Set initial volume based on slider state
    }
  };

  const togglePlayPause = () => {
    if (widget) {
      widget.isPaused((paused: boolean) => {
        if (paused) {
          widget.play();
        } else {
          widget.pause();
        }
      });
    }
  };

  const nextTrack = () => {
    if (widget) {
      widget.next();
    }
  };

  const prevTrack = () => {
    if (widget) {
      widget.prev();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume); // Update the volume state
    if (widget) {
      widget.setVolume(newVolume); // Set the volume on the SoundCloud player
    }
  };

  return (
    <div className="music-player flex flex-col w-[50%] items-center bg-neutral-800 p-4 rounded-lg">
      {/* SoundCloud Player */}
      <iframe
        ref={iframeRef}
        width="100%"
        height="100"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1432527076&color=%238e24aa&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"
      ></iframe>

      {/* Custom Controls */}
      <div className="flex flex-col space-y-4">
        <div className="controls mt-2 flex space-x-4">
          <MotionButtonComponent
            onClick={() => prevTrack()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-400"
          >
            <SkipBack size={24} />
          </MotionButtonComponent>
          <MotionButtonComponent
            onClick={togglePlayPause}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-400"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </MotionButtonComponent>
          <MotionButtonComponent
            onClick={() => nextTrack()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-400"
          >
            <SkipForward size={24} />
          </MotionButtonComponent>
        </div>

        {/* Volume Slider */}
        <div className="flex justify-center items-center mt-4 w-full">
          <Slider
            value={[volume]}
            onValueChange={(newVolume) => handleVolumeChange(newVolume[0])} // Listen to the slider value change
            max={100}
            step={1}
            aria-label="Volume Control"
            className="bg-neutral-950"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
