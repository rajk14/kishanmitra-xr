import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { X, Check, Zap, Shield, Crown } from 'lucide-react';

const PLANS = [
  {
    id: 'free',
    name: 'Free Starter',
    price: '₹0',
    features: ['3 Scans/day', 'Basic Chatbot', 'Community Support'],
    icon: <Zap size={24} className="text-muted" />,
    color: 'bg-surface'
  },
  {
    id: 'basic',
    name: 'Farmer Pro',
    price: '₹199/mo',
    features: ['Unlimited Scans', 'Advanced Local AI', 'Weather Alerts', 'Priority Support'],
    icon: <Shield size={24} className="text-primary" />,
    color: 'bg-primary/5 border-primary/20',
    popular: true
  },
  {
    id: 'pro',
    name: 'Agriculture Expert',
    price: '₹499/mo',
    features: ['All Pro Features', 'Export Detailed Reports', 'Direct Expert Chat', 'Disease Mapping'],
    icon: <Crown size={24} className="text-accent" />,
    color: 'bg-accent/5 border-accent/20'
  }
];

const PricingModal = ({ isOpen, onClose }) => {
  const { setPlan } = useAppStore();

  const handleSelectPlan = (planId) => {
    setPlan(planId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-xl"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="glass-card w-full max-w-4xl overflow-hidden relative z-10"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-display font-bold mb-2">Choose Your Plan</h2>
                <p className="text-muted">Unlock the full power of KisanMitra AI</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ y: -5 }}
                  className={`p-6 rounded-2xl border flex flex-col ${plan.color} relative overflow-hidden`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-background text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-4 border border-border">
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                    <div className="text-2xl font-display font-bold text-text">{plan.price}</div>
                  </div>

                  <div className="space-y-4 flex-1 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-muted">
                        <Check size={16} className="text-primary mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      plan.popular 
                        ? 'bg-primary text-background hover:scale-[1.02]' 
                        : 'bg-surface border border-border hover:border-primary text-text'
                    }`}
                  >
                    Select Plan
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PricingModal;
