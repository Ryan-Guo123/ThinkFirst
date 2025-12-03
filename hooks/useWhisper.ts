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

            // Start loading model immediately or lazy load?
            // Requirement: "Initial state: Click to enable voice input (first time need download model)"
            // So we don't load immediately. We load on first click.
        }

        return () => {
            worker.current?.terminate();
            worker.current = null;
        };
    }, []); // Empty dependency array to run only once

    const loadModel = useCallback(() => {
        if (!worker.current) return;
        setIsLoadingModel(true);
        worker.current.postMessage({ type: 'load' });
    }, []);

    const processAudio = (e: AudioProcessingEvent) => {
        const inputData = e.inputBuffer.getChannelData(0);
        // Clone the data
        audioData.current.push(new Float32Array(inputData));
    };

    const startRecording = async () => {
        if (!isModelLoaded && !isLoadingModel) {
            loadModel();
            // We wait for model to load? Or just start loading and tell user?
            // "Initial state: Click to enable voice input (first time need download model)"
            // Let's assume user clicks button -> if not loaded, load.
            // But we can't record while loading model efficiently or UI might be confusing.
            // Let's return and let the UI show loading state.
            return;
        }

        if (isLoadingModel) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStream.current = stream;

            // Use 16000Hz sample rate as required by Whisper
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioContext.current = new AudioContextClass({ sampleRate: 16000 });

            const source = audioContext.current.createMediaStreamSource(stream);
            // ScriptProcessorNode is deprecated but widely supported. AudioWorklet is better but more complex to setup in a single file without extra files.
            // bufferSize 4096 gives ~0.25s latency at 16kHz
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

        // Send to worker
        if (worker.current) {
            worker.current.postMessage({
                type: 'generate',
                audio: result
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
