import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function IntroductionVideo() {
  const navigate = useNavigate();

  useEffect(() => {
    // Load YouTube IFrame API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // When API is ready, create player
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player("player", {
        videoId: "ZCFMrsYh-ME", // Your YouTube video ID
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,               // No suggested videos from other channels
          modestbranding: 1,    // Minimized YouTube branding
          fs: 0                 // (Optional) disable fullscreen button
        },
        events: {
          onReady: (event) => {
            event.target.unMute();
            event.target.setVolume(100);
          }
        }
      });
    };
  }, []);

  return (
    <div style={container}>
      <div id="player" style={iframeStyle}></div>

      <button
        onClick={() => navigate("/hand-tenon-mech")} // ✅ updated destination
        style={topBtn}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
      >
        Next / Skip →
      </button>
    </div>
  );
}

// Styles
const container = {
  position: "relative",
  width: "100vw",
  height: "100vh",
  backgroundColor: "#000",
  overflow: "hidden"
};

const iframeStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%"
};

const topBtn = {
  position: "absolute",
  top: "20px",
  right: "20px",
  zIndex: 10,
  padding: "20px 40px",
  fontSize: "1.5em",
  fontWeight: "bold",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  transition: "transform 0.2s"
};
