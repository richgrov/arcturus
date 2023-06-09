import { getDownloadURL, ref } from "firebase/storage";
import { createContext, createSignal, JSX, useContext } from "solid-js";

import * as firebase from "~/lib/firebase";
import type { Song } from "~/lib/song";

class MusicPlayerState {
  songQueue = createSignal(new Array<Song & { id: string }>());
  currentSong = createSignal(0);

  private audio: HTMLAudioElement | undefined;

  constructor(public userId: string) {}

  queueSong(songId: string, songData: Song) {
    const [_, setQueue] = this.songQueue;
    const queue = setQueue((q) => {
      const song = Object.assign({ id: songId }, songData);
      q = q.concat(song);
      return q;
    });

    const [currentSong] = this.currentSong;
    if (queue.length - 1 === currentSong()) {
      this.playSong(songId);
    }
  }

  setCurrentSong(songIndex: number) {
    const [queue] = this.songQueue;
    const song = queue()[songIndex];
    if (!song) {
      throw new Error(`invalid song index ${songIndex}`);
    }

    const [_, setSongIndex] = this.currentSong;
    setSongIndex(songIndex);
    this.playSong(song.id);
  }

  playSong(songId: string) {
    if (typeof this.audio !== "undefined") {
      this.audio.onended = null;
      this.audio.pause();
    }

    const storage = firebase.storage();
    getDownloadURL(ref(storage, `${this.userId}/${songId}`)).then((url) => {
      this.audio = new Audio(url);
      this.audio.play();

      this.audio.onended = () => {
        const [songIndex] = this.currentSong;
        const [queue] = this.songQueue;
        if (songIndex() + 1 < queue().length) {
          this.setCurrentSong(songIndex() + 1);
        }
      };
    });
  }
}

const PlayerContext = createContext<MusicPlayerState>();

export function PlayerProvider(props: {
  children: JSX.Element;
  userId: string;
}) {
  return (
    <PlayerContext.Provider value={new MusicPlayerState(props.userId)}>
      {props.children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);

export function MusicController() {
  const musicPlayer = usePlayer()!;
  const [queue] = musicPlayer.songQueue;
  const [songIndex] = musicPlayer.currentSong;

  function changeSongIndex(offset: number) {
    musicPlayer.setCurrentSong(songIndex() + offset);
  }

  return (
    <>
      <button onClick={() => changeSongIndex(-1)} disabled={songIndex() === 0}>
        Previous
      </button>
      <button>Pause</button>
      <button
        onClick={() => changeSongIndex(1)}
        disabled={songIndex() === queue().length - 1}
      >
        Next
      </button>
    </>
  );
}
