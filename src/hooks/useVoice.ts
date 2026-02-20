import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to handle voice input for maintenance reports.
 * Integrates with Supabase Edge Functions for Speech-to-Text.
 */
export const useVoice = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const processAudio = useCallback(async (blob: Blob) => {
        try {
            // Convert blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64Audio = reader.result?.toString().split(',')[1];

                if (!base64Audio) throw new Error('Error al procesar el audio');

                // Call Supabase Edge Function
                const { data, error: invokeError } = await supabase.functions.invoke('speaky-stt', {
                    body: { audio: base64Audio },
                });

                if (invokeError) throw invokeError;
                setTranscript(data.transcript);
            };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Error al procesar la voz';
            setError(message);
            console.error('STT Error:', err);
        }
    }, []);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                await processAudio(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError('No se pudo acceder al micrófono.');
            console.error(err);
        }
    }, [processAudio]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder.current && isRecording) {
            mediaRecorder.current.stop();
            setIsRecording(false);
            // Stop all tracks in the stream
            mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        }
    }, [isRecording]);

    return {
        isRecording,
        transcript,
        error,
        startRecording,
        stopRecording,
        resetTranscript: () => setTranscript('')
    };
};
