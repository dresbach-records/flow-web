/**
 * FLOW — FloatingPlayer
 * Player de áudio flutuante, contínuo e persistente entre trocas de rotas.
 * Conectado ao PlayerContext global.
 */
import { ChevronDown, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, X } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

export default function FloatingPlayer() {
  const {
    track,
    playing,
    progress,
    volume,
    muted,
    minimized,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    toggleMinimize,
    closePlayer,
  } = usePlayer();

  if (!track) return null;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, p)));
  };

  if (minimized) {
    return (
      <div
        className="flow-floating-player is-minimized"
        role="region"
        aria-label="Player de música minimizado"
        onClick={toggleMinimize}
        title={`${track.title} — ${track.artist}`}
      >
        <div className="flow-player-body">
          <button
            className="flow-player-play-btn"
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            aria-label={playing ? 'Pausar' : 'Reproduzir'}
          >
            {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flow-floating-player"
      role="region"
      aria-label={`Reproduzindo: ${track.title}`}
    >
      {/* Progress bar */}
      <div
        className="flow-player-progress-bar"
        onClick={handleProgressClick}
        role="slider"
        aria-label="Progresso da faixa"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') seek(Math.min(1, progress + 0.05));
          if (e.key === 'ArrowLeft') seek(Math.max(0, progress - 0.05));
        }}
      >
        <div
          className="flow-player-progress-fill"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Body */}
      <div className="flow-player-body">
        {/* Cover */}
        <div className="flow-player-cover">
          {track.coverUrl
            ? <img src={track.coverUrl} alt={`Capa de ${track.title}`} />
            : (
              <div className="flow-player-cover-placeholder">
                <Music2 size={20} />
              </div>
            )}
        </div>

        {/* Track info */}
        <div className="flow-player-info">
          <div className="flow-player-title">{track.title}</div>
          <div className="flow-player-artist">{track.artist}</div>
        </div>

        {/* Controls */}
        <div className="flow-player-controls">
          <button className="flow-player-btn" aria-label="Faixa anterior" title="Anterior">
            <SkipBack size={18} />
          </button>

          <button
            className="flow-player-play-btn"
            onClick={togglePlay}
            aria-label={playing ? 'Pausar' : 'Reproduzir'}
            id="floating-player-play-btn"
          >
            {playing
              ? <Pause size={20} fill="currentColor" />
              : <Play size={20} fill="currentColor" />}
          </button>

          <button className="flow-player-btn" aria-label="Próxima faixa" title="Próxima">
            <SkipForward size={18} />
          </button>
        </div>

        {/* Volume */}
        <div className="flow-player-volume">
          <button
            className="flow-player-btn"
            onClick={toggleMute}
            aria-label={muted ? 'Ativar som' : 'Silenciar'}
            title={muted ? 'Ativar som' : 'Silenciar'}
          >
            {muted || volume === 0
              ? <VolumeX size={16} />
              : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            className="flow-player-volume-slider"
            min={0}
            max={1}
            step={0.02}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>

        {/* Minimize */}
        <button
          className="flow-player-btn"
          onClick={toggleMinimize}
          aria-label="Minimizar player"
          title="Minimizar"
        >
          <ChevronDown size={18} />
        </button>

        {/* Close */}
        <button
          className="flow-player-btn"
          onClick={closePlayer}
          aria-label="Fechar player"
          title="Fechar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
