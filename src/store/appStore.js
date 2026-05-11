import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      language: 'hi',
      setLanguage: (lang) => set({ language: lang }),
      
      aiSource: 'cloud', // 'cloud' or 'local'
      setAiSource: (source) => set({ aiSource: source }),
      
      cloudModel: 'google/gemini-2.0-flash-lite-preview-02-05:free',
      setCloudModel: (model) => set({ cloudModel: model }),
      
      localModel: 'llama3.2-vision',
      setLocalModel: (model) => set({ localModel: model }),

      // Custom API Keys
      customGeminiKey: '',
      setCustomGeminiKey: (key) => set({ customGeminiKey: key }),
      customOpenRouterKey: '',
      setCustomOpenRouterKey: (key) => set({ customOpenRouterKey: key }),

      user: null, 
      plan: null, 
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null, plan: null }),
      setPlan: (planId) => set({ plan: planId }),
      history: [],
      addHistory: (item) => set((state) => ({ 
        history: [item, ...state.history].slice(0, 20) 
      })),
      
      currentDiagnosis: null,
      setCurrentDiagnosis: (diagnosis) => set({ currentDiagnosis: diagnosis }),
      
      weather: null,
      setWeather: (data) => set({ weather: data }),
      
      isScanning: false,
      setScanning: (status) => set({ isScanning: status }),
      
      lastUploadedImage: null,
      setLastUploadedImage: (image) => set({ lastUploadedImage: image }),
    }),
    {
      name: 'kisanmitra-storage',
      partialize: (state) => ({ 
        language: state.language, 
        history: state.history,
        aiSource: state.aiSource,
        cloudModel: state.cloudModel,
        localModel: state.localModel,
        customGeminiKey: state.customGeminiKey,
        customOpenRouterKey: state.customOpenRouterKey
      }),
    }
  )
);
