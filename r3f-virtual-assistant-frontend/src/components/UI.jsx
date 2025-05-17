import { useChat } from "../hooks/useChat";
import AssistantLayout from "./AssistantLayout";
import { useRef, useState, useEffect } from "react";

const UI = () => {
  const { chat } = useChat();
  const inputRef = useRef();
  const conversationRef = useRef();
  const panelRef = useRef();

  const [panelPos, setPanelPos] = useState({ x: 100, y: 100 });
  const [pomodoroPos, setPomodoroPos] = useState({ x: 200, y: 200 });
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [isPomodoroPaused, setIsPomodoroPaused] = useState(false);
  const [showWeatherPanel, setShowWeatherPanel] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState("");

  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    const userText = inputRef.current?.value.trim();
    if (!userText) return;

    setConversation(prev => [...prev, { sender: "user", text: userText }]);
    inputRef.current.value = "";

    try {
      const reply = await chat(userText);
      if (reply?.text) {
        setConversation(prev => [...prev, { sender: "assistant", text: reply.text }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new message arrives
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [conversation]);


 
};

export default UI;
