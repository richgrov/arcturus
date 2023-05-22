<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import * as firebase from '$lib/firebase';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { CollectionReference, collection, doc, type DocumentData, addDoc } from 'firebase/firestore';

  import SongList from '$lib/SongList.svelte';

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

  function uploadSong() {
    addDoc(songCollection, {
      name: uploadName.value,
    });
  }
</script>

{#if songCollection}
  <SongList songCollection={songCollection} />

  <form on:submit={uploadSong}>
    <label for="upload-name">Name</label>
    <input type="text" id="upload-name" bind:this={uploadName}>
    <input type="submit">
  </form>
{/if}
