import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
// Or use gemini-2.0-flash if officially listed

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [{
        parts: [{ text: prompt }],
        role: "user"
      }]
    });

    const output = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No output";
    res.json({ output });
  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "API error" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
