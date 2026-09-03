type Story={id:string;username:string;avatarUrl?:string;seen?:boolean};
export function StoryStrip({stories}:{stories:Story[]}){return <div className="flow-story-strip" aria-label="Stories">{stories.map(s=><button key={s.id} className={s.seen?'seen':''}><span>{s.avatarUrl?<img src={s.avatarUrl} alt=""/>:<span className="avatar-fallback"/>}</span><small>{s.username}</small></button>)}</div>}
