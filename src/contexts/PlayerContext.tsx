/**
 * FLOW — PlayerContext
 * Estado global do player de áudio flutuante persistente.
 * Persiste entre trocas de rotas.
 */
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  audioUrl: string;
  duration?: number;
}

interface PlayerState {
  track: Track | null;
  playing: boolean;
  progress: number;   // 0–1
  volume: number;     // 0–1
  muted: boolean;
  minimized: boolean;
}

interface PlayerActions {
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (progress: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleMinimize: () => void;
  closePlayer: () => void;
}

const PlayerContext = createContext<(PlayerState & PlayerActions) | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.volume = volume;
      audio.ontimeupdate = () => {
        if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
      };
      audio.onended = () => setPlaying(false);
      audioRef.current = audio;
    }
    return audioRef.current;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = useCallback((next: Track) => {
    const audio = getAudio();
    if (track?.id !== next.id) {
      audio.src = next.audioUrl;
      setProgress(0);
    }
    setTrack(next);
    setMinimized(false);
    void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [track, getAudio]);

  const togglePlay = useCallback(() => {
    const audio = getAudio();
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [playing, getAudio]);

  const seek = useCallback((p: number) => {
    const audio = getAudio();
    if (audio.duration > 0) {
      audio.currentTime = audio.duration * p;
      setProgress(p);
    }
  }, [getAudio]);

  const setVolume = useCallback((v: number) => {
    const audio = getAudio();
    audio.volume = v;
    setVolumeState(v);
    if (v > 0) setMuted(false);
  }, [getAudio]);

  const toggleMute = useCallback(() => {
    const audio = getAudio();
    const next = !muted;
    audio.muted = next;
    setMuted(next);
  }, [muted, getAudio]);

  const toggleMinimize = useCallback(() => setMinimized(m => !m), []);

  const closePlayer = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    audio.src = '';
    setTrack(null);
    setPlaying(false);
    setProgress(0);
  }, [getAudio]);

  return (
    <PlayerContext.Provider value={{
      track, playing, progress, volume, muted, minimized,
      playTrack, togglePlay, seek, setVolume, toggleMute, toggleMinimize, closePlayer,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used inside PlayerProvider');
  return ctx;
}
