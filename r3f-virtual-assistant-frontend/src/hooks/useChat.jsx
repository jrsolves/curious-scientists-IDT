import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are Amanda, a friendly and intelligent STEM tutor for kids and teens.",
    },
  ]);
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const lipsyncData = useRef([]);
  const lipsyncTimer = useRef(0);
  const audioRef = useRef(null);
  const objectUrl = useRef(null);

  const cleanupAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrl.current) {
      URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = null;
    }
    lipsyncData.current = [];
    lipsyncTimer.current = 0;
  };

  const onMessagePlayed = () => {
    lipsyncTimer.current = 0;
    lipsyncData.current = [];
    if (audioRef.current) audioRef.current = null;
  };

  const speak = async (text) => {
    cleanupAudio();

    try {
      const response = await fetch(`${backendUrl}/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      if (!data.audio) throw new Error("Missing 'audio' in response");

      const byteArray = Uint8Array.from(atob(data.audio), (c) =>
        c.charCodeAt(0)
      );
      const audioBlob = new Blob([byteArray], { type: "audio/mpeg" });
      objectUrl.current = URL.createObjectURL(audioBlob);
      const audio = new Audio(objectUrl.current);
      audioRef.current = audio;

      lipsyncData.current = (data.lipsync || []).map((cue) => ({
        ...cue,
        value: cue.value?.toUpperCase?.() || "REST",
      }));

      if (lipsyncData.current.length > 0) {
        console.log("🔤 Lipsync cues loaded:", lipsyncData.current.length);
      }

      lipsyncTimer.current = 0;

      audio.onplay = () => {
        console.log("🎤 Audio started playing — lipsyncTimer reset");
        lipsyncTimer.current = 0;
      };

      audio.onended = () => {
        console.log("✅ Audio finished playing.");
        onMessagePlayed();
      };

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      if (context.state === "suspended") await context.resume();

      await audio.play().catch((err) => {
        console.warn("⚠️ Audio autoplay blocked:", err.message);
        onMessagePlayed();
      });
    } catch (err) {
      console.error("❌ Failed to speak and lipsync:", err.message);
      onMessagePlayed();
    }
  };

  const chat = async (userInput) => {
    cleanupAudio();
    setLoading(true);
    try {
      const updatedMessages = [
        ...messages,
        { role: "user", content: userInput },
      ];
      setMessages(updatedMessages);
      setConversation((prev) => [
        ...prev,
        { sender: "user", text: userInput },
      ]);

      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      const assistantReply = data.text || "";

      setMessage({ role: "assistant", content: assistantReply });
      setConversation((prev) => [
        ...prev,
        { sender: "assistant", text: assistantReply },
      ]);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);

      console.log("✏️ Full assistant reply:", assistantReply);
      if (assistantReply) await speak(assistantReply);
      return { text: assistantReply, lipsync: lipsyncData.current };
    } catch (error) {
      console.error("❌ Error in chat function:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMessage(messages[messages.length - 1] || null);
    return () => cleanupAudio();
  }, [messages]);

  return (
    <ChatContext.Provider
      value={{
        chat,
        speak,
        message,
        loading,
        cameraZoomed,
        setCameraZoomed,
        conversation,
        lipsyncData,
        lipsyncTimer,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within a ChatProvider");
  return context;
};
