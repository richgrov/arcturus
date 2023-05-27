<script lang="ts">
  import { browser } from '$app/environment';
  import type { Unsubscribe } from 'firebase/auth';
  import { onSnapshot, type CollectionReference, type DocumentData, query, QueryDocumentSnapshot } from 'firebase/firestore';
  import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
  import * as appState from '$lib/app-state';

  export let songCollection: CollectionReference<DocumentData>;

  const context = getContext<appState.State>(appState.key);

  let unsub: Unsubscribe;
  let songs: QueryDocumentSnapshot[] = [];

  onMount(() => {
    unsub = onSnapshot(query(songCollection), snapshot => {
      songs = snapshot.docs;
      for (const doc of snapshot.docs) {
        context.songCache[doc.id] = doc.data();
      }
    });
  });

  onDestroy(() => {
    if (browser && unsub) {
      unsub();
    }
  });

  const dispatch = createEventDispatcher();
</script>

<ul>
  {#each songs as song}
    <li>
      <p>{song.data().name}</p>
      <p>{song.data().author}</p>
      <button on:click={() => { dispatch('playSong', { songId: song.id }); }}>Play</button>
      <button on:click={() => { dispatch('editSong', { songId: song.id, songData: song.data() }); }}>Edit</button>
    </li>
  {/each}
</ul>
