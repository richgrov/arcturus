import { For, Show } from "solid-js";

import { usePlayer } from "~/components/player";

export default function Home() {
  return (
    <main>
      <SongQueue />
    </main>
  );
}

function SongQueue() {
  const musicPlayer = usePlayer()!;
  const [queue] = musicPlayer.songQueue;
  const [songIndex] = musicPlayer.currentSong;

  return (
    <For each={queue()}>
      {(song, i) => {
        return (
          <>
            <p>{song.name}</p>
            <p>{song.author}</p>
            <button>Delete</button>

            <Show when={i() != songIndex()} fallback={<p>Now playing</p>}>
              <button onClick={() => musicPlayer.setCurrentSong(i())}>
                Play
              </button>
            </Show>
          </>
        );
      }}
    </For>
  );
}
