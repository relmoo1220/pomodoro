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
    <div className="music-player flex flex-col items-center bg-neutral-800 p-4 rounded-lg w-full max-w-lg">
      {/* SoundCloud Player */}
      <iframe
        ref={iframeRef}
        width="100%"
        height="100"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1432527076&color=%238e24aa&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"
        className="rounded-lg max-w-full max-h-40 sm:max-h-48 md:max-h-60" // Add max-height and responsive scaling
      ></iframe>

      {/* Custom Controls */}
      <div className="controls mt-4 w-full flex justify-center items-center space-x-4 md:space-x-4 md:space-y-0">
        <MotionButtonComponent
          onClick={() => prevTrack()}
          className="px-6 py-4 bg-purple-600 hover:bg-purple-400 rounded-full"
        >
          <SkipBack size={24} />
        </MotionButtonComponent>
        <MotionButtonComponent
          onClick={togglePlayPause}
          className="px-6 py-4 bg-purple-600 hover:bg-purple-400 rounded-full"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </MotionButtonComponent>
        <MotionButtonComponent
          onClick={() => nextTrack()}
          className="px-6 py-4 bg-purple-600 hover:bg-purple-400 rounded-full"
        >
          <SkipForward size={24} />
        </MotionButtonComponent>
      </div>

      {/* Volume Slider */}
      <div className="hidden xl:flex justify-center w-full mt-4">
        <Slider
          value={[volume]}
          onValueChange={(newVolume) => handleVolumeChange(newVolume[0])} // Listen to the slider value change
          max={100}
          step={1}
          aria-label="Volume Control"
          className="w-3/4 bg-neutral-950"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
