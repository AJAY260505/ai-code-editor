import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

dotenv.config();
console.log("🚀 index.js is running");
const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // ✅ Allow frontend origin
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const tempDir = path.join(process.cwd(), 'temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ==========================
// AI Explanation Endpoint
// ==========================
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{ parts: [{ text: prompt }], role: "user" }]
    });

    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No output";
    res.json({ explanation: output }); // 🧠 Use `explanation` key for frontend match
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "AI API error" });
  }
});

// Optional alias
app.post('/ai', async (req, res) => {
  req.body.prompt = req.body.code; // assume code sent from frontend
  app._router.handle(req, res, () => {}, 'POST', '/generate');
});

// ==========================
// Code Execution Endpoint
// ==========================
app.post('/run', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const id = uuid();
  let ext, command;

  if (language === 'javascript') {
    ext = 'js';
    command = `node "${path.join(tempDir, `${id}.js`)}"`;
  } else if (language === 'python') {
    ext = 'py';
    command = `python "${path.join(tempDir, `${id}.py`)}"`;
  } else {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const filePath = path.join(tempDir, `${id}.${ext}`);
  try {
    fs.writeFileSync(filePath, code);
  } catch (err) {
    return res.status(500).json({ error: 'File write failed' });
  }

  exec(command, (err, stdout, stderr) => {
    fs.unlink(filePath, () => {}); // clean up

    if (err) {
      return res.json({ output: stderr || err.message });
    }

    res.json({ output: stdout });
  });
});

// ==========================
// Start Server
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
