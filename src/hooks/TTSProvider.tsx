// ./tts/TTSProvider.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import TTS from 'react-native-tts';
import {showToast} from '../service/fn';

export interface useTTSReturnType {
  isPlaying: boolean;
  lastUtterance: string;
  speak: (text: string) => void;
  pause: () => void;
  playAgain: () => void;
  getLanguages: () => Promise<string[]>;
  changeLanguage: (lang: string) => void;
  currentLang: string;
}

const TTSContext = createContext<useTTSReturnType>(undefined as never);

export const useTTS = () => useContext(TTSContext);

export const TTSProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const lastUtteranceRef = useRef('');
  const [currentLang, setCurrentLang] = useState('en-US');

  const changeLanguage = useCallback(async (lang: string) => {
    try {
      await TTS.setDefaultLanguage(lang);
      setCurrentLang(lang);
    } catch {
      showToast({
        type: 'error',
        text1: `Voice pack for ${lang} is not installed on this device.`,
      });
    }
  }, []);

  async function getLanguages(): Promise<string[]> {
    const voices = await TTS.voices();
    const langs = new Set(
      voices.filter(v => !v.notInstalled).map(v => v.language),
    );
    return Array.from(langs).sort();
  }

  useEffect(() => {
    TTS.getInitStatus()
      .then(() => TTS.setDefaultLanguage('en-US').catch(() => {}))
      .catch(() =>
        showToast({type: 'error', text1: 'tts not supported by your device.'}),
      );

    const subStart = TTS.addEventListener('tts-start', () =>
      setIsPlaying(true),
    );
    const subFinish = TTS.addEventListener('tts-finish', () =>
      setIsPlaying(false),
    );
    const subCancel = TTS.addEventListener('tts-cancel', () =>
      setIsPlaying(false),
    );

    return () => {
      (subStart as any)?.remove?.();
      (subFinish as any)?.remove?.();
      (subCancel as any)?.remove?.();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!text?.trim()) return;
    lastUtteranceRef.current = text;
    TTS.stop();
    TTS.speak(text.trim());
  }, []);

  const pause = useCallback(() => TTS.stop(), []);

  const playAgain = useCallback(() => {
    if (!lastUtteranceRef.current) return;
    speak(lastUtteranceRef.current);
  }, [speak]);

  return (
    <TTSContext.Provider
      value={{
        isPlaying,
        lastUtterance: lastUtteranceRef.current,
        speak,
        pause,
        playAgain,
        getLanguages,
        currentLang,
        changeLanguage,
      }}>
      {children}
    </TTSContext.Provider>
  );
};
