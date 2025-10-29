import { supabase } from "@/integrations/supabase/client";

// Check if browser supports Web Speech API
export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Start voice recording using Web Speech API (if available)
export const startVoiceRecording = (
  onResult: (text: string) => void,
  onError: (error: string) => void
): any => {
  if (!isSpeechRecognitionSupported()) {
    onError("Speech recognition not supported in this browser");
    return null;
  }

  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = 'te-IN'; // Telugu language
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(`Speech recognition error: ${event.error}`);
  };

  recognition.start();
  return recognition;
};

// Convert audio blob to base64
export const audioToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Transcribe audio using Whisper API
export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const base64Audio = await audioToBase64(audioBlob);
    
    const { data, error } = await supabase.functions.invoke('transcribe-audio', {
      body: { audio: base64Audio }
    });

    if (error) throw error;
    return data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

// Text-to-speech using OpenAI
export const speakText = async (text: string): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: { text, voice: 'nova' }
    });

    if (error) throw error;

    // Convert base64 to audio and play
    const audioData = atob(data.audioContent);
    const arrayBuffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = reject;
      audio.play();
    });
  } catch (error) {
    console.error('TTS error:', error);
    throw new Error('Failed to generate speech');
  }
};
