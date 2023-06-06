import { For } from 'solid-js';

import { usePlayer } from '~/components/player';

export default function Queue() {
  return <SongQueue />;
}

function SongQueue() {
  const musicPlayer = usePlayer()!;
  const [queue] = musicPlayer.songQueue;

  return <For each={queue()}>{song => {
    return <>
      <p>{song.name}</p>
      <p>{song.author}</p>
    </>
  }}</For>
}
