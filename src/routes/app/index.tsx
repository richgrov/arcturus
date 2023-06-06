import { createSignal, For, onCleanup, Show } from 'solid-js';
import { Title } from 'solid-start';

import { collection, doc, onSnapshot, query, QueryDocumentSnapshot, setDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';

import * as firebase from '~/lib/firebase';
import { Song } from '~/lib/song';
import { usePlayer } from '~/components/player';

export default function Home() {
  let [editSong, setEditSong] = createSignal<[string, Song]>();

  return (
    <main>
      <Title>Hello World</Title>

      <SongList onEdit={(songId, song) => setEditSong([songId, song])} />
      <AddSongForm />
      <Show when={typeof editSong() !== 'undefined'}>
        <dialog open>
          <EditSongForm songId={editSong()![0]} initialValues={editSong()![1]} />
        </dialog>
      </Show>
    </main>
  );
}

function SongList(props: { onEdit: (songId: string, doc: Song) => void }) {
  const [songs, setSongs] = createSignal(new Array<QueryDocumentSnapshot>());
  const musicPlayer = usePlayer()!;
  const db = firebase.firestore();
  const songCollection = collection(db, 'users', musicPlayer.userId, 'songs');

  const unsub = onSnapshot(query(songCollection), snapshot => {
    setSongs(snapshot.docs);
  });

  onCleanup(unsub);

  return <ul>
    <For each={songs()}>{song =>
      <li>
        <p>{song.data().name}</p>
        <p>{song.data().author}</p>
        <button onClick={() => musicPlayer.queueSong(song.id, song.data() as Song)}>Play</button>
        <button onClick={() => props.onEdit(song.id, song.data() as Song)}>Edit</button>
      </li>
    }</For>
  </ul>
}

function AddSongForm() {
  const musicPlayer = usePlayer()!;
  let uploadEl: HTMLInputElement | undefined;

  async function onSubmit(e: Event) {
    e.preventDefault();
    const file = uploadEl!.files![0];

    const storage = firebase.storage();
    const fileRef = ref(storage, musicPlayer.userId + `/${Date.now()}`);

    await uploadBytes(fileRef, file, { customMetadata: { fileName: uploadEl!.value } });
  }

  return <form onSubmit={onSubmit}>
    <label for="upload-file">File</label>
    <input type="file" id="upload-file" ref={uploadEl} />
    <input type="submit" />
  </form>
}

function EditSongForm(props: { songId: string, initialValues: Song }) {
  const musicPlayer = usePlayer()!;

  let formName: HTMLInputElement | undefined;
  let formAuthor: HTMLInputElement | undefined;
  let formFile: HTMLInputElement | undefined;

  async function onSubmit(e: Event) {
    e.preventDefault();

    const db = firebase.firestore();
    const songDoc = doc(db, 'users', musicPlayer.userId, 'songs', props.songId);
    await setDoc(songDoc, {
      name: formName!.value,
      author: formAuthor!.value,
    }, { merge: true });

    if (formFile!.files!.length > 0) {
      const file = formFile!.files![0];
      const storage = firebase.storage();
      const fileRef = ref(storage, `${musicPlayer.userId}/${props.songId}`);
      await uploadBytes(fileRef, file, { customMetadata: { fileName: formFile!.value } });
    }
  }

  return <form onSubmit={onSubmit}>
    <label for="edit-name">Name</label>
    <input type="text" id="edit-name" ref={formName} value={props.initialValues.name} />

    <label for="edit-author">Author</label>
    <input type="text" id="edit-author" ref={formAuthor} value={props.initialValues.author || ''} />

    <label for="edit-file">Change Audio</label>
    <input type="file" id="edit-file" ref={formFile} />

    <input type="submit" />
  </form>;
}
