import { useState, useRef, useCallback, useEffect } from 'react';

// Target sample rate for Whisper model
const TARGET_SAMPLE_RATE = 16000;

export type SpeechToTextStatus = 
  | 'idle'          // Initial state - ready to start
  | 'loading'       // Loading the model
  | 'ready'         // Model loaded, ready to record
  | 'recording'     // Recording audio
  | 'processing'    // Transcribing audio
  | 'error';        // Error state

export interface UseSpeechToTextReturn {
  status: SpeechToTextStatus;
  progress: number;
  error: string | null;
  transcript: string | null;
  isModelLoaded: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  loadModel: () => void;
}

/**
 * Resample audio to target sample rate (16000Hz for Whisper)
 */
function resampleAudio(
  audioData: Float32Array,
  sourceSampleRate: number,
  targetSampleRate: number
): Float32Array {
  if (sourceSampleRate === targetSampleRate) {
    return audioData;
  }

  const ratio = sourceSampleRate / targetSampleRate;
  const newLength = Math.round(audioData.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const srcIndex = i * ratio;
    const srcIndexFloor = Math.floor(srcIndex);
    const srcIndexCeil = Math.min(srcIndexFloor + 1, audioData.length - 1);
    const frac = srcIndex - srcIndexFloor;
    
    // Linear interpolation
    result[i] = audioData[srcIndexFloor] * (1 - frac) + audioData[srcIndexCeil] * frac;
  }

  return result;
}

/**
 * Custom hook for Speech-to-Text using Whisper model in a Web Worker
 */
export function useSpeechToText(onTranscript?: (text: string) => void): UseSpeechToTextReturn {
  const [status, setStatus] = useState<SpeechToTextStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * Initialize the Web Worker
   */
  const initWorker = useCallback(() => {
    if (workerRef.current) return;

    workerRef.current = new Worker(
      new URL('../workers/whisper-worker.js', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { type, progress: prog, text, error: err, status: msgStatus } = event.data;

      switch (type) {
        case 'progress':
          setProgress(prog || 0);
          if (msgStatus === 'initiate') {
            setStatus('loading');
          }
          break;

        case 'ready':
          setStatus('ready');
          setIsModelLoaded(true);
          setProgress(100);
          break;

        case 'result':
          setTranscript(text);
          setStatus('ready');
          if (onTranscript && text) {
            onTranscript(text);
          }
          break;

        case 'error':
          setError(err);
          setStatus('error');
          break;
      }
    };

    workerRef.current.onerror = (err) => {
      setError(err.message || 'Worker error');
      setStatus('error');
    };
  }, [onTranscript]);

  /**
   * Load the Whisper model
   */
  const loadModel = useCallback(() => {
    if (isModelLoaded) return;
    
    initWorker();
    setStatus('loading');
    setProgress(0);
    setError(null);

    workerRef.current?.postMessage({ type: 'load' });
  }, [initWorker, isModelLoaded]);

  /**
   * Start recording audio
   */
  const startRecording = useCallback(async () => {
    if (status === 'recording') return;
    
    // If model not loaded, load it first
    if (!isModelLoaded) {
      loadModel();
      return;
    }

    setError(null);
    setTranscript(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000, // Request higher quality, we'll resample
        } 
      });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setStatus('recording');
    } catch (err: any) {
      setError(err.message || 'Failed to access microphone');
      setStatus('error');
    }
  }, [status, isModelLoaded, loadModel]);

  /**
   * Stop recording and process the audio
   */
  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || status !== 'recording') return;

    mediaRecorderRef.current.stop();
    setStatus('processing');

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Process the recorded audio
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      try {
        // Convert to AudioBuffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Get audio data (mono)
        let audioData: Float32Array;
        if (audioBuffer.numberOfChannels > 1) {
          // Mix down to mono
          const left = audioBuffer.getChannelData(0);
          const right = audioBuffer.getChannelData(1);
          audioData = new Float32Array(left.length);
          for (let i = 0; i < left.length; i++) {
            audioData[i] = (left[i] + right[i]) / 2;
          }
        } else {
          audioData = audioBuffer.getChannelData(0);
        }

        // Resample to 16000Hz
        const resampledData = resampleAudio(
          audioData,
          audioBuffer.sampleRate,
          TARGET_SAMPLE_RATE
        );

        // Send to worker for transcription
        workerRef.current?.postMessage({
          type: 'transcribe',
          audio: resampledData
        });

        await audioContext.close();
      } catch (err: any) {
        setError(err.message || 'Failed to process audio');
        setStatus('error');
      }
    };

    mediaRecorderRef.current = null;
  }, [status]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      workerRef.current?.terminate();
    };
  }, []);

  return {
    status,
    progress,
    error,
    transcript,
    isModelLoaded,
    startRecording,
    stopRecording,
    loadModel,
  };
}
