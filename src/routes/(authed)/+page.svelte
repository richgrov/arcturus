<script lang="ts">
  import { getContext, onMount } from 'svelte';

  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { CollectionReference, collection, doc, type DocumentData, DocumentReference, setDoc, arrayUnion } from 'firebase/firestore';
  import { ref, uploadBytes, type StorageReference, getDownloadURL } from 'firebase/storage';

  import * as firebase from '$lib/firebase';
  import SongList from '$lib/SongList.svelte';
  import EditSongModal from '$lib/EditSongModal.svelte';
  import * as appState from '$lib/app-state';

  const context = getContext<appState.State>(appState.key);

  let userDoc: DocumentReference;
  let songCollection: CollectionReference<DocumentData>;

  let editingSong: [any, DocumentReference, StorageReference];

  onMount(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, user => {
      unsub();
      if (!user) {
        return;
      }

      const db = firebase.firestore();
      userDoc = doc(db, 'users', auth.currentUser!.uid);
      songCollection = collection(db, userDoc.path, 'songs');
    });
  });

  let uploadFile: HTMLInputElement;

  function getSongFileRef(songId: string): StorageReference {
    const user = getAuth().currentUser!;
    const storage = firebase.storage();
    return ref(storage, `${user.uid}/${songId}`);
  }

  async function uploadSong() {
    const file = uploadFile.files![0];
    const fileRef = getSongFileRef(Date.now().toString());
    await uploadBytes(fileRef, file, { customMetadata: { fileName: uploadFile.value } });
  }

  async function startEditSong(event: any) {
    const db = firebase.firestore();
    editingSong = [
      event.detail.songData,
      doc(db, songCollection.path, event.detail.songId),
      getSongFileRef(event.detail.songId),
    ];
  }

  async function playSong(event: any) {
    const fileRef = getSongFileRef(event.detail.songId);
    const audio = new Audio(await getDownloadURL(fileRef));
    audio.play();

    context.queue.push(event.detail.songId);
    setDoc(userDoc, {
      queue: context.queue,
    }, { merge: true });
  }
</script>

{#if songCollection}
  <SongList songCollection={songCollection} on:playSong={playSong} on:editSong={startEditSong} />

  <form on:submit={uploadSong}>
    <label for="upload-file">File</label>
    <input type="file" id="upload-file" bind:this={uploadFile}>
    <input type="submit">
  </form>

  <dialog open={typeof editingSong !== 'undefined'}>
    {#if editingSong}
      <EditSongModal initialValues={editingSong[0]} doc={editingSong[1]} fileRef={editingSong[2]} />
    {/if}
  </dialog>
{/if}
