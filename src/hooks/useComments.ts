// FLOW — useComments (FASE 3).
// Encapsula listComments do Firebase para reuso entre CommentsPanel,
// CommentList e futuros componentes de comentário. Sem mocks.
import { useEffect, useState } from 'react';
import { listComments, type CommentRecord } from '../services/firebase/social';

export function useComments(postId: string) {
  const [comments, setComments] = useState<CommentRecord[]>([]);

  useEffect(() => {
    void listComments(postId).then(setComments).catch(() => {});
  }, [postId]);

  return { comments };
}

export type { CommentRecord };
