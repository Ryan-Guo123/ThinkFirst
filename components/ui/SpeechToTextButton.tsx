import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2, Square } from 'lucide-react';
import { useSpeechToText, SpeechToTextStatus } from '../../hooks/useSpeechToText';

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({
  onTranscript,
  disabled = false,
  className = '',
}) => {
  const {
    status,
    progress,
    error,
    isModelLoaded,
    startRecording,
    stopRecording,
    loadModel,
  } = useSpeechToText(onTranscript);

  const handleClick = () => {
    if (disabled) return;

    switch (status) {
      case 'idle':
        // First click loads the model
        loadModel();
        break;
      case 'ready':
        // Ready to record
        startRecording();
        break;
      case 'recording':
        // Stop recording
        stopRecording();
        break;
      case 'loading':
      case 'processing':
        // Do nothing while loading/processing
        break;
      case 'error':
        // Retry loading or recording
        if (!isModelLoaded) {
          loadModel();
        } else {
          startRecording();
        }
        break;
    }
  };

  const getTooltipText = (): string => {
    switch (status) {
      case 'idle':
        return 'Click to enable voice input (first time will download model ~40MB)';
      case 'loading':
        return `Loading model... ${progress}%`;
      case 'ready':
        return 'Click to start recording';
      case 'recording':
        return 'Click to stop recording';
      case 'processing':
        return 'Transcribing...';
      case 'error':
        return error || 'Error occurred. Click to retry.';
      default:
        return 'Voice input';
    }
  };

  const getButtonStyle = (): string => {
    const baseStyle = 'relative flex items-center justify-center p-2 rounded-full transition-all duration-300';
    
    switch (status) {
      case 'recording':
        return `${baseStyle} bg-red-100 text-red-600 hover:bg-red-200 animate-pulse`;
      case 'loading':
      case 'processing':
        return `${baseStyle} bg-brand-50 text-brand-600`;
      case 'error':
        return `${baseStyle} bg-red-50 text-red-500 hover:bg-red-100`;
      case 'ready':
        return `${baseStyle} bg-brand-50 text-brand-600 hover:bg-brand-100`;
      default:
        return `${baseStyle} text-stone-400 hover:text-stone-600 hover:bg-stone-100`;
    }
  };

  const renderIcon = () => {
    switch (status) {
      case 'loading':
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'recording':
        return <Square className="w-4 h-4 fill-current" />;
      case 'error':
        return <MicOff className="w-5 h-5" />;
      default:
        return <Mic className="w-5 h-5" />;
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <button
        onClick={handleClick}
        disabled={disabled || status === 'loading' || status === 'processing'}
        className={getButtonStyle()}
        title={getTooltipText()}
        aria-label={getTooltipText()}
      >
        {renderIcon()}
        
        {/* Progress ring for loading state */}
        {status === 'loading' && progress > 0 && progress < 100 && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 36 36"
          >
            <circle
              className="stroke-brand-200"
              strokeWidth="3"
              fill="transparent"
              r="16"
              cx="18"
              cy="18"
            />
            <circle
              className="stroke-brand-500 transition-all duration-300"
              strokeWidth="3"
              strokeLinecap="round"
              fill="transparent"
              r="16"
              cx="18"
              cy="18"
              strokeDasharray={`${progress} 100`}
            />
          </svg>
        )}
        
        {/* Recording indicator pulse */}
        {status === 'recording' && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-stone-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg"
        >
          {getTooltipText()}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-900"></div>
        </motion.div>
      </AnimatePresence>

      {/* Status indicator below button */}
      <AnimatePresence>
        {(status === 'loading' || status === 'processing' || status === 'recording') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap"
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              status === 'recording' 
                ? 'bg-red-100 text-red-600' 
                : 'bg-brand-50 text-brand-600'
            }`}>
              {status === 'loading' && `${progress}%`}
              {status === 'recording' && 'Listening...'}
              {status === 'processing' && 'Transcribing...'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
