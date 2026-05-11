import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import { chatWithKisanMitra } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatBot = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: language === 'hi' ? 'नमस्ते! मैं आपका किसानमित्र सहायक हूँ। मैं आपकी खेती में कैसे मदद कर सकता हूँ?' : 'Namaste! I am your KisanMitra assistant. How can I help you today?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const { aiSource, cloudModel, localModel, currentDiagnosis } = useAppStore.getState();
      const apiHistory = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await chatWithKisanMitra(text, apiHistory, aiSource, { 
        cloudModel, 
        localModel,
        currentDiagnosis 
      });
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = error.message.includes('Error:') ? error.message : (language === 'hi' ? 'AI सेवा अभी व्यस्त है। कृपया पुनः प्रयास करें।' : 'AI service is busy. Please try again.');
      setMessages([...newMessages, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = language === 'hi' 
    ? ["बीमारी", "खाद", "सरकारी योजना", "कीटनाशक"] 
    : ["Disease", "Fertilizer", "Govt Schemes", "Pesticides"];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-primary text-background rounded-full flex items-center justify-center shadow-2xl z-40 neon-glow"
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-full max-w-2xl bg-surface border-r border-border z-[200] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-background/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Bot className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">{t.chatbot_title}</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-muted">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-muted hover:text-danger p-2 bg-surface hover:bg-danger/10 rounded-xl transition-all border border-transparent hover:border-danger/20"
              >
                <X size={28} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}>
                      {m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed overflow-hidden ${m.role === 'user' ? 'bg-primary text-background font-medium rounded-tr-none' : 'bg-background border border-border text-text rounded-tl-none shadow-sm'}`}>
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="border-collapse border border-border w-full text-xs" {...props} /></div>,
                          th: ({node, ...props}) => <th className="border border-border bg-surface p-2 font-bold text-left" {...props} />,
                          td: ({node, ...props}) => <td className="border border-border p-2" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-background border border-border p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-background/50 space-y-4">
              <div className="flex flex-wrap gap-2">
                {quickReplies.map(reply => (
                  <button
                    key={reply}
                    onClick={() => handleSend(reply)}
                    className="px-3 py-1 bg-surface border border-border rounded-full text-xs text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={language === 'hi' ? 'सवाल पूछें...' : 'Ask a question...'}
                  className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 bg-primary text-background rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
