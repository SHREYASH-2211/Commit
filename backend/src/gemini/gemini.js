// routes/gemini.js
import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key not set." });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: "Error communicating with Gemini API." });
  }
});

export default router;
