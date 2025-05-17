import React, { useRef, useEffect, useState } from "react";

export default function CustomVideoPlayer({ videoName = "instructions" }) {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const videoSrc = `/videos/${videoName}.mp4`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };

    video.addEventListener("timeupdate", updateProgress);
    return () => video.removeEventListener("timeupdate", updateProgress);
  }, []);

  const handlePlay = () => {
    const video = videoRef.current;
    if (video) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handlePause = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const percent = parseFloat(e.target.value);
    if (video && video.duration) {
      video.currentTime = (percent / 100) * video.duration;
    }
  };

  const handleVolume = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = false;
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        src={videoSrc}
        muted={false}
        autoPlay
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 380,
          width: "85vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "all"
        }}
      />

      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 9999,
          background: "rgba(0,0,0,0.6)",
          padding: "10px 15px",
          borderRadius: "10px",
          color: "white",
          width: "300px",
          pointerEvents: "auto"
        }}
      >
        <div style={{ marginBottom: "8px" }}>
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            style={{
              backgroundColor: "#1f2937",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶️ Play"}
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          step="0.1"
          style={{ width: "100%", cursor: "pointer" }}
        />

        <div style={{ marginTop: "10px" }}>
          <label htmlFor="volume">🔊 Volume</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            style={{ width: "100%", marginTop: "4px", cursor: "pointer" }}
          />
        </div>
      </div>
    </>
  );
}
