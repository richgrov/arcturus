import { createEffect, createSignal, For, onCleanup } from "solid-js";

import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";

import { TaggedSong, usePlayer } from "~/components/player";
import * as firebase from "~/lib/firebase";
import { Song } from "~/lib/song";
import { CgPen, CgPlayListAdd } from "solid-icons/cg";
import { ref, uploadBytes } from "firebase/storage";
import { SongEntry } from "./song-entry";

export default function () {
  const [editSong, setEditSong] = createSignal<TaggedSong>();

  return (
    <>
      <AddSongForm />
      <SongList onEdit={setEditSong} />
      <EditSongForm song={editSong()} />
    </>
  );
}

function AddSongForm() {
  const musicPlayer = usePlayer()!;
  let uploadEl: HTMLInputElement | undefined;

  function onDrop(e: DragEvent) {
    const file = e.dataTransfer?.files?.[0];
    if (!file) {
      return;
    }
    upload(file);
  }

  async function onUpload() {
    const file = uploadEl!.files?.[0];
    if (!file) {
      return;
    }
    upload(file);
  }

  async function upload(file: File) {
    const storage = firebase.storage();
    const fileRef = ref(storage, musicPlayer.userId + `/${Date.now()}`);

    await uploadBytes(fileRef, file, {
      customMetadata: { fileName: uploadEl!.value },
    });
  }

  return (
    <form onDrop={onDrop} class="p-5">
      <label
        for="upload-file"
        class="w-full inline-block bg-secondary-background dark:bg-secondary-background-dark
        rounded-2xl py-7 text-center text-xl cursor-pointer"
      >
        Drag and Drop Files or Click to Upload
      </label>
      <input
        class="hidden"
        type="file"
        id="upload-file"
        ref={uploadEl}
        onChange={onUpload}
      />
    </form>
  );
}

function SongList(props: { onEdit: (song: TaggedSong) => void }) {
  const [songs, setSongs] = createSignal(new Array<TaggedSong>());
  const musicPlayer = usePlayer()!;
  const db = firebase.firestore();
  const songCollection = collection(db, "users", musicPlayer.userId, "songs");

  const unsub = onSnapshot(query(songCollection), (snapshot) => {
    setSongs(
      snapshot.docs.map((doc) => {
        return { id: doc.id, ...(doc.data() as Song) };
      })
    );
  });

  onCleanup(unsub);

  return (
    <>
      <ul>
        <For each={songs()}>
          {(song) => (
            <SongEntry
              song={song}
              buttons={
                <div class="text-3xl items-center">
                  <button onClick={() => musicPlayer.queueSong(song)}>
                    <CgPlayListAdd />
                  </button>
                  <button onClick={() => props.onEdit(song)}>
                    <CgPen />
                  </button>
                </div>
              }
            />
          )}
        </For>
      </ul>
    </>
  );
}

function EditSongForm(props: { song: TaggedSong | undefined }) {
  const musicPlayer = usePlayer()!;

  let formDialog: HTMLDialogElement | undefined;
  let formName: HTMLInputElement | undefined;
  let formAuthor: HTMLInputElement | undefined;
  let formFile: HTMLInputElement | undefined;

  async function onSubmit(e: Event) {
    e.preventDefault();
    formDialog!.close();

    const db = firebase.firestore();
    const songDoc = doc(
      db,
      "users",
      musicPlayer.userId,
      "songs",
      props.song!.id
    );
    await setDoc(
      songDoc,
      {
        name: formName!.value,
        author: formAuthor!.value,
      },
      { merge: true }
    );

    if (formFile!.files!.length > 0) {
      const file = formFile!.files![0];
      const storage = firebase.storage();
      const fileRef = ref(storage, `${musicPlayer.userId}/${props.song!.id}`);
      await uploadBytes(fileRef, file, {
        customMetadata: { fileName: formFile!.value },
      });
    }
  }

  createEffect(() => {
    if (!props.song) {
      formDialog!.close();
      return;
    }

    formDialog!.showModal();
    formName!.value = props.song.name;
    if (props.song.author) {
      formAuthor!.value = props.song.author;
    }
  });

  return (
    <dialog ref={formDialog}>
      <form onSubmit={onSubmit}>
        <label for="edit-name">Name</label>
        <input type="text" id="edit-name" ref={formName} />

        <label for="edit-author">Author</label>
        <input type="text" id="edit-author" ref={formAuthor} />

        <label for="edit-file">Change Audio</label>
        <input type="file" id="edit-file" ref={formFile} />

        <input type="submit" />
      </form>
    </dialog>
  );
}
