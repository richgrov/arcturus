<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import * as firebase from '$lib/firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { CollectionReference, collection, doc, type DocumentData, addDoc } from 'firebase/firestore';

  import SongList from '$lib/SongList.svelte';
  import { ref, uploadBytes, type StorageReference, getDownloadURL } from 'firebase/storage';
  import 'firebase/functions';

  let songCollection: CollectionReference<DocumentData>;

  onMount(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, user => {
      if (!user) {
        goto('/login', { replaceState: true });
        return;
      }

      const db = firebase.firestore();
      const userDoc = doc(db, 'users', user.uid);
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

  async function playSong(event: any) {
    const fileRef = getSongFileRef(event.detail.songId);
    const audio = new Audio(await getDownloadURL(fileRef));
    audio.play();
  }
</script>

{#if songCollection}
  <SongList songCollection={songCollection} on:playSong={playSong} />

  <form on:submit={uploadSong}>
    <label for="upload-file">File</label>
    <input type="file" id="upload-file" bind:this={uploadFile}>
    <input type="submit">
  </form>
{/if}
