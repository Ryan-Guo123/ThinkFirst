/**
 * Whisper Speech-to-Text Web Worker
 * 
 * This worker handles the loading and inference of the Whisper model
 * in an isolated thread to prevent blocking the main UI thread.
 */

import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js environment
env.allowLocalModels = false;
env.useBrowserCache = true;

let transcriber = null;

/**
 * Initialize the Whisper pipeline
 * @param {Function} progressCallback - Callback for download progress
 */
async function initializePipeline(progressCallback) {
  transcriber = await pipeline(
    'automatic-speech-recognition',
    'Xenova/whisper-tiny.en',
    {
      progress_callback: progressCallback,
    }
  );
}

/**
 * Handle incoming messages from the main thread
 */
self.onmessage = async function(event) {
  const { type, audio } = event.data;

  switch (type) {
    case 'load':
      try {
        await initializePipeline((progress) => {
          // Report download progress
          if (progress.status === 'progress') {
            const percent = progress.progress || 0;
            self.postMessage({
              type: 'progress',
              progress: Math.round(percent),
              status: progress.status,
              file: progress.file || ''
            });
          } else if (progress.status === 'done') {
            self.postMessage({
              type: 'progress',
              progress: 100,
              status: 'done',
              file: progress.file || ''
            });
          } else {
            self.postMessage({
              type: 'progress',
              progress: 0,
              status: progress.status,
              file: progress.file || ''
            });
          }
        });
        
        self.postMessage({ type: 'ready' });
      } catch (error) {
        self.postMessage({ 
          type: 'error', 
          error: error.message || 'Failed to load model' 
        });
      }
      break;

    case 'transcribe':
      if (!transcriber) {
        self.postMessage({ 
          type: 'error', 
          error: 'Model not loaded. Please load the model first.' 
        });
        return;
      }

      try {
        // Transcribe the audio
        const result = await transcriber(audio, {
          chunk_length_s: 30,
          stride_length_s: 5,
          language: 'english',
          task: 'transcribe',
          return_timestamps: false,
        });

        self.postMessage({
          type: 'result',
          text: result.text.trim()
        });
      } catch (error) {
        self.postMessage({ 
          type: 'error', 
          error: error.message || 'Transcription failed' 
        });
      }
      break;

    default:
      console.warn('Unknown message type:', type);
  }
};
