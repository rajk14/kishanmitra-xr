import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434/api/chat';

// Initialize Gemini SDK
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are KisanMitra AI, an expert agriculture diagnostic system. 
Analyze the crop image and provide a JSON response with the following structure:
{
  "is_crop": boolean,
  "crop_name": "string",
  "disease_name": "string",
  "confidence": number (0-100),
  "severity": "None" | "Mild" | "Moderate" | "Severe",
  "affected_part": "string",
  "cause": "string",
  "estimated_yield_loss": "string",
  "medicine": { "name": "string", "dose": "string", "frequency": "string" },
  "organic_option": "string",
  "treatment": ["step 1", "step 2", "step 3"],
  "voice_summary": "Short 2-line summary in Hindi for audio playback"
}
If it's not a crop, set is_crop to false. Use Hindi for text fields if possible.`;

export const diagnoseCrop = async (image, source = 'cloud', config = {}) => {
  if (source === 'cloud') {
    // Priority 1: Direct Google Gemini SDK
    if (genAI) {
      try {
        // Use gemini-1.5-flash as default for vision
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const base64Data = image.split(",")[1];
        const imagePart = {
          inlineData: { data: base64Data, mimeType: "image/jpeg" }
        };

        const result = await model.generateContent([SYSTEM_PROMPT, imagePart]);
        const response = await result.response;
        return extractJSON(response.text());
      } catch (error) {
        console.error('Direct Gemini SDK failed, trying fallback:', error);
      }
    }

    // Priority 2: OpenRouter with a very stable model ID
    try {
      // Use a more stable ID or the one selected by user
      let modelId = config.cloudModel || "google/gemini-2.0-flash-001";
      if (modelId.includes('lite-preview')) modelId = "google/gemini-2.0-flash-001"; // Safety override for outdated IDs
      
      const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: modelId,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Diagnose this crop image." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
        reasoning: { enabled: true },
        response_format: { type: "json_object" }
      }, {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kisanmitra-ai.vercel.app",
          "X-Title": "KisanMitra AI"
        }
      });

      const content = response.data.choices[0].message.content;
      return extractJSON(content);
    } catch (error) {
      console.error('Cloud AI Error:', error.response?.data || error.message);
      const serverError = error.response?.data?.error?.message || error.message;
      throw new Error(`Analysis Failed: ${serverError}`);
    }
  } else {
    // Local Ollama
    try {
      const localModel = config.localModel || 'llama3.2-vision';
      const response = await axios.post(OLLAMA_URL, {
        model: localModel,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: 'Diagnose this crop image.', images: [image.split(',')[1]] }
        ],
        stream: false,
        format: 'json'
      });
      return extractJSON(response.data.message.content);
    } catch (error) {
      throw new Error(error.code === 'ERR_NETWORK' ? 'Ollama is not running.' : `Ollama Error: ${error.message}`);
    }
  }
};

export const chatWithKisanMitra = async (message, history = [], source = 'cloud', config = {}) => {
  const CHAT_SYSTEM_PROMPT = `You are KisanMitra AI, a helpful agriculture assistant. 
  Answer the farmer's questions about crops, diseases, fertilizers, and farming techniques. 
  Current Diagnosis Context: ${JSON.stringify(config.currentDiagnosis || 'None')}
  Keep answers practical and in Hindi/English mix.`;

  if (source === 'cloud') {
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
          history: history.map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }],
          }))
        });
        const result = await chat.sendMessage(CHAT_SYSTEM_PROMPT + "\n\nUser: " + message);
        const response = await result.response;
        return response.text();
      } catch (error) {
        console.error('Direct Gemini Chat failed:', error);
      }
    }

    try {
      const model = config.cloudModel || "openrouter/free";
      const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
        model: model,
        messages: [{ role: "system", content: CHAT_SYSTEM_PROMPT }, ...history, { role: "user", content: message }],
        reasoning: { enabled: true }
      }, {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://kisanmitra-ai.vercel.app",
          "X-Title": "KisanMitra AI"
        }
      });
      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`Chat AI Error: ${error.message}`);
    }
  } else {
    try {
      const response = await axios.post(OLLAMA_URL, {
        model: config.localModel || 'llama3.2-vision',
        messages: [{ role: 'system', content: CHAT_SYSTEM_PROMPT }, ...history, { role: 'user', content: message }],
        stream: false
      });
      return response.data.message.content;
    } catch (error) {
      throw new Error(`Ollama Chat Error: ${error.message}`);
    }
  }
};

const extractJSON = (text) => {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    if (start === -1 || end === 0) throw new Error('No JSON found');
    return JSON.parse(text.substring(start, end));
  } catch (error) {
    throw new Error('Failed to parse AI response. Please try again.');
  }
};
