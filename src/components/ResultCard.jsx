import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import { Shield, AlertTriangle, Info, Pill, Leaf, TrendingDown, Copy, Share2, Save, ThumbsUp, ThumbsDown, CheckCircle2, Thermometer, Droplets, Wind, AlertCircle, Calendar, Phone } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { clsx } from 'clsx';

const ResultCard = ({ diagnosis }) => {
  const { language, weather } = useAppStore();
  const t = translations[language];
  const [feedback, setFeedback] = React.useState(null); // 'up' | 'down'
  const [isCopied, setIsCopied] = React.useState(false);

  // Safeguard: Extract fields with defaults to prevent crashes
  const diseaseName = diagnosis?.disease_name || diagnosis?.disease || (language === 'hi' ? 'अज्ञात बीमारी' : 'Unknown Issue');
  const cropName = diagnosis?.crop_name || (language === 'hi' ? 'फसल' : 'Crop');
  const severity = diagnosis?.severity || 'Normal';
  const confidence = diagnosis?.confidence || 0;
  const voiceSummary = diagnosis?.voice_summary || '';
  const affectedPart = diagnosis?.affected_part || 'N/A';
  const cause = diagnosis?.cause || 'N/A';
  const yieldLoss = diagnosis?.estimated_yield_loss || '0%';
  const medicine = diagnosis?.medicine || { name: 'N/A', dose: 'N/A', frequency: 'N/A' };
  const organicOption = diagnosis?.organic_option || 'N/A';
  const treatment = Array.isArray(diagnosis?.treatment) ? diagnosis.treatment : [];

  const handleCopy = async () => {
    const text = `${cropName} - ${diseaseName}\n\nCause: ${cause}\nMedicine: ${medicine?.name || 'N/A'}\nTreatment: ${treatment.join(', ')}`;
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `KisanMitra Report: ${cropName}`,
          text: `Check out this crop diagnosis: ${diseaseName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      handleCopy();
      alert('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    alert(language === 'hi' ? 'रिपोर्ट आपके इतिहास में सहेजी गई!' : 'Report saved to your history!');
  };

  const getSeverityColor = (sev) => {
    switch (sev) {
      case 'None':
      case 'Healthy':
      case 'Safe': return 'text-success bg-success/10 border-success/20';
      case 'Mild': return 'text-success bg-success/10 border-success/20';
      case 'Moderate': return 'text-warning bg-warning/10 border-warning/20';
      case 'Severe': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'None':
      case 'Healthy':
      case 'Safe': return <CheckCircle2 size={16} />;
      case 'Mild': return <Shield size={16} />;
      case 'Moderate': return <Info size={16} />;
      case 'Severe': return <AlertTriangle size={16} />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="glass-card w-full max-w-4xl mx-auto overflow-hidden border-primary/20 shadow-2xl mb-20"
    >
      {/* Premium Header */}
      <div className="p-8 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">AI Analysis Report</span>
              <span className={clsx("flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold capitalize", getSeverityColor(severity))}>
                {getSeverityBadge(severity)}
                {severity === 'None' || severity === 'Safe' || severity === 'Healthy' ? (language === 'hi' ? 'सुरक्षित' : 'Safe') : severity}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-text mb-2 tracking-tight">{diseaseName}</h2>
            <div className="flex items-center gap-4 text-muted">
              <span className="flex items-center gap-1.5 font-bold"><Leaf size={16} className="text-primary" /> {cropName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border" />
              <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <VoiceButton text={voiceSummary} />
            <button className="bg-primary text-background p-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              <Phone size={24} />
            </button>
          </div>
        </div>

        {/* Confidence Gauge */}
        <div className="bg-background/40 p-4 rounded-2xl border border-border/50">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Analysis Confidence</span>
            <span className="text-2xl font-display font-black text-primary">{confidence}%</span>
          </div>
          <div className="h-2.5 bg-surface rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary relative"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Weather Impact Section */}
        {weather && weather.main && (
          <section className="bg-secondary/5 border border-secondary/20 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Wind size={80} />
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-black text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Wind size={18} /> Weather Impact Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                    <Thermometer size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase">Temp</p>
                    <p className="font-bold">{weather.main.temp || 'N/A'}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase">Humidity</p>
                    <p className="font-bold">{weather.main.humidity || 'N/A'}%</p>
                  </div>
                </div>
                <div className="bg-background/60 p-3 rounded-xl border border-secondary/10 flex-1">
                  <p className="text-xs font-medium leading-relaxed">
                    <span className="text-secondary font-bold">Alert:</span> {weather.main.humidity > 70 ? 'High humidity may accelerate spore growth.' : 'Weather conditions are stable.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-10">
          {/* Left Column: Diagnostics */}
          <div className="space-y-8">
            <section className="p-6 bg-surface rounded-3xl border border-border/50">
              <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-primary" /> Key Observations
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase mb-0.5">Affected Part</p>
                    <p className="text-sm font-bold">{affectedPart}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase mb-0.5">Root Cause</p>
                    <p className="text-sm leading-relaxed">{cause}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-danger mt-2" />
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase mb-0.5">Estimated Yield Loss</p>
                    <p className="text-lg font-black text-danger">{yieldLoss}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Shield size={16} /> Treatment Solution
              </h3>
              <div className="bg-background p-4 rounded-2xl border border-primary/20 mb-4">
                <p className="text-xs font-bold text-muted uppercase mb-1">Recommended Medicine</p>
                <p className="text-xl font-black text-primary">{medicine?.name || 'N/A'}</p>
                <div className="flex gap-4 mt-2 text-xs font-bold">
                  <span className="px-2 py-1 bg-primary/10 rounded">{medicine?.dose || 'N/A'}</span>
                  <span className="px-2 py-1 bg-primary/10 rounded">{medicine?.frequency || 'N/A'}</span>
                </div>
              </div>
              <p className="text-xs font-medium text-muted leading-relaxed italic">
                * {organicOption}
              </p>
            </section>
          </div>

          {/* Right Column: Steps & Safety */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" /> Step-by-Step Action
              </h3>
              <div className="space-y-3">
                {treatment.length > 0 ? treatment.map((step, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-surface rounded-2xl border border-border/50 hover:border-primary/30 transition-all">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium leading-relaxed">{step}</p>
                  </div>
                )) : (
                  <p className="text-sm text-muted">No specific steps provided.</p>
                )}
              </div>
            </section>

            <section className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-3xl">
              <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Shield size={16} /> Spray Safety Precautions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {['Wear PPE Kit', 'Spray with Wind', 'Keep Away from Kids', 'Wash Hands After'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-muted">
                    <div className="w-1 h-1 rounded-full bg-orange-500" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Weekly Timeline */}
        <section className="pt-8 border-t border-border/50">
          <h3 className="text-xs font-black text-muted uppercase tracking-widest mb-6 flex items-center gap-2 text-center justify-center">
            <Calendar size={16} /> Recommended 7-Day Timeline
          </h3>
          <div className="flex justify-between items-start gap-2 overflow-x-auto pb-4">
            {[
              { day: 'Day 1', task: 'First Spray', status: 'critical' },
              { day: 'Day 3', task: 'Monitor Results', status: 'normal' },
              { day: 'Day 5', task: 'Soil Irrigation', status: 'normal' },
              { day: 'Day 7', task: 'Expert Review', status: 'important' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 min-w-[100px]">
                <div className={clsx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-lg",
                  step.status === 'critical' ? "bg-danger text-background" : "bg-surface border border-border"
                )}>
                  {step.day}
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-tighter mb-0.5">{step.day}</p>
                  <p className="text-[11px] font-medium leading-tight text-muted">{step.task}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Action Footer */}
      <div className="p-6 md:p-8 bg-surface/50 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start border-b sm:border-none pb-4 sm:pb-0 border-border/50">
          <span className="text-sm text-muted font-black uppercase tracking-widest">Helpful?</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setFeedback('up')}
              className={clsx(
                "p-3 rounded-2xl transition-all border shadow-sm",
                feedback === 'up' ? "bg-success text-background border-success" : "bg-background text-muted border-border hover:border-success/50"
              )}
            >
              <ThumbsUp size={20} />
            </button>
            <button 
              onClick={() => setFeedback('down')}
              className={clsx(
                "p-3 rounded-2xl transition-all border shadow-sm",
                feedback === 'down' ? "bg-danger text-background border-danger" : "bg-background text-muted border-border hover:border-danger/50"
              )}
            >
              <ThumbsDown size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-background border border-border rounded-2xl text-xs font-black uppercase tracking-widest hover:border-primary transition-all active:scale-95"
          >
            <Copy size={16} className={isCopied ? "text-primary" : ""} />
            {isCopied ? 'Copied' : 'Copy'}
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 px-5 py-3.5 bg-background border border-border rounded-2xl text-xs font-black uppercase tracking-widest hover:border-secondary transition-all active:scale-95"
          >
            <Share2 size={16} />
            Share
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-background rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/30"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
