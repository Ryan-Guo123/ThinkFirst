
import { pipeline } from '@xenova/transformers';

class AutomaticSpeechRecognitionPipeline {
    static task = 'automatic-speech-recognition';
    static model = 'Xenova/whisper-tiny.en';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { quantized: true, progress_callback });
        }
        return this.instance;
    }
}

self.addEventListener('message', async (event) => {
    const message = event.data;

    if (message.type === 'load') {
        try {
            await AutomaticSpeechRecognitionPipeline.getInstance((data) => {
                self.postMessage({
                    type: 'download',
                    data: data
                });
            });
            self.postMessage({ type: 'ready' });
        } catch (error) {
            self.postMessage({ type: 'error', data: error.message });
        }
    } else if (message.type === 'generate') {
        try {
            const transcriber = await AutomaticSpeechRecognitionPipeline.getInstance();
            const audio = message.audio;

            // Run transcription
            const output = await transcriber(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: 'english',
                task: 'transcribe',
                return_timestamps: false // or true if we want timestamps
            });

            self.postMessage({
                type: 'result',
                data: output.text
            });

        } catch (error) {
            self.postMessage({ type: 'error', data: error.message });
        }
    }
});
