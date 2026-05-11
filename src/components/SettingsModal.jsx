import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Cloud, Check } from 'lucide-react';
import { useAppStore } from '../store/appStore';

const CLOUD_MODELS = [
  { id: 'openrouter/free', name: 'OpenRouter Free (Auto-Select)' },
  { id: 'google/gemini-2.0-flash-lite-preview-02-05:free', name: 'Gemini 2.0 Flash Lite (Recommended)' },
  { id: 'google/gemma-3-4b-it:free', name: 'Gemma 3 4B (Google Free)' },
  { id: 'google/gemma-3-12b-it:free', name: 'Gemma 3 12B (Google Free)' },
  { id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B (High Quality)' },
  { id: 'meta-llama/llama-3.2-11b-vision-instruct:free', name: 'Llama 3.2 Vision 11B' },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1 24B' },
  { id: 'moonshotai/kimi-vl-a3b-thinking:free', name: 'Moonshot Kimi VL (Thinking)' },
  { id: 'google/gemma-4-31b-it', name: 'Gemma 4 31B (Google New)' },
  { id: 'qwen/qwen2.5-vl-32b-instruct:free', name: 'Qwen 2.5 VL 32B (Great Vision)' },
  { id: 'qwen/qwen2.5-vl-72b-instruct:free', name: 'Qwen 2.5 VL 72B (Pro Vision)' },
];

const LOCAL_MODELS = [
  { id: 'glm-4.6:cloud', name: 'Ollama: GLM-4.6 (Cloud Tag)' },
  { id: 'gpt-oss:120b-cloud', name: 'Ollama: GPT-OSS 120B (Cloud Tag)' },
  { id: 'qwen3-vl:235b-cloud', name: 'Ollama: Qwen 3 VL 235B (Cloud Tag)' },
  { id: 'qwen3.5:397b-cloud', name: 'Ollama: Qwen 3.5 397B (Cloud Tag)' },
  { id: 'gemma3:12b-cloud', name: 'Ollama: Gemma 3 12B Cloud' },
  { id: 'gemma4:31b-cloud', name: 'Ollama: Gemma 4 31B Cloud' },
  { id: 'gemma2', name: 'Ollama: Gemma 2 (Google)' },
  { id: 'llama3.2-vision', name: 'Ollama: Llama 3.2 Vision (Recommended)' },
  { id: 'llava', name: 'Ollama: LLaVA' },
  { id: 'bakllava', name: 'Ollama: BakLLaVA' },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const { 
    aiSource, setAiSource, 
    cloudModel, setCloudModel, 
    localModel, setLocalModel 
  } = useAppStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-lg overflow-hidden relative z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-display font-bold">App Settings</h2>
              <button onClick={onClose} className="p-2 hover:bg-surface rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
              {/* Language Selection */}
              <div>
                <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Language / भाषा</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => useAppStore.getState().setLanguage('en')}
                    className={`p-3 rounded-xl border transition-all font-bold ${
                      useAppStore.getState().language === 'en' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-muted'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => useAppStore.getState().setLanguage('hi')}
                    className={`p-3 rounded-xl border transition-all font-bold ${
                      useAppStore.getState().language === 'hi' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-muted'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              </div>

              {/* Source Selection */}
              <div>
                <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">AI Source</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setAiSource('cloud')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                      aiSource === 'cloud' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-muted'
                    }`}
                  >
                    <Cloud size={24} />
                    <span className="font-bold">Cloud AI</span>
                  </button>
                  <button
                    onClick={() => setAiSource('local')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${
                      aiSource === 'local' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-muted'
                    }`}
                  >
                    <Cpu size={24} />
                    <span className="font-bold">Local AI</span>
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">
                  {aiSource === 'cloud' ? 'Cloud Model Selection' : 'Local Model Selection (Ollama)'}
                </h3>
                <div className="space-y-2">
                  {(aiSource === 'cloud' ? CLOUD_MODELS : LOCAL_MODELS).map(model => (
                    <button
                      key={model.id}
                      onClick={() => aiSource === 'cloud' ? setCloudModel(model.id) : setLocalModel(model.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        (aiSource === 'cloud' ? cloudModel === model.id : localModel === model.id)
                          ? 'bg-primary/5 border-primary/30 text-primary'
                          : 'bg-surface/50 border-border/50 text-text hover:border-border'
                      }`}
                    >
                      <span className="text-sm font-medium">{model.name}</span>
                      {(aiSource === 'cloud' ? cloudModel === model.id : localModel === model.id) && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface/50 border-t border-border">
              <button 
                onClick={onClose}
                className="btn-primary w-full"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
