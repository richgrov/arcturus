import { CgPlayButton } from "solid-icons/cg";
import { For, Show } from "solid-js";

import { usePlayer } from "~/components/player";
import { SongEntry } from "./song-entry";

export default function Home() {
  return (
    <main>
      <p class="text-xl p-4">Songs in Queue</p>
      <SongQueue />
    </main>
  );
}

function SongQueue() {
  const musicPlayer = usePlayer()!;
  const [queue] = musicPlayer.songQueue;
  const [songIndex] = musicPlayer.currentSong;

  return (
    <ul>
      <For each={queue()}>
        {(song, i) => (
          <SongEntry
            song={song}
            class={
              i() === songIndex()
                ? "bg-secondary-background dark:bg-secondary-background-dark"
                : ""
            }
            buttons={
              <Show when={i() != songIndex()} fallback={<p>Now playing</p>}>
                <button
                  class="text-5xl items-center"
                  onClick={() => musicPlayer.setCurrentSong(i())}
                >
                  <CgPlayButton />
                </button>
              </Show>
            }
          />
        )}
      </For>
    </ul>
  );
}
