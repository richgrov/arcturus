<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import * as firebase from '$lib/firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { CollectionReference, collection, doc, type DocumentData, addDoc } from 'firebase/firestore';

  import SongList from '$lib/SongList.svelte';
    import { ref, uploadBytes } from 'firebase/storage';

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

  let uploadName: HTMLInputElement;
  let uploadFile: HTMLInputElement;

  async function uploadSong() {
    const doc = await addDoc(songCollection, {
      name: uploadName.value,
    });

    const file = uploadFile.files![0];

    const user = getAuth().currentUser!;
    const storage = firebase.storage();
    const fileRef = ref(storage, `songs/${user.uid}/${doc.id}`);
    await uploadBytes(fileRef, file);
    alert('Song added');
  }
</script>

{#if songCollection}
  <SongList songCollection={songCollection} />

  <form on:submit={uploadSong}>
    <label for="upload-name">Name</label>
    <input type="text" id="upload-name" bind:this={uploadName}>
    <label for="upload-file">File</label>
    <input type="file" id="upload-file" bind:this={uploadFile}>
    <input type="submit">
  </form>
{/if}
