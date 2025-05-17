import React from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const SpeakTestButton = () => {
  const speakTest = async () => {
    try {
      const response = await fetch(`${backendUrl}/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Testing audio playback from Selma." }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const audioBlob = await response.blob();
      console.log("🧪 Test audio size:", audioBlob.size, "bytes");

      if (audioBlob.size === 0) throw new Error("Audio blob is empty");

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => console.log("✅ Audio finished playing.");
      audio.onerror = (e) => console.error("❌ Audio playback error", e);

      await audio.play().catch((err) => {
        console.warn("⚠️ Autoplay blocked:", err.message);
        alert("Click anywhere on the page to allow sound, then try again.");
      });
    } catch (err) {
      console.error("❌ Failed to play test voice:", err.message);
    }
  };

  return (
<button
  onClick={speakTest}
  style={{
    padding: "12px 20px",
    fontSize: "16px",
    background: "#1f2937",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 9999, // ✅ force above everything
    top: "20px", 
    left: "50%", 
    transform: "translateX(-50%)",
  }}
>
  🔊 Test Voice
</button>
  );
};


export default SpeakTestButton;
