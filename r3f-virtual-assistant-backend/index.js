
// index.js (backend for Amanda AI)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs, { existsSync, mkdirSync } from "fs";
import fetch from "node-fetch";
import { exec } from "child_process";
import OpenAI from "openai";

dotenv.config();

// Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/lipsync", express.static(path.join(__dirname, "audios")));

// Ensure audio directory exists
const audioDir = path.join(__dirname, "audios");
if (!existsSync(audioDir)) mkdirSync(audioDir);

// APIs
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "zrHiDhphv9ZnVXBqCLjz";

// Utils
const execCommand = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });

const downloadTTSFromElevenLabs = async (text, filePath) => {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceID}`, {
    method: "POST",
    headers: {
      "xi-api-key": elevenLabsApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs error ${res.status}: ${errText}`);
  }

  const buffer = await res.arrayBuffer();
  await fs.promises.writeFile(filePath, Buffer.from(buffer));
};

// 🔊 SPEAK
app.post("/speak", async (req, res) => {
  const { text } = req.body;
  console.log("📥 Received /speak with text:", text);

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Missing or invalid 'text'" });
  }

  try {
    const id = Date.now();
    const mp3Path = path.join(audioDir, `msg_${id}.mp3`);
    await downloadTTSFromElevenLabs(text, mp3Path);

    // Fake lipsync cues
    const visemes = ["A", "E", "I", "O", "U"];
    let time = 0;
    const lipsync = [];
    for (let i = 0; i < text.length; i++) {
      lipsync.push({ start: time, end: time + 0.12, value: visemes[i % visemes.length] });
      time += 0.12;
    }
    lipsync.push({ start: time, end: time + 0.2, value: "REST" });

    const audioBuffer = await fs.promises.readFile(mp3Path);
    res.json({ audio: audioBuffer.toString("base64"), lipsync });
  } catch (err) {
    console.error("❌ /speak failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 💬 CHAT with personality & gesture history
app.post("/chat", async (req, res) => {
  let { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Missing messages array" });
  }

  // Prepend system prompt with Amanda's personality and available gestures
  const systemPrompt = {
    role: "system",
    content: `You are Amanda, a knowledgeable, friendly virtual assistant. You explain concepts clearly and use gestures to emphasize points. Available animation files: teaching.glb, laughing.glb, explaining.glb, pointing_to.glb.`
  };
  messages = [systemPrompt, ...messages];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });
    const text = response.choices?.[0]?.message?.content || "";
    res.json({ text });
  } catch (err) {
    console.error("❌ /chat failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Amanda AI backend running at http://localhost:${port}`);
});

