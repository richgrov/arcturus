import { createSignal, Show } from "solid-js";
import { A, Outlet, Title, useNavigate } from "solid-start";

import { PlayerProvider, usePlayer } from "~/components/player";
import * as firebase from "~/lib/firebase";
import logo from "~/assets/arcturus.png";
import { signOut } from "firebase/auth";
import {
  CgLogOut,
  CgPlayButton,
  CgPlayPause,
  CgPlayTrackNext,
  CgPlayTrackPrev,
} from "solid-icons/cg";

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
          <div class="flex">
            <Nav />
            <main class="grow">
              <Outlet />
            </main>
          </div>
        </PlayerProvider>
      </Show>
    </>
  );
}

function Nav() {
  const auth = firebase.auth();
  const musicPlayer = usePlayer()!;
  const [queue] = musicPlayer.songQueue;
  const [songIndex] = musicPlayer.currentSong;
  const [paused] = musicPlayer.paused;

  function changeSongIndex(offset: number) {
    musicPlayer.setCurrentSong(songIndex() + offset);
  }

  function togglePause() {
    musicPlayer.setPaused(!paused());
  }

  return (
    <nav class="w-1/6 h-full p-5 text-xl">
      <img src={logo} alt="Logo" class="" />

      <div class="flex justify-evenly text-4xl py-5">
        <button
          class="text-primary"
          onClick={() => changeSongIndex(-1)}
          disabled={songIndex() === 0}
        >
          <CgPlayTrackPrev />
        </button>
        <button
          class="bg-primary rounded-full p-2 text-background dark:text-background-dark"
          onClick={togglePause}
        >
          {paused() ? <CgPlayButton /> : <CgPlayPause />}
        </button>
        <button
          class="text-primary"
          onClick={() => changeSongIndex(1)}
          disabled={songIndex() === queue().length - 1}
        >
          <CgPlayTrackNext />
        </button>
      </div>

      <ul>
        <li>
          <A href="./">Home</A>
        </li>

        <li>
          <A href="songs">All Songs</A>
        </li>

        <li>
          <button onClick={() => signOut(auth)}>
            <CgLogOut class="inline" /> Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
