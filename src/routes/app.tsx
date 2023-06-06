import { createSignal, Show } from 'solid-js';
import { A, Outlet, useNavigate } from 'solid-start';
import { PlayerProvider, usePlayer } from '~/components/player';

import * as firebase from '~/lib/firebase';

export default function AuthGuard() {
  const navigate = useNavigate();
  const [userId, setUserId] = createSignal<string>();
  
  firebase.onAuthChange(user => {
    if (!user) {
      navigate('/');
      return;
    }

    setUserId(user.uid);
  });

  return <Show when={userId()}>
    <PlayerProvider userId={userId()!}>
      <Nav />
      <Outlet />
    </PlayerProvider>
  </Show>;
}

function Nav() {
  const musicPlayer = usePlayer()!;
  const [queue] = musicPlayer.songQueue;

  const queueBadge = () => {
    const len = queue().length;
    return len > 0 ? ` (${len})` : '';
  };

  return <nav>
    <A href="/app">Home</A>
    <A href="/app/queue">Queue{queueBadge()}</A>
  </nav>;
}
