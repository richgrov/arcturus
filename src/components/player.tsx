import { getDownloadURL, ref } from 'firebase/storage';
import { createContext, createSignal, JSX, useContext } from 'solid-js';

import * as firebase from '~/lib/firebase';
import type { Song } from '~/lib/song';

class MusicPlayer {
  songQueue = createSignal(new Array<Song & { id: string }>());
  currentSong = createSignal(0);

  private audio: HTMLAudioElement | undefined;

  constructor(public userId: string) {
  }

  queueSong(songId: string, songData: Song) {
    const [_, setQueue] = this.songQueue;
    const queue = setQueue(q => {
      const song = Object.assign({ id: songId }, songData);
      q = q.concat(song);
      return q;
    });

    const [currentSong] = this.currentSong;
    if (queue.length - 1 === currentSong()) {
      this.audio?.pause();
      const storage = firebase.storage();
      getDownloadURL(ref(storage, `${this.userId}/${songId}`)).then(url => {
        this.audio = new Audio(url);
        this.audio.play();
      });
    }
  }
}

const PlayerContext = createContext<MusicPlayer>();

export function PlayerProvider(props: { children: JSX.Element, userId: string }) {
  return <PlayerContext.Provider value={new MusicPlayer(props.userId)}>
    {props.children}
  </PlayerContext.Provider>
}

export const usePlayer = () => useContext(PlayerContext);
