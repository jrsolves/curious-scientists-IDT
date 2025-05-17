import { useChat } from "../hooks/useChat";
import VoiceListener from "../hooks/VoiceListener";
import Calendar from "./Calendar";
import TimeDisplay from "./TimeDisplay";

export default function AssistantLayout({
  input,
  conversationRef,
  panelRef,
  panelPos,
  onPanelPointerDown,
  pomodoroPos,
  onPomodoroPointerDown,
  pomodoroTime,
  isPomodoroRunning,
  isPomodoroPaused,
  setIsPomodoroRunning,
  setIsPomodoroPaused,
  setPomodoroTime,
  weatherInfo,
  showWeatherPanel,
}) {
  const { chat, conversation } = useChat();

  const sendMessage = async () => {
    const userText = input?.current?.value?.trim();
    if (!userText) {
      console.warn("⚠️ No input to send.");
      return;
    }

    console.log("📤 Sending message:", userText);
    input.current.value = "";

    try {
      await chat(userText);
    } catch (err) {
      console.error("❌ Chat failed:", err);
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      {/* 🎙️ Voice Recognition */}
      <VoiceListener
        wakeWord={["Thelma", "Selma", "Soma", "Salma", "comma", "summer"]}
        onResult={sendMessage}
      />

      {/* 📄 UI Layout */}
      <div className="fixed inset-0 z-10 flex pointer-events-none">
        {/* 💬 Conversation History */}
        <div
          className="w-1/6 bg-gray-100 p-4 overflow-y-auto pointer-events-auto"
          ref={conversationRef}
        >
          <div className="flex flex-col space-y-2">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`w-full p-2 rounded ${
                  msg.sender === "user" ? "bg-blue-200" : "bg-green-200"
                }`}
              >
                <p className="text-left text-xl">
                  <strong
                    className={
                      msg.sender === "user"
                        ? "text-blue-500"
                        : "text-red-500 font-bold"
                    }
                  >
                    {msg.sender === "user" ? "Jason:" : "Selma:"}
                  </strong>{" "}
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 👩‍🔬 Assistant Area + Input */}
        <div className="flex-1 flex flex-col justify-between p-4 pointer-events-auto">
          {/* 🔖 Header */}
          <div className="relative flex justify-between items-center">
            <div className="backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
              <h1
                className="text-black font-bold"
                style={{ fontFamily: "Helvetica, Arial", fontSize: "2rem" }}
              >
                Amanda <TimeDisplay />
              </h1>
              {showWeatherPanel && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: "0.5rem",
                    width: "16rem",
                    background: "#ffffff",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    color: "blue",
                  }}
                >
                  {weatherInfo}
                </div>
              )}
            </div>
          </div>

          {/* 🧠 Input Area */}
          <div className="mt-auto flex items-center gap-2">
            <input
              ref={input}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full p-4 rounded-md bg-opacity-50 bg-white placeholder:text-gray-800 placeholder:italic backdrop-blur-md pointer-events-auto"
              placeholder="Type a message..."
            />
            <button
              type="button"
              onClick={sendMessage}
              className="bg-pink-500 hover:bg-pink-600 text-white p-4 px-10 font-semibold uppercase rounded-md pointer-events-auto"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
