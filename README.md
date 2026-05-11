# KisanMitra XR AI 🌿

An immersive AI-powered crop disease detection platform for Indian farmers.

## 🚀 Features

- **AI Diagnosis**: Upload a crop photo and get instant disease identification using OpenRouter (Gemini Free models).
- **XR Canvas Overlay**: Visual hotspots highlighting exactly where the disease is detected.
- **Hindi Voice Support**: Audio results read aloud in Hindi for accessibility.
- **AI Chatbot**: A dedicated agricultural assistant answering questions in Hindi.
- **Dark Mode UI**: Futuristic cinematic design with glassmorphism effects.
- **History Tracking**: Keep track of previous diagnoses locally.
- **Learning Center**: Explore common crop diseases and their treatments.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Framer Motion (Animations)
- **AI Engine**: OpenRouter (Gemini 2.0 Flash Lite Free)
- **State Management**: Zustand
- **Routing**: React Router v6
- **Voice**: Web Speech API (window.speechSynthesis)

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root and add your OpenRouter API key:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This project is configured for easy deployment on **Vercel**. Simply connect your GitHub repository and add the environment variables in the Vercel dashboard.

---

Built with ❤️ for Indian Farmers.
