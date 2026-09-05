import { ChevronRight, Eye, Heart, Play, Share2 } from 'lucide-react';
import type { CreatorVideoRowProps } from './CreatorVideoRow.types';

export default function CreatorVideoRow({ video }: CreatorVideoRowProps) {
  return (
    <article className="video-row">
      <div className="thumb">
        <img src={video.img} alt="" />
        <i>
          <Play />
        </i>
        <b>{video.date}</b>
      </div>
      <div className="video-info">
        <h4>{video.title}</h4>
        <small>Taxa de conclusão: {video.completion}</small>
        <div>
          <span>
            <Eye />
            {video.views}
          </span>
          <span>
            <span className="message-icon" />
            {video.comments}
          </span>
          <span>
            <Heart />
            {video.likes}
          </span>
          <span>
            <Share2 />
            {video.shares}
          </span>
        </div>
      </div>
      <ChevronRight />
    </article>
  );
}
