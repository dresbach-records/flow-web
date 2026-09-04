import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Music, Volume2, VolumeX, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';

interface ShortItem {
  id: string;
  creator: string;
  handle: string;
  avatar: string;
  caption: string;
  songName: string;
  videoUrl: string;
  posterUrl: string;
  likes: number;
  comments: number;
  shares: number;
}

const SHORTS_DATA: ShortItem[] = [
  {
    id: 'short-1',
    creator: 'Beatmaker Marina',
    handle: '@marinabeats',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    caption: 'Criando um beat de Trap Lo-Fi em 30 segundos do zero! O que acharam desse drop? 🔥🎹',
    songName: 'Marina D. • Sunset Vibrations (Original Mix)',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-performing-tricks-41887-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    likes: 12400,
    comments: 482,
    shares: 890,
  },
  {
    id: 'short-2',
    creator: 'Pedro Santos',
    handle: '@pedro.fpv',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    caption: 'Voo rasante de drone FPV pela Serra do Mar em São Paulo ao amanhecer 🇧🇷 ☁️',
    songName: 'Electronic Waves • Cinematic Dawn',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    likes: 24500,
    comments: 920,
    shares: 1450,
  },
  {
    id: 'short-3',
    creator: 'Clara Arte & Design',
    handle: '@claradesign',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    caption: 'Ilustrando no iPad com Procreate usando pincéis texturizados de giz pastel 🎨✨',
    songName: 'Chilled Acoustic • Coffee & Sketch',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40788-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    likes: 8700,
    comments: 310,
    shares: 420,
  },
];

export default function ShortsModule() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const current = SHORTS_DATA[currentIndex];
  const isLiked = Boolean(likedMap[current.id]);
  const isSaved = Boolean(savedMap[current.id]);

  const handleNext = () => {
    if (currentIndex < SHORTS_DATA.length - 1) setCurrentIndex(c => c + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const toggleLike = () => {
    setLikedMap(prev => ({ ...prev, [current.id]: !prev[current.id] }));
  };

  const toggleSave = () => {
    setSavedMap(prev => ({ ...prev, [current.id]: !prev[current.id] }));
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 20px',
      minHeight: 'calc(100vh - 64px)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        maxWidth: 580,
        width: '100%',
        justifyContent: 'center'
      }}>
        {/* Main Reel Card (9:16 Aspect Ratio) */}
        <div style={{
          position: 'relative',
          width: 360,
          height: 640,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          flexShrink: 0
        }}>
          {/* Video element */}
          <video
            key={current.videoUrl}
            src={current.videoUrl}
            poster={current.posterUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={() => setIsPlaying(!isPlaying)}
          />

          {/* Top Controls Overlay */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 10,
            zIndex: 10
          }}>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 16px 20px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            color: '#FFFFFF',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <img
                src={current.avatar}
                alt={current.creator}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #FFFFFF', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ fontSize: 14, fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                  {current.creator}
                </strong>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{current.handle}</span>
              </div>
              <button
                type="button"
                style={{
                  marginLeft: 'auto',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  border: 'none',
                  borderRadius: 999,
                  padding: '5px 14px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Seguir
              </button>
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: 13.5, lineHeight: 1.4 }}>
              {current.caption}
            </p>

            {/* Song title with animated icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.9 }}>
              <Music size={14} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {current.songName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Column on Right Side of Reel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          {/* Navigation Prev */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            title="Vídeo anterior"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: currentIndex === 0 ? '#CBD5E1' : '#0F172A',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <ChevronUp size={22} />
          </button>

          {/* Like */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={toggleLike}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: isLiked ? '#FEE2E2' : '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: isLiked ? '#DC2626' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Heart size={20} fill={isLiked ? '#DC2626' : 'none'} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              {current.likes + (isLiked ? 1 : 0)}
            </span>
          </div>

          {/* Comments */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <MessageCircle size={20} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              {current.comments}
            </span>
          </div>

          {/* Save */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={toggleSave}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: isSaved ? '#EFF6FF' : '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: isSaved ? '#2563EB' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Bookmark size={20} fill={isSaved ? '#2563EB' : 'none'} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              Salvar
            </span>
          </div>

          {/* Share */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link do Short copiado para a área de transferência!');
                }
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Share2 size={20} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              {current.shares}
            </span>
          </div>

          {/* Navigation Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === SHORTS_DATA.length - 1}
            title="Próximo vídeo"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: currentIndex === SHORTS_DATA.length - 1 ? '#CBD5E1' : '#0F172A',
              cursor: currentIndex === SHORTS_DATA.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
