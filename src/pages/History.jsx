import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { translations } from '../i18n/translations';
import { Calendar, ChevronRight, Shield, AlertTriangle, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

import { useUser } from "@clerk/clerk-react";
import { supabase } from '../lib/supabase';

const History = () => {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { language, setCurrentDiagnosis } = useAppStore();
  const [dbHistory, setDbHistory] = React.useState([]);
  const [fetching, setFetching] = React.useState(true);
  const [error, setError] = React.useState(null);
  const t = translations[language];
  const navigate = useNavigate();

  const fetchHistory = async () => {
    if (!isSignedIn || !clerkUser) {
      setFetching(false);
      return;
    }

    setFetching(true);
    setError(null);

    try {
      const { data, error: dbError } = await supabase
        .from('scans')
        .select('*')
        .eq('user_id', clerkUser.id)
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      
      const formattedData = data.map(scan => ({
        ...scan.diagnosis_data,
        image: scan.image_url,
        date: scan.created_at,
        id: scan.id
      }));
      
      setDbHistory(formattedData);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, [isSignedIn, clerkUser]);

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

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case 'None':
      case 'Healthy':
      case 'Safe': return null;
      case 'Mild': return <Shield size={14} />;
      case 'Moderate': return <Info size={14} />;
      case 'Severe': return <AlertTriangle size={14} />;
      default: return null;
    }
  };

  const handleViewDetails = (item) => {
    setCurrentDiagnosis(item);
    navigate('/diagnose');
  };

  if (!isLoaded || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.history}</h1>
          <p className="text-muted">{language === 'hi' ? 'आपके पिछले निदान यहाँ सुरक्षित हैं' : 'Your past diagnoses are saved here'}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-display font-bold text-primary">{dbHistory.length}</span>
          <p className="text-xs text-muted uppercase tracking-widest">{language === 'hi' ? 'कुल निदान' : 'Total Scans'}</p>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-danger/10 border border-danger/20 rounded-xl text-danger flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <div>
              <p className="font-bold">{language === 'hi' ? 'डेटा लोड करने में समस्या' : 'Error Loading History'}</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
          <button 
            onClick={() => fetchHistory()}
            className="px-4 py-2 bg-danger text-white rounded-lg text-sm font-bold hover:bg-danger/80 transition-colors"
          >
            {language === 'hi' ? 'दोबारा कोशिश करें' : 'Retry'}
          </button>
        </div>
      )}

      {dbHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center text-muted mb-6 border border-border">
            <Calendar size={48} className="opacity-20" />
          </div>
          <h3 className="text-2xl font-bold mb-2">{t.no_history}</h3>
          <p className="text-muted mb-8">{language === 'hi' ? 'आज ही अपनी पहली फसल स्कैन करें' : 'Start your first crop scan today'}</p>
          <button onClick={() => navigate('/diagnose')} className="btn-primary">
            {t.scan_title}
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dbHistory.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, borderColor: 'rgba(0, 255, 136, 0.3)' }}
              className="glass-card overflow-hidden group cursor-pointer"
              onClick={() => handleViewDetails(item)}
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={item.image} alt={item.disease_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <div className={clsx("px-2 py-1 rounded-md border text-[10px] font-bold flex items-center gap-1", getSeverityColor(item.severity))}>
                    {getSeverityIcon(item.severity)}
                    {item.severity}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.disease_name}</h3>
                  <ChevronRight size={20} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-muted text-sm mb-4">{item.crop_name}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted uppercase tracking-widest font-bold">
                  <Calendar size={12} />
                  {new Date(item.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
