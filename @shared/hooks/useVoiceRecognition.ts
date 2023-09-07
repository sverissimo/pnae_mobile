import { useState, useEffect } from "react";
import Voice, { SpeechStartEvent } from "@react-native-voice/voice";

interface VoiceRecognitionResult {
  isRecording: boolean;
  speechText: string;
  error: string | null;
  startRecording: () => void;
  stopRecording: () => void;
}

export const useVoiceRecognition = (): VoiceRecognitionResult => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechText, setSpeechText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = catchErrors;
    Voice.onSpeechEnd = catchErrors;
    Voice.onSpeechResults = handleResults;
    return () => {
      setSpeechText("");
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const catchErrors = (e: SpeechStartEvent) => {
    if (e.error) {
      console.error("🚀 ~ file: useVoiceRecognition.ts:34:", e.error);
    }
  };

  const startRecording = async () => {
    try {
      setSpeechText("");
      setIsRecording(true);
      await Voice.start("pt-BR");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleResults = (e: any) => {
    setSpeechText(() => _parseSentence(e.value[0]));
    setIsRecording(false);
  };

  return {
    isRecording,
    speechText,
    error,
    startRecording,
    stopRecording,
  };
};

function _parseSentence(text: string) {
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);
  const sentence = capitalized.trim();
  const lastChar = sentence.charAt(sentence.length - 1);

  if (lastChar === "." || lastChar === "!" || lastChar === "?") {
    return sentence;
  } else {
    return sentence + ". ";
  }
}
