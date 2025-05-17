import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import voice from "elevenlabs-node";
import express from "express";
import { promises as fs } from "fs";
import OpenAI from "openai/index.mjs";
import path from "path";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "-", // Replace with a proper API key in production
});

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "zrHiDhphv9ZnVXBqCLjz";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/voices", async (req, res) => {
  res.send(await voice.getVoices(elevenLabsApiKey));
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing command:", command);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (message) => {
  const time = Date.now();
  console.log(`Starting conversion for message ${message}`);

  // Convert mp3 to wav using ffmpeg
  await execCommand(
    `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
  );
  console.log(`Conversion done in ${Date.now() - time}ms`);

  // Determine the correct rhubarb executable path based on the platform.
  const isWindows = process.platform === "win32";
  // On Windows, the executable likely is rhubarb.exe; on others just "rhubarb".
  const rhubarbExecutable = isWindows
    ? path.join("node_modules", ".bin", "rhubarb.exe")
    : path.join("node_modules", ".bin", "rhubarb");

  // For Windows and PowerShell, prefix with .\ if needed.
  const formattedExecutable =
    isWindows && !rhubarbExecutable.startsWith(".\\")
      ? ".\\" + rhubarbExecutable
      : rhubarbExecutable;

  // Use the correct path separators for output files as well (here using quotes to be safe).
  const command = `"${formattedExecutable}" -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`;

  // Execute the command
  await execCommand(command);
  console.log(`Lip sync done in ${Date.now() - time}ms`);
};

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    max_tokens: 1000,
    temperature: 0.6,
    response_format: {
      type: "json_object",
    },
    messages: [
      {
        role: "system",
            content: `
You are a virtual assistant. Your name is Thelma. You will always reply with a JSON array of exactly one message
 (with properties: text, facialExpression, and animation). Make sure that if you need time to search for information,
  you include an indication (such as '...') in the single message's text rather than sending two separate messages.
   The allowed facial expressions are: thinking, smile, sad, angry, surprised, funnyFace, and default.
   Allowed animations are: lengthy_head_nod, shrugging, thoughtful_nod, agreeing, laughing, pointing, calling, argue, explain, texting, typing, and talking.
 The person you're talking to is Jason. Do not output any additional text. Please return only a valid JSON array.

        
        `,
      },
      {
        role: "user",
        content: userMessage || "Hello",
      },
    ],
  });

  let messages = JSON.parse(completion.choices[0].message.content);
  if (messages.messages) {
    messages = messages.messages;
  }

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    // generate audio file
    const fileName = `audios/message_${i}.mp3`;
    const textInput = message.text;
    await voice.textToSpeech(elevenLabsApiKey, voiceID, fileName, textInput);
    // generate lip sync transcript
    await lipSyncMessage(i);
    message.audio = await audioFileToBase64(fileName);
    message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
  }

  res.send({ messages });
});

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`Virtual Assistant listening on port ${port}`);
});
