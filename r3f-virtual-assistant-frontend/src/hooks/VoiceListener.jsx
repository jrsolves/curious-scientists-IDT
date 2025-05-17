import React, { useEffect, useRef, useState } from 'react';

const VoiceListener = ({ wakeWord = ["Thelma", "Soma", "Selma", "Salma", "comma", "summer"], onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState(null);  // State for microphone permission status
  const recognitionRef = useRef(null);
  const isRecognitionActiveRef = useRef(false);
  const isCommandActiveRef = useRef(false);
  const commandBufferRef = useRef("");
  const timerRef = useRef(null);
  const WAIT_DELAY = 3000;

  useEffect(() => {
    const requestMicrophone = async () => {
      try {
        // Request access to the microphone
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted");
        setMicPermission(true); // Permission granted
        // Continue with the recognition setup
      } catch (err) {
        console.error("Microphone permission error:", err);
        setMicPermission(false); // Permission denied
        alert("Microphone access is required.");
      }
    };
  
    // Request microphone access when the component is mounted
    requestMicrophone();
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported in this browser. Try using Chrome or Firefox.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
      console.log("Speech recognition started.");
    };

    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      console.log("Speech recognition ended.");
      setTimeout(() => {
        if (!isRecognitionActiveRef.current) {
          try {
            recognition.start();
          } catch (err) {
            console.error("Error restarting recognition in onend:", err);
          }
        }
      }, 1000);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "audio-capture") {
        alert("Please check your microphone or give microphone permissions.");
      } else if (event.error === "aborted") {
        setTimeout(() => {
          if (!isRecognitionActiveRef.current) {
            try {
              recognition.start();
            } catch (err) {
              console.error("Error restarting recognition after aborted:", err);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      transcript = transcript.trim();
      console.log("Recognized:", transcript);

      // Handle wake word detection
      const wakeWords = Array.isArray(wakeWord) ? wakeWord : [wakeWord];
      const lowerTranscript = transcript.toLowerCase();

      let matchedWakeWord = null;
      for (const word of wakeWords) {
        const lowerWord = word.toLowerCase();
        if (lowerTranscript.includes(lowerWord)) {
          if (matchedWakeWord === null || lowerTranscript.indexOf(lowerWord) < lowerTranscript.indexOf(matchedWakeWord.toLowerCase())) {
            matchedWakeWord = word;
          }
        }
      }

      if (matchedWakeWord) {
        console.log(`Wake word "${matchedWakeWord}" detected.`);
        const index = lowerTranscript.indexOf(matchedWakeWord.toLowerCase());
        let commandPart = transcript.substring(index + matchedWakeWord.length).trim();
        commandPart = commandPart.replace(/^[,:\s]+/, "");

        if (!isCommandActiveRef.current) {
          isCommandActiveRef.current = true;
          commandBufferRef.current = commandPart;
        } else {
          commandBufferRef.current += " " + commandPart;
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (commandBufferRef.current.length > 0) {
            console.log("Final command:", commandBufferRef.current);
            if (typeof onResult === "function") {
              onResult(commandBufferRef.current);
            }
          } else {
            console.log("Wake word detected but no command provided.");
          }
          isCommandActiveRef.current = false;
          commandBufferRef.current = "";
          timerRef.current = null;
        }, WAIT_DELAY);
      } else if (isCommandActiveRef.current) {
        commandBufferRef.current += " " + transcript;
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (commandBufferRef.current.length > 0) {
            console.log("Final command:", commandBufferRef.current);
            if (typeof onResult === "function") {
              onResult(commandBufferRef.current);
            }
          } else {
            console.log("No command provided.");
          }
          isCommandActiveRef.current = false;
          commandBufferRef.current = "";
          timerRef.current = null;
        }, WAIT_DELAY);
      }
    };

    // Requesting microphone access
    const requestMicrophoneAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission(true); // Permission granted
        recognitionRef.current = recognition;
        recognition.start();
        setIsListening(true);
      } catch (err) {
        setMicPermission(false); // Permission denied
        console.error('Microphone permission error:', err);
      }
    };

    if (micPermission === true) {
      recognition.start();
    }

    // Request the microphone if permissions are not yet granted
    if (micPermission === null) {
      requestMicrophoneAccess();
    }

    return () => {
      recognition.onend = null;
      recognition.onerror = null;
      recognition.onresult = null;
      if (timerRef.current) clearTimeout(timerRef.current);
      try {
        recognition.stop();
        setIsListening(false);
      } catch (err) {
        console.error("Error stopping recognition on unmount:", err);
      }
    };
  }, [wakeWord, onResult, micPermission]);

  const stopRecognition = () => {
    if (!isListening) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  if (micPermission === null) {
    return <div>Loading...</div>; // Awaiting permission status
  }

  if (micPermission === false) {
    return (
      <div>
        <h1>Microphone Permission Denied</h1>
        <p>Please allow microphone access to start using voice commands.</p>
      </div>
    );
  }

  return (
    <div>


    </div>
  );
};

export default VoiceListener;
