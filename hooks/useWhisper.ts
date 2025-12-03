import { useState, useEffect, useRef, useCallback } from 'react';

export interface WhisperHook {
    isRecording: boolean;
    isTranscribing: boolean;
    transcript: string | null;
    isLoadingModel: boolean;
    loadingProgress: number | null;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
}

export function useWhisper(onTranscript?: (text: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState<string | null>(null);
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState<number | null>(null); // 0-100
    const [isModelLoaded, setIsModelLoaded] = useState(false);

    const worker = useRef<Worker | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const processor = useRef<ScriptProcessorNode | null>(null);
    const audioData = useRef<Float32Array[]>([]);

    // Use a ref for the callback to avoid re-initializing the worker when the callback changes
    const onTranscriptRef = useRef(onTranscript);
    useEffect(() => {
        onTranscriptRef.current = onTranscript;
    }, [onTranscript]);

    useEffect(() => {
        // Initialize worker
        if (!worker.current) {
            worker.current = new Worker(new URL('../workers/worker.js', import.meta.url), {
                type: 'module'
            });

            worker.current.onmessage = (event) => {
                const { type, data } = event.data;
                switch (type) {
                    case 'download':
                        // data usually contains { status: 'progress', progress: 0-100, file: '...' } or similar
                        // transformers.js progress callback: { status: 'progress', name: string, file: string, loaded: number, total: number, progress: number }
                        if (data.status === 'progress') {
                            setIsLoadingModel(true);
                            setLoadingProgress(Math.round(data.progress)); // 0-100
                        } else if (data.status === 'done') {
                            // Single file done
                        } else if (data.status === 'ready') {
                             setIsLoadingModel(false);
                             setLoadingProgress(null);
                        }
                        break;
                    case 'ready':
                        setIsModelLoaded(true);
                        setIsLoadingModel(false);
                        setLoadingProgress(null);
                        break;
                    case 'result':
                        setIsTranscribing(false);
                        setTranscript(data);
                        if (onTranscriptRef.current) {
                            onTranscriptRef.current(data);
                        }
                        break;
                    case 'error':
                        console.error("Whisper Worker Error:", data);
                        setIsTranscribing(false);
                        setIsLoadingModel(false);
                        break;
                }
            };
        }

        return () => {
            worker.current?.terminate();
            worker.current = null;
        };
    }, []);

    const loadModel = useCallback(() => {
        if (!worker.current) return;
        setIsLoadingModel(true);
        worker.current.postMessage({ type: 'load' });
    }, []);

    const processAudio = (e: AudioProcessingEvent) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Clone the data to avoid it being overwritten
        audioData.current.push(new Float32Array(inputData));
    };

    const startRecording = async () => {
        if (!isModelLoaded && !isLoadingModel) {
            loadModel();
            return;
        }

        if (isLoadingModel) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStream.current = stream;

            // Don't force 16kHz here, browsers often ignore it or return 48kHz anyway.
            // We will resample manually.
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioContext.current = new AudioContextClass();

            const source = audioContext.current.createMediaStreamSource(stream);

            // ScriptProcessorNode is deprecated but widely supported for simple use cases without extra files
            processor.current = audioContext.current.createScriptProcessor(4096, 1, 1);

            processor.current.onaudioprocess = processAudio;

            source.connect(processor.current);
            processor.current.connect(audioContext.current.destination);

            audioData.current = [];
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const stopRecording = async () => {
        if (!isRecording) return;

        // Cleanup audio resources
        if (processor.current && audioContext.current) {
            processor.current.disconnect();
            audioContext.current.close();
        }

        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
        }

        setIsRecording(false);
        setIsTranscribing(true);

        // Merge audio buffers
        const totalLength = audioData.current.reduce((acc, val) => acc + val.length, 0);
        const result = new Float32Array(totalLength);
        let offset = 0;
        for (const buffer of audioData.current) {
            result.set(buffer, offset);
            offset += buffer.length;
        }

        // Resample if necessary (Whisper expects 16000Hz)
        let finalAudio = result;
        const currentSampleRate = audioContext.current?.sampleRate || 44100;
        const targetSampleRate = 16000;

        if (currentSampleRate !== targetSampleRate) {
            console.log(`Resampling from ${currentSampleRate} to ${targetSampleRate}`);
            finalAudio = resampleAudio(result, currentSampleRate, targetSampleRate);
        }

        // Send to worker
        if (worker.current) {
            worker.current.postMessage({
                type: 'generate',
                audio: finalAudio
            });
        }
    };

    return {
        isRecording,
        isTranscribing,
        transcript,
        isLoadingModel,
        loadingProgress,
        startRecording,
        stopRecording
    };
}

// Simple linear interpolation resampler
function resampleAudio(audioBuffer: Float32Array, sampleRate: number, targetRate: number): Float32Array {
    if (sampleRate === targetRate) return audioBuffer;

    const ratio = sampleRate / targetRate;
    const newLength = Math.ceil(audioBuffer.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
        const originalIndex = i * ratio;
        const index1 = Math.floor(originalIndex);
        const index2 = Math.min(index1 + 1, audioBuffer.length - 1);
        const fraction = originalIndex - index1;

        // Linear interpolation
        result[i] = audioBuffer[index1] * (1 - fraction) + audioBuffer[index2] * fraction;
    }

    return result;
}
