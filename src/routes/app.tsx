import { createSignal, Show } from "solid-js";
import { A, Outlet, Title, useNavigate } from "solid-start";
import {
  MusicController,
  PlayerProvider,
  usePlayer,
} from "~/components/player";

import * as firebase from "~/lib/firebase";

export default function AuthGuard() {
  const navigate = useNavigate();
  const [userId, setUserId] = createSignal<string>();

  firebase.onAuthChange((user) => {
    if (!user) {
      navigate("/");
      return;
    }

    setUserId(user.uid);
  });

  return (
    <>
      <Title>Arcturus</Title>
      <Show when={userId()}>
        <PlayerProvider userId={userId()!}>
          <Nav />
          <MusicController />
          <Outlet />
        </PlayerProvider>
      </Show>
    </>
  );
}

function Nav() {
  const musicPlayer = usePlayer()!;
  const [queue] = musicPlayer.songQueue;

  const queueBadge = () => {
    const len = queue().length;
    return len > 0 ? ` (${len})` : "";
  };

  return (
    <nav>
      <A href="/app">Home</A>
      <A href="/app/queue">Queue{queueBadge()}</A>
      <A href="/app/settings">Settings</A>
    </nav>
  );
}
