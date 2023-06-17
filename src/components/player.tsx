import { getDownloadURL, ref } from "firebase/storage";
import { createContext, createSignal, JSX, useContext } from "solid-js";

import * as firebase from "~/lib/firebase";
import type { Song } from "~/lib/song";

type TaggedSong = Song & { id: string };

class MusicPlayerState {
  songQueue = createSignal(new Array<TaggedSong>());
  currentSong = createSignal(0);

  paused = createSignal(true);
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
      this.playSong(queue[currentSong()]);
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
    this.playSong(song);
  }

  setPaused(pause: boolean) {
    const [_, setPaused] = this.paused;
    setPaused(pause);
    if (pause) {
      this.audio?.pause();
    } else {
      this.audio?.play();
    }
  }

  playSong(song: TaggedSong) {
    if (typeof this.audio !== "undefined") {
      this.audio.onended = null;
      this.setPaused(true);
    }

    const storage = firebase.storage();
    getDownloadURL(ref(storage, `${this.userId}/${song.id}`)).then((url) => {
      this.audio = new Audio(url);
      this.setPaused(false);

      if (song.author) {
        document.title = `${song.name} by ${song.author} | Arcturus`;
      } else {
        document.title = `${song.name} | Arcturus`;
      }

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
  const [paused] = musicPlayer.paused;

  function changeSongIndex(offset: number) {
    musicPlayer.setCurrentSong(songIndex() + offset);
  }

  function togglePause() {
    musicPlayer.setPaused(!paused());
  }

  return (
    <>
      <button onClick={() => changeSongIndex(-1)} disabled={songIndex() === 0}>
        Previous
      </button>
      <button onClick={togglePause}>{paused() ? "Play" : "Pause"}</button>
      <button
        onClick={() => changeSongIndex(1)}
        disabled={songIndex() === queue().length - 1}
      >
        Next
      </button>
    </>
  );
}
